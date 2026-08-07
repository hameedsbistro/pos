import { supabase } from "./supabase.js";



const user =
JSON.parse(
localStorage.getItem("user")
);



if(!user){

window.location.href="kitchen-login.html";

}






document.getElementById("userName").innerText =
user.name || "---";


document.getElementById("userRole").innerText =
user.role || "cook";







let selectedSection="";

let currentStatus="Accepted";









// LOAD KITCHEN SECTIONS


async function loadSections(){



const {

data,

error

}=await supabase

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



data.forEach(section=>{


select.innerHTML +=`


<option value="${section.section_name}">

${section.section_name}

</option>


`;



});



}









document

.getElementById("sectionSelect")

.onchange=(e)=>{


selectedSection=e.target.value;


loadOrders();


};









// LOAD ORDERS


async function loadOrders(){



let query =
supabase

.from("orders")

.select("*")

.eq(
"status",
currentStatus
)

.order(
"created_at",
{
ascending:true
}
);






const {

data,

error

}=await query;





if(error){

console.log(error);

return;

}





showOrders(data);



}









// SHOW ORDERS


function showOrders(data){



const box =
document.getElementById(
"orderContainer"
);



box.innerHTML="";





data.forEach(order=>{



let items =
order.order_items || [];






// station filter


if(selectedSection){


items = items.filter(item=>

item.section === selectedSection

);



if(items.length===0)
return;


}









box.innerHTML +=`


<div class="kitchen-order">


<h2>

Table:

${order.table_number}

</h2>



<p>

Order Time:

${new Date(
order.created_at
)
.toLocaleTimeString()}

</p>





<div>


${items.map(item=>`


<div class="kitchen-item">


${item.item_name}

×

${item.quantity}


</div>



`).join("")}


</div>





<button onclick="updateStatus('${order.id}','Preparing')">

Preparing

</button>





<button onclick="updateStatus('${order.id}','Ready')">

Ready

</button>





</div>



`;



});



}









// UPDATE STATUS


window.updateStatus = async function(
id,
status
){



const {

error

}=await supabase

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



};









// STATUS BUTTONS


document.getElementById(
"newBtn"
)

.onclick=()=>{


currentStatus="Accepted";

loadOrders();


};





document.getElementById(
"readyBtn"
)

.onclick=()=>{


currentStatus="Ready";

loadOrders();


};





document.getElementById(
"completedBtn"
)

.onclick=()=>{


currentStatus="Completed";

loadOrders();


};









// REFRESH


document.getElementById(
"refreshBtn"
)

.onclick=()=>{


loadOrders();


};








// LOGOUT


document.getElementById(
"logoutBtn"
)

.onclick=()=>{


localStorage.removeItem(
"user"
);


window.location.href=
"kitchen-login.html";


};









// REALTIME


supabase

.channel(
"kitchen-orders"
)

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








loadSections();

loadOrders();
