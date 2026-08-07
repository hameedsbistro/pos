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



let selectedCategories=[];





// LOAD SECTION


async function loadSections(){



const {

data,

error

}= await supabase

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






sectionSelect.innerHTML=

`
<option value="">
Select Section
</option>
`;






data.forEach(section=>{


sectionSelect.innerHTML +=

`
<option value="${section.id}">
${section.section_name}
</option>
`;


});


}









// SECTION CHANGE


sectionSelect.addEventListener(

"change",

async()=>{


const id =
sectionSelect.value;



if(!id){

selectedCategories=[];

loadOrders();

return;

}






const {

data,

error

}= await supabase

.from("kitchen_section_categories")

.select("category")

.eq(

"section_id",

id

);






if(error){

console.log(error);

return;

}






selectedCategories =

data.map(
x=>x.category
);



loadOrders();



});









// LOAD ORDERS


async function loadOrders(){



newOrders.innerHTML="";

readyOrders.innerHTML="";

completedOrders.innerHTML="";







const {

data,

error

}= await supabase

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



if(

selectedCategories.length &&

!selectedCategories.includes(

item.category

)

){

return;

}




const order=item.orders;




if(!order)

return;





createCard(item,order);



});



}









// CREATE CARD


function createCard(item,order){



const card=

document.createElement("div");


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


<p>
${item.category}
</p>



`;







if(order.status==="New"){



let btn=document.createElement("button");

btn.innerText="Preparing";

btn.onclick=()=>{

updateStatus(

order.id,

"Preparing"

);

};



card.appendChild(btn);



newOrders.appendChild(card);



}





else if(order.status==="Preparing"){



let btn=document.createElement("button");

btn.innerText="Ready";

btn.onclick=()=>{


updateStatus(

order.id,

"Ready"

);


};



card.appendChild(btn);



newOrders.appendChild(card);



}





else if(order.status==="Ready"){



readyOrders.appendChild(card);



}





else if(order.status==="Completed"){



completedOrders.appendChild(card);



}




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


});









// COMPLETED BUTTON


document

.getElementById("completedBtn")

?.addEventListener(

"click",

()=>{


completedView.style.display="block";


readyView.style.display="none";


});









// REFRESH


document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


loadOrders();


});








// AUTO REFRESH


setInterval(

loadOrders,

5000

);





loadSections();

loadOrders();
