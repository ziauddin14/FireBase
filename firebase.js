
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
  
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
  export { auth };