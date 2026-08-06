// pos/js/orders.js


import { db } from "./firebase.js";


import {

collection,

getDocs,

doc,

updateDoc,

orderBy,

query

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";







const ordersTable =

document.getElementById(

"ordersTable"

);







let allOrders = [];









// LOAD ORDERS


async function loadOrders(){



try{



ordersTable.innerHTML="";







const q = query(



collection(db,"orders"),



orderBy(

"createdAt",

"desc"

)



);








const snapshot =

await getDocs(q);







allOrders=[];







snapshot.forEach(orderDoc=>{



allOrders.push({


id:orderDoc.id,


...orderDoc.data()



});



});








displayOrders(allOrders);



}

catch(error){



console.log(

"Orders Load Error:",

error

);



}



}













// DISPLAY ORDERS


function displayOrders(orders){



ordersTable.innerHTML="";







orders.forEach(order=>{





let row =

document.createElement(

"tr"

);








row.innerHTML = `



<td>

#${order.id.slice(0,6)}

</td>






<td>

${order.customerName || "-"}

</td>






<td>

${order.orderType || "-"}

</td>






<td>

${order.tableNumber || "-"}

</td>






<td>

RM ${Number(order.total || 0).toFixed(2)}

</td>







<td>



<select class="status-select">



<option value="Pending"

${order.status==="Pending"?"selected":""}>

Pending

</option>






<option value="Preparing"

${order.status==="Preparing"?"selected":""}>

Preparing

</option>






<option value="Ready"

${order.status==="Ready"?"selected":""}>

Ready

</option>






<option value="Completed"

${order.status==="Completed"?"selected":""}>

Completed

</option>






<option value="Cancelled"

${order.status==="Cancelled"?"selected":""}>

Cancelled

</option>





</select>



</td>








<td>



<button class="update-btn">

Update

</button>



</td>



`;









const select =

row.querySelector(

".status-select"

);






const updateBtn =

row.querySelector(

".update-btn"

);







updateBtn.onclick = async()=>{





try{





await updateDoc(



doc(

db,

"orders",

order.id

),



{


status:select.value



}



);







alert(

"Order Updated"

);






loadOrders();






}

catch(error){



console.log(

"Update Error:",

error

);



}



};









ordersTable.appendChild(row);




});



}












// FILTER SYSTEM


document.querySelectorAll(

".order-filter button"

)

.forEach(button=>{



button.addEventListener(

"click",

()=>{



const status =

button.dataset.status;







if(status==="All"){



displayOrders(allOrders);



}

else{



displayOrders(



allOrders.filter(

order =>

order.status === status

)



);



}



});



});












// REFRESH


document.getElementById(

"refreshBtn"

)

?.addEventListener(

"click",

()=>{


loadOrders();



}

);












// START


loadOrders();
