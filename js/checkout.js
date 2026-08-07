// js/checkout.js


import { supabase } from "./supabase.js";



let cart = JSON.parse(

localStorage.getItem("cart")

) || [];



let orderType =

localStorage.getItem("orderType") || "Dine In";





// CHECK LOGIN


async function checkCustomer(){



const user = JSON.parse(

localStorage.getItem("customer")

);




if(!user){



let confirmLogin = confirm(

"Please Login or Create Account to place order"

);



if(confirmLogin){

window.location.href="login.html";

}

else{

window.location.href="register.html";

}


return false;


}




document.getElementById(
"customerName"
).value = user.name || "";



document.getElementById(
"customerPhone"
).value = user.phone || "";



return true;



}









// SHOW ORDER TYPE


document.getElementById(
"orderType"
).innerText = orderType;






// TABLE CONTROL


if(orderType==="Take Away"){



document.getElementById(
"tableBox"
).style.display="none";



}









// PLACE ORDER


document.getElementById(
"confirmOrderBtn"
)
.onclick=async()=>{



let logged = await checkCustomer();



if(!logged)
return;





let user = JSON.parse(

localStorage.getItem("customer")

);





let table = null;



if(orderType==="Dine In"){



table = document.getElementById(
"tableNumber"
).value;



if(!table){


alert(
"Please Select Table"
);


return;


}



}







if(cart.length===0){



alert(
"Cart Empty"
);



return;


}








// CREATE ORDER


const {data:order,error}=await supabase

.from("orders")

.insert({

customer_id:user.id,


customer_name:user.name,


phone:user.phone,


order_type:orderType,


table_number:table,


status:"New"


})

.select()

.single();







if(error){


console.log(error);

alert(
"Order Failed"
);

return;


}









// ORDER ITEMS


let items = cart.map(item=>({



order_id:order.id,



item_name:item.itemName,



quantity:item.quantity,



item_note:item.note || ""



}));







const {error:itemError}=await supabase

.from("order_items")

.insert(items);







if(itemError){


console.log(itemError);


alert(
"Item Error"
);


return;


}









alert(

"Order Sent Successfully"

);







// CLEAR CART


localStorage.removeItem(
"cart"
);



window.location.href="index.html";



};












// START


checkCustomer();
