import { supabase } from "./supabase.js";


const orderContainer =
document.getElementById("orderContainer");


const orderTitle =
document.getElementById("orderTitle");



async function loadOrders(){


try{


const {data,error}=await supabase

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

.eq("status","New");





if(error){

orderContainer.innerHTML=`

<div class="order-card">

<h2>
Database Error
</h2>

<p>
${error.message}
</p>

</div>

`;

return;

}





if(!data || data.length===0){


orderContainer.innerHTML=`

<div class="order-card">

<h2>
No New Orders Found
</h2>

</div>

`;

return;


}






orderContainer.innerHTML="";





data.forEach(order=>{



let items="";



if(order.order_items){


order.order_items.forEach(item=>{


items += `

<div class="item-row">

${item.quantity} × ${item."itemName"}


<div class="item-note">

${item.item_note || ""}

</div>


</div>

`;



});


}







orderContainer.innerHTML += `


<div class="order-card">


<h3>

Order No: ${order.orderNumber}

</h3>



<div class="order-info">

Table:
${order.tableNumber || "-"}

</div>



<div class="order-info">

Ordered By:

${order.ordered_by_name || order.ordered_by_type}

</div>



<hr>


${items}



<div class="order-time">

${new Date(order.created_at)
.toLocaleString()}

</div>



</div>


`;



});




}

catch(err){


orderContainer.innerHTML=`

<div class="order-card">

<h2>
JavaScript Error
</h2>

<p>
${err.message}
</p>

</div>

`;


}



}




orderTitle.innerText="NEW ORDERS";


loadOrders();




// LIVE UPDATE


supabase

.channel("debug-kitchen")

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
