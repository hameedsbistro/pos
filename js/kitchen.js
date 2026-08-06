import { supabase } from "./supabase.js";



const sectionSelect =
document.getElementById("sectionSelect");


const newOrders =
document.getElementById("newOrders");


const preparingOrders =
document.getElementById("preparingOrders");


const readyOrders =
document.getElementById("readyOrders");


const completedOrders =
document.getElementById("completedOrders");




let selectedCategories = [];







// LOAD KITCHEN SECTIONS


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





sectionSelect.innerHTML =

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


sectionSelect.onchange = async()=>{


let sectionId =
sectionSelect.value;




if(!sectionId){

selectedCategories=[];

loadOrders();

return;

}





const {data,error}=

await supabase

.from("kitchen_section_categories")

.select("category")

.eq(

"section_id",

sectionId

);






if(error){

console.log(error);

return;

}





selectedCategories =

data.map(

item=>item.category

);




loadOrders();



};









// LOAD ORDERS


async function loadOrders(){



newOrders.innerHTML="";

preparingOrders.innerHTML="";

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





// CATEGORY FILTER


if(

selectedCategories.length &&

!selectedCategories.includes(

item.category

)

){

return;

}







let order =
item.orders;





if(!order)
return;






createCard(

item,

order

);



});




}









// CREATE CARD


function createCard(item,order){



let card=document.createElement("div");

card.className="kitchen-card";





card.innerHTML=

`

<h3>

${order.order_number}

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





<button>

${getNextStatus(order.status)}

</button>


`;







card.querySelector("button")

.onclick=()=>{


updateStatus(

order.id,

getNextStatus(order.status)

);


};








if(order.status==="New")

newOrders.appendChild(card);



else if(order.status==="Preparing")

preparingOrders.appendChild(card);



else if(order.status==="Ready")

readyOrders.appendChild(card);



else

completedOrders.appendChild(card);



}









function getNextStatus(status){


if(status==="New")

return "Preparing";



if(status==="Preparing")

return "Ready";



if(status==="Ready")

return "Completed";



return "Completed";


}









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
