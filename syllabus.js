var terms = ["前期", "第1クォーター", "第2クォーター", "後期", "第3クォーター", "第4クォーター", "通年"];
var examples = {
    jugyo_theme_Jp: "この授業では～について学習する。",
    jugyo_theme_En: "This course is designed for students to acquire ...",
    jugyo_mokuhyo_Jp: "この授業では～を習得することを目標とする。",
    jugyo_mokuhyo_En: "Through this course, students will be able to ...",
    jugyo_gaiyo_keikaku_Jp: "この授業では以下の内容を扱う。\n1.イントロダクション \n2. \n3. \n4. \n5. \n6. \n7.",
    jugyo_hyoka_houhou_Jp: "・学修システムを利用した小テスト\n・期末テスト\nを用いて評価する。",
    jugyo_hyoka_kijun_Jp: "・学修システムを利用した小テスト(10%)\n・期末テスト(90%)\nを予定している。",
    rishu_cyui_Jp: "(科目名)を履修していることを前提として授業を行う。",
    junbi_gakushu_Jp: "各回の課題を行う必要がある。/指定される文献を授業までに読んでおくこと。",
    office_renrakusaki_Jp: "？曜日昼休み/要事前連絡\nメールアドレス:",
    nendo_kufu_Jp: "授業評価アンケートの結果をもとに内容を調整しました",
    kyozai_Jp: "特に使用しません。教材をBEEFで配布します。",
    sanko_shiryo_Jp: "授業中に紹介します。",
    jugyo_gengo_Jp: 1,
    jugyo_gengo_En: 1
};

var courseName, kyokanName;

console.log("running syllabus.js");

$("#main-frame-if").on('load', function () {
    console.log("iframe loaded");

    var contents = $(this).contents();

    var shozokuSelect = contents.find("#jikanwariShozokuCode:visible");
    if (shozokuSelect.length) {
//        shozokuSelect.val([]);

        var p = $("<div><span style='visibility:hidden'>： </span></div>");
        shozokuSelect.after(p);

//        shozokuSelect.change(function () { contents.find("#kyokannm").val(""); });

        var openOption = $("<button>拡張機能の設定を表示</button>");
        openOption.click(function (e) {
            chrome.runtime.sendMessage({ type: "open option" }, function (res) { console.log(res); });
            e.preventDefault();
        });
        p.append(openOption);

        chrome.storage.sync.get("shozoku", function (options) {
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

            var defaultSelection = shozokuSelect.find(":contains('指示なし')");
            if (!defaultSelection.length) {
                shozokuSelect.prepend($('<option value="" style="" selected>指示なし</option>'));
            }
        });
    }

    var title = contents.find("#main-portlet-title > span").text();
    if (title && title.includes("インポート")) {
        var nendo = contents.find("#sfkNendo");
        if (nendo && nendo.val() == new Date().getFullYear()) nendo.val(nendo.val() - 1);
        nendo = contents.find("#nendo");
        if (nendo && nendo.val() == new Date().getFullYear()) nendo.val(nendo.val() - 1);

        if (courseName) {
            //var kaikoKamokunm = contents.find("#kaikoKamokunm");
            //if (kaikoKamokunm) kaikoKamokunm.val(courseName);
            var td = contents.find("td:contains('" + courseName + "')");
            console.log(td.length);
            if(td.length) td.parent().css("background-color", "#f0f0f0");
        }
        if (kyokanName) {
            var kyokannm = contents.find("#kyokannm");
            if (kyokannm) kyokannm.val(kyokanName);
        }
    }

    var importButton = contents.find(":input[name='_eventId_syllabusImport']");
    if (importButton) {
        importButton.click(function (e) {
            var th = contents.find("th:contains('科目名'):contains('日本語'):first");
            if (th) courseName = th.next().text().trim();
            th = contents.find("th:contains('主担当教員'):contains('日本語'):first");
            if (th) kyokanName = th.next().text().trim();
        });

        var insertExamplesButton = $("<button>空欄に文例を挿入</button>");
        insertExamplesButton.appendTo(importButton.parent());
        insertExamplesButton.click(function (e) {
            Object.keys(examples).forEach(function (key) {
                var input = contents.find("#" + key);
                if (input && input.val().length == 0) input.val(examples[key]);
            });
            e.preventDefault();
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