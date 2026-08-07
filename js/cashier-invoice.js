import { supabase } from "./supabase.js";



const invoiceList =
document.getElementById("invoiceList");





// LOAD PAID INVOICES


async function loadInvoices(){



const {

data,

error

}=await supabase

.from("orders")

.select("*")

.eq(
"payment_status",
"Paid"
)

.order(
"paid_at",
{
ascending:false
}

);







if(error){

console.log(error);

return;

}







invoiceList.innerHTML="";






(data || [])

.forEach(order=>{





let invoiceNo =
"INV-" +
order.id
.slice(0,8)
.toUpperCase();







invoiceList.innerHTML += `



<div class="invoice-card">



<h3>

${invoiceNo}

</h3>




<p>

Table:

${order.table_number || "Take Away"}

</p>





<p>

Amount:

RM ${Number(order.total || 0).toFixed(2)}

</p>





<p>

Payment:

${order.payment_method || "---"}

</p>





<p>

Date:

${

new Date(
order.paid_at
)

.toLocaleString()

}

</p>






<button onclick="viewInvoice('${order.id}')">

View Invoice

</button>



</div>



`;



});





}









// OPEN INVOICE


window.viewInvoice = function(id){



localStorage.setItem(
"paymentOrder",
id
);



window.location.href=
"invoice.html";



};









loadInvoices();
