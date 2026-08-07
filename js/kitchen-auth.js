import { supabase } from "./supabase.js";



async function checkKitchenAccess(){



const {
data:{
user
}

}= await supabase.auth.getUser();





if(!user){

window.location.href="/kitchen-login.html";

return;

}







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


window.location.href="/kitchen-login.html";


return;


}









// ROLE CHECK


if(

userData.role !== "admin" &&

userData.role !== "cook"

){


await supabase.auth.signOut();


alert(
"Kitchen access denied"
);


window.location.href="/kitchen-login.html";


return;


}









// SAVE USER


localStorage.setItem(

"kitchenUser",

JSON.stringify(userData)

);









// SHOW NAME


const userName =

document.getElementById("userName");



const userRole =

document.getElementById("userRole");





if(userName){

userName.innerText =
userData.name || user.email;

}





if(userRole){

userRole.innerText =
userData.role;

}






}









// LOGOUT FUNCTION


const logoutBtn =

document.getElementById("logoutBtn");




if(logoutBtn){



logoutBtn.addEventListener(

"click",

async()=>{


try{


await supabase.auth.signOut();


localStorage.removeItem(
"kitchenUser"
);



window.location.href="/kitchen-login.html";



}

catch(error){


console.log(error);


}



}


);


}







checkKitchenAccess();
