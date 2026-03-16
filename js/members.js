
// ============ MEMBERS DATA ============
const membersData = [
  { name:"奥田 奏至", instrument:"flute", hometown:"周南市", profile:"須々万中学校・新南陽高等学校・徳島文理大学・エリザベト音楽大学在学中", img:"" },
  { name:"澤井 波音", instrument:"flute", hometown:"防府市", profile:"国府中学校・防府西高等学校・エリザベト音楽大学在学中", img:"" },
  { name:"渡部 真菜", instrument:"flute", hometown:"防府市", profile:"国府中学校・岡山県明成学院高等学校・国立音楽大学卒", img:"" },
  { name:"貞賴 惠", instrument:"oboe", hometown:"山口県", profile:"", img:"" },
  { name:"（メンバー）", instrument:"clarinet", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"saxophone", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"horn", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"trumpet", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"trombone", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"tuba", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"percussion", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
  { name:"（メンバー）", instrument:"piano", hometown:"", profile:"情報はスプレッドシートから読み込まれます", img:"" },
];

const instLabel = {
  flute:"Flute", oboe:"Oboe", clarinet:"Clarinet",
  saxophone:"Saxophone", horn:"Horn", trumpet:"Trumpet",
  trombone:"Trombone", tuba:"Tuba", percussion:"Percussion",
  piano:"Piano", strings:"Strings"
};

function renderMembers(filter) {
  const grid = document.getElementById('membersGrid');
  const data = filter === 'all' ? membersData : membersData.filter(m => m.instrument === filter);
  grid.innerHTML = data.map(m => `
    <div class="member-card">
      <div class="member-photo-wrap">
        ${m.img ? `<img class="member-photo" src="${m.img}" alt="${m.name}" loading="lazy">` : ''}
      </div>
      <div class="member-instrument">${instLabel[m.instrument] || m.instrument}</div>
      <div class="member-name">${m.name}</div>
      ${m.hometown ? `<div class="member-bio">${m.hometown}出身</div>` : ''}
      <div class="member-bio">${m.profile}</div>
    </div>
  `).join('');
}
renderMembers('all');

function filterMembers(filter, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMembers(filter);
}
