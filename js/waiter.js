import { supabase } from "./supabase.js";



let selectedTable="";

let orderItems=[];



// USER

const user =
JSON.parse(localStorage.getItem("user"));



if(!user){

location.href="login.html";

}



if(
user.role!=="waiter" &&
user.role!=="admin" &&
user.role!=="manager"
){

alert("Access Denied");

location.href="login.html";

}



userName.innerText=user.name;

userRole.innerText=user.role;








// CREATE TABLE


function createTables(){


createGroup(
"indoorTables",
"Indoor",
"A",
30
);


createGroup(
"outdoorTables",
"Outdoor",
"B",
30
);


createGroup(
"floorTables",
"First Floor",
"C",
30
);


}





function createGroup(id,title,prefix,total){



let box=document.getElementById(id);



for(let i=1;i<=total;i++){



let btn=document.createElement("button");


btn.className="table-btn";


btn.innerText=
title+" "+prefix+i;



btn.onclick=()=>openTable(
title+" "+prefix+i
);



box.appendChild(btn);



}



}









// OPEN TABLE


function openTable(table){


selectedTable=table;


document.getElementById(
"selectedTable"
).innerText=table;



document.getElementById(
"orderModal"
).style.display="block";



loadMenu();


}









// CLOSE


closeBtn.onclick=()=>{


orderModal.style.display="none";


};









// LOAD MENU


async function loadMenu(){



const {

data

}=await supabase

.from("menu")

.select("*");





menuItems.innerHTML="";



data.forEach(item=>{


menuItems.innerHTML += `


<div class="menu-item">


<span>

${item.item_name}

</span>


<button onclick='addItem(${JSON.stringify(item)})'>

+

</button>


</div>


`;



});


}









window.addItem=(item)=>{


orderItems.push({

item_name:item.item_name,

quantity:1,

note:""


});


showItems();


};








function showItems(){


orderItemsDiv=document.getElementById(
"orderItems"
);


orderItemsDiv.innerHTML="";



orderItems.forEach(i=>{


orderItemsDiv.innerHTML +=`

<div class="order-item">

${i.item_name}

</div>

`;

});


}









// SEND ORDER


sendOrderBtn.onclick=async()=>{


if(orderItems.length===0){

alert("Add Item");

return;

}





const {

error

}=await supabase

.from("orders")

.insert({

table_number:selectedTable,

status:"Accepted",

order_items:orderItems


});






if(error){

console.log(error);

return;

}





alert("Order Sent To Kitchen");



orderModal.style.display="none";


orderItems=[];


};









// REFRESH


refreshBtn.onclick=()=>{

location.reload();

};








// LOGOUT


logoutBtn.onclick=()=>{


localStorage.removeItem("user");


location.href="login.html";


};







createTables();
