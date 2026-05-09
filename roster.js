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

const links = studentTable.find("a");

if (links.length) {
  const facePhotoQuizLink = $("<a href='#'>顔写真クイズ</a>");

  facePhotoQuizLink.click(async function (e) {
    e.preventDefault();

    const data = await collectFacePhotos(links);
    data.sort(() => Math.random() - 0.5);

    if (data.length) {
      showQuizModal(data);
    } else {
      alert("画像が取得できませんでした");
    }
  });

  studentTable.before(facePhotoQuizLink);
}

async function getFacePhotoUrl(url) {
  const res = await fetch(url);
  const text = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  const img = doc.querySelector('img[alt="Face Photo"]');
  return img ? img.src : null;
}

async function collectFacePhotos(links) {
  const results = [];

  for (const a of links.toArray()) {
    const url = $(a).attr("href");
    const name = $(a).text().trim();

    const facePhotoUrl = await getFacePhotoUrl(url);
    if (facePhotoUrl) {
      results.push({ name, facePhotoUrl });
    }
  }

  return results;
}

function showQuizModal(data) {
  let index = 0;
  let showAnswer = false;

  const modal = $(`
    <div id="face-quiz-modal" style="
      position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.7); display:flex;
      align-items:center; justify-content:center; z-index:9999;
    ">
      <div style="background:white; padding:20px; text-align:center;">
        <img id="quiz-img" src="" style="max-width:300px;"><br>
        <div id="quiz-name" style="font-size:20px; margin:10px;"></div>
        <button id="show-answer">答え</button>
        <button id="next">次へ</button>
        <button id="close">閉じる</button>
      </div>
    </div>
  `);

  $("body").append(modal);

  function render() {
    const item = data[index];
    $("#quiz-img").attr("src", item.facePhotoUrl);
    $("#quiz-name").text(showAnswer ? item.name : "？？？");
  }

  $("#show-answer").click(() => {
    showAnswer = true;
    render();
  });

  $("#next").click(() => {
    index = (index + 1) % data.length;
    showAnswer = false;
    render();
  });

  $("#close").click(() => modal.remove());

  render();
}