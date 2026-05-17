// ============================
// FIREBASE IMPORT
// ============================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc
}
from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


// ============================
// FIREBASE CONFIG
// ============================

const firebaseConfig = {
  apiKey: "AIzaSyBNtsLRrpwRsaZkhC5rIl1R8DdwW6TKXUk",
  authDomain: "liga-football.firebaseapp.com",
  projectId: "liga-football",
  storageBucket: "liga-football.firebasestorage.app",
  messagingSenderId: "174725178144",
  appId: "1:174725178144:web:1b6ea7574b344fcd386d45"
};


// ============================
// INIT
// ============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================
// LOAD CLUBS
// ============================

async function loadClubOptions() {

  const snapshot =
    await getDocs(collection(db, "clubs"));

  const selects = [

    document.getElementById("homeTeam"),
    document.getElementById("awayTeam"),
    document.getElementById("statsTeam")

  ];

  selects.forEach(select => {

    select.innerHTML = "";

  });

  snapshot.forEach(doc => {

    const club = doc.data();

    selects.forEach(select => {

      select.innerHTML += `
        <option value="${club.name}">
          ${club.name}
        </option>
      `;

    });

  });

}


// ============================
// ADD CLUB
// ============================

document
  .getElementById("clubForm")

  .addEventListener("submit", async (e) => {

    e.preventDefault();

    await addDoc(collection(db, "clubs"), {

      name:
        document.getElementById("clubName").value,

      shortName:
        document.getElementById("clubShortName").value,

      primaryColor:
        document.getElementById("clubColor").value,

      logo:
        document.getElementById("clubLogo").value

    });

    alert("Club added!");

  });


// ============================
// ADD MATCH
// ============================

document
  .getElementById("matchForm")

  .addEventListener("submit", async (e) => {

    e.preventDefault();

    await addDoc(collection(db, "matches"), {

      homeTeam:
        document.getElementById("homeTeam").value,

      awayTeam:
        document.getElementById("awayTeam").value,

      homeScore:
        Number(
          document.getElementById("homeScore").value
        ),

      awayScore:
        Number(
          document.getElementById("awayScore").value
        ),

      matchesDate:
        new Date(
          document.getElementById("matchesDate").value
        ),

      stadium:
        document.getElementById("stadium").value,

      week:
        document.getElementById("week").value,

      status:
        document.getElementById("matchStatus").value

    });

    alert("Match added!");

  });


// ============================
// ADD STATS
// ============================

document
  .getElementById("statsForm")

  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const type =
      document.getElementById("statsType").value;

    const value =
      Number(
        document.getElementById("statsValue").value
      );

    let payload = {

      player:
        document.getElementById("playerName").value,

      team:
        document.getElementById("statsTeam").value

    };

    if(type === "statsGoals")
      payload.goals = value;

    if(type === "statsAssists")
      payload.assists = value;

    if(type === "statsYellowCards")
      payload.yellowCards = value;

    if(type === "statsRedCards")
      payload.redCards = value;

    await addDoc(collection(db, type), payload);

    alert("Stats added!");

  });


// ============================
// INIT
// ============================

loadClubOptions();
