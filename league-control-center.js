// ============================
// FIREBASE
// ============================

import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  orderBy,
  setDoc
}
from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";


// ============================
// CONFIG
// ============================

const firebaseConfig = {
  apiKey: "AIzaSyBNtsLRrpwRsaZkhC5rIl1R8DdwW6TKXUk",
  authDomain: "liga-football.firebaseapp.com",
  projectId: "liga-football",
  storageBucket: "liga-football.firebasestorage.app",
  messagingSenderId: "174725178144",
  appId: "1:174725178144:web:1b6ea7574b344fcd386d45"};


// ============================
// INIT
// ============================

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);


// ============================
// GLOBAL
// ============================

let currentCollection = "clubs";

const tableHead =
  document.getElementById("tableHead");

const tableBody =
  document.getElementById("tableBody");

const pageTitle =
  document.getElementById("pageTitle");

const modal =
  document.getElementById("modal");

const crudForm =
  document.getElementById("crudForm");

// ============================
// FIELD RELATIONS
// ============================

const relationFields = {

  groupName: {
    collection: "groups",
    value: "groupName"
  },

  stadium: {
    collection: "stadiums",
    value: "stadiumName"
  },

  stadiumName: {
    collection: "stadiums",
    value: "stadiumName"
  },

  homeTeam: {
    collection: "clubs",
    value: "name"
  },

  awayTeam: {
    collection: "clubs",
    value: "name"
  },

  team: {
    collection: "clubs",
    value: "name"
  }

};

// ============================
// CREATE FIELD
// ============================

async function createField(field, value = "") {

  // ============================
  // RELATION DROPDOWN
  // ============================

  if (relationFields[field]) {

    const relation =
      relationFields[field];

    const snapshot =
      await getDocs(
        collection(db, relation.collection)
      );

    let options = "";

    snapshot.forEach(doc => {

      const item = doc.data();

      const selected =
        item[relation.value] === value
          ? "selected"
          : "";

      options += `
        <option
          value="${item[relation.value]}"
          ${selected}
        >
          ${item[relation.value]}
        </option>
      `;

    });

    return `
      <select name="${field}">
        <option value="">
          Select ${field}
        </option>

        ${options}

      </select>
    `;
  }


  // ============================
  // NUMBER
  // ============================

  const numberFields = [
    "homeScore",
    "awayScore",
    "pts",
    "mp",
    "w",
    "d",
    "l",
    "gf",
    "ga",
    "gd",
    "goals",
    "assists",
    "yellowCards",
    "redCards",
    "position"
  ];

  if (numberFields.includes(field)) {

    return `
      <input
        type="number"
        name="${field}"
        value="${value}"
        placeholder="${field}"
      />
    `;
  }


  // ============================
  // DATETIME
  // ============================

  if (field === "matchesDate") {

    return `
      <input
        type="datetime-local"
        name="${field}"
        value="${value}"
      />
    `;
  }


  // ============================
  // DEFAULT TEXT
  // ============================

  return `
    <input
      type="text"
      name="${field}"
      value="${value}"
      placeholder="${field}"
    />
  `;

}

// ============================
// COLLECTION CONFIG
// ============================

const collectionsConfig = {

  clubs: [
    "name",
    "shortName",
    "primaryColor",
    "groupName",
    "logo",
    "coachName",
    "coachImg"
  ],

  groups: [
    "group",
    "groupName"
  ],

  matches: [
    "homeTeam",
    "awayTeam",
    "homeScore",
    "awayScore",
    "stadium",
    "status",
    "matchesDate",
    "week"
  ],

  playOff: [
    "homeTeam",
    "awayTeam",
    "homeScore",
    "awayScore",
    "round",
    "status"
  ],

  statsAssists: [
    "player",
    "team",
    "assists"
  ],

  statsGoals: [
    "player",
    "team",
    "goals"
  ],

  statsRedCards: [
    "player",
    "team",
    "redCards"
  ],

  statsYellowCards: [
    "player",
    "team",
    "yellowCards"
  ],

  stadiums: [
    "stadiumName"
  ]

};

// ============================
// FORMAT TABLE VALUE
// ============================

function formatTableValue(value) {

  // FIREBASE TIMESTAMP
  if (
    value &&
    typeof value === "object" &&
    typeof value.toDate === "function"
  ) {

    return value
      .toDate()
      .toLocaleString("en-US", {

        year: "numeric",
        month: "short",
        day: "numeric",

        hour: "numeric",
        minute: "2-digit"

      });

  }

  // ARRAY
  if (Array.isArray(value)) {

    return value.join(", ");

  }

  // DEFAULT
  return value ?? "";

}


// ============================
// COLLECTION ORDER
// ============================

const collectionOrders = {

  clubs: [
    orderBy("groupName"),
    orderBy("name")
  ],

  groups: [
    orderBy("group")
  ],

  matches: [
    orderBy("status", "desc"),
    orderBy("matchesDate")
  ],

  playOff: [
    orderBy("round")
  ]

};


// ============================
// LOAD TABLE
// ============================

async function loadTable(collectionName){

  currentCollection =
    collectionName;

  pageTitle.textContent =
    collectionName;

  let collectionQuery;
  if (collectionOrders[collectionName]) {
    collectionQuery = query(
      collection(db, collectionName),
      ...collectionOrders[collectionName]
    ); }
  else {
    collectionQuery = collection(db, collectionName);
  }
  
  const snapshot = await getDocs(collectionQuery);

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  const fields =
    collectionsConfig[collectionName];

  let headHTML = "<tr>";

  fields.forEach(field => {

    headHTML += `
      <th>${field}</th>
    `;

  });

  headHTML += `
    <th>Actions</th>
  </tr>
  `;

  tableHead.innerHTML =
    headHTML;


  snapshot.forEach(item => {

    const data =
      item.data();

    let row = "<tr>";

    fields.forEach(field => {

      row += `
        <td>${formatTableValue(data[field])}</td>
      `;

    });

    row += `
      <td>

        <button
          class="action-btn edit-btn"
          onclick="editData('${item.id}')">

          Edit

        </button>

        <button
          class="action-btn delete-btn"
          onclick="deleteData('${item.id}')">

          Delete

        </button>

      </td>
    `;

    row += "</tr>";

    tableBody.innerHTML += row;

  });

}


// ============================
// MENU
// ============================

document
  .querySelectorAll(".menu-btn")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      document
        .querySelectorAll(".menu-btn")
        .forEach(b =>
          b.classList.remove("active")
        );

      btn.classList.add("active");

      loadTable(
        btn.dataset.page
      );

    });

  });

// ============================
// ADD BUTTON
// ============================

document
  .getElementById("addButton")
  .addEventListener("click", () => {

    openModal();

  });

// ============================
// OPEN MODAL
// ============================

async function openModal(data = null, docId = null) {

  modal.classList.remove("hidden");

  crudForm.innerHTML = "";

  const fields =
    collectionsConfig[currentCollection];

  for (const field of fields) {

  let value = data?.[field] || "";
    
    // FORMAT TIMESTAMP FOR DATETIME-LOCAL
    if (
      field === "matchesDate" &&
      value &&
      typeof value.toDate === "function"
    ) {
    
      const date =
        value.toDate();
    
      const pad = (n) =>
        String(n).padStart(2, "0");
    
      value =
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    
    }
    
    const fieldHTML =
      await createField(
        field,
        value
      );

  crudForm.innerHTML += fieldHTML;

}

  // simpan id edit
  crudForm.dataset.docId =
    docId || "";

}

// ============================
// CLOSE MODAL
// ============================

document
  .getElementById("cancelBtn")
  .addEventListener("click", () => {

    modal.classList.add("hidden");

  });

// ============================
// SAVE DATA
// ============================

document
  .getElementById("saveBtn")
  .addEventListener("click", async () => {

    const formData =
      new FormData(crudForm);

    let data = {};

    formData.forEach((value, key) => {

      // DATETIME → FIREBASE TIMESTAMP
      if (key === "matchesDate")
        { data[key] = Timestamp.fromDate( new Date(value) ); }
      else { data[key] = value; }

    });

    const docId =
      crudForm.dataset.docId;

    // EDIT
    if (docId) {

      await updateDoc(
        doc(db, currentCollection, docId),
        data
      );

    }

    // ADD
    else {

      await addDoc(
        collection(db, currentCollection),
        data
      );

    }

    modal.classList.add("hidden");

    // AUTO GENERATE STANDINGS
    if (currentCollection === "matches") {
    
      await generateStandings();
    
    }
    
    loadTable(currentCollection);

  });

// ============================
// EDIT DATA
// ============================

async function editData(id) {

  const snapshot =
    await getDocs(
      collection(db, currentCollection)
    );

  snapshot.forEach(item => {

    if (item.id === id) {

      openModal(
        item.data(),
        id
      );

    }

  });

}

// ============================
// DELETE DATA
// ============================

async function deleteData(id) {

  const confirmDelete =
    confirm("Delete this data?");

  if (!confirmDelete) return;

  await deleteDoc(
    doc(db, currentCollection, id)
  );

  loadTable(currentCollection);

}

// ============================
// GENERATE STANDINGS
// ============================

async function generateStandings() {

  // ============================
  // GET CLUBS
  // ============================

  const clubsSnapshot =
    await getDocs(collection(db, "clubs"));

  // ============================
  // GET MATCHES
  // ============================

  const matchesSnapshot =
    await getDocs(collection(db, "matches"));

  // ============================
  // STANDINGS OBJECT
  // ============================

  let standings = {};

  // ============================
  // INIT CLUBS
  // ============================

  clubsSnapshot.forEach(doc => {

    const club = doc.data();

    standings[club.name] = {

      group: club.groupName,
      team: club.name,

      pts: 0,
      mp: 0,

      w: 0,
      d: 0,
      l: 0,

      gf: 0,
      ga: 0,
      gd: 0,

      form: []

    };

  });

  // ============================
  // PROCESS MATCHES
  // ============================

  matchesSnapshot.forEach(doc => {

    const match = doc.data();

    // ONLY FT
    if (
      match.status !== "FT" &&
      match.status !== "Full Time"
    ) return;

    const home =
      standings[match.homeTeam];

    const away =
      standings[match.awayTeam];

    if (!home || !away) return;

    const homeScore =
      Number(match.homeScore);

    const awayScore =
      Number(match.awayScore);

    // PLAYED
    home.mp++;
    away.mp++;

    // GOALS
    home.gf += homeScore;
    home.ga += awayScore;

    away.gf += awayScore;
    away.ga += homeScore;

    // WIN DRAW LOSE
    if (homeScore > awayScore) {

      home.w++;
      away.l++;

      home.pts += 3;

      home.form.push("W");
      away.form.push("L");

    }

    else if (awayScore > homeScore) {

      away.w++;
      home.l++;

      away.pts += 3;

      away.form.push("W");
      home.form.push("L");

    }

    else {

      home.d++;
      away.d++;

      home.pts += 1;
      away.pts += 1;

      home.form.push("D");
      away.form.push("D");

    }

  });

  // ============================
  // GOAL DIFFERENCE
  // ============================

  Object.values(standings)
    .forEach(team => {

      team.gd =
        team.gf - team.ga;

      // LAST 5 ONLY
      team.form =
        team.form.slice(-5).reverse();

    });

  // ============================
  // GROUPING
  // ============================

  const grouped = {};

  Object.values(standings)
    .forEach(team => {

      if (!grouped[team.group]) {
        grouped[team.group] = [];
      }

      grouped[team.group]
        .push(team);

    });

  // ============================
  // SORT + POSITION
  // ============================

  for (const group in grouped) {

    grouped[group].sort((a, b) => {

      // PTS
      if (b.pts !== a.pts)
        return b.pts - a.pts;

      // GD
      if (b.gd !== a.gd)
        return b.gd - a.gd;

      // GF
      return b.gf - a.gf;

    });

    grouped[group]
      .forEach((team, index) => {

        team.position =
          index + 1;

      });

  }

  // ============================
  // CLEAR + SAVE
  // ============================

  const standingsSnapshot =
    await getDocs(collection(db, "standings"));

  // DELETE OLD
  for (const item of standingsSnapshot.docs) {

    await deleteDoc(
      doc(db, "standings", item.id)
    );

  }

  // SAVE NEW
  for (const group in grouped) {

    for (const team of grouped[group]) {

      await addDoc(
        collection(db, "standings"),
        team
      );

    }

  }

  alert("Standings updated!");

}


// ============================
// INIT
// ============================

loadTable("clubs");


// ============================
// GLOBAL WINDOW
// ============================

window.editData = editData;
window.deleteData = deleteData;
