// root/js/kitchen.js

import { supabase } from "./supabase.js";



let currentStatus = "Accepted";

let currentSection = "";







// ===============================
// CHECK USER
// ===============================


function checkUser(){


const user = JSON.parse(
localStorage.getItem("user")
);



if(!user){

window.location.href="../login.html";

return;

}





if(
user.role !== "cook" &&
user.role !== "admin" &&
user.role !== "manager"
){


alert("Access Denied");

window.location.href="../login.html";

return;


}





const name =
document.getElementById("userName");


const role =
document.getElementById("userRole");




if(name){

name.innerText =
user.name || "---";

}



if(role){

role.innerText =
user.role || "---";

}



}









// ===============================
// LOAD KITCHEN SECTIONS
// ===============================


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





const select =
document.getElementById(
"sectionSelect"
);





if(!select)
return;





select.innerHTML = `

<option value="">

All Stations

</option>

`;






data.forEach(section=>{


select.innerHTML += `

<option value="${section.section_name}">

${section.section_name}

</option>

`;



});







select.onchange = ()=>{


currentSection =
select.value;



loadOrders();



};



}












// ===============================
// LOAD ORDERS
// ===============================


async function loadOrders(){



const {

data,

error

}= await supabase


.from("orders")


.select(`

*,

order_items(*)

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








const container =
document.getElementById(
"orderContainer"
);





if(!container)
return;






container.innerHTML="";









data.forEach(order=>{



let items =
order.order_items || [];







// STATION FILTER


if(currentSection){


items = items.filter(item=>{


return (

item.section_name === currentSection

);


});





if(items.length===0){

return;

}



}









const card =
document.createElement(
"div"
);



card.className =
"order-card";








card.innerHTML = `


<div class="order-header">


<h2>

Order #${order.order_number || order.id}

</h2>


<p>

Table:

${order.table_number || "Take Away"}

</p>



</div>



<hr>


`;









items.forEach(item=>{


card.innerHTML += `


<div class="kitchen-item">


<h3>

${item.item_name}

</h3>



<p>

Quantity:

${item.quantity}

</p>



<p>

Note:

${item.item_note || "-"}

</p>



</div>


`;



});










// BUTTON


if(currentStatus==="Accepted"){


const btn =
document.createElement(
"button"
);



btn.innerText =
"START PREPARING";




btn.onclick = ()=>{


updateStatus(

order.id,

"Preparing"

);



};



card.appendChild(btn);



}









if(currentStatus==="Preparing"){


const btn =
document.createElement(
"button"
);



btn.innerText =
"READY";




btn.onclick = ()=>{


updateStatus(

order.id,

"Ready"

);



};



card.appendChild(btn);



}









if(currentStatus==="Ready"){


const btn =
document.createElement(
"button"
);



btn.innerText =
"COMPLETED";




btn.onclick = ()=>{


updateStatus(

order.id,

"Completed"

);



};



card.appendChild(btn);



}









container.appendChild(card);




});



}












// ===============================
// UPDATE STATUS
// ===============================


async function updateStatus(
id,
status
){



const {

error

}= await supabase


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

return;

}





loadOrders();



}












// ===============================
// STATUS BUTTONS
// ===============================


document.getElementById(
"newBtn"
)
?.addEventListener(
"click",
()=>{


currentStatus="Accepted";


loadOrders();



});






document.getElementById(
"readyBtn"
)
?.addEventListener(
"click",
()=>{


currentStatus="Ready";


loadOrders();



});







document.getElementById(
"completedBtn"
)
?.addEventListener(
"click",
()=>{


currentStatus="Completed";


loadOrders();



});












// ===============================
// REFRESH
// ===============================


document.getElementById(
"refreshBtn"
)
?.addEventListener(
"click",
()=>{


location.reload();



});












// ===============================
// LOGOUT
// ===============================


document.getElementById(
"logoutBtn"
)
?.addEventListener(
"click",
()=>{


localStorage.removeItem(
"user"
);



window.location.href="../login.html";



});











// ===============================
// LIVE UPDATE
// ===============================


setInterval(()=>{


loadOrders();


},5000);











// START


checkUser();

loadSections();

loadOrders();
