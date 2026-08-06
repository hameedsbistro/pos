// pos/js/orders.js


import { supabase } from "./supabase.js";



const ordersTable =
document.getElementById("ordersTable");



let allOrders = [];







// LOAD ORDERS

async function loadOrders(){


ordersTable.innerHTML="";



const {data,error}=

await supabase

.from("orders")

.select("*")

.order(
"created_at",
{
ascending:false
}
);




if(error){

console.log(error);

return;

}



allOrders = data || [];



displayOrders(allOrders);



}









// DISPLAY ORDERS


function displayOrders(orders){



ordersTable.innerHTML="";




orders.forEach(order=>{


let row =
document.createElement("tr");



row.innerHTML = `



<td>
${order.order_number || order.orderNumber || ""}
</td>



<td>
${order.customer_name || order.customerName || ""}
</td>



<td>
${order.order_type || order.orderType || ""}
</td>



<td>
${order.table_number || order.tableNumber || "-"}
</td>



<td>
RM ${Number(order.total_amount || order.totalAmount || 0).toFixed(2)}
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



row.querySelector(
".update-btn"
)

.onclick = async()=>{



await supabase

.from("orders")

.update({

status:
select.value

})

.eq(
"id",
order.id
);



alert(
"Order Updated"
);



loadOrders();



};





ordersTable.appendChild(row);



});



}









// FILTER


document.querySelectorAll(
".order-filter button"
)

.forEach(btn=>{


btn.onclick=()=>{


let status =
btn.dataset.status;



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


};



});









// REFRESH

document.getElementById(
"refreshBtn"
)?.addEventListener(
"click",
()=>{

loadOrders();

});








loadOrders();
