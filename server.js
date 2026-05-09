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

// TECH LOGIN
app.post("/tech-login", (req, res) => {
  const { password } = req.body;

  const TECH_PASSWORD = "SIT2009";

  if (password === TECH_PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false });
});

// LOGIN
app.post("/login", (req, res) => {

  const { group, name } = req.body;

  let team =
    teams.find(t => t.group === group);

  if (!team) {

    team = {
      group,
      members: []
    };

    teams.push(team);
  }

  // prevent duplicate members
  if (!team.members.includes(name)) {
    team.members.push(name);
  }

  // create score object if missing
  if (!teamScores[group]) {

    teamScores[group] = {
      total: 0
    };
  }

  // AUTO SORT TEAM NUMBER
  teams.sort(
    (a, b) => Number(a.group) - Number(b.group)
  );

  // LIVE UPDATE ADMIN PANEL
  io.emit("teamsUpdated");

  // LIVE UPDATE RANKING
  io.emit("scoreUpdate", teamScores);

  res.send({
    success: true
  });
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

// RANKING
app.get("/rankings", (req, res) => {

  const ranking = Object.entries(teamScores)
    .map(([group, data]) => ({
      group,
      score: data.total || 0
    }))
    .sort((a, b) => b.score - a.score);

  res.json(ranking);
});

// GET ALL TEAMS
app.get("/teams", (req, res) => {

  const result = teams.map(team => ({

    group: team.group,

    members: team.members || [],

    score: teamScores[team.group] || {
      total: 0
    }

  }));

  result.sort(
    (a, b) => Number(a.group) - Number(b.group)
  );

  res.json(result);
});


// DELETE TEAM
app.delete("/team/:group", (req, res) => {

  const group = req.params.group;

  teams = teams.filter(
    t => t.group !== group
  );

  delete teamScores[group];

  fs.writeFileSync(
    "scores.json",
    JSON.stringify(teamScores, null, 2)
  );

  io.emit("teamsUpdated");
  io.emit("scoreUpdate", teamScores);

  res.json({
    success: true
  });
});


// MOVE MEMBER
app.post("/reassign-member", (req, res) => {

  const {
    member,
    oldGroup,
    newGroup
  } = req.body;

  const oldTeam =
    teams.find(t => t.group === oldGroup);

  if (oldTeam) {

    oldTeam.members =
      oldTeam.members.filter(
        m => m !== member
      );
  }

  let newTeam =
    teams.find(t => t.group === newGroup);

  if (!newTeam) {

    newTeam = {
      group: newGroup,
      members: []
    };

    teams.push(newTeam);
  }

  if (!newTeam.members.includes(member)) {
    newTeam.members.push(member);
  }

  if (!teamScores[newGroup]) {

    teamScores[newGroup] = {
      total: 0
    };
  }

  teams.sort(
    (a, b) => Number(a.group) - Number(b.group)
  );

  io.emit("teamsUpdated");

  res.json({
    success: true
  });
});


// EXPORT CSV
app.get("/export-teams", (req, res) => {

  let csv =
    "Team,Score,Members\n";

  teams
    .sort((a, b) =>
      Number(a.group) - Number(b.group)
    )
    .forEach(team => {

      const score =
        teamScores[team.group]?.total || 0;

      const members =
        (team.members || []).join(" | ");

      csv +=
        `${team.group},${score},"${members}"\n`;
    });

  res.header(
    "Content-Type",
    "text/csv"
  );

  res.attachment(
    "teams.csv"
  );

  res.send(csv);
});

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
