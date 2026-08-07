import { supabase } from "./supabase.js";



let orderId =
localStorage.getItem("paymentOrder");



let selectedMethod = "";

let orderData = null;






// LOAD ORDER


async function loadOrder(){


if(!orderId){

alert("No Order Selected");

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





orderData=data;



showOrder();



}








// SHOW ORDER


function showOrder(){



document.getElementById(
"orderNo"
).innerText =
orderData.id.slice(0,8);



document.getElementById(
"tableNo"
).innerText =
orderData.table_number || "Take Away";





let itemsBox =
document.getElementById(
"paymentItems"
);



itemsBox.innerHTML="";





let total=0;




(orderData.order_items || [])

.forEach(item=>{


let amount =
Number(item.price || 0)
*
Number(item.quantity || 1);



total += amount;



itemsBox.innerHTML +=`


<div class="payment-item">


<span>

${item.item_name}

x

${item.quantity}

</span>



<span>

RM ${amount.toFixed(2)}

</span>



</div>



`;



});





document.getElementById(
"totalAmount"
).innerText =
total.toFixed(2);



}









// PAYMENT METHOD


document.querySelectorAll(
".method-btn"
)

.forEach(btn=>{



btn.onclick=()=>{


document.querySelectorAll(
".method-btn"
)

.forEach(b=>{

b.classList.remove("active");

});





btn.classList.add("active");



selectedMethod =
btn.dataset.method;





if(selectedMethod==="Cash"){


document.getElementById(
"cashBox"
).style.display="block";


}

else{


document.getElementById(
"cashBox"
).style.display="none";


}



};



});









// CASH CHANGE


document.getElementById(
"cashAmount"
)

?.addEventListener(
"input",
()=>{


let total =
Number(
document.getElementById(
"totalAmount"
).innerText
);



let cash =
Number(
document.getElementById(
"cashAmount"
).value
);



let change =
cash-total;



if(change<0){

change=0;

}



document.getElementById(
"changeAmount"
).innerText =
change.toFixed(2);



}

);









// PAY


document.getElementById(
"payBtn"
)

.onclick=async()=>{



if(!selectedMethod){


alert(
"Select Payment Method"
);


return;


}




let total =
Number(
document.getElementById(
"totalAmount"
).innerText
);






if(selectedMethod==="Cash"){



let cash =
Number(
document.getElementById(
"cashAmount"
).value
);



if(cash < total){


alert(
"Insufficient Amount"
);


return;


}



}








const {

error

}=await supabase

.from("orders")

.update({

payment_status:"Paid",

payment_method:selectedMethod,

paid_at:new Date()

})

.eq(
"id",
orderId
);








if(error){


console.log(error);


alert(
"Payment Failed"
);


return;


}








document.getElementById(
"message"
).innerText =
"Payment Successful";







setTimeout(()=>{


window.location.href=
"cashier.html";



},1500);




};









loadOrder();
