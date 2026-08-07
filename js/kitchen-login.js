import { supabase } from "./supabase.js";



const loginBtn = 
document.getElementById("loginBtn");



loginBtn.addEventListener(
"click",
async()=>{


const email =
document.getElementById("email").value.trim();



const password =
document.getElementById("password").value;




const message =
document.getElementById("message");




if(!email || !password){

message.innerText =
"Please enter email and password";

return;

}






// LOGIN

const {

data,

error

}= await supabase.auth.signInWithPassword({

email,

password

});







if(error){

message.innerText =
error.message;

return;

}







// GET USER DATA


const {

data:userData,

error:userError

}= await supabase

.from("users")

.select("*")

.eq(

"email",

email

)

.single();








if(userError || !userData){


await supabase.auth.signOut();


message.innerText =
"User not found";


return;


}









// KITCHEN PERMISSION


if(

userData.role !== "admin" &&

userData.role !== "cook"

){


await supabase.auth.signOut();


message.innerText =
"Only Cook/Admin can access Kitchen";


return;


}









// SAVE SESSION


localStorage.setItem(

"kitchenUser",

JSON.stringify(userData)

);








// FINAL REDIRECT


window.location.href =
"/kitchen/index.html";



});
