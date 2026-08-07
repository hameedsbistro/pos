import { supabase } from "./supabase.js";


// ===============================
// CHECK KITCHEN AUTH
// ===============================


async function checkKitchenAuth(){


const {
data:{
session
}

}=

await supabase.auth.getSession();



if(!session){


localStorage.removeItem(
"kitchenUser"
);


window.location.href=
"/kitchen-login.html";


return;


}





const email =
session.user.email;



const {
data:user,
error
}=

await supabase

.from("users")

.select("*")

.eq(
"email",
email
)

.single();






if(error || !user){


await supabase.auth.signOut();


window.location.href=
"/kitchen-login.html";


return;


}





// ONLY ADMIN + COOK


if(

user.role !== "admin"

&&

user.role !== "cook"

){


await supabase.auth.signOut();


window.location.href=
"/kitchen-login.html";


return;


}






// SAVE USER


localStorage.setItem(

"kitchenUser",

JSON.stringify(user)

);



}





// RUN

checkKitchenAuth();







// ===============================
// LOGOUT
// ===============================


const logoutBtn =
document.getElementById("logoutBtn");



logoutBtn?.addEventListener(

"click",

async()=>{


await supabase.auth.signOut();


localStorage.removeItem(
"kitchenUser"
);



window.location.href=
"/kitchen-login.html";



}

);
