// pos/js/cashier.js


import { supabase } from "./supabase.js";



let currentUser = null;

let orders = [];





// CHECK LOGIN USER

async function checkUser(){


const userData =

JSON.parse(

localStorage.getItem("user")

);



if(!userData){

window.location.href="login.html";

return;

}



currentUser = userData;



document.getElementById("userName").innerText =

userData.name || userData.email;



document.getElementById("userRole").innerText =

userData.role;



// ACCESS CONTROL


if(

userData.role !== "admin" &&

userData.role !== "manager" &&

userData.role !== "cashier"

){


alert("Access Denied");


window.location.href="index.html";


return;


}



loadOrders();



}








// LOAD CURRENT ORDERS


async function loadOrders(){


const container =

document.getElementById(

"orderContainer"

);


container.innerHTML="Loading...";





const {data,error}=

await supabase

.from("orders")

.select("*")

.in(

"status",

[

"New",

"Accepted",

"Preparing",

"Ready"

]

)

.order(

"created_at",

{

ascending:false

}

);





if(error){


console.log(error);

container.innerHTML="Error Loading Orders";

return;


}




orders=data || [];



showOrders();


}








// SHOW ORDER GRID


function showOrders(){



const container =

document.getElementById(

"orderContainer"

);



container.innerHTML="";





if(orders.length===0){


container.innerHTML=

`

<h3>
No Current Orders
</h3>

`;


return;


}







orders.forEach(order=>{


let card=document.createElement("div");


card.className="order-card";



card.innerHTML=

`

<h3>

Order #${order.order_number}

</h3>


<p>

Table:

${order.table_number || "Take Away"}

</p>



<p>

Status:

${order.status}

</p>



<button>

OPEN

</button>

`;





card.querySelector("button")

.onclick=()=>{


openOrder(order);


};



container.appendChild(card);



});




}









// OPEN ORDER


function openOrder(order){



const modal =

document.getElementById(

"orderModal"

);



const box =

document.getElementById(

"selectedOrder"

);





box.innerHTML=

`

<h3>

Order #${order.order_number}

</h3>


<p>

Table:

${order.table_number}

</p>


<p>

Status:

${order.status}

</p>


<hr>


<h3>

Items

</h3>


<div>

Loading Items...

</div>


`;




modal.style.display="flex";



}









// CLOSE ORDER


document

.getElementById("closeModalBtn")

.onclick=()=>{


document

.getElementById("orderModal")

.style.display="none";


};









// REFRESH


document

.getElementById("refreshBtn")

.onclick=()=>{


location.reload();


};









// LOGOUT


document

.getElementById("logoutBtn")

.onclick=()=>{


localStorage.removeItem("user");


window.location.href="login.html";


};









// PAYMENT BUTTON


document

.getElementById("paymentBtn")

.onclick=()=>{


document

.getElementById("paymentModal")

.style.display="flex";


};









// OPEN PAYMENT


document

.getElementById("openPaymentBtn")

.onclick=()=>{


let table =

document.getElementById(

"paymentTable"

).value;



if(!table){


alert("Select Table");


return;


}




window.location.href=

"payment.html?table="+table;



};









// INVOICE


document

.getElementById("invoiceBtn")

.onclick=()=>{


document

.getElementById("invoiceModal")

.style.display="flex";



loadInvoices();



};









async function loadInvoices(){



const box=

document.getElementById(

"invoiceList"

);



box.innerHTML="Loading...";



const {data}=

await supabase

.from("invoices")

.select("*")

.order(

"created_at",

{

ascending:false

}

);





box.innerHTML="";



(data || []).forEach(inv=>{


box.innerHTML +=

`

<div class="invoice-item">


Invoice:

${inv.invoice_number}


<br>


Amount:

RM ${Number(inv.total).toFixed(2)}


</div>


`;



});


}








document

.getElementById("closeInvoiceBtn")

.onclick=()=>{


document

.getElementById("invoiceModal")

.style.display="none";


};








// NEW ORDER


document

.getElementById("newOrderBtn")

.onclick=()=>{


window.location.href=

"waiter.html";


};








// START


checkUser();
