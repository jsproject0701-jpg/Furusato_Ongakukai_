
// ============ CMS ============
const CMS_URL = "https://script.google.com/macros/s/AKfycbxLP3JZpcW7ON7ay5QO2tzoZmI1Vmi9CsqcUeBnf6rSonl6r2ZqP6gJQTglm5abJmnk/exec";

async function loadCMS() {
  let data;
  try {
    const res = await fetch(CMS_URL);
    data = await res.json();
  } catch(e) {
    console.error("CMS load error", e);
    return;
  }
  window.concertData = data.concerts;

  // MEMBERS
  if (data.members) {
    membersData.length = 0;
    data.members.forEach(r => {
      membersData.push({
        name: r[0],
        instrument: (r[1] || "").toLowerCase(),
        hometown: r[2],
        profile: r[3],
        img: r[4]
      });
    });
    renderMembers("all");
  }

  // CONCERT
  if (data.concerts.length) {
    const today = new Date();
    let upcoming = data.concerts
      .map(c => ({ title: c[0], date: new Date(c[1]), venue: c[2], time: c[3] || "" }))
      .filter(c => c.date >= today)
      .sort((a,b) => a.date - b.date)[0];

    if (!upcoming) {
      document.querySelector(".next-month").innerText = "";
      document.querySelector(".next-day").innerText = "--";
      document.querySelector(".next-week").innerText = "";
      document.querySelector(".next-year").innerText = "次回公演日程調整中";
      upcoming = data.concerts
        .map(c => ({ title: c[0], date: new Date(c[1]), venue: c[2], time: c[3] }))
        .sort((a,b) => b.date - a.date)[0];
    }

    if (upcoming) {
      const d = upcoming.date;
      const week = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
      document.getElementById("nextWeek").innerText = week[d.getDay()];
      document.querySelector(".next-month").innerText = d.getFullYear();
      document.querySelector(".next-day").innerText = String(d.getMonth()+1).padStart(2,"0") + "." + String(d.getDate()).padStart(2,"0");
      document.querySelector(".next-year").innerText = "";

      let displayTime = upcoming.time;
      if (displayTime) {
        if (displayTime instanceof Date) {
          displayTime = displayTime.toLocaleTimeString("ja-JP", { hour:"2-digit", minute:"2-digit" });
        } else if (typeof displayTime === "string" && displayTime.includes("T")) {
          displayTime = new Date(displayTime).toLocaleTimeString("ja-JP", { hour:"2-digit", minute:"2-digit" });
        }
      }

      document.getElementById("concertTitle").innerText = upcoming.title;
      document.getElementById("concertInfo").innerHTML = `
        📍 会場：${upcoming.venue}<br>
        🕐 開演：${displayTime}<br>
        🎟 入場無料
      `;
    }
  }

  // CALENDAR
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const dayNames = ["日","月","火","水","木","金","土"];
  const calGrid = document.getElementById("calendarGrid");
  const today = new Date();
  const futureConcerts = data.concerts
    .filter(c => new Date(c[1]) >= today)
    .sort((a,b) => new Date(a[1]) - new Date(b[1]));

  const year = futureConcerts.length
    ? new Date(futureConcerts[0][1]).getFullYear()
    : new Date(data.concerts[data.concerts.length-1][1]).getFullYear();

  document.querySelector(".calendar-header").innerText = year + "年 公演カレンダー";

  const concertDates = {};
  data.concerts.forEach((c, index) => {
    const d = new Date(c[1]);
    if (d.getFullYear() !== year) return;
    const month = d.getMonth()+1;
    const day = d.getDate();
    if (!concertDates[month]) concertDates[month] = [];
    concertDates[month].push({ day, index });
  });

  calGrid.innerHTML = months.map((m, i) => {
    const mo = i + 1;
    const firstDay = new Date(year, i, 1).getDay();
    const daysInMonth = new Date(year, i+1, 0).getDate();
    const concerts = concertDates[mo] || [];
    let cells = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join("");
    for (let x = 0; x < firstDay; x++) cells += `<div class="cal-day empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
      const concert = concerts.find(c => c.day === day);
      if (concert) {
        cells += `<div class="cal-day has-concert" onclick="showConcertDetail(${concert.index})" title="${mo}月${day}日 公演">${day}</div>`;
      } else {
        cells += `<div class="cal-day">${day}</div>`;
      }
    }
    return `<div class="cal-month"><div class="cal-month-name">${m}</div><div class="cal-days">${cells}</div></div>`;
  }).join("");

 // CONCERT HISTORY
const historyEl = document.getElementById("concertHistory");

if (data.concerts && historyEl) {

  const pastConcerts = data.concerts
    .map(c => ({
      title: c[0],
      date: new Date(c[1]),
      venue: c[2],
      time: c[3]
    }))
    .filter(c => c.date < today)
    .sort((a,b) => b.date - a.date);

  historyEl.innerHTML = pastConcerts.map(c => {

    const y = c.date.getFullYear();
    const m = c.date.getMonth()+1;
    const d = c.date.getDate();

    return `
    <div style="display:flex;gap:1rem;align-items:flex-start;padding:0.7rem 0;border-bottom:1px solid #e8e2d9;">
      <span style="flex-shrink:0;font-family:'Cormorant Garamond',serif;font-size:0.8rem;color:var(--accent);letter-spacing:0.1em;min-width:40px;">
        ${y}
      </span>
      <span style="font-size:0.82rem;color:var(--text-light);font-weight:300;line-height:1.7;">
        ${c.title} - ${y}年${m}月${d}日 ${c.venue}
      </span>
    </div>
    `;
  }).join("");

}

  // INSTAGRAM VIDEOS
  const html = data.videos.map(v => `
    <blockquote class="instagram-media"
      data-instgrm-permalink="${v[1]}"
      data-instgrm-version="14"
      style="width:100%;">
    </blockquote>
  `).join("");
  document.getElementById("videoGrid").innerHTML = html;
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  } else {
    setTimeout(() => { if (window.instgrm) window.instgrm.Embeds.process(); }, 800);
  }

  // HERO CAROUSEL
  const heroHTML = data.heros.map((h, i) => `
    <div class="carousel-slide ${i===0?'active':''}">
      <div class="carousel-image"
        style="background-image: linear-gradient(to right, rgba(15,30,20,0.3), rgba(15,30,20,0.7)), url('${h[3]}')">
      </div>
      <div class="carousel-body">
        <div class="carousel-tag">${h[0]}</div>
        <div class="carousel-title">${h[1]}</div>
        <div class="carousel-desc">${h[2]}</div>
        <a href="${h[4]}" class="carousel-more">${h[5]} →</a>
      </div>
    </div>
  `).join("");

  document.getElementById("heroCarousel").innerHTML = heroHTML + `
    <div class="carousel-dots">
      ${data.heros.map((_,i) => `<div class="carousel-dot ${i===0?'active':''}" onclick="goSlide(${i})"></div>`).join("")}
    </div>
  `;
}

window.addEventListener("DOMContentLoaded", loadCMS);

function showConcertDetail(index) {
  const c = window.concertData[index];
  const d = new Date(c[1]);
  const month = d.getMonth()+1;
  const day = d.getDate();
  const time = new Date(c[3]).toLocaleTimeString("ja-JP", { hour:"2-digit", minute:"2-digit" });

  document.getElementById("detailTitle").innerText = c[0];
  document.getElementById("detailInfo").innerHTML = `
    📅 ${month}月${day}日<br>
    📍 ${c[2]}<br>
    🕐 開演 ${time}
  `;
  document.getElementById("concertDetail").style.display = "block";
  document.getElementById("concertDetail").scrollIntoView({ behavior: "smooth" });
}


