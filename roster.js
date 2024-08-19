const studentTable = $("table").has("th:contains('現況区分')").not(":has(table)");

if(studentTable.length){
    console.log("roster.js: student table found.");
    const th = studentTable.find("th:contains('所属'):first");

    if (th.length) {
        const m = new Map();
        const i = studentTable.find("th").index(th);
        const tbody = studentTable.find("tbody");

        const rows = tbody.find("tr");
        rows.each(function (index) {
            const shozoku = $(this).children().eq(i).text().trim();
            if (!m.has(shozoku)) {
                m.set(shozoku, 1);
            }
            else {
                m.set(shozoku, m.get(shozoku) + 1);
            }
        });

        const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);

        if (sorted.length > 1) {
            const table = $("<table border=='1' cellspacing='0' cellpadding='3' class='normal sp-table-break'></table>");
            table.append("<tr><th class='normal'>集計 (by Uribo-net extension)</th><th class='normal'>人数</th></tr>");
            sorted.forEach(e => 
                table.append("<tr><td>" + formatShozoku(e[0]) + "</td><td>" + e[1] + "人</td></tr>")
            );
            studentTable.before(table);            
        }
    }
}

function formatShozoku(shozoku) {
    const rules = [
        [/博士課程前期課程/, " M "],
        [/博士課程後期課程/, " D "],
        [/学部\s*/, "学部 "],
        [/学科\s*/, "学科 "],
        [/専攻\s*/, "専攻 "],
        [/研究科\s*/, "研究科 "]
    ];

    rules.forEach(rule => {
        shozoku = shozoku.replace(rule[0], rule[1]);
    })
    return shozoku;
}
    