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







snapshot.forEach(

orderDoc=>{


allOrders.push({


id:orderDoc.id,

...orderDoc.data()


});



});







displayOrders(allOrders);



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

${order.orderNumber || ""}

</td>





<td>

${order.customerName || ""}

</td>





<td>

${order.orderType || ""}

</td>





<td>

${order.tableNumber || "-"}

</td>





<td>

RM ${Number(order.totalAmount).toFixed(2)}

</td>





<td>


<select class="status-select">


<option ${order.status==="New"?"selected":""}>
New
</option>



<option ${order.status==="Accepted"?"selected":""}>
Accepted
</option>



<option ${order.status==="Preparing"?"selected":""}>
Preparing
</option>



<option ${order.status==="Ready"?"selected":""}>
Ready
</option>



<option ${order.status==="Completed"?"selected":""}>
Completed
</option>



<option ${order.status==="Cancelled"?"selected":""}>
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





await updateDoc(

doc(
db,
"orders",
order.id
),

{


status:

select.value



}



);







alert(
"Order Updated"
);






loadOrders();





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





let status =

button.dataset.status;







if(status==="All"){



displayOrders(allOrders);



}

else{



displayOrders(

allOrders.filter(

order=>

order.status===status

)

);



}



}

);



});









// REFRESH



document.getElementById(
"refreshBtn"
)
?.addEventListener(

"click",

()=>{


location.reload();


}

);








loadOrders();
