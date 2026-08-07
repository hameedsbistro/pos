import { supabase } from "./supabase.js";



async function kitchenAuth(){



const {
data:{
user
}

}=await supabase.auth.getUser();





if(!user){

window.location.href="/kitchen-login.html";
return;

}






const {data:userData,error}=

await supabase

.from("users")

.select("*")

.eq(
"email",
user.email
)

.single();







if(error || !userData){

await supabase.auth.signOut();

window.location.href="/kitchen-login.html";

return;

}







if(

userData.role!=="admin" &&

userData.role!=="cook"

){


await supabase.auth.signOut();

window.location.href="/kitchen-login.html";

return;


}







// USER NAME


const name =
document.getElementById("userName");


const role =
document.getElementById("userRole");





if(name){

name.innerText =
userData.name || "User";

}




if(role){

role.innerText =
userData.role;

}





localStorage.setItem(

"kitchenUser",

JSON.stringify(userData)

);



}








// LOGOUT


document

.getElementById("logoutBtn")

?.addEventListener("click",async()=>{


await supabase.auth.signOut();


localStorage.removeItem(
"kitchenUser"
);



window.location.href="/kitchen-login.html";



});







kitchenAuth();
