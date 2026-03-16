const CMS_URL = "https://script.google.com/macros/s/AKfycbxLP3JZpcW7ON7ay5QO2tzoZmI1Vmi9CsqcUeBnf6rSonl6r2ZqP6gJQTglm5abJmnk/exec";

async function loadConcerts() {

  const res = await fetch(CMS_URL);
  const data = await res.json();

  const timeline = document.getElementById("concertTimeline");

  const concerts = data.concerts
    .map(c => ({
      title: c[0],
      date: new Date(c[1]),
      venue: c[2],
      time: c[3],
      image: c[4]
    }))
    .sort((a,b)=> b.date - a.date);

  timeline.innerHTML = concerts.map((c,i)=>{

    const odd = i % 2 === 0 ? "concert--odd" : "concert--even";
    const isLatest = i === 0 ? "latest" : "";

    const y = c.date.getFullYear();
    const m = c.date.getMonth()+1;
    const d = c.date.getDate();

    const num = c.title.match(/\d+/)?.[0] || "";

    const image = c.image && c.image.trim() !== ""
      ? c.image
      : "images/coming.jpg";

    return `

<article class="concert ${odd} ${isLatest}">
  
  <div class="concert__image">
    <img src="${image}" 
         alt="${c.title}" 
         loading="lazy"
         onerror="this.src='images/coming.jpg'">
  </div>

  <div class="concert__center">
    <div class="concert__node"></div>
  </div>

  <div class="concert__content">

    ${isLatest ? `<div class="latest-badge">最新公演</div>` : ""}

    <p class="concert__num">${num}th Concert</p>

    <h2 class="concert__title">${c.title}</h2>

    <div class="concert__divider"></div>

    <div class="concert__meta">

      <div class="concert__date">
        <span class="concert__date-icon">◆</span>
        <span>${y}年${m}月${d}日</span>
      </div>

      <div class="concert__venue">
        <span class="concert__venue-icon">◆</span>
        <span>${c.venue}</span>
      </div>

    </div>

  </div>

</article>

`;

  }).join("");

}

window.addEventListener("DOMContentLoaded", loadConcerts);
