const riddles = [
{
  title: "Easy Riddle",
  question: "I connect Campus Court and Campus Heart"
},
{
  title: "Hard Riddle",
  question: "Unscramble the word ERDIGB"
}
];

const hintText = "Hint: I have round holes in me.";

const div = document.getElementById("riddles");

// SHOW RIDDLES
riddles.forEach(r => {

  const box = document.createElement("div");

  box.innerHTML = `
    <h3>${r.title}</h3>
    <p>${r.question}</p>
  `;

  div.appendChild(box);
});

// SINGLE HINT BUTTON
const hintButton = document.createElement("button");

hintButton.innerText = "Show Hint (-5 points)";

div.appendChild(hintButton);

// HINT DISPLAY
const hint = document.createElement("p");

hint.style.display = "none";

hint.innerText = hintText;

div.appendChild(hint);

// BUTTON ACTION
hintButton.onclick = async () => {

  hint.style.display = "block";

  hintButton.disabled = true;

  await updateScore(-5);

  loadTeam();
};