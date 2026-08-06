// pos/js/checkout.js


import { supabase } from "./supabase.js";




// ELEMENTS

const checkoutBtn =
document.getElementById("checkoutBtn");



const customerNameInput =
document.getElementById("customerName");



const paymentMethodInput =
document.getElementById("paymentMethod");






// GET CART


function getCart(){


return JSON.parse(

localStorage.getItem("cart")

) || [];


}








// GET KITCHEN SECTION


async function getKitchenSection(category){



const {data,error}=

await supabase

.from("kitchen_mapping")

.select("section")

.eq(
"category",
category
)

.single();





if(error || !data){


return "Main Kitchen";


}



return data.section;



}









// CREATE ORDER NUMBER


function generateOrderNumber(){


let date =
new Date();



return (

"HB" +

date.getFullYear() +

(date.getMonth()+1)

.toString()

.padStart(2,"0")

+

date.getDate()

.toString()

.padStart(2,"0")

+

Date.now()

.toString()

.slice(-5)

);


}









// CHECKOUT


checkoutBtn.onclick = async()=>{



const cart =
getCart();





if(cart.length===0){


alert(
"Cart is empty"
);


return;


}






let customerName =

customerNameInput?.value ||

"Walk In Customer";





let paymentMethod =

paymentMethodInput?.value ||

"Cash";







let totalAmount =

cart.reduce(

(sum,item)=>


sum +

(Number(item.price) *

Number(item.quantity)),


0

);







try{





// CREATE ORDER



const orderNumber =

generateOrderNumber();






const {data:order,error:orderError}=

await supabase

.from("orders")

.insert({



order_number:
orderNumber,


customer_name:
customerName,


order_type:
localStorage.getItem("orderType")

|| "Dine In",



table_number:
localStorage.getItem("tableNumber")

|| null,



total_amount:
totalAmount,



payment_method:
paymentMethod,



status:
"New"



})



.select()

.single();







if(orderError){

throw orderError;

}







// CREATE ORDER ITEMS



let orderItems=[];






for(let item of cart){





let section =

await getKitchenSection(

item.category

);






orderItems.push({



order_id:

order.id,



item_name:

item.itemName,



category:

item.category,



quantity:

Number(item.quantity),



price:

Number(item.price),



section:

section



});





}







const {error:itemError}=

await supabase

.from("order_items")

.insert(orderItems);






if(itemError){

throw itemError;

}









// CLEAR CART



localStorage.removeItem(
"cart"
);







alert(

"Order placed successfully\nOrder No: "

+

orderNumber

);







window.location.href=

"success.html";








}

catch(error){



console.log(error);



alert(

"Order Failed: "

+

error.message

);



}



};
