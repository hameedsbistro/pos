// js/checkout.js


import { supabase } from "./supabase.js";

import { changeLanguage } from "./language.js";





// ===============================
// LOAD CART
// ===============================


let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];





let orderType =

localStorage.getItem(
"orderType"
)

||

"Dine In";







// ===============================
// SHOW ORDER TYPE
// ===============================


const orderTypeBox =

document.getElementById(
"orderType"
);



if(orderTypeBox){

orderTypeBox.innerText =
orderType;

}









// ===============================
// TABLE BOX
// ===============================


const tableBox =

document.getElementById(
"tableBox"
);





if(orderType==="Take Away"){


if(tableBox){

tableBox.style.display="none";

}


}









// ===============================
// CONFIRM ORDER
// ===============================


document

.getElementById("confirmOrderBtn")

?.addEventListener(

"click",

async()=>{





if(cart.length===0){


alert(
"Cart Empty"
);


return;


}







const customerName =

document

.getElementById(
"customerName"
)

.value.trim();







const phone =

document

.getElementById(
"customerPhone"
)

.value.trim();







const tableNumber =

document

.getElementById(
"tableNumber"
)

?.value || "";







const note =

document

.getElementById(
"orderNote"
)

.value.trim();








if(orderType==="Dine In" && !tableNumber){


alert(
"Please select table"
);


return;


}









// ===============================
// CALCULATE TOTAL
// ===============================


let total = 0;



cart.forEach(item=>{


total +=

item.price *

item.quantity;


});









// ===============================
// ORDER NUMBER
// ===============================


const orderNumber =

"HMB-" +

Date.now();









// ===============================
// INSERT ORDER
// ===============================


const {

data:order,

error:orderError

}=await supabase

.from("orders")

.insert({

order_number:
orderNumber,


table_number:
tableNumber,


order_type:
orderType,


ordered_by_type:
"customer",


ordered_by_name:
customerName || "Guest",


customer_name:
customerName,


customer_phone:
phone,


status:
"New",


payment_status:
"Pending",


total_amount:
total


})

.select()

.single();








if(orderError){


console.log(orderError);


alert(
"Order Failed"
);


return;


}









// ===============================
// INSERT ORDER ITEMS
// ===============================


const orderItems =

cart.map(item=>({


order_id:
order.id,


item_name:
item.itemName,


quantity:
item.quantity,


price:
item.price,


section_id:
item.section_id,


item_note:
note



}));








const {

error:itemError

}=await supabase

.from("order_items")

.insert(orderItems);









if(itemError){


console.log(itemError);


alert(
"Item Save Failed"
);


return;


}








// ===============================
// CLEAR CART
// ===============================


localStorage.removeItem(
"cart"
);







alert(

"Order Confirmed"

);






window.location.href =

"index.html";







});








// ===============================
// HEADER
// ===============================


document

.getElementById("homeBtn")

?.addEventListener(

"click",

()=>{


window.location.href="index.html";


});







document

.getElementById("backBtn")

?.addEventListener(

"click",

()=>{


history.back();


});







document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


location.reload();


});









changeLanguage();
