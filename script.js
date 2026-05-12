// const tabs = document.querySelectorAll('.tab');
// const contents = document.querySelectorAll('.content');


// // MAIN TABS

// tabs.forEach(tab => {

//   tab.addEventListener('click', () => {

//     tabs.forEach(t => t.classList.remove('active'));
//     contents.forEach(c => c.classList.remove('active'));

//     tab.classList.add('active');

//     const target = tab.dataset.tab;

//     document
//       .getElementById(target)
//       .classList.add('active');

//   });

// });


// // STATS SUB TABS

// const statsButtons = document.querySelectorAll('.stats-btn');

// statsButtons.forEach(btn => {

//   btn.addEventListener('click', () => {

//     statsButtons.forEach(b => b.classList.remove('active'));

//     btn.classList.add('active');

//     // nanti bisa dihubungkan ke API statistik

//   });

// });
// ============================
// FIREBASE IMPORT
// ============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


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
// TABS
// ============================

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');

    document
      .getElementById(tab.dataset.tab)
      .classList.add('active');

  });

});


// ============================
// LOAD MATCHES
// ============================

async function loadMatches() {

  const container =
    document.getElementById('matchesContainer');

  const querySnapshot =
    await getDocs(collection(db, "matches"));

  container.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const match = doc.data();

    const winnerHome =
      match.homeScore > match.awayScore;

    const card = `
      <div class="match-card">

        <div class="week">
          ${match.week}
        </div>

        <div class="teams">

          <div class="team-row ${winnerHome ? 'winner' : ''}">
            <span>${match.homeTeam}</span>
            <strong>${match.homeScore}</strong>
          </div>

          <div class="team-row ${!winnerHome ? 'winner' : ''}">
            <span>${match.awayTeam}</span>
            <strong>${match.awayScore}</strong>
          </div>

        </div>

        <div class="match-info">
          <span>${match.status}</span>
          <small>${match.date}</small>
        </div>

      </div>
    `;

    container.innerHTML += card;

  });

}


// ============================
// LOAD STANDINGS
// ============================

async function loadStandings() {

  const body =
    document.getElementById('standingsBody');

  const querySnapshot =
    await getDocs(collection(db, "standings"));

  body.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const team = doc.data();

    const formHTML =
      team.form.map(result => {

        let cls = "draw";

        if (result === "W") cls = "win";
        if (result === "L") cls = "lose";

        return `
          <span class="${cls}">
            ${result}
          </span>
        `;

      }).join("");

    const row = `
      <tr>

        <td>${team.position}</td>
        <td>${team.team}</td>
        <td>${team.pts}</td>
        <td>${team.mp}</td>
        <td>${team.w}</td>
        <td>${team.d}</td>
        <td>${team.l}</td>
        <td>${team.gf}</td>
        <td>${team.ga}</td>
        <td>${team.gd}</td>

        <td>
          <div class="form">
            ${formHTML}
          </div>
        </td>

      </tr>
    `;

    body.innerHTML += row;

  });

}


// ============================
// LOAD STATS
// ============================

async function loadStatsGoals() {

  const body =
    document.getElementById('statsBody');

  const querySnapshot =
    await getDocs(collection(db, "statsGoals"));

  body.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const stat = doc.data();

    const row = `
      <tr>
        <td>${stat.player}</td>
        <td>${stat.team}</td>
        <td>${stat.goals}</td>
      </tr>
    `;

    body.innerHTML += row;

  });

}


// ============================
// LOAD PLAYOFF
// ============================

async function loadPlayoff() {

  const wrapper =
    document.getElementById('playoffWrapper');

  const querySnapshot =
    await getDocs(collection(db, "playoff"));

  wrapper.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const item = doc.data();

    const card = `
      <div class="round">

        <h3>${item.round}</h3>

        <div class="bracket-card ${item.loser ? 'loser' : ''}">
          <span>${item.team}</span>
          <strong>${item.score}</strong>
        </div>

      </div>
    `;

    wrapper.innerHTML += card;

  });

}


// ============================
// INIT LOAD
// ============================

loadMatches();
loadStandings();
loadStatsGoals();
loadPlayoff();
