// pos/js/menu.js

import { supabase } from "./supabase.js";


const menuItemsDiv =
document.getElementById("menuItems");


const categoryList =
document.getElementById("categoryList");



let allMenuItems = [];




// LOAD MENU FROM SUPABASE

async function loadMenu(){


try{


const { data, error } = await supabase
.from("menu")
.select("*")
.eq("status","active");



if(error){

throw error;

}



allMenuItems = data || [];



showCategories();

showMenu(allMenuItems);



}

catch(error){


console.log(
"Menu Load Error:",
error
);


}


}





// SHOW CATEGORY

function showCategories(){


let categories = [

"All"

];



allMenuItems.forEach(item=>{


if(
item.category &&
!categories.includes(item.category)
){


categories.push(
item.category
);


}



});





categoryList.innerHTML="";





categories.forEach(category=>{


let btn =
document.createElement("button");



btn.className =
"category-btn";



btn.innerText =
category;




btn.onclick=()=>{


if(category==="All"){


showMenu(allMenuItems);


}

else{


showMenu(

allMenuItems.filter(

item=>

item.category===category

)

);


}


};





categoryList.appendChild(btn);



});



}








// SHOW MENU ITEMS

function showMenu(items){



menuItemsDiv.innerHTML="";




items.forEach(item=>{


let card =
document.createElement("div");



card.className =
"food-card";





card.innerHTML = `


<img src="${item.image || '../images/menu/default.jpg'}">


<h3>
${item.itemname || item.itemName}
</h3>


<div class="price-box">


<p>
Dine In:
<br>
RM ${Number(item.dineinprice || item.dineInPrice).toFixed(2)}
</p>



<p>
Take Away:
<br>
RM ${Number(item.takeawayprice || item.takeAwayPrice).toFixed(2)}
</p>


</div>




<button class="add-cart-btn">

Add To Cart

</button>


`;





card
.querySelector(".add-cart-btn")
.onclick=()=>{


addToCart(item);


};





menuItemsDiv.appendChild(card);



});



}









// ADD TO CART

function addToCart(item){



let cart =

JSON.parse(

localStorage.getItem("cart")

)

|| [];






let exist =

cart.find(

product=>

product.id===item.id

);





if(exist){


exist.quantity++;

}

else{


cart.push({


id:item.id,


itemName:
item.itemname || item.itemName,


price:
item.dineinprice || item.dineInPrice,


image:item.image,


quantity:1


});


}






localStorage.setItem(

"cart",

JSON.stringify(cart)

);




updateCartCount();



}








// CART COUNT

function updateCartCount(){


let cart =

JSON.parse(

localStorage.getItem("cart")

)

|| [];



let count=0;


cart.forEach(item=>{


count += item.quantity;


});





document.getElementById(
"cartCount"
)?.innerText=count;



}









// HEADER BUTTONS

document.getElementById(
"homeBtn"
)?.addEventListener(
"click",
()=>{

window.location.href="../index.html";

});


document.getElementById(
"backBtn"
)?.addEventListener(
"click",
()=>{

history.back();

});



document.getElementById(
"refreshBtn"
)?.addEventListener(
"click",
()=>{

location.reload();

});



document.getElementById(
"cartBtn"
)?.addEventListener(
"click",
()=>{

window.location.href="cart.html";

});








// START

loadMenu();

updateCartCount();
