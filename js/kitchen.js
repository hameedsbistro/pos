// js/kitchen.js


import { supabase } from "./supabase.js";



let currentStatus="New";

let currentSection="";






// LOAD USER


function loadUser(){


const user=

JSON.parse(

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





document.getElementById(
"userName"
).innerText=user.name;



document.getElementById(
"userRole"
).innerText=user.role;


}









// LOAD SECTION


async function loadSections(){



const {data}=await supabase

.from("Kitchen Section")

.select("*")

.eq(
"status",
"active"
);





const select=

document.getElementById(
"sectionSelect"
);





data?.forEach(section=>{


select.innerHTML +=`

<option value="${section.section_name}">

${section.section_name}

</option>


`;


});





select.onchange=()=>{


currentSection=

select.value;


loadOrders();


};



}









// LOAD ORDERS


async function loadOrders(){



const {data,error}=await supabase

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

"id",

{

ascending:false

}

);







if(error){

console.log(error);

return;

}








const container=

document.getElementById(
"orderContainer"
);




container.innerHTML="";








data.forEach(order=>{



let items=order.order_items;






// SECTION FILTER


if(currentSection){



items = items.filter(item=>{


return item.section_name===currentSection;


});




if(items.length===0)
return;


}









let card=document.createElement(
"div"
);



card.className="order-card";





card.innerHTML=`

<h3>

Order #${order.order_number || order.id}

</h3>


<p>

Table:

${order.table_number || "Take Away"}

</p>



<hr>



`;







items.forEach(item=>{


card.innerHTML+=`

<div class="item">


<b>
${item.item_name}
</b>


<br>


Qty:
${item.quantity}



<br>


Note:
${item.item_note || "-"}


</div>


`;



});








let btn=document.createElement(
"button"
);



if(currentStatus==="New"){


btn.innerText="READY";


btn.onclick=()=>{


updateStatus(

order.id,

"Ready"

);


};


}

else if(currentStatus==="Ready"){


btn.innerText="COMPLETED";


btn.onclick=()=>{


updateStatus(

order.id,

"Completed"

);


};


}







card.appendChild(btn);



container.appendChild(card);



});



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









// STATUS BUTTONS


document.getElementById(
"newBtn"
)
?.onclick=()=>{


currentStatus="New";

loadOrders();


};






document.getElementById(
"readyBtn"
)
?.onclick=()=>{


currentStatus="Ready";

loadOrders();


};






document.getElementById(
"completedBtn"
)
?.onclick=()=>{


currentStatus="Completed";

loadOrders();


};










// REFRESH


document.getElementById(
"refreshBtn"
)
.onclick=()=>{


location.reload();


};









// LOGOUT


document.getElementById(
"logoutBtn"
)
.onclick=()=>{


localStorage.removeItem(
"user"
);



window.location.href="../login.html";


};








setInterval(()=>{


loadOrders();


},5000);







loadUser();

loadSections();

loadOrders();
