// pos/js/checkout.js



import { db } from "./firebase.js";



import {

collection,

addDoc,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";







// CART DATA


const cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];






// ORDER TYPE


const orderType =

localStorage.getItem(
"orderType"
)

||

"Dine In";






document.getElementById(
"orderType"
).innerText = orderType;








// HIDE TABLE FOR TAKE AWAY


const tableBox =

document.getElementById(
"tableBox"
);



const tableNumber =

document.getElementById(
"tableNumber"
);






if(orderType==="Take Away"){


tableBox.style.display="none";


}










// CONFIRM ORDER



const confirmBtn =

document.getElementById(
"confirmOrderBtn"
);






confirmBtn.addEventListener(

"click",

async ()=>{






let name =

document.getElementById(
"customerName"
).value.trim();





let phone =

document.getElementById(
"customerPhone"
).value.trim();





let table =

tableNumber.value;





let note =

document.getElementById(
"orderNote"
).value;








if(name===""){


alert(
"Please enter customer name"
);


return;


}








if(cart.length===0){


alert(
"Cart is empty"
);


return;


}









let total = 0;





cart.forEach(item=>{


total +=

Number(item.price)

*

item.quantity;



});










try{



const order = await addDoc(

collection(db,"orders"),

{


orderNumber:

"HMB-"+Date.now(),



customerName:name,



customerPhone:phone,



orderType:orderType,



tableNumber:
table,



items:cart,



totalAmount:
total,



note:note,



status:
"New",



paymentStatus:
"Pending",



createdAt:
serverTimestamp()



}



);







alert(

"Order Confirmed Successfully"

);







// CLEAR CART


localStorage.removeItem(
"cart"
);







window.location.href="../index.html";





}

catch(error){



console.log(
error
);



alert(
"Order Failed"
);



}




}

);









// HEADER BUTTONS


document.getElementById(
"homeBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="../index.html";


}

);







document.getElementById(
"backBtn"
)?.addEventListener(

"click",

()=>{


history.back();


}

);







document.getElementById(
"refreshBtn"
)?.addEventListener(

"click",

()=>{


location.reload();


}

);
