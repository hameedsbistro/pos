// pos/js/auth.js


import { auth, db } from "./firebase.js";



import {

createUserWithEmailAndPassword,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";




import {

doc,

setDoc,

getDoc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";









// REGISTER SYSTEM



const registerBtn =

document.getElementById(
"registerSubmit"
);






if(registerBtn){



registerBtn.addEventListener(

"click",

async()=>{





const name =

document.getElementById(
"name"
).value.trim();




const email =

document.getElementById(
"email"
).value.trim();





const password =

document.getElementById(
"password"
).value.trim();







if(
name===""
||
email===""
||
password===""

){


alert(
"Please fill all fields"
);


return;


}








try{



const userCredential =

await createUserWithEmailAndPassword(

auth,

email,

password

);






const user =

userCredential.user;







await setDoc(

doc(
db,
"users",
user.uid
),

{


name:name,


email:email,


role:"customer",


status:"active",


createdAt:
new Date()


}

);







alert(
"Registration Successful"
);





window.location.href =
"index.html";




}

catch(error){


alert(
error.message
);


}





}

);



}









// LOGIN SYSTEM




const loginBtn =

document.getElementById(
"loginSubmit"
);







if(loginBtn){



loginBtn.addEventListener(

"click",

async()=>{





const email =

document.getElementById(
"email"
).value.trim();






const password =

document.getElementById(
"password"
).value.trim();






try{



const userCredential =

await signInWithEmailAndPassword(

auth,

email,

password

);






const user =

userCredential.user;







const userDoc =

await getDoc(

doc(
db,
"users",
user.uid
)

);






if(userDoc.exists()){


let data =
userDoc.data();





if(data.role==="admin"){


window.location.href =
"admin/index.html";


}

else{


window.location.href =
"index.html";


}



}

else{


window.location.href =
"index.html";


}






}

catch(error){



alert(
"Login Failed: "
+
error.message
);



}





}

);


}
