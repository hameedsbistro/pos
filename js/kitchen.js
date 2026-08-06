import { supabase } from "./supabase.js";



const sectionSelect =
document.getElementById("sectionSelect");

const newOrders =
document.getElementById("newOrders");

const readyOrders =
document.getElementById("readyOrders");

const completedOrders =
document.getElementById("completedOrders");

const readyView =
document.getElementById("readyView");

const completedView =
document.getElementById("completedView");



let selectedCategories = [];






// LOAD SECTION


async function loadSections(){


const {data,error}=

await supabase

.from("kitchen_sections")

.select("*")

.eq(
"status",
"active"
)

.order(
"section_name"
);




if(error){

console.log(error);

return;

}



sectionSelect.innerHTML=`

<option value="">
Select Section
</option>

`;



data.forEach(section=>{


sectionSelect.innerHTML +=`

<option value="${section.id}">
${section.section_name}
</option>

`;

});


}









// SECTION CHANGE


sectionSelect
.addEventListener(

"change",

async()=>{


let id =
sectionSelect.value;



if(!id){

selectedCategories=[];

loadOrders();

return;

}




const {data}=

await supabase

.from("kitchen_section_categories")

.select("category")

.eq(

"section_id",

id

);




selectedCategories =

data.map(

x=>x.category

);



loadOrders();


}

);









// LOAD ORDERS


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





if(error){

console.log(error);

return;

}





data.forEach(item=>{



let order=item.orders;



if(!order)
return;





// CATEGORY FILTER


if(

selectedCategories.length &&

!selectedCategories.includes(

item.category

)

)

return;







createOrderCard(

item,

order

);



});



}









function createOrderCard(item,order){



const card=document.createElement("div");

card.className="order-card";



card.innerHTML=`

<h3>
Order #${order.order_number}
</h3>


<p>
${item.item_name}
</p>


<p>
Qty: ${item.quantity}
</p>


<p>
${item.category}
</p>



<button class="prepare">

Preparing

</button>



<button class="ready">

Ready

</button>


`;







card
.querySelector(".prepare")
.onclick=async()=>{


await updateStatus(

order.id,

"Preparing"

);


};








card
.querySelector(".ready")
.onclick=async()=>{


await updateStatus(

order.id,

"Ready"

);


};








if(order.status==="New")

newOrders.appendChild(card);



else if(order.status==="Ready")

readyOrders.appendChild(card);



else if(order.status==="Completed")

completedOrders.appendChild(card);





}









// UPDATE STATUS


async function updateStatus(id,status){


await supabase

.from("orders")

.update({

status:status

})

.eq(

"id",

id

);


loadOrders();


}









// READY BUTTON


document

.getElementById("readyBtn")

?.addEventListener(

"click",

()=>{


readyView.style.display="block";

completedView.style.display="none";


}

);









// COMPLETED BUTTON


document

.getElementById("completedBtn")

?.addEventListener(

"click",

()=>{


completedView.style.display="block";

readyView.style.display="none";


}

);









// REFRESH


document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


loadOrders();


});









setInterval(

loadOrders,

5000

);



loadSections();

loadOrders();
