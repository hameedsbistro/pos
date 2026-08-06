import { db } from "./firebase.js";

import { changeLanguage } from "./language.js";


import {


collection,

addDoc,

serverTimestamp


}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";







let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];








let orderType = "Dine In";


let paymentMethod = "Cash";









const checkoutItems =

document.getElementById(

"checkoutItems"

);






const checkoutTotal =

document.getElementById(

"checkoutTotal"

);









// SHOW ORDER SUMMARY



function showOrderSummary(){



checkoutItems.innerHTML="";



let total = 0;






cart.forEach(item=>{





let itemTotal =

Number(item.price)

*

item.quantity;







total += itemTotal;








let div =

document.createElement(

"div"

);





div.className =

"checkout-item";






div.innerHTML = `



<span>

${item.itemName}

×

${item.quantity}

</span>





<span>

RM ${itemTotal.toFixed(2)}

</span>



`;






checkoutItems.appendChild(div);



});








checkoutTotal.innerText =

total.toFixed(2);



}












// ORDER TYPE BUTTONS



document.getElementById(

"dineInBtn"

)

.onclick = ()=>{


orderType="Dine In";


document.getElementById(

"dineInBtn"

)

.classList.add(

"active"

);


document.getElementById(

"takeAwayBtn"

)

.classList.remove(

"active"

);



};








document.getElementById(

"takeAwayBtn"

)

.onclick = ()=>{


orderType="Take Away";


document.getElementById(

"takeAwayBtn"

)

.classList.add(

"active"

);


document.getElementById(

"dineInBtn"

)

.classList.remove(

"active"

);



};












// PAYMENT BUTTONS



document.querySelectorAll(

".payment-method button"

)

.forEach(button=>{



button.onclick=()=>{



paymentMethod =

button.dataset.payment;







document.querySelectorAll(

".payment-method button"

)

.forEach(btn=>{


btn.classList.remove(

"active"

);


});







button.classList.add(

"active"

);



};



});












// PLACE ORDER



document.getElementById(

"placeOrderBtn"

)

.onclick = async ()=>{





if(cart.length===0){



alert(

"Cart is empty"

);



return;



}







let customerName =

document.getElementById(

"customerName"

)

.value;







let customerPhone =

document.getElementById(

"customerPhone"

)

.value;







if(!customerName || !customerPhone){



alert(

"Please enter customer details"

);



return;



}









try{





await addDoc(

collection(

db,

"orders"

),

{



customerName,


customerPhone,


orderType,


paymentMethod,



items:cart,



total:Number(

checkoutTotal.innerText

),



status:"Pending",



createdAt:

serverTimestamp()



}

);







alert(

"Order Placed Successfully"

);








localStorage.removeItem(

"cart"

);







window.location.href=

"index.html";






}

catch(error){



console.log(error);


alert(

"Order Failed"

);



}



};











// HEADER BUTTONS



document.getElementById(

"backBtn"

)

?.addEventListener(

"click",

()=>{


history.back();


}

);









// START



showOrderSummary();


changeLanguage();
