const socket = io();

/**
 * Listen for score updates from server
 * and refresh dashboard automatically
 */
socket.on("scoreUpdate", () => {
  if (typeof loadDashboardTeam === "function") {
    loadDashboardTeam();
  }
});

/**
 * Listen for countdown updates (if you use timer control)
 */
socket.on("countdown", (time) => {
  const el = document.getElementById("countdown");
  if (el) {
    el.innerText = time;
  }
});

/**
 * Listen for announcements (popup system)
 */
socket.on("announcement", (msg) => {
  alert(msg); // simple popup
});