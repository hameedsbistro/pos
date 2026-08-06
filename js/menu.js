// pos/js/menu.js


import { db } from "./firebase.js";

import { changeLanguage } from "./language.js";


import {

collection,

getDocs

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";





const menuItemsDiv =

document.getElementById("menuItems");



const categoryList =

document.getElementById("categoryList");






let allMenuItems = [];









// LOAD MENU FROM FIREBASE


async function loadMenu(){



try{



const querySnapshot =

await getDocs(

collection(db,"menu")

);





allMenuItems = [];






querySnapshot.forEach((doc)=>{



allMenuItems.push({


id:doc.id,


...doc.data()


});



});







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






categoryList.innerHTML = "";







categories.forEach(category=>{



let btn =

document.createElement("button");





btn.className =

"category-btn";





btn.innerText = category;








btn.onclick = ()=>{



if(category==="All"){



showMenu(allMenuItems);



}

else{



showMenu(

allMenuItems.filter(

item =>

item.category === category

)

);



}



};






categoryList.appendChild(btn);





});



}











// SHOW MENU


function showMenu(items){



menuItemsDiv.innerHTML = "";






let orderType =

new URLSearchParams(

window.location.search

)

.get("type");







items.forEach(item=>{





let card =

document.createElement("div");





card.className =

"food-card";







card.innerHTML = `



<img src="${item.image || 'images/menu/default.jpg'}">





<div class="food-info">



<h3>

${item.itemName}

</h3>







<div class="price-box">


<p>

Dine In:

<br>

RM ${Number(item.dineInPrice).toFixed(2)}

</p>




<p>

Take Away:

<br>

RM ${Number(item.takeAwayPrice).toFixed(2)}

</p>



</div>







<button class="add-cart-btn">

Add To Cart

</button>





</div>



`;








card.querySelector(

".add-cart-btn"

)

.onclick = ()=>{



addToCart(item,orderType);



};








menuItemsDiv.appendChild(card);



});



}











// ADD TO CART


function addToCart(item,type){



let cart =

JSON.parse(

localStorage.getItem("cart")

)

|| [];








let price =

type==="takeaway"

?

item.takeAwayPrice

:

item.dineInPrice;







let exist =

cart.find(

product =>

product.id === item.id

);








if(exist){



exist.quantity += 1;



}

else{



cart.push({



id:item.id,


itemName:item.itemName,


price:Number(price),


dineInPrice:Number(item.dineInPrice),


takeAwayPrice:Number(item.takeAwayPrice),


image:item.image || "",


quantity:1



});



}








localStorage.setItem(

"cart",

JSON.stringify(cart)

);






updateCartCount();






alert(

"Added To Cart"

);



}











// UPDATE CART COUNT


function updateCartCount(){



let cart =

JSON.parse(

localStorage.getItem("cart")

)

|| [];






let count =

cart.reduce(

(total,item)=>


total + item.quantity,


0

);







const cartCount =

document.getElementById(

"cartCount"

);







const floatingCount =

document.getElementById(

"floatingCartCount"

);








if(cartCount){



cartCount.innerText = count;



}






if(floatingCount){



floatingCount.innerText = count;



}



}











// HEADER BUTTONS


document.getElementById(

"homeBtn"

)

?.addEventListener(

"click",

()=>{


window.location.href="index.html";


}

);








document.getElementById(

"backBtn"

)

?.addEventListener(

"click",

()=>{


history.back();


}

);









document.getElementById(

"refreshBtn"

)

?.addEventListener(

"click",

()=>{


location.reload();


}

);








document.getElementById(

"cartBtn"

)

?.addEventListener(

"click",

()=>{


window.location.href="cart.html";


}

);









// START


loadMenu();


updateCartCount();


changeLanguage();
