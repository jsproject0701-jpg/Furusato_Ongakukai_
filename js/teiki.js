// ============ TEIKI CONCERTS ============
// CMS_URL は cms.js で定義済みのため、teiki.html 専用ページでのみ
// このファイルが読み込まれる。cms.js と同時読み込みにならないよう注意。
const TEIKI_CMS_URL = "https://script.google.com/macros/s/AKfycbxLP3JZpcW7ON7ay5QO2tzoZmI1Vmi9CsqcUeBnf6rSonl6r2ZqP6gJQTglm5abJmnk/exec";

// XSS対策
function teikiEscape(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadConcerts() {
  const timeline = document.getElementById("concertTimeline");
  if (!timeline) {
    console.error("concertTimeline element not found");
    return;
  }

  try {
    const res  = await fetch(TEIKI_CMS_URL);
    const data = await res.json();

    if (!Array.isArray(data.concerts) || !data.concerts.length) {
      timeline.innerHTML = '<p style="text-align:center;color:var(--text-light);">公演情報を準備中です</p>';
      return;
    }

    const concerts = data.concerts
      .map(c => ({
        title: c[0] || "",
        date:  new Date(c[1]),
        venue: c[2] || "",
        time:  c[3] || "",
        image: c[4] || ""
      }))
      .filter(c => !isNaN(c.date))
      .sort((a, b) => b.date - a.date);

    timeline.innerHTML = concerts.map((c, i) => {
      const odd      = i % 2 === 0 ? "concert--odd" : "concert--even";
      const isLatest = i === 0;
      const y = c.date.getFullYear();
      const m = c.date.getMonth() + 1;
      const d = c.date.getDate();

      // タイトルから回次番号を取得。取れない場合は非表示
      const numMatch = c.title.match(/\d+/);
      const numLabel = numMatch ? `<p class="concert__num">${numMatch[0]}th Concert</p>` : "";

      const image = c.image && c.image.trim() !== ""
        ? c.image
        : "images/coming.svg";

      return `
<article class="concert ${odd}${isLatest ? " latest" : ""}">
  <div class="concert__image">
    <img src="${teikiEscape(image)}"
         alt="${teikiEscape(c.title)}"
         loading="lazy"
         onerror="this.src='images/coming.svg'">
  </div>
  <div class="concert__center">
    <div class="concert__node"></div>
  </div>
  <div class="concert__content">
    ${isLatest ? `<div class="latest-badge">最新公演</div>` : ""}
    ${numLabel}
    <h2 class="concert__title">${teikiEscape(c.title)}</h2>
    <div class="concert__divider"></div>
    <div class="concert__meta">
      <div class="concert__date">
        <span class="concert__date-icon">◆</span>
        <span>${y}年${m}月${d}日</span>
      </div>
      <div class="concert__venue">
        <span class="concert__venue-icon">◆</span>
        <span>${teikiEscape(c.venue)}</span>
      </div>
    </div>
  </div>
</article>`;
    }).join("");

    initScrollReveal();

  } catch (e) {
    console.error("concert load error", e);
    timeline.innerHTML = '<p style="text-align:center;color:var(--text-light);">公演情報の読み込みに失敗しました。しばらく経ってから再度お試しください。</p>';
  }
}

function initScrollReveal() {
  const concerts = document.querySelectorAll('.concert');
  if (!concerts.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  concerts.forEach(c => io.observe(c));
}

window.addEventListener("DOMContentLoaded", loadConcerts);
