// js/popular.js


import { supabase } from "./supabase.js";

import { changeLanguage } from "./language.js";






// ===============================
// LOAD POPULAR ITEMS
// ===============================


async function loadPopular(){



const {

data,

error

}=await supabase

.from("menu")

.select(`

id,

item_name,

image,

category,

dine_in_price,

take_away_price,

section_id

`)

.eq(

"status",

"active"

)

.limit(8);







if(error){


console.log(
error
);


return;


}






showPopular(data);



}









// ===============================
// DISPLAY POPULAR
// ===============================


function showPopular(items){



const container =

document.getElementById(
"popularContainer"
);





if(!container){

return;

}






container.innerHTML="";








items.forEach(item=>{





container.innerHTML += `



<div class="popular-card">



<img src="${item.image || '../images/no-image.png'}">



<h3>

${item.item_name}

</h3>



<p>

${item.category}

</p>



<h4>

RM ${Number(item.dine_in_price || 0).toFixed(2)}

</h4>





<button

onclick="openMenu()">

Order Now

</button>



</div>



`;





});



}









// ===============================
// OPEN MENU
// ===============================


window.openMenu=function(){


window.location.href =
"menu.html";


}









// ===============================
// REFRESH
// ===============================


document

.getElementById("refreshBtn")

?.addEventListener(

"click",

()=>{


location.reload();


});









// START


loadPopular();

changeLanguage();
