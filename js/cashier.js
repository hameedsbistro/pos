import { supabase } from "./supabase.js";


// USER CHECK

const user = JSON.parse(localStorage.getItem("user"));


if(!user){

    window.location.href="login.html";

}


if(
    user.role !== "admin" &&
    user.role !== "manager" &&
    user.role !== "cashier"
){

    alert("Access Denied");

    window.location.href="login.html";

}



document.getElementById("userName").innerText =
user.name || "---";


document.getElementById("userRole").innerText =
user.role || "---";





let currentOrders=[];

let selectedOrder=null;





// LOAD CURRENT ORDERS

async function loadOrders(){


const {
data,
error
}=await supabase

.from("orders")

.select("*")

.order("created_at",{ascending:false});




if(error){

console.log(error);

return;

}




currentOrders=data || [];



showOrders();


}









// SHOW ORDERS

function showOrders(){


const box=document.getElementById(
"orderContainer"
);



box.innerHTML="";





currentOrders.forEach(order=>{



if(
order.status==="Completed" ||
order.payment_status==="Paid"
){

return;

}





let div=document.createElement("div");


div.className="order-card";



div.innerHTML=`


<h3>

Order #${order.id.slice(0,6)}

</h3>


<p>

Table:

${order.table_number || "Take Away"}

</p>


<p>

Status:

${order.status}

</p>



<button class="open-btn">

Open

</button>


`;





div.querySelector(".open-btn")

.onclick=()=>{


openOrder(order);


};



box.appendChild(div);



});



}









// OPEN ORDER

function openOrder(order){


selectedOrder=order;



document.getElementById(
"orderModal"
).style.display="block";





document.getElementById(
"selectedOrder"
).innerHTML=`



<h3>
Order Details
</h3>


<p>
Order No:
${order.id}
</p>


<p>
Table:
${order.table_number}
</p>



<hr>



${

(order.order_items || [])

.map(item=>`


<p>

${item.item_name}

x

${item.quantity}

</p>


`)

.join("")

}



`;





}











// CLOSE ORDER


document.getElementById(
"closeModalBtn"
)

.onclick=()=>{


document.getElementById(
"orderModal"
).style.display="none";


};











// ADD ITEM


document.getElementById(
"addItemBtn"
)

.onclick=()=>{


alert(
"Menu will open for adding items"
);


// next step connect menu


};











// SEND ORDER


document.getElementById(
"sendOrderBtn"
)

.onclick=async()=>{



if(!selectedOrder)
return;




await supabase

.from("orders")

.update({

status:"Accepted"

})

.eq(
"id",
selectedOrder.id
);




alert(
"Order Sent"
);



document.getElementById(
"orderModal"
).style.display="none";



loadOrders();



};









// PAYMENT BUTTON


document.getElementById(
"paymentBtn"
)

.onclick=()=>{


document.getElementById(
"paymentModal"
).style.display="block";



loadPaymentTables();



};









// LOAD TABLES PAYMENT

function loadPaymentTables(){


const select=
document.getElementById(
"paymentTable"
);



select.innerHTML=`

<option>

Select Table

</option>

`;



currentOrders.forEach(order=>{


if(order.table_number){



select.innerHTML +=`

<option value="${order.id}">

${order.table_number}

</option>


`;



}



});



}









// OPEN PAYMENT


document.getElementById(
"openPaymentBtn"
)

.onclick=()=>{


let id=
document.getElementById(
"paymentTable"
).value;



if(!id){

alert(
"Select Table"
);

return;

}




localStorage.setItem(
"paymentOrder",
id
);



window.location.href=
"payment.html";



};











// INVOICE LIST


document.getElementById(
"invoiceBtn"
)

.onclick=async()=>{



document.getElementById(
"invoiceModal"
).style.display="block";



const {
data
}=await supabase

.from("orders")

.select("*")

.eq(
"payment_status",
"Paid"
);



const box=
document.getElementById(
"invoiceList"
);



box.innerHTML="";



(data || []).forEach(order=>{


box.innerHTML +=`


<div class="invoice-item">


Invoice:

${order.id}



<br>


Amount:

RM ${order.total || "0.00"}



</div>


`;



});



};








document.getElementById(
"closeInvoiceBtn"
)

.onclick=()=>{


document.getElementById(
"invoiceModal"
).style.display="none";


};









// NEW ORDER


document.getElementById(
"newOrderBtn"
)

.onclick=()=>{


window.location.href="menu.html";


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


localStorage.removeItem("user");


window.location.href="login.html";


};







loadOrders();
