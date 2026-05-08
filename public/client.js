localStorage.setItem("group", group);

const socket = io();

async function login() {
  const group = document.getElementById("group").value;
  const name = document.getElementById("name").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ group, name })
  });

  if (res.ok) {
    localStorage.setItem("group", group);
    window.location.href = "dashboard.html";
  } else {
    alert("Group full");
  }
}

socket.on("scoreUpdate", (scores) => {
  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  Object.entries(scores)
    .sort((a,b)=>b[1]-a[1])
    .forEach(([group, score]) => {
      const li = document.createElement("li");
      li.innerText = `Group ${group}: ${score}`;
      ranking.appendChild(li);
    });
});

socket.on("countdown", (endTime) => {
  setInterval(() => {
    const diff = endTime - Date.now();
    document.getElementById("timer").innerText =
      Math.max(0, Math.floor(diff / 1000)) + "s";
  }, 1000);
});

socket.on("announcement", (msg) => {
  const box = document.getElementById("announcement");

  box.innerText = msg;
  box.style.display = "block";

  setTimeout(() => {
    box.style.display = "none";
  }, 5000);
});