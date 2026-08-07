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
user.role || "---";





let menu = [];

let cart = [];

let selectedTable = "";









// TABLE SELECT


document
.getElementById("tableSelect")
.addEventListener(
"change",
(e)=>{


selectedTable =
e.target.value;


});









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
)

.order(
"category"
);







if(error){

console.log(error);

return;

}






menu=data;



displayMenu();



}










// DISPLAY MENU


function displayMenu(){



const box =
document.getElementById(
"menuContainer"
);



box.innerHTML="";





menu.forEach(item=>{



box.innerHTML += `


<div class="menu-item">


<h3>

${item.item_name}

</h3>



<p>

RM ${Number(item.dine_in_price).toFixed(2)}

</p>



<button class="add-btn"
data-id="${item.id}">

Add

</button>



</div>


`;



});






document
.querySelectorAll(".add-btn")
.forEach(btn=>{



btn.onclick=()=>{


addToCart(
btn.dataset.id
);


};



});



}









// ADD CART


function addToCart(id){



let item =
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

item_name:item.item_name,

price:Number(item.dine_in_price),

quantity:1


});


}





showCart();



}









// SHOW CART


function showCart(){



const box =
document.getElementById(
"cartContainer"
);



box.innerHTML="";





if(cart.length===0){


box.innerHTML=

"<p>No Item Selected</p>";

return;


}






cart.forEach((item,index)=>{





box.innerHTML += `


<div class="cart-item">


<span>

${item.item_name}

</span>



<span>


RM ${(item.price*item.quantity).toFixed(2)}


</span>



<button onclick="minusItem(${index})">

-

</button>



<span>

${item.quantity}

</span>



<button onclick="plusItem(${index})">

+

</button>



<button onclick="removeItem(${index})">

✕


</button>



</div>


`;



});





}









window.plusItem=function(index){


cart[index].quantity++;


showCart();


}







window.minusItem=function(index){


if(cart[index].quantity>1){


cart[index].quantity--;


}

else{


cart.splice(index,1);


}



showCart();



}








window.removeItem=function(index){


cart.splice(index,1);


showCart();


}









// SEND ORDER


document
.getElementById("sendOrderBtn")
.onclick=async()=>{



if(!selectedTable){


alert(
"Please Select Table"
);


return;


}




if(cart.length===0){


alert(
"Cart Empty"
);


return;


}








const {

error

}=await supabase

.from("orders")

.insert({



order_type:

"Dine In",



table_number:

selectedTable,



customer_name:

"Walk In",



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


showCart();



};









// REFRESH


document
.getElementById("refreshBtn")
.onclick=()=>{

location.reload();

};







// LOGOUT


document
.getElementById("logoutBtn")
.onclick=()=>{


localStorage.removeItem(
"user"
);


window.location.href=
"login.html";


};






loadMenu();
