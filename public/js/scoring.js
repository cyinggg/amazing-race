async function updateScore(points) {

  const group = localStorage.getItem("group");

  await fetch("/add-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ group, points })
  });

  loadTeam(); // refresh UI
}