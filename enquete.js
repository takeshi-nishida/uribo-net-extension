var evaluations = ["有益ではなかった", "どちらかといえば有益ではなかった", "どちらともいえない", "どちらかといえば有益であった", "有益であった" ];

console.log("running enquete.js");

$("#main-frame-if").on('load', function () {
    console.log("iframe loaded");

    var contents = $(this).contents();

    var resultForm = contents.find("#enqueteResultCsv");
    if (resultForm.length == 1) {
        var eTable = resultForm.find("table:" + evaluations.map(function (e) { return "contains(" + e + ")" }).join(":"));

        var sumScore = 0;
        var sumN = 0;

        if (eTable.length == 1) {
            for (var i = 0; i < evaluations.length; i++) {
                var td = eTable.find("td").filter(function () {
                    return $(this).text().trim() == evaluations[i];
                }).first();
                var n = Number(td.next().text().trim());
                sumN += n;
                sumScore += n * (i + 1);
                console.log((i + 1) + ":" + n + "人");
            }
            if (sumN > 0) {
                console.log("人数:" + sumN + ", 平均:" + sumScore / sumN);
                eTable.after($("<p>平均:" + (sumScore / sumN).toFixed(2) + " (by Uribo-net Extension)</p>"));
            }
        }

        var bDiv = resultForm.find("div:contains(全学共通教育ベストティーチャー賞)");

        if (bDiv.length == 1) {
            var yes = bDiv.find("td").filter(function () { return $(this).text().trim() == "はい"; }).first();
            var no = bDiv.find("td").filter(function () { return $(this).text().trim() == "いいえ"; }).first();
            var nYes = Number(yes.next().text().trim());
            var nNo = Number(no.next().text().trim());
            if (nYes + nNo > 0) {
                var ratio = nYes / (nYes + nNo);
                console.log("人数:" + (nYes + nNo) + ", 推薦率:" + ratio);
                bDiv.find("table").first().after($("<p>推薦率:" + (ratio * 100).toFixed(2) + "% (by Uribo-net Extension)</p>"));
            }
        }
    }
});