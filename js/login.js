// pos/js/login.js


import { supabase } from "./supabase.js";



const loginBtn =
document.getElementById("loginBtn");


const message =
document.getElementById("message");






loginBtn.onclick = async()=>{


const email =
document.getElementById("email").value.trim();



const password =
document.getElementById("password").value;





if(!email || !password){


message.innerText =
"Enter email and password";


return;


}







try{



// AUTH LOGIN

const {

data,

error

} = await supabase.auth.signInWithPassword({

email,

password

});





if(error){


throw error;


}







// GET USER PROFILE


const {data:userData,error:userError}=

await supabase

.from("users")

.select("*")

.eq("email",email)

.single();






if(userError){


throw userError;


}







if(userData.status !== "active"){


message.innerText =
"Account inactive";


await supabase.auth.signOut();


return;


}








// ROLE CHECK


if(userData.role==="admin"){



window.location.href =

"admin/index.html";



}

else if(userData.role==="manager"){



window.location.href =

"admin/index.html";



}

else if(userData.role==="cashier"){



window.location.href =

"cashier/index.html";



}

else if(userData.role==="waiter"){



window.location.href =

"waiter/index.html";



}

else if(userData.role==="cook"){



window.location.href =

"admin/kitchen.html";



}

else{


message.innerText =
"Invalid Role";


}





}

catch(error){



console.log(error);



message.innerText =
error.message;



}



};
