// pos/js/firebase.js


import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";


import { getAuth } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";




// Firebase Configuration


const firebaseConfig = {


apiKey: "AIzaSyAkG10Ng7I3S8MqwxxdptsT4tthxHhwBzk",


authDomain: "ordering-system-f7e1e.firebaseapp.com",


projectId: "ordering-system-f7e1e",


storageBucket: "ordering-system-f7e1e.firebasestorage.app",


messagingSenderId: "456194566113",


appId: "1:456194566113:web:8a5744530df71a1684d4a0"


};







// Initialize Firebase


const app = initializeApp(firebaseConfig);







// Firebase Services


const auth = getAuth(app);


const db = getFirestore(app);







export {


app,

auth,

db


};
