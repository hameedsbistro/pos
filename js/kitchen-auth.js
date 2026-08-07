import { supabase } from "./supabase.js";


// ==========================
// CHECK LOGIN USER
// ==========================

const kitchenUser = 
JSON.parse(
localStorage.getItem("kitchenUser")
);



if(!kitchenUser){


    window.location.href =
    "/kitchen-login.html";


}




// ==========================
// SHOW USER INFO
// ==========================


const userName =
document.getElementById("userName");


const userRole =
document.getElementById("userRole");



if(userName){

    userName.innerText =
    kitchenUser.name || "User";

}



if(userRole){

    userRole.innerText =
    kitchenUser.role || "-";

}





// ==========================
// LOGOUT
// ==========================


const logoutBtn =
document.getElementById("logoutBtn");



logoutBtn?.addEventListener(
"click",
async()=>{


    await supabase.auth.signOut();


    localStorage.removeItem(
    "kitchenUser"
    );


    window.location.href =
    "/kitchen-login.html";


});
