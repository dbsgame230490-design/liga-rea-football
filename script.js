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
// CLUBS MASTER
// ============================

let clubsData = {};

async function loadClubs() {

  const querySnapshot = await getDocs(collection(db, "clubs"));

  querySnapshot.forEach((doc) => {

    const club = doc.data();

    clubsData[club.name] = {
      logo: club.logo,
      shortName: club.shortName,
      primaryColor: club.primaryColor
    };

  });

}

// ============================
// LOAD MATCHES
// ============================

async function loadMatches() {

  const container = document.getElementById('matchesContainer');

  const querySnapshot = await getDocs(collection(db, "matches"));

  container.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const match = doc.data();

    const winnerHome = match.homeScore > match.awayScore ? 'winner' : '';
    const winnerAway = match.awayScore > match.homeScore ? 'winner' : '';
    const homeLogo = clubsData[match.homeTeam]?.logo || '';
    const awayLogo = clubsData[match.awayTeam]?.logo || '';
    
    const formattedDate =
      match.matchesDate
        .toDate()
        .toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });

    const card = `
      <div class="match-card">

        <div class="week">
          ${match.week}
        </div>

        <div class="teams">

          <div class="team-row ${winnerHome}">
            <span class="team-info">
              <img src=${homeLogo} class="team-logo" alt=${match.homeTeam}/>
              <span>${match.homeTeam}</span>
              <strong>${match.homeScore}</strong>
            </span>
          </div>

          <div class="team-row ${winnerAway}">
            <span class="team-info">
              <img src=${awayLogo} class="team-logo" alt=${match.awayTeam}/>
              <span>${match.awayTeam}</span>
              <strong>${match.awayScore}</strong>
            </span>
          </div>

        </div>

        <div class="match-info">
          <span>${match.status}</span>
          <small>${formattedDate}</small>
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

  const body = document.getElementById('standingsBody');

  const querySnapshot = await getDocs(collection(db, "standings"));

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
// STATS MENU
// ============================

const statsButtons = document.querySelectorAll('.stats-btn');


// mapping firebase collection
const statsConfig = {

  goals: {
    collection: "statsGoals",
    field: "goals",
    title: "Goals"
  },

  assists: {
    collection: "statsAssists",
    field: "assists",
    title: "Assists"
  },

  yellowcards: {
    collection: "statsYellowCards",
    field: "yellowCards",
    title: "Yellow Cards"
  },

  redcards: {
    collection: "statsRedCards",
    field: "redCards",
    title: "Red Cards"
  }

};


// ============================
// LOAD STATS
// ============================

async function loadStats(type) {

  const body = document.getElementById('statsBody');

  const title = document.getElementById('statsValueTitle');

  const config = statsConfig[type];

  title.textContent = config.title;

  const querySnapshot =
    await getDocs(
      collection(db, config.collection)
    );

  body.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const stat = doc.data();

    const row = `
      <tr>

        <td>${stat.player}</td>

        <td>${stat.team}</td>

        <td>${stat[config.field]}</td>

      </tr>
    `;

    body.innerHTML += row;

  });

}


// ============================
// STATS BUTTON CLICK
// ============================

statsButtons.forEach(btn => {

  btn.addEventListener('click', () => {

    statsButtons.forEach(b =>
      b.classList.remove('active')
    );

    btn.classList.add('active');

    const type = btn.dataset.type;

    loadStats(type);

  });

});


// ============================
// LOAD PLAYOFF
// ============================

async function loadPlayoff() {

  const wrapper = document.getElementById('playoffWrapper');

  const querySnapshot = await getDocs(collection(db, "playOff"));

  wrapper.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const item = doc.data();

    const homeLoser = item.homeScore < item.awayScore ? 'loser' : '';
    const awayLoser = item.awayScore < item.homeScore ? 'loser' : '';

    const card = `
      <div class="round">

        <h3>${item.round}</h3>

        <div class="bracket-card ${homeLoser}">
          <span>${item.homeTeam}</span>
          <strong>${item.homeScore}</strong>
        </div>
        <div class="bracket-card ${awayLoser}">
          <span>${item.awayTeam}</span>
          <strong>${item.awayScore}</strong>
        </div>

      </div>
    `;

    wrapper.innerHTML += card;

  });

}


// ============================
// INIT LOAD
// ============================

async function init() {

  await loadClubs();

  loadMatches();
  loadStandings();
  loadStats("goals");
  loadPlayoff();

}

init();
