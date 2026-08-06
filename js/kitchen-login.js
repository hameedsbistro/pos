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





try{



const {

data,

error

}= await supabase.auth.signInWithPassword({

email,

password

});





if(error){

throw error;

}






const {data:userData,error:userError}=

await supabase

.from("users")

.select("*")

.eq(
"email",
email
)

.single();






if(userError){

throw userError;

}







// ONLY ADMIN AND COOK


if(

userData.role !== "admin" &&

userData.role !== "cook"

){



await supabase.auth.signOut();


message.innerText =
"Kitchen access denied";


return;


}






localStorage.setItem(

"kitchenUser",

JSON.stringify(userData)

);





window.location.href=

"admin/kitchen.html";





}

catch(error){


message.innerText =
error.message;


}



};
