import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const formBox = document.querySelector(".form-box");
const todoContainer = document.querySelector(".todo-container");
const toggleForm = document.querySelector(".toggle-form");
const toggleText = document.querySelector(".toggle-text");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn1 = document.getElementById("btn1");
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User login hai
    formBox.classList.add("hidden");
    todoContainer.classList.remove("hidden");
    console.log("User login hai:", user.uid);
  } else {
    // User login nahi hai
    formBox.classList.remove("hidden");
    todoContainer.classList.add("hidden");
    console.log("Koi user login nahi hai");
  }
});
import {  createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

btn1.addEventListener("click", () => {
  if (!email.value || !password.value) {
    alert("Please fill in both fields.");
    return;
  }

  if (password.value.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user);
      alert("Registration successful!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error:", errorCode, errorMessage);
      alert(`Error: ${errorMessage}`);
    });
});
// import { auth, db } from "./firebase.js";
//   import {
//     collection,
//     addDoc,
//     query,
//     where,
//     onSnapshot,
//     doc,
//     deleteDoc,
//   } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
//   const inputEl = document.getElementById("inputEl");
//   const btn = document.getElementById("btn");
//   const todoList = document.getElementById("todo-list");

//   const deleteTodo = async (docId) => {
//     const documentRefrence = doc(db, "todos", docId);
//     await deleteDoc(documentRefrence);
//   };

//   window.deleteTodo = deleteTodo;

//   const getAllData = (userId) => {
//     const q = query(collection(db, "todos"), where("userId", "==", userId));
//     onSnapshot(q, (querySnapshot) => {
//       const todos = [];
//       querySnapshot.forEach((doc) => {
//         const newData = {
//           ...doc.data(),
//           objectId: doc.id,
//         };
//         todos.push(newData);
//       });
//       todoList.innerHTML = "";
//       for (let index = 0; index < todos.length; index++) {
//         let todo = todos[index].todo;
//         let objectId = todos[index].objectId;
//         todoList.innerHTML += `
//          <li class="todo-item">
//                   ${todo}
//                   <div class="todo-actions">
//                       <button class="edit-btn">Edit</button>
//                       <button class="delete-btn" onclick="deleteTodo('${objectId}')">Delete</button>
//                   </div>
//               </li>
//         `;
//       }

//       console.log("todos", todos);
//     });
//   };

//   let userId;
//   const getUserData = async () => {
//     await onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const uid = user.uid;
//         userId = uid;
//         getAllData(userId);
//       } else {
//         console.log("User is signout");
//         // window.location.href = ''
//         // User is signed out
//       }
//     });
//   };
//   getUserData();

//   btn.addEventListener("click", async () => {
//     const value = inputEl.value;
//     const collectionRef = collection(db, "todos");
//     const data = {
//       todo: value,
//       id: Date.now(),
//       userId: userId,
//     };
//     try {
//       await addDoc(collectionRef, data);
//       inputEl.value = "";
//     } catch (error) {
//       console.log(error, "error");
//     }
//   })
