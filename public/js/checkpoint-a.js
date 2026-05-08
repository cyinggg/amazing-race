const answer = "LEVEL 1 TIERED STEPS NEAR START POINT";

const clues = [
  "11","4","21","4","11",
  "SPACE",
  "B",
  "SPACE",
  "19","8","4","17","4","3",
  "SPACE",
  "18","19","4","15","18",
  "SPACE",
  "13","4","0","17",
  "SPACE",
  "18","19","0","17","19",
  "SPACE",
  "15","14","8","13","19"
];

const container = document.getElementById("codeBoxes");

let inputIndex = 0;

clues.forEach(clue => {

  // WORD SPACING
  if (clue === "SPACE") {

    const gap = document.createElement("div");
    gap.style.width = "100%";
    gap.style.height = "15px";

    container.appendChild(gap);

    return;
  }

  // INPUT + CLUE CONTAINER
  const wrapper = document.createElement("div");

  wrapper.style.display = "inline-flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.margin = "4px";

  // INPUT BOX
  const input = document.createElement("input");

  input.maxLength = 2;

  input.dataset.index = inputIndex;

  input.style.width = "35px";
  input.style.height = "35px";
  input.style.textAlign = "center";
  input.style.fontSize = "18px";

  // CLUE BELOW INPUT
  const clueText = document.createElement("small");

  clueText.innerText = clue;

  wrapper.appendChild(input);
  wrapper.appendChild(clueText);

  container.appendChild(wrapper);

  inputIndex++;
});

document.querySelectorAll("#codeBoxes input")
.forEach(input => {

  input.addEventListener("input", checkAnswer);
});

function normalizeInput(value) {

  value = value.trim();

  // NUMBER INPUT
  if (!isNaN(value) && value !== "") {

    const num = Number(value);

    if (num >= 0 && num <= 25) {
      return String.fromCharCode(65 + num);
    }
  }

  // LETTER INPUT
  return value.toUpperCase();
}

function checkAnswer() {

  const answerChars =
  answer.replaceAll(" ", "").split("");

  document.querySelectorAll("#codeBoxes input")
  .forEach((input, index) => {

    const userInput =
    normalizeInput(input.value);

    const correctAnswer =
    answerChars[index];

    // EMPTY INPUT
    if (userInput === "") {

      input.style.background = "white";
      input.disabled = false;

      return;
    }

    // CORRECT
    if (userInput === correctAnswer) {

      input.style.background = "lightgreen";

      input.disabled = true;
    }

    // WRONG
    else {

      input.style.background = "#ffb3b3";

      input.disabled = false;
    }
  });
}