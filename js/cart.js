// js/cart.js


import { changeLanguage } from "./language.js";





let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];








// ===============================
// ELEMENTS
// ===============================


const cartItemsBox =

document.getElementById(
"cartItems"
);



const cartTotalBox =

document.getElementById(
"cartTotal"
);









// ===============================
// SHOW CART
// ===============================


function showCart(){



if(!cartItemsBox){

return;

}





cartItemsBox.innerHTML="";






let total = 0;







if(cart.length===0){


cartItemsBox.innerHTML =

`

<p class="empty-cart">

Your cart is empty

</p>

`;





cartTotalBox.innerText =
"RM 0.00";



updateCartCount();


return;



}









cart.forEach(

(item,index)=>{



let itemTotal =

item.price *

item.quantity;





total += itemTotal;







cartItemsBox.innerHTML += `



<div class="cart-item">



<div>


<h3>

${item.itemName}

</h3>


<p>

RM ${item.price.toFixed(2)}

</p>


</div>






<div class="quantity-box">


<button onclick="minusItem(${index})">

-

</button>



<span>

${item.quantity}

</span>




<button onclick="plusItem(${index})">

+

</button>



</div>







<button

class="remove-btn"

onclick="removeItem(${index})">

✕

</button>



</div>



`;





});









cartTotalBox.innerText =

"RM " +

total.toFixed(2);







updateCartCount();



}









// ===============================
// PLUS
// ===============================


window.plusItem = function(index){


cart[index].quantity++;


saveCart();


}









// ===============================
// MINUS
// ===============================


window.minusItem = function(index){



if(cart[index].quantity > 1){


cart[index].quantity--;


}

else{


cart.splice(index,1);


}





saveCart();



}









// ===============================
// REMOVE
// ===============================


window.removeItem = function(index){


cart.splice(index,1);



saveCart();



}









// ===============================
// SAVE CART
// ===============================


function saveCart(){


localStorage.setItem(

"cart",

JSON.stringify(cart)

);



showCart();



}









// ===============================
// CART COUNT
// ===============================


function updateCartCount(){



let count=0;




cart.forEach(item=>{


count += item.quantity;


});





const box =

document.getElementById(
"cartCount"
);





if(box){


box.innerText=count;


}





}









// ===============================
// CHECKOUT
// ===============================


document

.getElementById("checkoutBtn")

?.addEventListener(

"click",

()=>{



if(cart.length===0){


alert(
"Cart is empty"
);


return;


}





window.location.href =

"checkout.html";



});









// ===============================
// HEADER
// ===============================


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







document

.getElementById("backBtn")

?.addEventListener(

"click",

()=>{


history.back();


});









// START


showCart();

updateCartCount();

changeLanguage();
