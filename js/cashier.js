// js/cashier.js


import { supabase } from "./supabase.js";



let currentOrder = null;



// USER CHECK


function checkUser(){


const user = JSON.parse(
localStorage.getItem("user")
);



if(!user){

window.location.href="login.html";

return;

}



if(

user.role !== "admin" &&

user.role !== "manager" &&

user.role !== "cashier"

){


alert("Access Denied");

window.location.href="login.html";


return;

}





document.getElementById(
"userName"
).innerText=user.name;



document.getElementById(
"userRole"
).innerText=user.role;



}








// LOAD ORDERS


async function loadOrders(){



const {data,error}=await supabase

.from("orders")

.select("*")

.order("id",{ascending:false});





if(error){

console.log(error);

return;

}





const grid=document.getElementById(
"orderGrid"
);



grid.innerHTML="";





data.forEach(order=>{



if(order.status==="Completed") return;





let div=document.createElement(
"div"
);



div.className="order-card";




if(order.status){

div.classList.add(
"order-"+order.status.toLowerCase()
);

}





div.innerHTML=`

<h3>
Order #${order.order_number || order.id}
</h3>


<p>
Table:
${order.table_number || "Take Away"}
</p>



<p>
Status:
${order.status}
</p>



<button class="acceptBtn">

Accept

</button>


`;







div.onclick=()=>{


openOrder(order);


};






let btn=div.querySelector(
".acceptBtn"
);



btn.onclick=(e)=>{


e.stopPropagation();

acceptOrder(order);


};






grid.appendChild(div);



});



}









// ACCEPT ORDER


async function acceptOrder(order){



await supabase

.from("orders")

.update({

status:"Accepted"

})

.eq(
"id",
order.id
);




alert(
"Order Accepted"
);



loadOrders();



}









// OPEN ORDER


async function openOrder(order){



currentOrder=order;



document.getElementById(
"orderPanel"
).style.display="block";



const box=document.getElementById(
"orderDetails"
);



box.innerHTML=`


<h3>
Order #${order.id}
</h3>


<p>
Table:
${order.table_number}
</p>


<hr>


`;





const {data}=await supabase

.from("order_items")

.select("*")

.eq(
"order_id",
order.id
);






data.forEach(item=>{


box.innerHTML+=`


<div class="order-item">


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



}









// CLOSE ORDER


document.getElementById(
"closeOrderBtn"
)
.onclick=()=>{


document.getElementById(
"orderPanel"
).style.display="none";


};









// SEND KITCHEN


document.getElementById(
"sendOrderBtn"
)
.onclick=async()=>{



if(!currentOrder)
return;



await supabase

.from("orders")

.update({

status:"New"

})

.eq(
"id",
currentOrder.id
);





alert(
"Sent To Kitchen"
);



};









// PAYMENT BUTTON


document.getElementById(
"paymentBtn"
)
.onclick=async()=>{



const {data}=await supabase

.from("orders")

.select("table_number,id")

.eq(
"status",
"Accepted"
);





const select=document.getElementById(
"paymentTable"
);



select.innerHTML="";



data.forEach(order=>{


select.innerHTML+=`

<option value="${order.id}">

${order.table_number}

</option>

`;



});




document.getElementById(
"paymentPanel"
).style.display="block";



};









// OPEN PAYMENT


document.getElementById(
"openPaymentBtn"
)
.onclick=()=>{



let id=

document.getElementById(
"paymentTable"
).value;



window.location.href=

"payment.html?id="+id;



};









// INVOICE LIST


document.getElementById(
"invoiceBtn"
)
.onclick=async()=>{



const {data}=await supabase

.from("invoices")

.select("*")

.order(
"id",
{
ascending:false
}
);





const box=document.getElementById(
"invoiceList"
);



box.innerHTML="";




data?.forEach(invoice=>{


box.innerHTML+=`

<div class="invoice-item">


Invoice:
${invoice.invoice_number}


<br>


Amount:
RM ${Number(invoice.amount).toFixed(2)}


</div>


`;


});





document.getElementById(
"invoicePanel"
).style.display="block";



};









document.getElementById(
"closeInvoiceBtn"
)
.onclick=()=>{


document.getElementById(
"invoicePanel"
).style.display="none";


};









// NEW ORDER


document.getElementById(
"newOrderBtn"
)
.onclick=()=>{


window.location.href="waiter.html";


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



window.location.href="login.html";


};









// AUTO LIVE CHECK


setInterval(()=>{


loadOrders();


},5000);







checkUser();

loadOrders();
