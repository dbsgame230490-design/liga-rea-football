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

function openModal(data = null, docId = null) {

  modal.classList.remove("hidden");

  crudForm.innerHTML = "";

  const fields =
    collectionsConfig[currentCollection];

  fields.forEach(field => {

    crudForm.innerHTML += `

      <input
        type="text"
        name="${field}"
        placeholder="${field}"
        value="${data?.[field] || ''}"
      />

    `;

  });

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

      data[key] = value;

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
// INIT
// ============================

loadTable("clubs");


// ============================
// GLOBAL WINDOW
// ============================

window.editData = editData;
window.deleteData = deleteData;
