import { supabase } from "./supabase.js";



let orderId =
localStorage.getItem("paymentOrder");



let invoiceData = null;







async function loadInvoice(){



if(!orderId){

alert("No Invoice Found");

return;

}







const {

data,

error

}=await supabase

.from("orders")

.select("*")

.eq(
"id",
orderId
)

.single();







if(error){

console.log(error);

return;

}





invoiceData=data;



showInvoice();



}









function showInvoice(){



document.getElementById(
"invoiceNo"
).innerText =

"INV-" +

invoiceData.id.slice(0,8).toUpperCase();







document.getElementById(
"invoiceDate"
).innerText =

new Date(
invoiceData.paid_at || Date.now()
)

.toLocaleString();








document.getElementById(
"tableNo"
).innerText =

invoiceData.table_number || "Take Away";







document.getElementById(
"paymentMethod"
).innerText =

invoiceData.payment_method || "---";








let itemsBox =

document.getElementById(
"invoiceItems"
);



itemsBox.innerHTML="";





let total=0;







(invoiceData.order_items || [])

.forEach(item=>{





let amount =

Number(item.price || 0)

*

Number(item.quantity || 1);





total += amount;







itemsBox.innerHTML +=`



<tr>


<td>

${item.item_name}

</td>



<td>

${item.quantity}

</td>



<td>

RM ${amount.toFixed(2)}

</td>



</tr>



`;





});








document.getElementById(
"invoiceTotal"
).innerText =

total.toFixed(2);








if(invoiceData.customer_name){



document.getElementById(
"customerName"
).innerText =

invoiceData.customer_name;



}



}









// PRINT


document.getElementById(
"printBtn"
)

.onclick=()=>{


window.print();


};







// BACK


document.getElementById(
"backBtn"
)

.onclick=()=>{


history.back();


};








loadInvoice();
