loadTeam();

// =========================
// ADD DIRECT SCORE
// =========================

async function addDirectScore(points) {

  const group =
  localStorage.getItem("group");

  await fetch("/add-score", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      group,
      points: Number(points)
    })
  });
}


// =========================
// MUSICAL STATUS SUBMIT
// =========================

document.getElementById("submitMusical")
.onclick = async () => {

  const score =
  parseInt(
    document.getElementById("musicalScore").value
  );

  const password =
  document.getElementById("musicalPassword").value;

  if (password !== "SIT2009") {

    alert("Wrong Password");
    return;
  }

  if (isNaN(score)) {

    alert("Enter valid score");
    return;
  }

  await addDirectScore(score);

  await loadTeam();

  alert("Score Added");

  document.getElementById("submitMusical")
  .disabled = true;
};