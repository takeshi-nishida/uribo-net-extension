const evaluations = ["有益ではなかった", "どちらかといえば有益ではなかった", "どちらともいえない", "どちらかといえば有益であった", "有益であった" ];

console.log("running enquete.js");

const resultForm = $("#enqueteResultCsv");

if (resultForm) {
    console.log("enquete result found.");
    const eTable = resultForm.find("table:" + evaluations.map(function (e) { return "contains(" + e + ")" }).join(":"));

    if (eTable.length == 1) {
        let sumScore = 0;
        let sumN = 0;
        for (let i = 0; i < evaluations.length; i++) {
            const td = eTable.find("td").filter(function () {
                return $(this).text().trim() == evaluations[i];
            }).first();
            const n = Number(td.next().text().trim());
            sumN += n;
            sumScore += n * (i + 1);
            console.log((i + 1) + ":" + n + "人");
        }
        if (sumN > 0) {
            console.log("人数:" + sumN + ", 平均:" + sumScore / sumN);
            eTable.after($("<p>平均:" + (sumScore / sumN).toFixed(2) + " (by Uribo-net Extension)</p>"));
        }
    }

    const bDiv = resultForm.find("div:contains(全学共通教育ベストティーチャー賞)");

    if (bDiv.length == 1) {
        const yes = bDiv.find("td").filter(function () { return $(this).text().trim() == "はい"; }).first();
        const no = bDiv.find("td").filter(function () { return $(this).text().trim() == "いいえ"; }).first();
        const nYes = Number(yes.next().text().trim());
        const nNo = Number(no.next().text().trim());
        if (nYes + nNo > 0) {
            const ratio = nYes / (nYes + nNo);
            console.log("人数:" + (nYes + nNo) + ", 推薦率:" + ratio);
            bDiv.find("table").first().after($("<p>推薦率:" + (ratio * 100).toFixed(2) + "% (by Uribo-net Extension)</p>"));
        }
    }
}

