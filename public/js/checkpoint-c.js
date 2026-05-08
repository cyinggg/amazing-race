let start;
let timer;
let finished = false;

document.getElementById("startBtn").onclick = () => {

  start = new Date();
  finished = false;

  document.getElementById("start").innerText = start.toLocaleTimeString();
  document.getElementById("end").innerText = "-";
  document.getElementById("duration").innerText = "00:00";

  document.getElementById("startBtn").disabled = true;
  document.getElementById("finishBtn").disabled = false;

  clearInterval(timer);

  timer = setInterval(() => {

    const sec = Math.floor((new Date() - start) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;

    document.getElementById("duration").innerText =
      `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  }, 1000);
};

document.getElementById("finishBtn").onclick = async () => {

  if (finished) return;
  finished = true;

  clearInterval(timer);

  const end = new Date();
  document.getElementById("end").innerText = end.toLocaleTimeString();

  const sec = Math.floor((end - start) / 1000);

  let score = 10;
  if (sec <= 60) score = 30;
  else if (sec <= 120) score = 20;

  await updateScore(score);

  if (window.loadDashboardTeam) {
    loadDashboardTeam();
  }

  document.getElementById("finishBtn").disabled = true;
};

document.getElementById("restartBtn").onclick = async () => {

  clearInterval(timer);
  finished = false;

  document.getElementById("start").innerText = "-";
  document.getElementById("end").innerText = "-";
  document.getElementById("duration").innerText = "00:00";

  currentActivityScore = 0;

  document.getElementById("startBtn").disabled = false;
  document.getElementById("finishBtn").disabled = true;

  if (window.loadDashboardTeam) {
    loadDashboardTeam();
  }
};

const socket = io();

socket.on("scoreUpdate", () => {
  loadTeam(); // or whatever function shows team score
});