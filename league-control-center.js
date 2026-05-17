
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
  doc
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
// COLLECTION CONFIG
// ============================

const collectionsConfig = {

  clubs: [
    "name",
    "shortName",
    "primaryColor",
    "logo"
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
    "week"
  ],

  playoff: [
    "homeTeam",
    "awayTeam",
    "homeScore",
    "awayScore",
    "round",
    "status"
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

  const snapshot =
    await getDocs(
      collection(db, collectionName)
    );

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
        <td>${data[field] || ''}</td>
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
// INIT
// ============================

loadTable("clubs");
