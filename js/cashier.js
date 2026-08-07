import { supabase } from "./supabase.js";



const user =
JSON.parse(
localStorage.getItem("user")
);



if(!user){

window.location.href="login.html";

}







document.getElementById("userName").innerText =
user.name || "---";


document.getElementById("userRole").innerText =
user.role || "cashier";






const orderContainer =
document.getElementById(
"orderContainer"
);






let orders=[];

let selectedOrder=null;









// LOAD ORDERS


async function loadOrders(){



const {

data,

error

}=await supabase

.from("orders")

.select("*")

.in(
"status",
[
"New",
"Accepted",
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

return;

}






orders=data;


showOrders();



}









// SHOW ORDERS


function showOrders(){



orderContainer.innerHTML="";






orders.forEach(order=>{



let total =
Number(
order.total || 0
);







orderContainer.innerHTML += `



<div class="order-card ${order.status}">



<h3>

Table:

${order.table_number || "Take Away"}

</h3>



<p>

Status:

${order.status}

</p>




<p>

Amount:

RM ${total.toFixed(2)}

</p>





<button onclick="openOrder('${order.id}')">

View

</button>




${
order.status==="New"

?

`

<button onclick="acceptOrder('${order.id}')">

Accept

</button>

`

:

""

}



</div>



`;



});





}









// OPEN ORDER


window.openOrder=function(id){



selectedOrder =
orders.find(
x=>x.id===id
);



localStorage.setItem(
"paymentOrder",
id
);





document.getElementById(
"selectedOrder"
).innerHTML = `



<h3>

Table:

${selectedOrder.table_number}

</h3>


<p>

Status:

${selectedOrder.status}

</p>



`;





document.getElementById(
"orderModal"
)
.style.display="flex";



}









// ACCEPT ORDER


window.acceptOrder=async function(id){



await supabase

.from("orders")

.update({

status:"Accepted"

})

.eq(
"id",
id
);





loadOrders();



}









// PAYMENT BUTTON


document.getElementById(
"paymentBtn"
)

.onclick=()=>{


if(!selectedOrder){


alert(
"Select Order First"
);


return;


}




localStorage.setItem(
"paymentOrder",
selectedOrder.id
);



window.location.href=
"payment.html";



};








// INVOICE BUTTON


document.getElementById(
"invoiceBtn"
)

.onclick=()=>{


document.getElementById(
"invoiceModal"
)

.style.display="flex";



};









// CLOSE MODAL


document.getElementById(
"closeModalBtn"
)

.onclick=()=>{


document.getElementById(
"orderModal"
)

.style.display="none";


};








document.getElementById(
"closeInvoiceBtn"
)

.onclick=()=>{


document.getElementById(
"invoiceModal"
)

.style.display="none";


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
"login.html";


};









// REALTIME


supabase

.channel(
"orders-channel"
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









loadOrders();
