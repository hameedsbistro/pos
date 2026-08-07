// pos/js/cart.js

import { changeLanguage } from "./language.js";


let cart =
JSON.parse(localStorage.getItem("cart"))
||
[];



const cartItems =
document.getElementById("cartItems");


const cartTotal =
document.getElementById("cartTotal");





function showCart(){


cartItems.innerHTML="";


let total=0;



if(cart.length===0){


cartItems.innerHTML=
`
<p>Your cart is empty</p>
`;

cartTotal.innerText="0.00";

updateCartCount();

return;

}





cart.forEach((item,index)=>{


let itemTotal =
Number(item.price) * Number(item.quantity);



total += itemTotal;



let div =
document.createElement("div");



div.className="cart-item";



div.innerHTML=`

<h3>
${item.itemName}
</h3>


<p>
RM ${Number(item.price).toFixed(2)}
</p>



<button class="minus">
-
</button>



<span>
${item.quantity}
</span>



<button class="plus">
+
</button>



<button class="remove-btn">
Remove
</button>



<textarea 
class="item-note"
placeholder="Order Note">${item.note || ""}</textarea>



`;





div.querySelector(".plus")
.onclick=()=>{


cart[index].quantity++;


saveCart();


};





div.querySelector(".minus")
.onclick=()=>{


if(cart[index].quantity>1){

cart[index].quantity--;

}
else{

cart.splice(index,1);

}


saveCart();


};





div.querySelector(".remove-btn")
.onclick=()=>{


cart.splice(index,1);


saveCart();


};





div.querySelector(".item-note")
.onchange=(e)=>{


cart[index].note=e.target.value;


saveCart();


};




cartItems.appendChild(div);



});



cartTotal.innerText=
total.toFixed(2);



updateCartCount();



}







function saveCart(){


localStorage.setItem(
"cart",
JSON.stringify(cart)
);


showCart();


}








function updateCartCount(){


let count=0;



cart.forEach(item=>{


count += Number(item.quantity);


});




document.getElementById("cartCount")
?.innerText=count;



document.getElementById("floatingCartCount")
?.innerText=count;



}







// CHECKOUT


document.getElementById("checkoutBtn")
?.addEventListener("click",()=>{


if(cart.length===0){


alert("Cart is empty");

return;


}



// go checkout

window.location.href=
"checkout.html";



});







// HEADER


document.getElementById("homeBtn")
?.addEventListener(
"click",
()=>{

window.location.href="index.html";

});





document.getElementById("backBtn")
?.addEventListener(
"click",
()=>{

history.back();

});





document.getElementById("refreshBtn")
?.addEventListener(
"click",
()=>{

location.reload();

});







showCart();

changeLanguage();
