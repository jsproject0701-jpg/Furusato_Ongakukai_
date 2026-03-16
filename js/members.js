// ============ MEMBERS DATA ============
// 初期データ：GASスプレッドシートから上書きされる（cms.js）
// GAS読み込み失敗時のフォールバックとして、実名データのみ残す
const membersData = [
  { name:"奥田 奏至", instrument:"flute",  hometown:"周南市", profile:"須々万中学校・新南陽高等学校・徳島文理大学・エリザベト音楽大学在学中", img:"" },
  { name:"澤井 波音", instrument:"flute",  hometown:"防府市", profile:"国府中学校・防府西高等学校・エリザベト音楽大学在学中",               img:"" },
  { name:"渡部 真菜", instrument:"flute",  hometown:"防府市", profile:"国府中学校・岡山県明成学院高等学校・国立音楽大学卒",                 img:"" },
  { name:"貞賴 惠",   instrument:"oboe",   hometown:"山口県", profile:"",                                                                   img:"" },
];

const instLabel = {
  flute:      "Flute",
  oboe:       "Oboe",
  clarinet:   "Clarinet",
  saxophone:  "Saxophone",
  horn:       "Horn",
  trumpet:    "Trumpet",
  trombone:   "Trombone",
  tuba:       "Tuba",
  percussion: "Percussion",
  piano:      "Piano",
  strings:    "Strings"
};

// XSS対策：テキストを安全にDOM挿入するヘルパー
function setTextContent(el, text) {
  el.textContent = typeof text === "string" ? text : "";
}

function renderMembers(filter) {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;

  const data = filter === 'all'
    ? membersData
    : membersData.filter(m => m.instrument === filter);

  // データが空の場合
  if (!data.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);">該当するメンバーがいません</p>';
    return;
  }

  // innerHTML を避け、DOM操作でカードを生成（XSS対策）
  grid.innerHTML = "";
  data.forEach(m => {
    const card = document.createElement("div");
    card.className = "member-card";

    const photoWrap = document.createElement("div");
    photoWrap.className = "member-photo-wrap";
    if (m.img) {
      const img = document.createElement("img");
      img.className   = "member-photo";
      img.src         = m.img;
      img.alt         = m.name;
      img.loading     = "lazy";
      photoWrap.appendChild(img);
    }

    const instrEl = document.createElement("div");
    instrEl.className = "member-instrument";
    setTextContent(instrEl, instLabel[m.instrument] || m.instrument);

    const nameEl = document.createElement("div");
    nameEl.className = "member-name";
    setTextContent(nameEl, m.name);

    card.appendChild(photoWrap);
    card.appendChild(instrEl);
    card.appendChild(nameEl);

    if (m.hometown) {
      const hometownEl = document.createElement("div");
      hometownEl.className = "member-bio";
      setTextContent(hometownEl, m.hometown + "出身");
      card.appendChild(hometownEl);
    }

    if (m.profile) {
      const profileEl = document.createElement("div");
      profileEl.className = "member-bio";
      setTextContent(profileEl, m.profile);
      card.appendChild(profileEl);
    }

    grid.appendChild(card);
  });
}

renderMembers('all');

function filterMembers(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMembers(filter);
}
