// pos/js/cart.js


import { changeLanguage } from "./language.js";



let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];









const cartItems =

document.getElementById(

"cartItems"

);






const cartTotal =

document.getElementById(

"cartTotal"

);









// SHOW CART


function showCart(){



cartItems.innerHTML = "";



let total = 0;







if(cart.length === 0){



cartItems.innerHTML = `


<h3 style="text-align:center">

Your cart is empty

</h3>


`;



cartTotal.innerText =

"0.00";



updateCartCount();



return;


}









cart.forEach((item,index)=>{





total +=

Number(item.price)

*

item.quantity;








let div =

document.createElement("div");





div.className =

"cart-item";








div.innerHTML = `



<img src="${item.image || 'images/menu/default.jpg'}">






<div class="cart-item-info">



<h3>

${item.itemName}

</h3>




<p>

RM ${Number(item.price).toFixed(2)}

</p>



</div>







<div class="quantity-box">



<button class="minus">

-

</button>





<span>

${item.quantity}

</span>





<button class="plus">

+

</button>



</div>







<button class="remove-btn">

Remove

</button>



`;











// PLUS


div.querySelector(

".plus"

)

.onclick = ()=>{


cart[index].quantity++;


saveCart();



};









// MINUS


div.querySelector(

".minus"

)

.onclick = ()=>{



if(cart[index].quantity > 1){


cart[index].quantity--;


}

else{


cart.splice(index,1);


}



saveCart();



};









// REMOVE


div.querySelector(

".remove-btn"

)

.onclick = ()=>{



cart.splice(index,1);



saveCart();



};








cartItems.appendChild(div);



});









cartTotal.innerText =

total.toFixed(2);



updateCartCount();



}











// SAVE CART


function saveCart(){



localStorage.setItem(

"cart",

JSON.stringify(cart)

);



showCart();



}











// UPDATE CART COUNT


function updateCartCount(){



let count = 0;






cart.forEach(item=>{



count += item.quantity;



});








const cartCount =

document.getElementById(

"cartCount"

);






const floatingCartCount =

document.getElementById(

"floatingCartCount"

);








if(cartCount){



cartCount.innerText = count;



}







if(floatingCartCount){



floatingCartCount.innerText = count;



}



}











// CHECKOUT


const checkoutBtn =

document.getElementById(

"checkoutBtn"

);








if(checkoutBtn){



checkoutBtn.onclick = ()=>{



if(cart.length === 0){



alert(

"Cart is empty"

);



return;



}






window.location.href =

"checkout.html";



};



}












// HEADER BUTTONS


document.getElementById(

"homeBtn"

)

?.addEventListener(

"click",

()=>{



window.location.href =

"index.html";



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












// START


showCart();


changeLanguage();
