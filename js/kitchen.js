import { supabase } from "./supabase.js";


// USER

const user =
JSON.parse(
localStorage.getItem("kitchenUser")
);


if(!user){

window.location.href="/kitchen-login.html";

}



// ELEMENTS

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



let currentStatus = "New";

let currentSection = "";





// =========================
// LOAD KITCHEN SECTIONS
// =========================


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



sectionSelect.innerHTML =

`
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





// =========================
// LOAD ORDERS
// =========================


async function loadOrders(){



let query =

supabase

.from("orders")

.select(`

*,

order_items(

id,

itemName,

quantity,

item_note,

item_id

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





const {data,error}=

await query;



if(error){

console.log(error);

return;

}





if(currentSection){


data = await filterByKitchen(
data
);


}





displayOrders(data);



}





// =========================
// FILTER BY SECTION
// =========================


async function filterByKitchen(orders){



const {data:mappings}=

await supabase

.from("kitchen_mapping")

.select("*")

.eq(
"section",
currentSection
);




if(!mappings)
return [];




const categories =

mappings.map(
m=>m.category
);





const result=[];





orders.forEach(order=>{


let keep=false;



order.order_items.forEach(item=>{


if(categories.includes(item.category)){

keep=true;

}


});




if(keep){

result.push(order);

}



});




return result;



}





// =========================
// DISPLAY ORDERS
// =========================


function displayOrders(orders){



orderContainer.innerHTML="";



if(!orders.length){


orderContainer.innerHTML=

`
<h2>
No Orders
</h2>
`;

return;

}





orders.forEach(order=>{



let items="";



order.order_items.forEach(item=>{



items +=

`

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



card.innerHTML =


`

<h3>
Order No: ${order.orderNumber}
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


${items}



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






// =========================
// BUTTONS
// =========================


readyBtn.onclick=()=>{


currentStatus="Ready";

orderTitle.innerText="READY";

loadOrders();


};





completedBtn.onclick=()=>{


currentStatus="Completed";

orderTitle.innerText="COMPLETED";

loadOrders();


};





refreshBtn.onclick=()=>{


currentStatus="New";

orderTitle.innerText="NEW ORDERS";

loadOrders();


};






sectionSelect.onchange=(e)=>{


currentSection =
e.target.value;


loadOrders();



};







// REALTIME


supabase

.channel("kitchen-live")

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
