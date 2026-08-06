// pos/js/admin.js


import { supabase } from "./supabase.js";





async function checkAdmin(){



const {

data:{user}

}= await supabase.auth.getUser();





if(!user){


window.location.href="../login.html";


return;


}






const {data:userData,error}=

await supabase

.from("users")

.select("*")

.eq("email",user.email)

.single();






if(error || !userData){


window.location.href="../login.html";


return;


}






if(

userData.role !== "admin" &&

userData.role !== "manager"

){


alert("Access Denied");


window.location.href="../login.html";


return;


}






console.log(
"Admin Login:",
userData.name
);




}





// LOGOUT BUTTON

document.getElementById(
"logoutBtn"
)?.addEventListener(
"click",
async()=>{


await supabase.auth.signOut();


window.location.href="../login.html";


});







// START

checkAdmin();
