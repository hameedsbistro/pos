// js/waiter.js


import { supabase } from "./supabase.js";

import { requireRole, logout } from "./auth.js";







let user = null;

let menu = [];

let cart = [];

let selectedTable = "";









// ===============================
// START
// ===============================


async function start(){


user = await requireRole(
[
"waiter",
"manager",
"admin"
]
);



if(!user){

return;

}




document.getElementById(
"userName"
)?.innerText =
user.name;



loadTables();

loadMenu();



}









// ===============================
// LOAD TABLES
// ===============================


async function loadTables(){



const {

data,

error

}=await supabase

.from("tables")

.select("*")

.eq(

"status",

"active"

)

.order(
"table_number"
);







if(error){

console.log(error);

return;

}






const box =

document.getElementById(
"tableSelect"
);






if(!box){

return;

}





box.innerHTML =

`
<option value="">
Select Table
</option>
`;






data.forEach(table=>{


box.innerHTML += `


<option value="${table.table_number}">

${table.table_number}

(${table.area})

</option>


`;



});







box.onchange=(e)=>{


selectedTable =
e.target.value;


};



}









// ===============================
// LOAD MENU
// ===============================


async function loadMenu(){



const {

data,

error

}=await supabase

.from("menu")

.select(`

id,

item_name,

category,

dine_in_price,

section_id

`)

.eq(

"status",

"active"

);







if(error){

console.log(error);

return;

}






menu=data;



showMenu(menu);



}









// ===============================
// SHOW MENU
// ===============================


function showMenu(items){



const box =

document.getElementById(
"menuContainer"
);





if(!box){

return;

}





box.innerHTML="";






items.forEach(item=>{


box.innerHTML += `



<div class="menu-item">


<h3>

${item.item_name}

</h3>



<p>

RM ${Number(item.dine_in_price).toFixed(2)}

</p>



<button

onclick="addItem('${item.id}')">

Add

</button>



</div>



`;




});





}









// ===============================
// ADD ITEM
// ===============================


window.addItem=function(id){



const item =

menu.find(
x=>x.id===id
);







let exist =

cart.find(
x=>x.id===id
);







if(exist){


exist.quantity++;


}

else{


cart.push({

id:item.id,


itemName:item.item_name,


price:Number(
item.dine_in_price
),


quantity:1,


section_id:
item.section_id


});



}





showCart();


}









// ===============================
// SHOW CART
// ===============================


function showCart(){



const box =

document.getElementById(
"cartItems"
);





if(!box){

return;

}





box.innerHTML="";





cart.forEach(
(item,index)=>{


box.innerHTML += `


<div>


${item.itemName}


×

${item.quantity}



<button onclick="removeItem(${index})">

X

</button>


</div>


`;



});



}









window.removeItem=function(index){


cart.splice(index,1);


showCart();


}









// ===============================
// SEND ORDER
// ===============================


document

.getElementById(
"sendOrderBtn"
)

?.addEventListener(

"click",

async()=>{






if(!selectedTable){


alert(
"Select Table"
);


return;


}






if(cart.length===0){


alert(
"Cart Empty"
);


return;


}








let total=0;



cart.forEach(item=>{


total +=

item.price *

item.quantity;


});







const orderNumber =

"HMB-" +

Date.now();








const {

data:order,

error

}=await supabase

.from("orders")

.insert({

order_number:
orderNumber,


table_number:
selectedTable,


order_type:
"Dine In",


ordered_by_type:
"waiter",


ordered_by_name:
user.name,


status:
"New",


payment_status:
"Pending",


total_amount:
total



})

.select()

.single();







if(error){


console.log(error);


return;


}








const items =

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
item.section_id



}));








await supabase

.from("order_items")

.insert(items);







alert(
"Order Sent"
);






cart=[];


showCart();



});









// ===============================
// BUTTONS
// ===============================


document

.getElementById(
"refreshBtn"
)

?.addEventListener(

"click",

()=>{


location.reload();


});






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
