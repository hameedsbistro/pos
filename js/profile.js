// pos/js/profile.js



// HOME BUTTON


document.getElementById(
"homeBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="../index.html";


}

);







// BACK BUTTON


document.getElementById(
"backBtn"
)?.addEventListener(

"click",

()=>{


history.back();


}

);







// REFRESH BUTTON


document.getElementById(
"refreshBtn"
)?.addEventListener(

"click",

()=>{


location.reload();


}

);








// CART BUTTON


document.getElementById(
"cartBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="cart.html";


}

);








// LOGIN BUTTON


document.getElementById(
"loginBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="../login.html";


}

);








// MENU BUTTON


const menuBtn =

document.getElementById(
"menuBtn"
);



if(menuBtn){


menuBtn.addEventListener(

"click",

()=>{


alert(
"Menu Open"
);


}

);


}
