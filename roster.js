const studentTable = $("table").has("th:contains('現況区分')").not(":has(table)");

if(studentTable.length){
    console.log("roster.js: student table found.");
    const shozokuTh = studentTable.find("th:contains('所属'):first");
    const idTh = studentTable.find("th:contains('学籍番号'):first");
    const kubunTh = studentTable.find("th:contains('現況区分'):first");

    if (shozokuTh.length && idTh.length) {
        const shozokuIndex = studentTable.find("th").index(shozokuTh);
        const idIndex = studentTable.find("th").index(idTh);
        const kubunIndex = studentTable.find("th").index(kubunTh);
        const tbody = studentTable.find("tbody");        
        const rows = tbody.find("tr");

        const initCounter = () => ({ total: 0, cancelled: 0 });
        const updateCounter = (counter, cancelled) => {
            counter.total++;
            if (cancelled) counter.cancelled++;
        }
        
        const nendos = new Set();
        const m = new Map(); // shozoku -> Map<nendo, { total, cancelled }>
        const shozokuTotal = new Map(); // shozoku -> { total, cancelled }
        const nendoTotal = new Map(); // nendo -> { total, cancelled }
        let grandTotal = initCounter();

        rows.each(function (index) {
            const tds = $(this).children();
            const shozoku = tds.eq(shozokuIndex).text().trim();
            const id = tds.eq(idIndex).text().trim();

            const kubun = tds.eq(kubunIndex).text().trim();
            const cancelled = kubun.includes("履修取消");

            const nendo = id.substr(0, 2); // 学籍番号の最初の2桁が年度
            nendos.add(nendo);

            if (!m.has(shozoku)) m.set(shozoku, new Map());
            const shozokuMap = m.get(shozoku);
            if (!shozokuMap.has(nendo)) shozokuMap.set(nendo, initCounter());
            updateCounter(shozokuMap.get(nendo), cancelled);

            if(!shozokuTotal.has(shozoku)) shozokuTotal.set(shozoku, initCounter());
            updateCounter(shozokuTotal.get(shozoku), cancelled);
            if(!nendoTotal.has(nendo)) nendoTotal.set(nendo, initCounter());
            updateCounter(nendoTotal.get(nendo), cancelled);

            updateCounter(grandTotal, cancelled);
        });

        const formatCount = (stat) => {
            if (!stat || stat.total === 0) return "";
            return stat.cancelled > 0 ? `${stat.total - stat.cancelled} (-${stat.cancelled})` : `${stat.total}`;
        };

        const sortedNendos = [...nendos].sort((a, b) => b - a);
        const sortedShozokus = [...m.keys()].sort((a, b) => shozokuTotal.get(b) - shozokuTotal.get(a));

        const table = $("<table border=='1' cellspacing='0' cellpadding='3' class='normal sp-table-break'></table>");
        const header = $("<tr><th class='normal'>集計 (by Uribo-net extension)</th></tr>");
        sortedNendos.forEach(nendo => {
            header.append(`<th class='normal'>${nendo}年</th>`);
        });
        header.append("<th class='normal'>合計</th>");
        table.append(header);

        for(const shozoku of sortedShozokus) {
            const nendoMap = m.get(shozoku);
            const row = $(`<tr><td class='normal'>${formatShozoku(shozoku)}</td></tr>`);
            sortedNendos.forEach(nendo => {
                row.append(`<td class='normal'>${formatCount(nendoMap.get(nendo))}</td>`);
            });
            row.append(`<td class='normal'>${formatCount(shozokuTotal.get(shozoku))}</td>`);
            table.append(row);
        }

        const nendoRow = $("<tr><td class='normal'>合計</td></tr>");
        sortedNendos.forEach(nendo => {
            nendoRow.append(`<td class='normal'>${formatCount(nendoTotal.get(nendo))}</td>`);
        });
        nendoRow.append(`<td class='normal'>${formatCount(grandTotal)}</td>`);
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
    