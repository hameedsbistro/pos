import { supabase } from "./supabase.js";


// ===============================
// ELEMENTS
// ===============================

const userName =
document.getElementById("userName");

const userRole =
document.getElementById("userRole");


const newOrders =
document.getElementById("newOrders");

const readyOrders =
document.getElementById("readyOrders");

const completedOrders =
document.getElementById("completedOrders");


const newOrderView =
document.getElementById("newOrderView");

const readyView =
document.getElementById("readyView");

const completedView =
document.getElementById("completedView");


const readyBtn =
document.getElementById("readyBtn");

const completedBtn =
document.getElementById("completedBtn");

const refreshBtn =
document.getElementById("refreshBtn");



// ===============================
// USER
// ===============================

const kitchenUser =
JSON.parse(
localStorage.getItem("kitchenUser")
);


if(!kitchenUser){

window.location.href="/kitchen-login.html";

}


userName.innerText =
kitchenUser.name || kitchenUser.email;


userRole.innerText =
kitchenUser.role;






// ===============================
// VIEW CONTROL
// ===============================


function showNew(){

newOrderView.classList.remove("hidden");

readyView.classList.add("hidden");

completedView.classList.add("hidden");

loadOrders("New",newOrders);

}



function showReady(){

newOrderView.classList.add("hidden");

readyView.classList.remove("hidden");

completedView.classList.add("hidden");

loadOrders("Ready",readyOrders);

}



function showCompleted(){

newOrderView.classList.add("hidden");

readyView.classList.add("hidden");

completedView.classList.remove("hidden");

loadOrders("Completed",completedOrders);

}







// ===============================
// LOAD ORDERS
// ===============================


async function loadOrders(status,container){


const {

data,
error

}=

await supabase

.from("orders")

.select(`

*

,

order_items (

id,

"itemName",

quantity,

price,

total,

item_note

)

`)

.eq(
"status",
status
)

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




renderOrders(
data,
container
);



}








// ===============================
// RENDER ORDER CARD
// ===============================


function renderOrders(
orders,
container
){


container.innerHTML="";



if(!orders.length){


container.innerHTML=

`
<h3>
No Orders
</h3>
`;

return;

}




orders.forEach(order=>{


let items="";



order.order_items?.forEach(item=>{


items +=

`

<div class="order-item">

<b>
${item.quantity} × ${item.itemName}
</b>


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






const card =
document.createElement("div");


card.className =
"order-card";




card.innerHTML=

`

<div class="order-meta">

Order No:
<b>
${order.orderNumber}
</b>

</div>


<div class="order-meta">

Table:
<b>
${order.tableNumber || "-"}

</b>

</div>



<div class="order-meta">

Ordered By:

<b>

${

order.ordered_by_type === "Customer"

?

"Customer"

:

order.ordered_by_name || "-"

}

</b>

</div>



<hr>


<h3>
Items
</h3>


${items}



<hr>


<div class="order-meta">

Date:

${

new Date(order.created_at)

.toLocaleDateString()

}

</div>



<div class="order-meta">

Time:

${

new Date(order.created_at)

.toLocaleTimeString()

}

</div>


`;




container.appendChild(card);



});



}







// ===============================
// STATUS UPDATE
// ===============================


async function updateStatus(id,status){



const {error}=

await supabase

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

}



}








// ===============================
// BUTTONS
// ===============================


readyBtn.onclick =
showReady;


completedBtn.onclick =
showCompleted;



refreshBtn.onclick =
showNew;





// ===============================
// REALTIME
// ===============================


supabase

.channel("kitchen-orders-live")

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"orders"

},

()=>{


loadOrders(
"New",
newOrders
);


}

)

.subscribe();





// START

showNew();
