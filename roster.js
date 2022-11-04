const studentTable = $("table").has("th:contains('所属')");

if(studentTable){
    console.log("roster.js: student table found.");
    const th = studentTable.find("th:contains('所属'):first");

    if(th){
        const m = new Map();
        const i = studentTable.find("th").index(th);
        const tbody = studentTable.find("tbody");

        const rows = tbody.find("tr");
        rows.each(function(index){
            const shozoku = $(this).children().eq(i).text().trim();
            if(!m.has(shozoku)){
                m.set(shozoku, 1);
            }
            else{
                m.set(shozoku, m.get(shozoku) + 1);
            }
        });

        const sorted = [...m.entries()].sort((a, b) => b[1] - a[1]);
        const info = sorted.map(e => e[0] + ":" + e[1] + "人").join(", ");
        const div = $("<div style='margin: 4px'>表示中の表の集計：" + info + " (by Uribo-net extension)</div>");
        studentTable.before(div);

    }
}
