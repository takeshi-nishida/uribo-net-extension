const studentTable = $("table").has("th:contains('現況区分')").not(":has(table)");

if(studentTable.length){
    console.log("roster.js: student table found.");
    const shozokuTh = studentTable.find("th:contains('所属'):first");
    const idTh = studentTable.find("th:contains('学籍番号'):first");

    if (shozokuTh.length && idTh.length) {
        const shozokuIndex = studentTable.find("th").index(shozokuTh);
        const idIndex = studentTable.find("th").index(idTh);
        const tbody = studentTable.find("tbody");        
        const rows = tbody.find("tr");
        
        const nendos = new Set();
        const m = new Map(); // shozoku -> Map<nendo, count>
        const shozokuTotal = new Map(); // shozoku -> count
        const nendoTotal = new Map(); // nendo -> count
        let total = 0;

        rows.each(function (index) {
            const tds = $(this).children();
            const shozoku = tds.eq(shozokuIndex).text().trim();
            const id = tds.eq(idIndex).text().trim();
            const nendo = id.substr(0, 2); // 学籍番号の最初の2桁が年度

            nendos.add(nendo);

            if (!m.has(shozoku)) m.set(shozoku, new Map());
            const shozokuMap = m.get(shozoku);
            shozokuMap.set(nendo, (shozokuMap.get(nendo) || 0) + 1);

            shozokuTotal.set(shozoku, (shozokuTotal.get(shozoku) || 0) + 1);
            nendoTotal.set(nendo, (nendoTotal.get(nendo) || 0) + 1);
            total++;
        });

        const sortedNendos = [...nendos].sort((a, b) => b - a);
        const sortedShozokus = [...m.keys()].sort((a, b) => shozokuTotal.get(b) - shozokuTotal.get(a));

        const table = $("<table border=='1' cellspacing='0' cellpadding='3' class='normal sp-table-break'></table>");
        const header = $("<tr><th class='normal'>集計 (by Uribo-net extension)</th></tr>");
        sortedNendos.forEach(nendo => {
            header.append("<th class='normal'>" + nendo + "年</th>");
        });
        header.append("<th class='normal'>合計</th>");
        table.append(header);

        for(const shozoku of sortedShozokus) {
            const nendoMap = m.get(shozoku);
            const row = $("<tr><td class='normal'>" + formatShozoku(shozoku) + "</td></tr>");
            sortedNendos.forEach(nendo => {
                const count = nendoMap.get(nendo) || 0;
                row.append("<td class='normal'>" + (count > 0 ? count : "") + "</td>");
            });
            const totalCount = shozokuTotal.get(shozoku);
            row.append("<td class='normal'>" + totalCount + "</td>");
            table.append(row);
        }

        const nendoRow = $("<tr><td class='normal'>合計</td></tr>");
        sortedNendos.forEach(nendo => {
            const count = nendoTotal.get(nendo) || 0;
            nendoRow.append("<td class='normal'>" + (count > 0 ? count : "") + "</td>");
        });
        nendoRow.append("<td class='normal'>" + total + "</td>");
        table.append(nendoRow);

        studentTable.before(table);            
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
    