let countdownInterval;

const RACE_END = new Date("2026-05-20T13:00:00");

function normalizeTeam(data, group) {

  return {
    teamName:
      typeof data.team === "object"
        ? data.team.group || group
        : data.team || group,

    members:
      Array.isArray(data.members)
        ? data.members
        : data.team?.members || [],

    score:
      typeof data.score === "object"
        ? data.score.total || 0
        : data.score || 0
  };
}

async function loadTeam() {

  const group = localStorage.getItem("group");

  const res = await fetch(`/team/${group}`);
  const data = await res.json();

  const t = normalizeTeam(data, group);

  document.getElementById("teamInfo").innerHTML = `
    <div class="topBar">

      <div class="left">
        <div class="groupName">Team ${t.teamName}</div>
        <div class="members">
          Members: ${t.members.length ? t.members.join(", ") : "-"}
        </div>
      </div>

      <div class="middle">
        <div class="score">Score: ${t.score}</div>
        <div id="raceStatus" class="status">LIVE</div>
        <div class="endTime" id="endTime"></div>
      </div>

      <div class="right">
        <a href="/dashboard.html" class="homeBtn">🏠 Home</a>
        <div id="countdown" class="countdown">--:--:--</div>
      </div>

    </div>
  `;

  // use constant (NO duplication)
  document.getElementById("endTime").innerText =
    "Ends: " + RACE_END.toLocaleTimeString();

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  function updateCountdown() {

    const now = new Date();
    const diff = RACE_END - now;

    const countdownEl = document.getElementById("countdown");
    const statusEl = document.getElementById("raceStatus");

    if (!countdownEl || !statusEl) return;

    if (diff <= 0) {
      countdownEl.innerText = "ENDED";
      statusEl.innerText = "ENDED";
      statusEl.style.background = "#dc3545";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.innerText =
      `${hours}h ${mins}m ${secs}s left`;
  }

  countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

loadTeam();