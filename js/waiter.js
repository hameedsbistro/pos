// js/waiter.js


import { supabase } from "./supabase.js";



let currentTable = null;

let cart = [];






// USER CHECK


async function checkUser(){


const user = JSON.parse(

localStorage.getItem("user")

);



if(!user){

window.location.href="login.html";

return;

}




if(
user.role !== "waiter" &&
user.role !== "manager" &&
user.role !== "admin"

){

alert("Access Denied");

window.location.href="login.html";

return;

}



document.getElementById("userName").innerText =
user.name;


document.getElementById("userRole").innerText =
user.role;



}





// LOAD TABLES


async function loadTables(){


const {data,error}=await supabase

.from("tables")

.select("*")

.order("table_number");



if(error){

console.log(error);

return;

}




const grid=document.getElementById(
"tableGrid"
);


grid.innerHTML="";



data.forEach(table=>{


let div=document.createElement("div");


div.className="table-card";



if(table.status==="pending"){

div.classList.add(
"table-pending"
);

}

else if(table.status==="ready"){

div.classList.add(
"table-ready"
);

}

else if(table.status==="completed"){

div.classList.add(
"table-completed"
);

}

else{

div.classList.add(
"table-empty"
);

}




div.innerHTML=`

<h3>${table.table_number}</h3>

<p>
${table.status}
</p>

`;




div.onclick=()=>{


openOrder(table);


};



grid.appendChild(div);



});



}








// OPEN ORDER


function openOrder(table){


currentTable = table;


cart=[];



document.getElementById(
"orderPanel"
).style.display="block";



loadMenu();


}








// CLOSE


document.getElementById(
"closeOrderBtn"
)
.onclick=()=>{


document.getElementById(
"orderPanel"
).style.display="none";


};










// LOAD MENU


async function loadMenu(){


const {data,error}=await supabase

.from("menu_items")

.select("*")

.eq("status","active");



if(error){

console.log(error);

return;

}



const box=document.getElementById(
"menuItems"
);


box.innerHTML="";



data.forEach(item=>{


let div=document.createElement(
"div"
);


div.className="menu-item";



div.innerHTML=`

<span>

${item.item_name}

</span>


<button>

Add

</button>

`;




div.querySelector("button")

.onclick=()=>{


addItem(item);


};



box.appendChild(div);



});


}








// ADD ITEM


function addItem(item){



let exist = cart.find(

x=>x.id===item.id

);



if(exist){

exist.quantity++;

}

else{


cart.push({

id:item.id,

item_name:item.item_name,

quantity:1,

note:""


});


}



showCart();



}








// SHOW CART


function showCart(){


const box=document.getElementById(
"orderItems"
);


box.innerHTML="";



cart.forEach((item,index)=>{


let div=document.createElement(
"div"
);


div.className="order-item";



div.innerHTML=`

<b>
${item.item_name}
</b>

<br>

Quantity:
${item.quantity}


<button class="plus">
+
</button>


<button class="minus">
-
</button>


`;





div.querySelector(".plus")

.onclick=()=>{

item.quantity++;

showCart();

};




div.querySelector(".minus")

.onclick=()=>{


if(item.quantity>1){

item.quantity--;

}

else{

cart.splice(index,1);

}


showCart();


};





box.appendChild(div);



});



}









// SEND ORDER


document.getElementById(
"sendOrderBtn"
)

.onclick=async()=>{



if(cart.length===0){

alert(
"Please add item"
);

return;

}



let user =
JSON.parse(
localStorage.getItem("user")
);





// CREATE ORDER


const {data:order,error}=await supabase

.from("orders")

.insert({

table_number:
currentTable.table_number,


status:"New",


created_by:user.id


})

.select()

.single();




if(error){

console.log(error);

return;

}





// INSERT ITEMS


let items=cart.map(item=>({


order_id:order.id,


item_name:item.item_name,


quantity:item.quantity,


item_note:item.note


}));





await supabase

.from("order_items")

.insert(items);






alert(
"Order Sent"
);



document.getElementById(
"orderPanel"
).style.display="none";



loadTables();



};









// REFRESH


document.getElementById(
"refreshBtn"
)

.onclick=()=>{


location.reload();


};







// LOGOUT


document.getElementById(
"logoutBtn"
)

.onclick=()=>{


localStorage.removeItem(
"user"
);


window.location.href="login.html";


};








checkUser();

loadTables();
