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









// LOAD ORDERS


async function loadKitchen(){



try{



newOrders.innerHTML = "";

preparingOrders.innerHTML = "";

readyOrders.innerHTML = "";







const q = query(


collection(db,"orders"),


orderBy(

"createdAt",

"desc"

)


);







const snapshot =

await getDocs(q);








snapshot.forEach(orderDoc=>{





const order = {


id:orderDoc.id,


...orderDoc.data()



};








// PENDING ORDERS



if(

order.status === "Pending"

){



createOrderCard(


order,


newOrders,


"Accept Order",


"Preparing"


);



}









// PREPARING ORDERS



if(

order.status === "Preparing"

){



createOrderCard(


order,


preparingOrders,


"Mark Ready",


"Ready"


);



}









// READY ORDERS



if(

order.status === "Ready"

){



createOrderCard(


order,


readyOrders,


"Complete",


"Completed"


);



}



});






}

catch(error){



console.log(

"Kitchen Load Error:",

error

);



}



}











// CREATE ORDER CARD


function createOrderCard(


order,


container,


buttonText,


nextStatus


){






const card =

document.createElement(

"div"

);





card.className =

"kitchen-card";









let itemsHTML = "";








order.items?.forEach(item=>{



itemsHTML += `


<p>

${item.itemName}

×

${item.quantity}

</p>


`;



});









card.innerHTML = `



<h3>

Order #

${order.id.slice(0,6)}

</h3>






<p>

Customer:

${order.customerName || "Walk In"}

</p>







<p>

Phone:

${order.customerPhone || "-"}

</p>







<p>

Type:

${order.orderType || "-"}

</p>







<p>

Payment:

${order.paymentMethod || "-"}

</p>







<div class="kitchen-items">


${itemsHTML}


</div>







<button class="kitchen-status-btn">


${buttonText}


</button>



`;









card.querySelector(

".kitchen-status-btn"

)

.onclick = async()=>{





try{



await updateDoc(



doc(

db,


"orders",


order.id


),



{


status:nextStatus



}



);






loadKitchen();






}

catch(error){



console.log(

"Status Update Error:",

error

);



}



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











// START


loadKitchen();








// AUTO REFRESH


setInterval(

()=>{



loadKitchen();



},

5000

);
