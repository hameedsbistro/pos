// pos/js/popular.js



import { db } from "./firebase.js";



import {

collection,

getDocs,

query,

where,

limit

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";







const popularItems =

document.getElementById(
"popularItems"
);








let cart =

JSON.parse(

localStorage.getItem("cart")

)

||

[];









// LOAD POPULAR ITEMS


async function loadPopular(){



try{



const q = query(

collection(db,"menu"),

where(
"popular",
"==",
true
),

limit(15)

);







const snapshot =

await getDocs(q);







popularItems.innerHTML="";








snapshot.forEach(doc=>{



let item = {


id:doc.id,

...doc.data()


};






createCard(item);




});






}

catch(error){


console.log(
"Popular Load Error",
error
);


}



}









// CREATE CARD



function createCard(item){



let card =

document.createElement(
"div"
);



card.className =
"popular-card";






card.innerHTML = `



<img src="${item.image || '../images/menu/default.jpg'}">



<h3>

${item.itemName}

</h3>




<div class="popular-price">

RM ${Number(item.dineInPrice).toFixed(2)}

</div>





<button class="popular-add-btn">

Add To Cart

</button>


`;







card.querySelector(
".popular-add-btn"
)
.onclick=()=>{


addCart(item);


};







popularItems.appendChild(card);



}









// ADD CART



function addCart(item){



let exist =

cart.find(

x=>

x.id===item.id

);






if(exist){


exist.quantity++;


}

else{


cart.push({


id:item.id,


itemName:item.itemName,


price:item.dineInPrice,


image:item.image,


quantity:1


});


}







localStorage.setItem(

"cart",

JSON.stringify(cart)

);







updateCart();



}









// UPDATE CART COUNT



function updateCart(){



let count=0;



cart.forEach(item=>{


count += item.quantity;


});






let cartCount =

document.getElementById(
"cartCount"
);



if(cartCount){


cartCount.innerText=count;


}



}









// HEADER BUTTONS



document.getElementById(
"homeBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="../index.html";


}

);








document.getElementById(
"backBtn"
)?.addEventListener(

"click",

()=>{


history.back();


}

);








document.getElementById(
"refreshBtn"
)?.addEventListener(

"click",

()=>{


location.reload();


}

);








document.getElementById(
"cartBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="cart.html";


}

);







document.getElementById(
"loginBtn"
)?.addEventListener(

"click",

()=>{


window.location.href="../login.html";


}

);








loadPopular();

updateCart();
