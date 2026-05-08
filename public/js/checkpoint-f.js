loadTeam();

// =========================
// RANDOM IMAGE
// =========================

const images = [

  "/images/pose/images.jpeg"

];

const randomImage = images[
  Math.floor(Math.random() * images.length)
];

document.getElementById("poseImage")
.src = randomImage;

// // =========================
// // RANDOM POSE LINKS
// // =========================

// const poseLinks = [

//   "https://example.com/pose1",

//   "https://example.com/pose2",

//   "https://example.com/pose3",

//   "https://example.com/pose4"

// ];

// // pick random link
// const randomLink =
// poseLinks[
//   Math.floor(Math.random() * poseLinks.length)
// ];

// // set link
// document.getElementById("poseLink")
// .href = randomLink;

// // NEW IMAGE ONLY AFTER CLICK
// const poseLinks = [
//   "https://example.com/pose1",
//   "https://example.com/pose2",
//   "https://example.com/pose3",
//   "https://example.com/pose4"
// ];

// function loadRandomPose() {

//   const randomLink =
//     poseLinks[
//       Math.floor(Math.random() * poseLinks.length)
//     ];

//   document.getElementById("poseLink")
//     .href = randomLink;
// }

// loadRandomPose();

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
// SUBMIT SCORE
// =========================

document.getElementById("submitPose")
.onclick = async () => {

  const score =
  parseInt(
    document.getElementById("poseScore").value
  );

  const password =
  document.getElementById("posePassword").value;

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

  document.getElementById("submitPose")
  .disabled = true;
};