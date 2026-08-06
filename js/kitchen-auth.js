import { supabase } from "./supabase.js";



async function checkKitchenAccess(){



const {
data:{user}

}= await supabase.auth.getUser();





// NO LOGIN

if(!user){


window.location.href="../kitchen-login.html";


return;


}








// GET USER ROLE


const {

data:userData,

error

}= await supabase

.from("users")

.select("*")

.eq(
"email",
user.email
)

.single();







if(error || !userData){


await supabase.auth.signOut();


window.location.href="../kitchen-login.html";


return;


}







// ONLY ADMIN AND COOK



if(

userData.role !== "admin" &&

userData.role !== "cook"

){



await supabase.auth.signOut();


alert(
"Kitchen access denied"
);


window.location.href="../kitchen-login.html";


return;


}







// SHOW USER


const nameElement =

document.getElementById(
"userName"
);



const roleElement =

document.getElementById(
"userRole"
);





if(nameElement)

nameElement.innerText =
userData.name;





if(roleElement)

roleElement.innerText =
userData.role;







// SAVE CURRENT USER


localStorage.setItem(

"kitchenUser",

JSON.stringify(userData)

);



}









// LOGOUT


document
.getElementById("logoutBtn")
?.addEventListener(

"click",

async()=>{



await supabase.auth.signOut();



localStorage.removeItem(
"kitchenUser"
);



window.location.href="../kitchen-login.html";


}

);









checkKitchenAccess();
