import { auth, db } from "./firebase.js";
import {doc,setDoc,getDoc,updateDoc,} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import {signInAnonymously,onAuthStateChanged,updateProfile,} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

//Авторизація
const adminButton = document.getElementById("admin-button");
const authButton = document.getElementById("auth-button");
const signUpModal = document.getElementById("login-modal");
const signUpModalObject = new bootstrap.Modal(signUpModal);
const signUpModalInput = signUpModal.querySelector("input");
const signUpModalSubmit = signUpModal.querySelector(".btn-primary");

// Створення анонімного користувача чи автоматична авторизація
export function autoSignIn() {
  onAuthStateChanged(auth, (user) => {
    if (user && user.displayName != null) {
      // Перевірка наявності ім'я користувача
      authButton.innerText = "Sign out";
      document.getElementById("username-display").innerText =
        "Hi " + user.displayName;
      // Панель адміністратора
      getDoc(doc(db, "users", user.uid)).then((user) => {
        if ("admin" in user.data()) {
          adminButton.style.display = "inline-block";
        }
      });
    } else {
      // Автоматичне створення анонімного аккаунту
      signInAnonymously(auth);
    }
  });
}


authButton.addEventListener("click", () => {
  if (authButton.innerText == "Sign out") {
    authButton.innerText = "Sign in";
    document.getElementById("username-display").innerText = "";
  } else {
    signUpModalInput.value = "";
    signUpModalObject.show();
  }
});

signUpModal.addEventListener("shown.bs.modal", () => {
  signUpModalInput.focus();
});

signUpModalSubmit.addEventListener("click", () => {
  signUp();
});
signUpModalInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    signUp();
  }
});

// Функція входження в ауккаунт
function signUp() {
  let username = signUpModalInput;
  let user = auth.currentUser;
  updateProfile(user, { displayName: username.value });
  setDoc(doc(db, "users", user.uid), { name: username.value, admin: false });
  console.debug("signUp() write to users/${auth.currentUser.uid}");
  authButton.innerText = "Sign out";
  document.getElementById("username-display").innerText =
    "Hi " + username.value;
  username.classList.add("is-valid");
  setTimeout(() => {
    signUpModalObject.hide();
    username.classList.remove("is-valid");
  }, 1000);
}

// Логіка для ставок
const bidModal = document.getElementById("bid-modal");
if (bidModal) {
  const bidModalObject = new bootstrap.Modal(bidModal);
  const bidModalTitle = bidModal.querySelector("strong");
  const bidModalInput = bidModal.querySelector("input");
  const bidModalSubmit = bidModal.querySelector(".btn-primary");

  bidModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const card =
      button.closest(".card") ||
      document.getElementById(bidModal.dataset.activeAuction);
    bidModalTitle.innerText = card.dataset.title;
    bidModal.dataset.activeAuction = card.dataset.id;
  });

  bidModal.addEventListener("shown.bs.modal", () => {
    if (authButton.innerText == "Sign in") {
      bidModalObject.hide();
      signUpModalObject.show();
    } else {
      bidModalInput.focus();
    }
  });

  bidModal.addEventListener("hidden.bs.modal", () => {
    bidModalInput.value = "";
    bidModalInput.classList.remove("is-invalid");
    bidModal.removeAttribute("data-active-auction");
  });

  bidModalSubmit.addEventListener("click", () => {
    placeBid();
  });
  bidModalInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      placeBid();
    }
  });

  // Функція для ставок
  function placeBid() {
    let nowTime = new Date().getTime();
    bidModalSubmit.setAttribute("disabled", ""); 
    let i = Number(bidModal.dataset.activeAuction.match("[0-9]+"));
    let endTime = document.querySelector(`.card[data-id="${i}"]`).dataset
      .endTime;
    let feedback = bidModal.querySelector(".invalid-feedback");
    let amountElement = bidModal.querySelector("input");
    let amount = Number(amountElement.value);
    if (endTime - nowTime < 0) {
      feedback.innerText = "The auction is already over!";
      amountElement.classList.add("is-invalid");
      setTimeout(() => {
        bidModalObject.hide();
        amountElement.classList.remove("is-invalid");
        bidModalSubmit.removeAttribute("disabled", "");
      }, 1000);
    } else if (amount == 0) {
      feedback.innerText = "Please specify an amount!";
      amountElement.classList.add("is-invalid");
      bidModalSubmit.removeAttribute("disabled", "");
    } else if (!/^-?\d*\.?\d{0,2}$/.test(amount)) {
      feedback.innerText = "Please specify a valid amount!";
      amountElement.classList.add("is-invalid");
      bidModalSubmit.removeAttribute("disabled", "");
    } else {
      let docRef = doc(db, "auction", "items");
      getDoc(docRef).then(function (doc) {
        console.debug("placeBid() read from auction/items");
        let data = doc.data();
        let itemId = `item${i.toString().padStart(5, "0")}`;
        let bids = Object.keys(data).filter((key) => key.includes(itemId));
        let bidId = `bid${bids.length.toString().padStart(5, "0")}`;
        let currentBid = data[bids[bids.length - 1]].amount;
        if (amount >= 1 + currentBid) {
          updateDoc(docRef, {
            [`${itemId}_${bidId}`]: {
              amount: amount,
              uid: auth.currentUser.uid,
            },
          });
          console.debug("placeBid() write to auction/items");
          amountElement.classList.add("is-valid");
          amountElement.classList.remove("is-invalid");
          setTimeout(() => {
            bidModalObject.hide();
            amountElement.classList.remove("is-valid");
            bidModalSubmit.removeAttribute("disabled", "");
          }, 1000);
        } else {
          amountElement.classList.add("is-invalid");
          feedback.innerText =
            "You must bid at least ₴" + (currentBid + 1).toFixed(2) + "!";
          bidModalSubmit.removeAttribute("disabled", "");
        }
      });
    }
  }
}

const infoModal = document.getElementById("info-modal");
if (infoModal) {
  infoModal.addEventListener("show.bs.modal", (event) => {
    const infoModalTitle = infoModal.querySelector(".modal-title");
    const infoModalDetail = infoModal.querySelector(".modal-body > p");
    const infoModalSecondaryImage =
      infoModal.querySelector(".modal-body > img");
    const button = event.relatedTarget;
    const card = button.closest(".card");
    infoModalTitle.innerText = card.dataset.title;
    infoModalDetail.innerText = card.dataset.detail;
    infoModalSecondaryImage.src = card.dataset.secondaryImage;
    bidModal.dataset.activeAuction = card.dataset.id;
  });

  bidModal.addEventListener("hide.bs.modal", () => {
    bidModal.removeAttribute("data-active-auction");
  });
}
