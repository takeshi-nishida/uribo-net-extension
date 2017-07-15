var terms = ["前期", "第1クォーター", "第2クォーター", "後期", "第3クォーター", "第4クォーター", "通年"];

console.log("running syllabus.js");

$("#main-frame-if").on('load', function () {
    console.log("iframe loaded");

    var contents = $(this).contents();

    var shozokuSelect = contents.find("#jikanwariShozokuCode:visible");
    if (shozokuSelect.length) {
        var p = $("<div><span style='visibility:hidden'>： </span></div>");
        shozokuSelect.after(p);

        shozokuSelect.change(function () {
            contents.find("#kyokannm").val("");
        });

        var openOption = $("<button>拡張機能の設定を表示</button>");
        openOption.click(function (e) {
            chrome.runtime.sendMessage({ type: "open option" }, function (res) { console.log(res); });
            e.preventDefault();
        });
        p.append(openOption);

        chrome.storage.sync.get({ shozoku: null }, function (options) {
            if (options.shozoku) {
                shozokuSelect.children().hide();
                var expr = options.shozoku.map(function (s) { return '[value=' + s + ']' }).join(',');
                shozokuSelect.children(expr).show();


                var showAll = $("<button>すべての所属を表示</button>");
                showAll.click(function (e) {
                    shozokuSelect.children().show();
                    e.preventDefault();
                });
                p.append(showAll);
            }
        });

    }

    var table = contents.find("table").has("th:contains('開講')");
    if (table.length) {
        var th = table.find("th:contains('開講'):first");

        if (th) {
            var i = table.find("th").index(th);
            var sorter = $("<a href=''>▼</a>");
            sorter.click(function (e) {
                var tbody = table.find("tbody");
                var trs = tbody.find("tr:gt(0)").sort(function (a, b) {
                    var atext = $(a).children().eq(i).text().trim();
                    var btext = $(b).children().eq(i).text().trim();
                    var result = terms.indexOf(atext) - terms.indexOf(btext);

                    if (result == 0) {
                        var ano = Number($(a).children().eq(0).text().trim());
                        var bno = Number($(b).children().eq(0).text().trim());
                        result = ano - bno;
                    }

                    return result;
                }).appendTo(tbody);
                e.preventDefault();
            });
            th.append(sorter);
        }
    }
});