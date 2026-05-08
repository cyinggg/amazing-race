const numbers = [];

for (let i = 0; i < 20; i++) {
  numbers.push(
    Math.floor(Math.random() * 90 + 10)
  );
}

document.getElementById("startMemoryBtn").onclick = async () => {

  const btn = document.getElementById("startMemoryBtn");
  btn.disabled = true;

  // reset UI only for memory game
  document.getElementById("memoryDisplay").innerText = "";
  document.getElementById("memoryInputs").innerHTML = "";
  document.getElementById("submitMemory").classList.add("hidden");

  await startMemoryGame();
};

document.getElementById("memoryDisplay")
.innerText = numbers.join(" ");

setTimeout(() => {

  document.getElementById("memoryDisplay")
  .innerText = "";

  const div =
  document.getElementById("memoryInputs");

  for (let i = 0; i < 20; i++) {

    const input =
    document.createElement("input");

    input.style.width = "50px";

    div.appendChild(input);
  }

}, 60000);

document.getElementById("submitMemory")
.onclick = async () => {

  const inputs =
  document.querySelectorAll("#memoryInputs input");

  let score = 0;

  inputs.forEach((input, i) => {

    if (input.value == numbers[i]) {
      score++;
    }
  });

  document.getElementById("memoryScore")
  .innerText = "Score: " + score;

  await updateScore(score);

  loadTeam();
};