// pos/js/admin-menu.js


import { db } from "./firebase.js";



import {

collection,

addDoc,

getDocs,

deleteDoc,

doc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";







const menuTable =

document.getElementById(
"menuTable"
);







// LOAD MENU


async function loadMenu(){



menuTable.innerHTML="";





const snapshot =

await getDocs(

collection(
db,
"menu"
)

);






snapshot.forEach(

(itemDoc)=>{



let item = itemDoc.data();




let row =

document.createElement(
"tr"
);







row.innerHTML = `


<td>

${item.category || ""}

</td>



<td>

${item.itemName || ""}

</td>




<td>

RM ${Number(item.dineInPrice).toFixed(2)}

</td>





<td>

RM ${Number(item.takeAwayPrice).toFixed(2)}

</td>





<td>

${item.popular ? "Yes":"No"}

</td>





<td>


<button class="delete-btn">

Delete

</button>


</td>



`;







row.querySelector(
".delete-btn"
)
.onclick=async()=>{



if(confirm("Delete Item?")){



await deleteDoc(

doc(

db,

"menu",

itemDoc.id

)

);



loadMenu();



}



};







menuTable.appendChild(row);




});




}









// SAVE NEW ITEM



document.getElementById(
"saveMenuBtn"
)
.addEventListener(

"click",

async()=>{





let data = {


category:

document.getElementById(
"category"
).value,



itemName:

document.getElementById(
"itemName"
).value,




dineInPrice:

Number(

document.getElementById(
"dineInPrice"
).value

),





takeAwayPrice:

Number(

document.getElementById(
"takeAwayPrice"
).value

),




image:

document.getElementById(
"image"
).value,





popular:

document.getElementById(
"popular"
).checked,





createdAt:

new Date()



};








await addDoc(

collection(
db,
"menu"
),

data

);






alert(
"Menu Saved"
);






loadMenu();





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








loadMenu();
