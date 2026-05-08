async function updateScore(points) {

  const group = localStorage.getItem("group");

  await fetch("/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      group,
      points
    })
  });

  if (window.loadTeam) {
    loadTeam();
  }

  if (window.loadDashboardTeam) {
    loadDashboardTeam();
  }
}