// pos/js/kitchen.js



import { db } from "./firebase.js";



import {

collection,

getDocs,

doc,

updateDoc,

query,

orderBy

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";









const newOrders =

document.getElementById(
"newOrders"
);



const preparingOrders =

document.getElementById(
"preparingOrders"
);



const readyOrders =

document.getElementById(
"readyOrders"
);








// LOAD KITCHEN ORDERS



async function loadKitchen(){



newOrders.innerHTML="";

preparingOrders.innerHTML="";

readyOrders.innerHTML="";







const q = query(

collection(db,"orders"),

orderBy(
"createdAt",
"desc"
)

);






const snapshot =

await getDocs(q);







snapshot.forEach(

orderDoc=>{



let order = {


id:orderDoc.id,

...orderDoc.data()


};







if(order.status==="New"){



createOrderCard(

order,

newOrders,

"Accept Order",

"Preparing"

);



}






if(order.status==="Preparing"){



createOrderCard(

order,

preparingOrders,

"Mark Ready",

"Ready"

);



}







if(order.status==="Ready"){



createOrderCard(

order,

readyOrders,

"Complete",

"Completed"

);



}






});





}









// CREATE ORDER CARD



function createOrderCard(

order,

container,

buttonText,

nextStatus

){





let card =

document.createElement(
"div"
);



card.className =
"kitchen-card";






let items="";







order.items?.forEach(

item=>{



items += `

<p>

${item.itemName}

 x ${item.quantity}

</p>


`;



});









card.innerHTML = `



<h3>

${order.orderNumber}

</h3>




<p>

Customer:

${order.customerName}

</p>





<p>

Type:

${order.orderType}

</p>





<div class="kitchen-items">

${items}

</div>





<button class="kitchen-status-btn">

${buttonText}

</button>


`;









card.querySelector(

".kitchen-status-btn"

)

.onclick = async()=>{





await updateDoc(

doc(

db,

"orders",

order.id

),

{


status:

nextStatus



}



);







loadKitchen();





};








container.appendChild(card);



}









// REFRESH BUTTON



document.getElementById(
"refreshBtn"
)
?.addEventListener(

"click",

()=>{


loadKitchen();


}

);







// AUTO LOAD


loadKitchen();




// AUTO REFRESH EVERY 5 SECOND


setInterval(

()=>{


loadKitchen();


},

5000

);
