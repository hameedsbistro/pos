// js/login.js


import { supabase } from "./supabase.js";

import { saveLocalUser } from "./auth.js";






// ===============================
// LOGIN BUTTON
// ===============================


const loginBtn =

document.getElementById(
"loginBtn"
);







loginBtn?.addEventListener(

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






const message =

document.getElementById(
"message"
);






if(!email || !password){


message.innerText =
"Enter email and password";


return;


}







message.innerText =
"Logging in...";









// ===============================
// SUPABASE AUTH LOGIN
// ===============================


const {

data,

error

}=await supabase.auth.signInWithPassword({


email,


password


});








if(error){


message.innerText =
"Login failed";


console.log(error);


return;


}









const authUser =
data.user;









// ===============================
// GET USER PROFILE
// ===============================


const {

data:user,

error:userError

}=await supabase

.from("users")

.select("*")

.eq(

"id",

authUser.id

)

.single();








if(userError || !user){


message.innerText =
"User profile not found";


return;


}









if(user.status !== "active"){


message.innerText =
"Account inactive";


await supabase.auth.signOut();


return;


}









// SAVE USER


saveLocalUser(user);









// ===============================
// ROLE REDIRECT
// ===============================



switch(user.role){



case "admin":


case "manager":


window.location.href =
"admin.html";


break;






case "cashier":


window.location.href =
"cashier.html";


break;







case "waiter":


window.location.href =
"waiter.html";


break;







case "cook":


window.location.href =
"kitchen.html";


break;






default:


message.innerText =
"Invalid Role";


}








}

);
