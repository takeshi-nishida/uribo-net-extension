const terms = ["前期", "第1クォーター", "第2クォーター", "後期", "第3クォーター", "第4クォーター", "通年"];
const examples = {
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

const shozokuSelect = $("#jikanwariShozokuCode");

if (shozokuSelect) {
    console.log("syllabus.js: shozoku select found.");

    shozokuSelect.change(function () { $("#kyokannm").val(""); });
 
    const gakkiSelect = shozokuSelect.closest("table").find("#nendo");
    if(gakkiSelect){
        const openOption = $("<button style='margin-left: 1em'>所属表示設定</button>");
        openOption.click(function (e) {
            chrome.runtime.sendMessage({ type: "open option" }, res => console.log(res));
            e.preventDefault();
        });
        gakkiSelect.after(openOption);
    }
 
    chrome.storage.sync.get("shozoku", function (options) {
        if (options.shozoku) {
            shozokuSelect.children().hide();
            const expr = options.shozoku.map(s => '[value=' + s + ']').join(',');
            shozokuSelect.children(expr).show();

            const showAll = $("<button style='margin-left: 1em'>全所属を表示</button>");
            showAll.click(function (e) {
                shozokuSelect.children().show();
                e.preventDefault();
            });
            gakkiSelect.after(showAll);
        }

        const defaultSelection = shozokuSelect.find(":contains('指示なし')");
        if (!defaultSelection.length) {
            shozokuSelect.prepend($('<option value="" style="" selected>指示なし</option>'));
        }
    });
}

const title = $("#main-portlet-title > span").text();
if (title && title.includes("インポート")) {
    const nendo = $("#sfkNendo");
    if (nendo && nendo.val() == new Date().getFullYear()) nendo.val(nendo.val() - 1);
    nendo = $("#nendo");
    if (nendo && nendo.val() == new Date().getFullYear()) nendo.val(nendo.val() - 1);

    if (courseName) {
        //var kaikoKamokunm = $("#kaikoKamokunm");
        //if (kaikoKamokunm) kaikoKamokunm.val(courseName);
        const td = $("td:contains('" + courseName + "')");
        if(td.length) td.parent().css("background-color", "#f0f0f0");
    }
    if (kyokanName) {
        const kyokannm = $("#kyokannm");
        if (kyokannm) kyokannm.val(kyokanName);
    }
}

const importButton = $(":input[name='_eventId_syllabusImport']");
if (importButton) {
    importButton.click(function (e) {
        const th = $("th:contains('科目名'):contains('日本語'):first");
        if (th) courseName = th.next().text().trim();
        th = $("th:contains('主担当教員'):contains('日本語'):first");
        if (th) kyokanName = th.next().text().trim();
    });

    const insertExamplesButton = $("<button>空欄に文例を挿入</button>");
    insertExamplesButton.appendTo(importButton.parent());
    insertExamplesButton.click(function (e) {
        Object.keys(examples).forEach(function (key) {
            const input = $("#" + key);
            if (input && input.val().length == 0) input.val(examples[key]);
        });
        e.preventDefault();
    });
}


const table = $("table").has("th:contains('開講')");
if (table) {
    console.log("syllabus.js: syllabus table found.");
    const th = table.find("th:contains('開講'):first");
    const tbody = table.find("tbody");

    if (th) {
        const i = table.find("th").index(th);
        const sorter = $("<a href=''>▼</a>");
        sorter.click(function (e) {
            e.preventDefault();
            const trs = tbody.find("tr:gt(0)").sort(function (a, b) {
                const atext = $(a).children().eq(i).text().trim();
                const btext = $(b).children().eq(i).text().trim();
                let result = terms.indexOf(atext) - terms.indexOf(btext);

                if (result == 0) {
                    const ano = Number($(a).children().eq(0).text().trim());
                    const bno = Number($(b).children().eq(0).text().trim());
                    result = ano - bno;
                }

                return result;
            }).appendTo(tbody);
        });
        th.append(sorter);
    }

    const dayOfWeek = [ "日", "月", "火", "水", "木", "金", "土" ][(new Date()).getDay()];

    const th2 = table.find("th:contains('曜日・時限'):first");
    const i2 = table.find("th").index(th2);
    const rows = tbody.find("tr:gt(0)");
    const todayRows = rows.filter(function(index){
        return $(this).children().eq(i2).text().includes(dayOfWeek);
    })

    todayRows.css('border', '2px dashed black');
    console.log(todayRows);
}