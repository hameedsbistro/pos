import { supabase } from "./supabase.js";


// ==========================
// ELEMENTS
// ==========================

const userName =
document.getElementById("userName");

const userRole =
document.getElementById("userRole");


const newOrderView =
document.getElementById("newOrderView");

const readyView =
document.getElementById("readyView");

const completedView =
document.getElementById("completedView");


const newOrders =
document.getElementById("newOrders");

const readyOrders =
document.getElementById("readyOrders");

const completedOrders =
document.getElementById("completedOrders");


const readyBtn =
document.getElementById("readyBtn");

const completedBtn =
document.getElementById("completedBtn");


const refreshBtn =
document.getElementById("refreshBtn");



// ==========================
// USER
// ==========================


const kitchenUser =
JSON.parse(
localStorage.getItem("kitchenUser")
);



if(!kitchenUser){

window.location.href="/kitchen-login.html";

}



userName.innerText =
kitchenUser.name || kitchenUser.email;


userRole.innerText =
kitchenUser.role;







// ==========================
// DEFAULT VIEW
// ==========================


function showNewOrders(){


newOrderView.classList.remove("hidden");

readyView.classList.add("hidden");

completedView.classList.add("hidden");


}



function showReadyOrders(){


newOrderView.classList.add("hidden");

readyView.classList.remove("hidden");

completedView.classList.add("hidden");


loadReadyOrders();


}



function showCompletedOrders(){


newOrderView.classList.add("hidden");

readyView.classList.add("hidden");

completedView.classList.remove("hidden");


loadCompletedOrders();


}








// ==========================
// LOAD NEW ORDERS
// ==========================


async function loadNewOrders(){


const {data,error}=

await supabase

.from("orders")

.select("*")

.eq("status","new")

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



renderOrders(
data,
newOrders
);


}








// ==========================
// READY ORDERS
// ==========================


async function loadReadyOrders(){


const {data,error}=

await supabase

.from("orders")

.select("*")

.eq("status","ready")

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


renderOrders(
data,
readyOrders
);


}








// ==========================
// COMPLETED
// ==========================


async function loadCompletedOrders(){


const {data,error}=

await supabase

.from("orders")

.select("*")

.eq("status","completed")

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



renderOrders(
data,
completedOrders
);


}









// ==========================
// UPDATE STATUS
// ==========================


async function updateStatus(
id,
status
){


const {error}=

await supabase

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



loadNewOrders();

loadReadyOrders();

loadCompletedOrders();


}








// ==========================
// ORDER CARD
// ==========================


function renderOrders(
orders,
container
){


container.innerHTML="";



if(!orders || orders.length===0){


container.innerHTML=

`
<h3>
No Orders
</h3>
`;


return;

}



orders.forEach(order=>{


const card =
document.createElement("div");


card.className="order-card";



let itemHTML="";



if(
Array.isArray(order.items)
){


order.items.forEach(item=>{


itemHTML +=

`
<p>
${item.name} × ${item.qty}
</p>
`;



});


}





card.innerHTML=

`

<h3>
Order #${order.id}
</h3>


<p>
Table:
${order.table_no || "-"}
</p>


<hr>


${itemHTML}


<p>
Status:
<b>${order.status}</b>
</p>


${
order.status==="new"

?

`

<button
class="prepare-btn">

Preparing

</button>

`

:""

}




${
order.status==="preparing"

?

`

<button
class="ready-btn">

Ready

</button>

`

:""

}



`;





const prepare =
card.querySelector(".prepare-btn");


if(prepare){

prepare.onclick=()=>{

updateStatus(
order.id,
"preparing"
);

};

}



const ready =
card.querySelector(".ready-btn");


if(ready){

ready.onclick=()=>{

updateStatus(
order.id,
"ready"
);

};

}



container.appendChild(card);


});


}









// ==========================
// BUTTONS
// ==========================


readyBtn.onclick =
showReadyOrders;


completedBtn.onclick =
showCompletedOrders;


refreshBtn.onclick =
loadNewOrders;







// ==========================
// REALTIME
// ==========================


supabase

.channel(
"kitchen-live-orders"
)

.on(

"postgres_changes",

{

event:"*",

schema:"public",

table:"orders"

},

()=>{


loadNewOrders();


}

)

.subscribe();







// START

showNewOrders();

loadNewOrders();
import { supabase } from "./supabase.js";


// ===============================
// CHECK KITCHEN AUTH
// ===============================


async function checkKitchenAuth(){


const {
data:{
session
}

}=

await supabase.auth.getSession();



if(!session){


localStorage.removeItem(
"kitchenUser"
);


window.location.href=
"/kitchen-login.html";


return;


}





const email =
session.user.email;



const {
data:user,
error
}=

await supabase

.from("users")

.select("*")

.eq(
"email",
email
)

.single();






if(error || !user){


await supabase.auth.signOut();


window.location.href=
"/kitchen-login.html";


return;


}





// ONLY ADMIN + COOK


if(

user.role !== "admin"

&&

user.role !== "cook"

){


await supabase.auth.signOut();


window.location.href=
"/kitchen-login.html";


return;


}






// SAVE USER


localStorage.setItem(

"kitchenUser",

JSON.stringify(user)

);



}





// RUN

checkKitchenAuth();







// ===============================
// LOGOUT
// ===============================


const logoutBtn =
document.getElementById("logoutBtn");



logoutBtn?.addEventListener(

"click",

async()=>{


await supabase.auth.signOut();


localStorage.removeItem(
"kitchenUser"
);



window.location.href=
"/kitchen-login.html";



}

);
