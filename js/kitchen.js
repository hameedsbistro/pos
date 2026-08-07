import { supabase } from "./supabase.js";



const newOrders =
document.getElementById("newOrders");


const readyOrders =
document.getElementById("readyOrders");


const completedOrders =
document.getElementById("completedOrders");



const sectionSelect =
document.getElementById("sectionSelect");



let categories=[];




async function loadSections(){


const {data}=

await supabase

.from("kitchen_sections")

.select("*")

.eq("status","active");





sectionSelect.innerHTML=
`
<option value="">
Select Section
</option>
`;



data?.forEach(item=>{


sectionSelect.innerHTML +=

`
<option value="${item.id}">
${item.section_name}
</option>
`;

});


}








sectionSelect?.addEventListener(
"change",
async()=>{


const id=
sectionSelect.value;



const {data}=

await supabase

.from("kitchen_section_categories")

.select("category")

.eq("section_id",id);




categories =
data?.map(x=>x.category) || [];



loadOrders();


});









async function loadOrders(){


newOrders.innerHTML="";

readyOrders.innerHTML="";

completedOrders.innerHTML="";



const {data,error}=

await supabase

.from("order_items")

.select(`
*,
orders(*)
`)

.order(
"created_at",
{
ascending:false
}
);




if(error)return;




data.forEach(item=>{


if(

categories.length &&

!categories.includes(item.category)

)return;



showOrder(item,item.orders);


});



}









function showOrder(item,order){



if(!order)return;



const card=document.createElement("div");

card.className="order-card";



card.innerHTML=

`
<h3>
Order #${order.order_number}
</h3>

<p>
${item.item_name}
</p>

<p>
Qty: ${item.quantity}
</p>

<button class="prepare-btn">
Preparing
</button>

<button class="ready-btn">
Ready
</button>

`;





card.querySelector(".prepare-btn")

.onclick=()=>updateStatus(order.id,"Preparing");




card.querySelector(".ready-btn")

.onclick=()=>updateStatus(order.id,"Ready");





if(order.status==="New")

newOrders.appendChild(card);


else if(order.status==="Ready")

readyOrders.appendChild(card);


else if(order.status==="Completed")

completedOrders.appendChild(card);



}









async function updateStatus(id,status){


await supabase

.from("orders")

.update({

status

})

.eq(
"id",
id
);



loadOrders();

}








document

.getElementById("refreshBtn")

?.addEventListener(

"click",

loadOrders

);






document

.getElementById("readyBtn")

?.addEventListener(

"click",

()=>{

document.getElementById("readyView")
.style.display="block";

});







document

.getElementById("completedBtn")

?.addEventListener(

"click",

()=>{

document.getElementById("completedView")
.style.display="block";

});







loadSections();

loadOrders();


setInterval(loadOrders,5000);
