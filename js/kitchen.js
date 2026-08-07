import { supabase } from "./supabase.js";


// =====================
// VARIABLES
// =====================

let currentStatus = "New";
let currentSection = "";


// =====================
// ELEMENTS
// =====================

const orderContainer =
document.getElementById("orderContainer");

const orderTitle =
document.getElementById("orderTitle");

const sectionSelect =
document.getElementById("sectionSelect");

const readyBtn =
document.getElementById("readyBtn");

const completedBtn =
document.getElementById("completedBtn");

const refreshBtn =
document.getElementById("refreshBtn");

const backBtn =
document.getElementById("backBtn");




// =====================
// BACK BUTTON
// =====================

backBtn?.addEventListener("click",()=>{

    window.history.back();

});





// =====================
// LOAD SECTIONS
// =====================

async function loadSections(){


const {data,error}=

await supabase

.from("kitchen_sections")

.select("*")

.eq(
"status",
"active"
);



if(error){

console.log(error);

return;

}



sectionSelect.innerHTML = `

<option value="">
All Stations
</option>

`;



data.forEach(section=>{


let option =
document.createElement("option");


option.value =
section.section_name;


option.textContent =
section.section_name;


sectionSelect.appendChild(option);


});


}






// =====================
// LOAD ORDERS
// =====================

async function loadOrders(){



let {data,error}=

await supabase

.from("orders")

.select(`

*,

order_items(

itemName,

quantity,

item_note

)

`)

.eq(
"status",
currentStatus
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





displayOrders(data);



}







// =====================
// DISPLAY ORDERS
// =====================

function displayOrders(orders){



orderContainer.innerHTML="";



if(!orders || orders.length===0){


orderContainer.innerHTML=`

<div class="order-card">

<h3>
No Orders
</h3>

</div>

`;

return;

}





orders.forEach(order=>{



let itemsHTML="";



order.order_items?.forEach(item=>{


itemsHTML += `


<div class="item-row">


${item.quantity} × ${item.itemName}


${

item.item_note

?

`

<div class="item-note">

Note:
${item.item_note}

</div>

`

:""

}


</div>


`;


});







let card =
document.createElement("div");


card.className =
"order-card";



card.innerHTML = `


<h3>

Order No:
${order.orderNumber}

</h3>



<div class="order-info">

Table:
${order.tableNumber || "-"}

</div>



<div class="order-info">

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



<div class="order-time">

${

new Date(order.created_at)

.toLocaleString()

}

</div>


`;



orderContainer.appendChild(card);



});



}








// =====================
// BUTTONS
// =====================


readyBtn?.addEventListener(
"click",
()=>{


currentStatus="Ready";

orderTitle.innerText="READY ORDERS";

loadOrders();


});





completedBtn?.addEventListener(
"click",
()=>{


currentStatus="Completed";

orderTitle.innerText="COMPLETED ORDERS";

loadOrders();


});





refreshBtn?.addEventListener(
"click",
()=>{


currentStatus="New";

orderTitle.innerText="NEW ORDERS";

loadOrders();


});







sectionSelect?.addEventListener(
"change",
(e)=>{


currentSection =
e.target.value;


// এখন section filtering বন্ধ রাখা হয়েছে
// কারণ menu category mapping final join পরে করবো


loadOrders();


});







// =====================
// REALTIME
// =====================


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






// START


loadSections();

loadOrders();
