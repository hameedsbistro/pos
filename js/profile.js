// js/profile.js


import { changeLanguage } from "./language.js";

import { getLocalUser } from "./auth.js";




// ===============================
// RESTAURANT DATA
// ===============================


const restaurant = {


name:
"Hameed's Bistro",


address:
"Your Restaurant Address Here",


phone:
"Your Contact Number",


opening:
"Everyday: 10:00 AM - 10:00 PM"



};









// ===============================
// LOAD PROFILE
// ===============================


function loadProfile(){



const name =

document.getElementById(
"restaurantName"
);



const address =

document.getElementById(
"restaurantAddress"
);



const phone =

document.getElementById(
"restaurantPhone"
);



const opening =

document.getElementById(
"openingHours"
);







if(name){

name.innerText =
restaurant.name;

}



if(address){

address.innerText =
restaurant.address;

}



if(phone){

phone.innerText =
restaurant.phone;

}



if(opening){

opening.innerText =
restaurant.opening;

}





}









// ===============================
// LOGIN BUTTON
// ===============================


document

.getElementById("loginBtn")

?.addEventListener(

"click",

()=>{



const user =

getLocalUser();





if(user){


window.location.href =
"index.html";


}

else{


window.location.href =
"login.html";


}



});









// ===============================
// HEADER BUTTONS
// ===============================


document

.getElementById("homeBtn")

?.addEventListener(

"click",

()=>{


window.location.href =
"index.html";


});







document

.getElementById("backBtn")

?.addEventListener(

"click",

()=>{


history.back();


});







document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


location.reload();


});









// START


loadProfile();

changeLanguage();
