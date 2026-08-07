// js/cashier-invoice.js


import { supabase } from "./supabase.js";

import { requireRole, logout } from "./auth.js";




let user = null;





// ===============================
// START
// ===============================


async function start(){



user = await requireRole(

[
"cashier",
"manager",
"admin"
]

);




if(!user){

return;

}





loadInvoices();



}









// ===============================
// LOAD INVOICES
// ===============================


async function loadInvoices(){



const {

data,

error

}=await supabase

.from("orders")

.select(`

*,

order_items(*)

`)

.eq(

"payment_status",

"Paid"

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




showInvoices(data);



}









// ===============================
// SHOW INVOICES
// ===============================


function showInvoices(list){



const box =

document.getElementById(

"invoiceList"

);





if(!box){

return;

}





box.innerHTML="";





list.forEach(order=>{





box.innerHTML += `


<div class="invoice-card">


<h3>

Invoice:

${order.order_number}

</h3>



<p>

Date:

${new Date(order.created_at)
.toLocaleString()}

</p>



<p>

Table:

${order.table_number || "-"}

</p>




<div>

${order.order_items.map(item=>`

<p>

${item.item_name}

×

${item.quantity}

&nbsp;

RM ${(item.price * item.quantity)
.toFixed(2)}

</p>

`).join("")}

</div>





<h3>

Total:

RM ${Number(order.total_amount)
.toFixed(2)}

</h3>





<p>

Payment:

${order.payment_method}

</p>




<button onclick="printInvoice(${order.id})">

Print

</button>



</div>



`;



});



}









// ===============================
// PRINT
// ===============================


window.printInvoice = async function(id){



const {

data,

error

}=await supabase

.from("orders")

.select(`

*,

order_items(*)

`)

.eq(

"id",

id

)

.single();






if(error){

console.log(error);

return;

}






let content = `

<h1>

Hameed's Bistro

</h1>


<h3>

Invoice ${data.order_number}

</h3>


<hr>

`;






data.order_items.forEach(item=>{


content += `

<p>

${item.item_name}

×

${item.quantity}

RM ${(item.price * item.quantity).toFixed(2)}

</p>

`;



});






content += `

<hr>

<h2>

Total RM ${Number(data.total_amount).toFixed(2)}

</h2>

`;







const win =

window.open(

"",

"_blank"

);





win.document.write(content);


win.print();



}









// ===============================
// REFRESH
// ===============================


document

.getElementById(

"refreshBtn"

)

?.addEventListener(

"click",

()=>{


loadInvoices();


});









// ===============================
// LOGOUT
// ===============================


document

.getElementById(

"logoutBtn"

)

?.addEventListener(

"click",

()=>{


logout();


});









start();
