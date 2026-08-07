import { supabase } from "./supabase.js";

let currentStatus = "New";


// Elements

const orderContainer =
document.getElementById("orderContainer");

const orderTitle =
document.getElementById("orderTitle");

const readyBtn =
document.getElementById("readyBtn");

const completedBtn =
document.getElementById("completedBtn");

const refreshBtn =
document.getElementById("refreshBtn");

const sectionSelect =
document.getElementById("sectionSelect");

const backBtn =
document.getElementById("backBtn");




// Back Button

backBtn?.addEventListener("click",()=>{

    window.history.back();

});




// Load Kitchen Sections

async function loadSections(){

    const {data,error}=await supabase
    .from("kitchen_sections")
    .select("*")
    .eq("status","active");


    if(error){

        console.log(error);
        return;

    }


    sectionSelect.innerHTML=`

    <option value="">
    All Stations
    </option>

    `;


    data.forEach(section=>{


        const option =
        document.createElement("option");


        option.value =
        section.section_name;


        option.textContent =
        section.section_name;


        sectionSelect.appendChild(option);


    });


}






// Load Orders

async function loadOrders(){


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







// Display Orders

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


let items="";



order.order_items.forEach(item=>{


items += `

<div class="item-row">


${item.quantity} × ${item.itemName}



${
item.item_note

?

`
<div class="item-note">

Note: ${item.item_note}

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


card.className="order-card";



card.innerHTML=`

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

${new Date(order.created_at)
.toLocaleString()}

</div>


`;



orderContainer.appendChild(card);



});



}







// Buttons


readyBtn?.addEventListener("click",()=>{


currentStatus="Ready";

orderTitle.innerText="READY ORDERS";

loadOrders();


});





completedBtn?.addEventListener("click",()=>{


currentStatus="Completed";

orderTitle.innerText="COMPLETED ORDERS";

loadOrders();


});





refreshBtn?.addEventListener("click",()=>{


currentStatus="New";

orderTitle.innerText="NEW ORDERS";

loadOrders();


});






// Station Change

sectionSelect?.addEventListener("change",()=>{

loadOrders();

});






// Realtime

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

loadOrders();

}

)

.subscribe();







// Start

loadSections();

loadOrders();
