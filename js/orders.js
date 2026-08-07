// js/orders.js


import { supabase } from "./supabase.js";



let currentFilter = "All";







// LOAD ORDERS


async function loadOrders(){



let query = supabase

.from("orders")

.select("*")

.order(
"id",
{
ascending:false
}

);





if(currentFilter !== "All"){


query = query.eq(
"status",
currentFilter
);


}





const {data,error}=await query;




if(error){

console.log(error);

return;

}






const table=document.getElementById(
"ordersTable"
);



table.innerHTML="";






data.forEach(order=>{



let row=document.createElement(
"tr"
);




row.innerHTML=`

<td>

${order.order_number || order.id}

</td>


<td>

${order.customer_name || "-"}

</td>



<td>

${order.order_type || "-"}

</td>



<td>

${order.table_number || "-"}

</td>



<td>

${order.status}

</td>



<td>


<button class="viewBtn">

View

</button>



<select class="statusSelect">


<option>
New
</option>


<option>
Accepted
</option>


<option>
Preparing
</option>


<option>
Ready
</option>


<option>
Completed
</option>


</select>


<button class="updateBtn">

Update

</button>



</td>

`;








// VIEW ORDER


row.querySelector(
".viewBtn"
)
.onclick=()=>{


viewOrder(order);


};







// UPDATE STATUS


row.querySelector(
".updateBtn"
)
.onclick=async()=>{



let status = row.querySelector(
".statusSelect"
).value;





await updateStatus(

order.id,

status

);



};



table.appendChild(row);



});



}









// VIEW ITEMS


async function viewOrder(order){



const {data}=await supabase

.from("order_items")

.select("*")

.eq(

"order_id",

order.id

);






let text=

"Order #"+order.id+"\n\n";




data.forEach(item=>{


text +=

item.item_name+

" x "+

item.quantity+

"\nNote: "+

(item.item_note || "-")+

"\n\n";


});





alert(text);



}










// UPDATE STATUS


async function updateStatus(id,status){



const {error}=await supabase

.from("orders")

.update({

status:status

})

.eq(

"id",

id

);





if(error){

console.log(error);

return;

}



loadOrders();



}









// FILTER BUTTON


document.querySelectorAll(
".order-filter button"
)

.forEach(btn=>{



btn.onclick=()=>{


currentFilter = btn.dataset.status;



loadOrders();


};



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










// LIVE UPDATE


setInterval(()=>{


loadOrders();



},5000);







loadOrders();
