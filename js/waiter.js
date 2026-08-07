import { supabase } from "./supabase.js";



const user = JSON.parse(
localStorage.getItem("user")
);



if(!user){

window.location.href="login.html";

}





if(
user.role !== "waiter" &&
user.role !== "manager" &&
user.role !== "admin"
){

alert("Access Denied");

window.location.href="login.html";

}





document.getElementById("userName").innerText =
user.name || "---";


document.getElementById("userRole").innerText =
user.role || "---";






let selectedTable = "";

let cart = [];







// TABLE SELECT


const tableSelect =
document.getElementById(
"tableSelect"
);



if(tableSelect){


tableSelect.onchange=()=>{


selectedTable =
tableSelect.value;


};


}









// LOAD MENU


async function loadMenu(){



const {

data,

error

}=await supabase

.from("menu")

.select("*")

.eq(
"status",
"active"
);





if(error){

console.log(error);

return;

}





const box =
document.getElementById(
"menuContainer"
);



if(!box)
return;





box.innerHTML="";





data.forEach(item=>{



box.innerHTML +=`



<div class="menu-item">



<h3>

${item.item_name}

</h3>



<p>

RM ${Number(item.dine_in_price).toFixed(2)}

</p>




<button onclick="addItem('${item.id}')">

Add

</button>



</div>



`;



});





}









// ADD ITEM


window.addItem=function(id){



alert(
"Item Added"
);



};









// SEND ORDER


document.getElementById(
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
"Add Item First"
);


return;


}









const {

error

}=await supabase

.from("orders")

.insert({


customer_name:

user.name,


table_number:

selectedTable,


order_type:

"Dine In",


order_items:

cart,


status:

"New",


payment_status:

"Pending",


created_by:

user.id


});







if(error){


console.log(error);


alert(
"Order Failed"
);


return;


}








alert(
"Order Sent To Cashier"
);





cart=[];



});









// REFRESH


document.getElementById(
"refreshBtn"
)

?.addEventListener(
"click",

()=>{

location.reload();

}

);







// LOGOUT


document.getElementById(
"logoutBtn"
)

?.addEventListener(
"click",

()=>{


localStorage.removeItem(
"user"
);


window.location.href=
"login.html";


}

);








loadMenu();
