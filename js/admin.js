// pos/js/admin.js



import { auth, db } from "./firebase.js";



import {

onAuthStateChanged,

signOut

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";





import {

doc,

getDoc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";









// CHECK ADMIN LOGIN



onAuthStateChanged(

auth,

async(user)=>{



if(!user){


window.location.href="../login.html";


return;


}







const userDoc =

await getDoc(

doc(

db,

"users",

user.uid

)

);








if(userDoc.exists()){


let data = userDoc.data();






if(data.role !== "admin"){



alert(
"Access Denied"
);



window.location.href="../index.html";



}



}

else{


window.location.href="../index.html";


}





}

);









// REFRESH BUTTON



document.getElementById(
"refreshBtn"
)
?.addEventListener(

"click",

()=>{


location.reload();


}

);









// ADMIN PROFILE BUTTON



document.getElementById(
"adminProfileBtn"
)
?.addEventListener(

"click",

()=>{


let logout = confirm(

"Logout from Admin?"

);



if(logout){



signOut(auth)
.then(()=>{


window.location.href="../login.html";


});



}



}

);









// LANGUAGE BUTTON



document.getElementById(
"languageBtn"
)
?.addEventListener(

"click",

()=>{


alert(
"Language Menu Coming"
);


}

);
