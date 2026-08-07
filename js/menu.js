// js/menu.js


import { supabase } from "./supabase.js";

import { changeLanguage } from "./language.js";






let menuItems = [];

let orderType =

localStorage.getItem(
"orderType"
)

||

"Dine In";








// ===============================
// LOAD MENU
// ===============================


async function loadMenu(){



const {

data,

error

}=await supabase

.from("menu")

.select(`

id,

category,

item_name,

image,

dine_in_price,

take_away_price,

section_id

`)

.eq(

"status",

"active"

)

.order(
"category"
);







if(error){


console.log(error);


return;


}





menuItems = data;


showMenu(menuItems);


}









// ===============================
// DISPLAY MENU
// ===============================


function showMenu(items){



const container =

document.getElementById(
"menuContainer"
);





if(!container){

return;

}





container.innerHTML="";








items.forEach(item=>{





let price =

orderType === "Take Away"

?

item.take_away_price

:

item.dine_in_price;









container.innerHTML += `



<div class="menu-card">



<img src="${item.image || '../images/no-image.png'}">



<h3>

${item.item_name}

</h3>



<p>

${item.category}

</p>



<h4>

RM ${Number(price).toFixed(2)}

</h4>




<button class="addCartBtn"

data-id="${item.id}">

Add

</button>



</div>



`;




});








document

.querySelectorAll(".addCartBtn")

.forEach(btn=>{


btn.onclick=()=>{


addToCart(
btn.dataset.id
);


};



});






}









// ===============================
// CATEGORY FILTER
// ===============================


document

.querySelectorAll(".category-btn")

.forEach(btn=>{


btn.onclick=()=>{


let category =

btn.dataset.category;






if(category==="all"){


showMenu(menuItems);


}

else{


showMenu(

menuItems.filter(

item=>

item.category === category

)

);


}




};



});









// ===============================
// ORDER TYPE
// ===============================


document

.getElementById("dineInBtn")

?.addEventListener(

"click",

()=>{


orderType="Dine In";


localStorage.setItem(

"orderType",

orderType

);



showMenu(menuItems);



});









document

.getElementById("takeAwayBtn")

?.addEventListener(

"click",

()=>{


orderType="Take Away";


localStorage.setItem(

"orderType",

orderType

);



showMenu(menuItems);



});









// ===============================
// ADD TO CART
// ===============================


function addToCart(id){



const item =

menuItems.find(

x=>x.id===id

);





let price =

orderType==="Take Away"

?

item.take_away_price

:

item.dine_in_price;






let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];







let exist =

cart.find(

x=>x.id===id

);







if(exist){


exist.quantity++;


}

else{


cart.push({

id:item.id,


itemName:item.item_name,


price:Number(price),


quantity:1,


category:item.category,


section_id:item.section_id,


orderType:orderType



});


}







localStorage.setItem(

"cart",

JSON.stringify(cart)

);






updateCartCount();



alert(

item.item_name+

" Added"

);



}









// ===============================
// CART COUNT
// ===============================


function updateCartCount(){



let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];




let count=0;



cart.forEach(item=>{


count += item.quantity;


});





const countBox =

document.getElementById(
"cartCount"
);





if(countBox){


countBox.innerText=count;


}



}









// ===============================
// HEADER BUTTONS
// ===============================


document

.getElementById("cartBtn")

?.addEventListener(

"click",

()=>{


window.location.href="cart.html";


});





document

.getElementById("homeBtn")

?.addEventListener(

"click",

()=>{


window.location.href="index.html";


});







document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


location.reload();


});









// START


loadMenu();

updateCartCount();

changeLanguage();
