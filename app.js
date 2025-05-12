import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDWVJImw66W2Disuws8No4UxJJXw2JAL7k",
  authDomain: "practise-todo-app.firebaseapp.com",
  projectId: "practise-todo-app",
  storageBucket: "practise-todo-app.firebasestorage.app",
  messagingSenderId: "805238388171",
  appId: "1:805238388171:web:cb9015032a6a430147f24e",
  measurementId: "G-DR5NDBYB30"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const formBox = document.querySelector(".form-box");
const todoContainer = document.querySelector(".todo-container");
const formTitle = document.querySelector("#form-title");
const toggleForm = document.querySelector("#toggle-form");
const toggleText = document.querySelector("#toggle-text");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn1 = document.getElementById("btn1");
const signOutBtn = document.getElementById("signout-btn");
const inputEl = document.getElementById("inputEl");
const addBtn = document.getElementById("btn");
const todoList = document.getElementById("todo-list");

let isSignup = true;

// Toggle Signup/Login Form
toggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  isSignup = !isSignup;
  if (isSignup) {
    formTitle.innerText = "Sign Up";
    btn1.innerText = "Sign Up";
    toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-form">Sign In</a>';
  } else {
    formTitle.innerText = "Sign In";
    btn1.innerText = "Sign In";
    toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-form">Sign Up</a>';
  }
});

// Signup/Login Button Click
btn1.addEventListener("click", () => {
  if (!email.value || !password.value) {
    alert("Please fill in both fields.");
    return;
  }

  if (password.value.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  if (isSignup) {
    // Signup Logic
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        alert("Registration successful!");
        formBox.classList.add("hidden");
        todoContainer.classList.remove("hidden");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  } else {
    // Login Logic
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        alert("Login successful!");
        formBox.classList.add("hidden");
        todoContainer.classList.remove("hidden");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  }
});

// Check Authentication State on Page Load
onAuthStateChanged(auth, (user) => {
  if (user) {
    formBox.classList.add("hidden");
    todoContainer.classList.remove("hidden");
    console.log("User is Login:", user.uid);
    // Load tasks for the logged-in user
    getAllData(user.uid);
  } else {
    formBox.classList.remove("hidden");
    todoContainer.classList.add("hidden");
    console.log("User is Signout");
    todoList.innerHTML = ""; // Clear tasks when signed out
  }
});

// Add Task
addBtn.addEventListener("click", async () => {
  const value = inputEl.value.trim();
  if (!value) {
    alert("Please enter a task.");
    return;
  }

  const user = auth.currentUser;
  if (user) {
    try {
      await addDoc(collection(db, `todos/${user.uid}/tasks`), {
        todo: value,
        createdAt: new Date(),
        userId: user.uid
      });
      inputEl.value = "";
    } catch (error) {
      alert(`Error adding task: ${error.message}`);
    }
  } else {
    alert("Please sign in to add tasks.");
  }
});

// Load and Display Tasks
function getAllData(userId) {
  const tasksRef = collection(db, `todos/${userId}/tasks`);
  onSnapshot(tasksRef, (snapshot) => {
    todoList.innerHTML = "";
    snapshot.forEach((doc) => {
      const task = doc.data();
      const taskId = doc.id;
      const li = document.createElement("li");
      li.className = "todo-item";
      li.innerHTML = `
        <span>${task.todo}</span>
        <div class="todo-actions">
          <button class="edit-btn" onclick="editTask('${taskId}', '${userId}')">Edit</button>
          <button class="delete-btn" onclick="deleteTask('${taskId}', '${userId}')">Delete</button>
        </div>
      `;
      todoList.appendChild(li);
    });
  });
}

// Edit Task
window.editTask = async (taskId, userId) => {
  const newTaskText = prompt("Enter new task text:");
  if (newTaskText && newTaskText.trim()) {
    try {
      const taskRef = doc(db, `todos/${userId}/tasks`, taskId);
      await updateDoc(taskRef, { todo: newTaskText.trim() });
    } catch (error) {
      alert(`Error updating task: ${error.message}`);
    }
  }
};

// Delete Task
window.deleteTask = async (taskId, userId) => {
  if (confirm("Are you sure you want to delete this task?")) {
    try {
      const taskRef = doc(db, `todos/${userId}/tasks`, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      alert(`Error deleting task: ${error.message}`);
    }
  }
};

// Sign Out
signOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Signed out successfully!");
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});