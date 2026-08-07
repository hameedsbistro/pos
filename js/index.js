// js/index.js


import { changeLanguage } from "./language.js";

import { getLocalUser } from "./auth.js";




// ===============================
// CART COUNT
// ===============================


function updateCartCount(){



const cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];





let count = 0;



cart.forEach(item=>{


count += item.quantity;


});







const cartCount =

document.getElementById(
"cartCount"
);





if(cartCount){


cartCount.innerText =
count;


}



}









// ===============================
// BUTTON EVENTS
// ===============================



document
.getElementById("menuBtn")
?.addEventListener(
"click",
()=>{


window.location.href =
"menu.html";


});








document
.getElementById("cartBtn")
?.addEventListener(
"click",
()=>{


window.location.href =
"cart.html";


});









document
.getElementById("loginBtn")
?.addEventListener(
"click",
()=>{


const user =
getLocalUser();



if(user){



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

window.location.href =
"profile.html";


}



}

else{


window.location.href =
"login.html";


}



});









document
.getElementById("refreshBtn")
?.addEventListener(
"click",
()=>{


location.reload();


});









document
.getElementById("languageBtn")
?.addEventListener(
"click",
()=>{


const lang =

prompt(
"Language: en / ms / bn / hi / ta / zh"
);



if(lang){


changeLanguage(lang);


}



});








// ===============================
// START
// ===============================


updateCartCount();
