import { supabase } from "./supabase.js";


const orderContainer = 
document.getElementById("orderContainer");


const orderTitle =
document.getElementById("orderTitle");



async function loadOrders(){


const { data, error } = await supabase

.from("orders")

.select(`

id,
orderNumber,
tableNumber,
ordered_by_type,
ordered_by_name,
created_at,
status,

order_items(

"itemName",
quantity,
item_note

)

`)

.eq("status","New")

.order(
"created_at",
{
ascending:false
}
);





if(error){

orderContainer.innerHTML = `

<div class="order-card">

<h3>
Database Error
</h3>

<p>
${error.message}
</p>

</div>

`;

return;

}





if(!data || data.length===0){


orderContainer.innerHTML = `

<div class="order-card">

<h3>
No New Orders
</h3>

</div>

`;

return;


}





orderContainer.innerHTML="";





data.forEach(order=>{


let itemsHTML="";



order.order_items?.forEach(item=>{


itemsHTML += `

<div class="item-row">

<strong>
${item.quantity} × ${item."itemName"}
</strong>


${
item.item_note
?
`
<div class="item-note">

Note:
${item.item_note}

</div>
`
:
""
}


</div>

`;

});





orderContainer.innerHTML += `


<div class="order-card">


<h2>

Order No:
${order.orderNumber}

</h2>



<div>

Table:
${order.tableNumber || "-"}

</div>



<div>

Ordered By:

${
order.ordered_by_name
?
order.ordered_by_name
:
order.ordered_by_type
}

</div>


<hr>


${itemsHTML}



<hr>



<div>

${new Date(order.created_at)
.toLocaleString()}

</div>


</div>


`;



});


}




loadOrders();




// Live New Order Update

supabase

.channel("kitchen-orders")

.on(

"postgres_changes",

{
event:"*",
schema:"public",
table:"orders"
},

()=>{

loadOrders();

}

)

.subscribe();
