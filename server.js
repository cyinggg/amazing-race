const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const TECH_PASSWORD = "admin123";

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

let teams = [];
let teamScores = {};

// LOAD SAVED SCORES
const scoresFile = "scores.json";

if (fs.existsSync(scoresFile)) {
  try {
    const raw = fs.readFileSync(scoresFile, "utf8");
    teamScores = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.log("scores.json corrupted or empty, resetting...");
    teamScores = {};
  }
} else {
  teamScores = {};
}

let countdownEnd = null;

// upload setup
const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// LOGIN
app.post("/login", (req, res) => {
  const { group, name } = req.body;

  let team = teams.find(t => t.group === group);

  if (!team) {
    team = { group, members: [] };
    teams.push(team);
  }

  if (!team.members.includes(name)) {
    team.members.push(name);
  }

  if (!teamScores[group]) {
    teamScores[group] = { total: 0};
  }

  res.send({ success: true });
});

// TEAM DATA
app.get("/team/:group", (req, res) => {
  const group = req.params.group;

  const team = teams.find(t => t.group === group) || {
    group,
    members: []
  };

  if (!teamScores[group]) {
    teamScores[group] = { total: 0};
  }

  res.json({
    team,
    score: teamScores[group]
  });
});

// SCORE
app.post("/score", (req, res) => {

  const { group, points } = req.body;

  if (!teamScores[group]) {

    teamScores[group] = {
      total: 0
    };
  }

  // DIRECT ADD / DEDUCT
  teamScores[group].total += points;

  // prevent negative score
  if (teamScores[group].total < 0) {
    teamScores[group].total = 0;
  }

  fs.writeFileSync(
    "scores.json",
    JSON.stringify(teamScores, null, 2)
  );

  io.emit("scoreUpdate", teamScores);

  res.json({
    success: true,
    total: teamScores[group].total
  });
});

// MANUAL ADD SCORE
app.post("/add-score", (req, res) => {

  const { group, points } = req.body;

  if (!teamScores[group]) {

    teamScores[group] = {
      total: 0,
      activities: {}
    };
  }

  // FORCE NUMBER
  const numericPoints = Number(points);

  // ADD PROPERLY
  teamScores[group].total =
  Number(teamScores[group].total) +
  Number(numericPoints);

  fs.writeFileSync(
    "scores.json",
    JSON.stringify(teamScores, null, 2)
  );

  io.emit("scoreUpdate", teamScores);

  res.json({
    success: true
  });
});

// UPLOAD

/* ---------------- SOCKET ---------------- */
io.on("connection", (socket) => {
  socket.emit("scoreUpdate", teamScores);

  socket.on("setCountdown", (time) => {
    io.emit("countdown", time);
  });

  socket.on("announcement", (msg) => {
    io.emit("announcement", msg);
  });
});

server.listen(3000, () => console.log("Running on 3000"));
