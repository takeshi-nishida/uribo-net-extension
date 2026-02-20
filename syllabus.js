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

const syllabusCheckPrompt = `以下はシラバスの内容です。以下のチェックリストを参考に添削や改善案をお願いします。

- **全般**
  - 入力必須項目に空欄がありませんか？
  - 日本語と英語の両方の記載が必要な項目に、両方の言語で記載がありますか？
  - 日本語と英語の内容は対応していますか？
  - 内容は具体的すぎず、抽象的すぎず、学生にとって分かりやすい内容になっていますか？シラバスは授業資料ではなく、学生が授業を選ぶ際の情報源であることを考慮してください。
- **授業のテーマ** （入力必須、英語版必須）
  - 学修内容とその目的の両方が記載されていますか？
- **授業の到達目標** （入力必須、英語版必須）
  - 学生の視点から具体的に記載されていますか？
    ※大学改革支援・学位授与機構の重視する項目であり、字数チェックが行われます。
  - 評価可能な目標になっていますか？
- **授業の概要と計画** （入力必須）
  - 単位数に応じた授業回数が記載されていますか？
    ※セメスター科目については15回目、クォーター科目については、8回目までの記載があること。
  - 授業回数毎に記載されていますか？
  - 15回目（8回目）が「試験」のみになっていませんか？
  - 実務経験のある教員による授業科目を実施する場合、どのような実務経験をもつ教員が、その実務経験を生かして、どのような授業を行うかが明確に分かるよう記載されていますか？
  - ハイブリッドまたは遠隔授業を実施する場合、学生に授業実施方法が伝わる記載になっていますか？
  - 開講日等を記載している場合、次年度の日付に更新されていますか？（日付自体を削除することも可能です）
- **成績評価方法** （入力必須）
  - 評価方法とその割合について記載がされていますか？
  - 複数の評価項目での評価になっていますか？
  - 「出席」が評価項目になっていませんか？
    授業への参加度や課題への取り組みの度合いを判断して評価を行う旨を記載してください。
- **成績評価基準** （入力必須）
  - 「授業の到達目標」に即して具体的に記載されていますか？
- **履修上の注意** （入力必須）
  - 留学生（交換留学生等）が受講できる授業の場合、受講可である旨と、留学生に求める能力が記載されていますか？
  - 授業でパソコンを活用する場合、詳細について記載がされていますか？
- **事前・事後学修** （入力必須）
  - 事前学修・事後学修それぞれについて記載されていますか？
  - 内容・方法について具体的に記載されていますか？
    ※大学改革支援・学位授与機構の重視する項目であり、字数チェックが行われます。
  - 以下の文言が記載されていますか？
    「本学では1単位あたりの学修時間を45時間としています。毎回の授業にあわせて事前学修・事後学修を行ってください。」
- **オフィスアワー・連絡先** （入力必須）
  - 誰が読んでも分かるよう、研究室の場所（○○研究科○棟201○○研究室）等、可能な限り詳細に記載がされていますか？
- **教科書** （入力必須）
  - 教科書情報が最新版になっていますか？
  - 特定の教科書がない場合、「資料を配付します」等と記載されていますか？
- **キーワード**
  - 実務経験のある教員による授業科目は、「実務経験教員」と記載されていますか？
  - 交換留学生が受講可能な場合、「交換留学生（特別聴講学生）可」と記載されていますか？
  - 成績評価にあたり、1題あたり1000字以上のレポートを課す場合、キーワード欄に「長文レポート」を記載されていますか？`

let courseName, kyokanName;

console.log("running syllabus.js");

const shozokuSelect = $("#jikanwariShozokuCode");

if (shozokuSelect.length) {
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
if (title.length && title.includes("インポート")) {
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
if (importButton.length) {
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
if (table.length) {
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

    const copyButton = $("<button style='margin-right: 1em'>シラバスをクリップボードにコピー</button>");
    const copyWithPromptButton = $("<button style='margin-right: 1em'>シラバスチェックプロンプトとともにコピー</button>");
    const referButton = $("input[value='シラバス参照へ']");
    if (referButton.length) {
        referButton.before(copyButton);
        referButton.before(copyWithPromptButton);
    }

    copyButton.click(function (e) {
        e.preventDefault();

        const markdownContent = getSyllabusContentText();
        if (!markdownContent) {
            alert("シラバスの内容が見つかりませんでした。");
            return;
        }

        navigator.clipboard.writeText(markdownContent).then(() => {
            alert("シラバスがクリップボードにコピーされました！");
        }).catch(err => {
            console.error("クリップボードへのコピーに失敗しました: ", err);
            alert("クリップボードへのコピーに失敗しました。");
        });
    });

    copyWithPromptButton.click(function (e) {
        e.preventDefault();
        const markdownContent = getSyllabusContentText();
        if (!markdownContent) {
            alert("シラバスの内容が見つかりませんでした。");
            return;
        }
        const prompt = syllabusCheckPrompt + "\n\n====\nシラバス\n" + markdownContent;
        navigator.clipboard.writeText(prompt).then(() => {
            alert("シラバスチェックプロンプトがクリップボードにコピーされました！");
        }).catch(err => {
            console.error("クリップボードへのコピーに失敗しました: ", err);
            alert("クリップボードへのコピーに失敗しました。");
        });
     });
}

function getSyllabusContentText() {
    const syllabusInputs = $("td.syllabus-input.inner-table");
    if (!syllabusInputs.length) {
        return null;
    }

    let markdownContent = "";

    // Extract content from .syllabus-input and textarea elements
    syllabusInputs.each(function () {
        // label is in the font element inside this element
        const label = $(this).find("font").first().text().trim();
        // contents is the textarea(s) in the same row as this element
        const textarea = $(this).closest("tr").find("textarea");
        let content = "";
        textarea.each(function () {
            if($(this).val().trim().length == 0) return;
            if ($(this).attr("id") && $(this).attr("id").includes("En")) {
                content += "(English)\n";
            }
            content += $(this).val() + "\n";
        });

        if (label && content.trim()) {
            markdownContent += `## ${label}\n${content}\n`;
        }
    });
    return markdownContent;
}