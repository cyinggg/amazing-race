async function loadTeam() {

  const group = localStorage.getItem("group");

  const res = await fetch(`/team/${group}`);

  const data = await res.json();

  document.getElementById("teamInfo").innerHTML = `
    <h2>Group ${group}</h2>

    <p>
      Members:
      ${data.team.members.join(", ")}
    </p>

    <h3>
      Total Score:
      ${data.score.total || 0}
    </h3>
  `;
}

loadTeam();