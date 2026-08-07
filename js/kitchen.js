import { supabase } from "./supabase.js";


// ===============================
// ELEMENTS
// ===============================

const userNameEl = document.getElementById("userName");
const userRoleEl = document.getElementById("userRole");

const sectionSelect = document.getElementById("sectionSelect");

const newOrdersBox = document.getElementById("newOrders");

const readyBtn = document.getElementById("readyBtn");
const completedBtn = document.getElementById("completedBtn");

const newOrderView = document.getElementById("newOrderView");
const readyView = document.getElementById("readyView");
const completedView = document.getElementById("completedView");

const refreshBtn = document.getElementById("refreshBtn");



// ===============================
// CURRENT USER
// ===============================


let kitchenUser =
JSON.parse(
localStorage.getItem("kitchenUser")
);



if(!kitchenUser){

window.location.href="/kitchen-login.html";

}



// HEADER USER

if(userNameEl){

userNameEl.innerText =
kitchenUser.name || kitchenUser.email;

}


if(userRoleEl){

userRoleEl.innerText =
kitchenUser.role;

}




// ===============================
// LOAD SECTIONS
// ===============================


async function loadSections(){


const {data,error}=

await supabase

.from("kitchen_sections")

.select("*")

.eq("status","active");



if(error){

console.log(error);

return;

}



sectionSelect.innerHTML =
`
<option value="">
Select Section
</option>
`;



data.forEach(section=>{


let option =
document.createElement("option");


option.value =
section.id;


option.textContent =
section.name;



sectionSelect.appendChild(option);



});


}





// ===============================
// LOAD NEW ORDERS
// ===============================


async function loadNewOrders(){



let query =

supabase

.from("orders")

.select("*")

.eq("status","new")

.order("created_at",
{
ascending:false
});




const {data,error}=

await query;



if(error){

console.log(error);

return;

}



displayOrders(
data,
newOrdersBox
);



}







// ===============================
// DISPLAY BASIC
// (Card Part 2)
// ===============================


function displayOrders(
orders,
container
){


container.innerHTML="";


if(!orders || orders.length===0){


container.innerHTML=
`
<h3 style="text-align:center">
No Orders
</h3>
`;


return;

}




orders.forEach(order=>{


let card =
document.createElement("div");


card.className =
"order-card";



card.innerHTML=
`

<h3>
Order #${order.id}
</h3>


<p>
Table: ${order.table_no || "-"}
</p>


<p>
Status:
${order.status}
</p>


`;



container.appendChild(card);



});



}







// ===============================
// REALTIME ORDER LISTENER
// ===============================



supabase

.channel("kitchen-orders")

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"orders"

},

(payload)=>{


console.log(
"New Update",
payload
);


loadNewOrders();



}

)

.subscribe();









// ===============================
// BUTTONS
// ===============================



refreshBtn?.addEventListener(
"click",
()=>{


loadNewOrders();


});





readyBtn?.addEventListener(
"click",
()=>{


newOrderView.style.display="none";

readyView.style.display="block";

completedView.style.display="none";


});






completedBtn?.addEventListener(
"click",
()=>{


newOrderView.style.display="none";

readyView.style.display="none";

completedView.style.display="block";


});







// START

loadSections();

loadNewOrders();
// ===============================
// LOAD READY ORDERS
// ===============================

async function loadReadyOrders(){


const {data,error}=

await supabase

.from("orders")

.select("*")

.eq("status","ready")

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



displayOrders(
data,
document.getElementById("readyOrders")
);



}





// ===============================
// LOAD COMPLETED ORDERS
// ===============================


async function loadCompletedOrders(){


const {data,error}=

await supabase

.from("orders")

.select("*")

.eq("status","completed")

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



displayOrders(
data,
document.getElementById("completedOrders")
);



}








// ===============================
// UPDATE ORDER STATUS
// ===============================


async function updateOrderStatus(
orderId,
status
){


const {error}=

await supabase

.from("orders")

.update({

status:status

})

.eq(
"id",
orderId
);



if(error){

console.log(error);

return;

}



loadNewOrders();

loadReadyOrders();

loadCompletedOrders();



}








// ===============================
// UPDATED ORDER CARD
// ===============================


function displayOrders(
orders,
container
){


container.innerHTML="";



if(!orders || orders.length===0){


container.innerHTML=

`
<h3 style="text-align:center">
No Orders
</h3>
`;


return;

}




orders.forEach(order=>{



let card =
document.createElement("div");


card.className="order-card";



let itemsHTML="";



if(order.items){


order.items.forEach(item=>{


itemsHTML +=

`
<p>
${item.name} × ${item.qty}
</p>
`;


});


}





card.innerHTML=

`

<h3>
Order #${order.id}
</h3>


<p>
Table:
${order.table_no || "-"}
</p>


<hr>


${itemsHTML}



<p>
Status:
<b>${order.status}</b>
</p>



<div>


${
order.status==="new"

?

`
<button 
class="prepare-btn"
onclick="updateOrderStatus('${order.id}','preparing')">

Preparing

</button>
`

:

""

}



${
order.status==="preparing"

?

`
<button
class="ready-btn"
onclick="updateOrderStatus('${order.id}','ready')">

Ready

</button>
`

:

""

}



</div>


`;



container.appendChild(card);



});


}







// ===============================
// BUTTON VIEW UPDATE
// ===============================



readyBtn?.addEventListener(
"click",
()=>{


newOrderView.style.display="none";

readyView.style.display="block";

completedView.style.display="none";


loadReadyOrders();


});






completedBtn?.addEventListener(
"click",
()=>{


newOrderView.style.display="none";

readyView.style.display="none";

completedView.style.display="block";


loadCompletedOrders();


});





// GLOBAL FUNCTION FOR BUTTON

window.updateOrderStatus =
updateOrderStatus;
