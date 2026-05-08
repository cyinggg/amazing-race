const categories = {

  sports: [
    "Football",
    "Basketball",
    "Swimming",
    "Badminton",
    "Tennis",
    "Volleyball",
    "Bowling",
    "Cycling"
  ],

  food: [
    "Chicken Rice",
    "Potato Chip",
    "Chilli Crab",
    "Laksa",
    "Kaya Toast",
    "Bak Kut Teh",
    "Hokkien Mee",
    "Char Kway Teow"
  ],

  animals: [
    "Elephant",
    "Monkey",
    "Tiger",
    "Snake",
    "Penguin",
    "Giraffe",
    "Kangaroo",
    "Dolphin"
  ]
};

let phrases = [];

let currentPhrase = "";

let currentScore = 0;

let timeLeft = 180;

let timerInterval;

// START BUTTON
document.getElementById("startBtn")
.onclick = () => {

  const selectedCategory =
  document.getElementById("category").value;

  phrases = [...categories[selectedCategory]];

  document.getElementById("instructionBox")
  .style.display = "none";

  startCountdown();
};

// 3 2 1 COUNTDOWN
function startCountdown() {

  document.getElementById("countdownBox")
  .style.display = "block";

  let count = 3;

  document.getElementById("countdownNumber")
  .innerText = count;

  const interval = setInterval(() => {

    count--;

    document.getElementById("countdownNumber")
    .innerText = count;

    if (count <= 0) {

      clearInterval(interval);

      document.getElementById("countdownBox")
      .style.display = "none";

      startGame();
    }

  }, 1000);
}

// START GAME
function startGame() {

  document.getElementById("gameBox")
  .style.display = "block";

  nextPhrase();

  updateTimerDisplay();

  timerInterval = setInterval(() => {

    timeLeft--;

    updateTimerDisplay();

    if (timeLeft <= 0) {

      clearInterval(timerInterval);

      endGame();
    }

  }, 1000);
}

// TIMER DISPLAY
function updateTimerDisplay() {

  const mins =
  Math.floor(timeLeft / 60);

  const secs =
  timeLeft % 60;

  document.getElementById("timer")
  .innerText =
  `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// NEXT PHRASE
function nextPhrase() {

  if (phrases.length === 0) {

    document.getElementById("phrase")
    .innerText = "No More Phrases";

    return;
  }

  const randomIndex =
  Math.floor(Math.random() * phrases.length);

  currentPhrase =
  phrases[randomIndex];

  document.getElementById("phrase")
  .innerText = currentPhrase;
}

// CORRECT BUTTON
document.getElementById("correctBtn")
.onclick = () => {

  currentScore++;

  document.getElementById("currentScore")
  .innerText = currentScore;

  nextPhrase();
};

// SKIP BUTTON
document.getElementById("skipBtn")
.onclick = () => {

  nextPhrase();
};

// END GAME
async function endGame() {

  document.getElementById("gameBox")
  .style.display = "none";

  document.getElementById("endBox")
  .style.display = "block";

  document.getElementById("finalScore")
  .innerText = currentScore;

  await updateScore(currentScore);

  loadTeam();
}