// pos/js/reports.js



import { db } from "./firebase.js";



import {

collection,

getDocs,

query,

orderBy

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";









const todaySales =

document.getElementById(
"todaySales"
);



const totalOrders =

document.getElementById(
"totalOrders"
);



const completedOrders =

document.getElementById(
"completedOrders"
);





const categoryReport =

document.getElementById(
"categoryReport"
);






const itemReport =

document.getElementById(
"itemReport"
);









async function loadReports(){





let totalSale = 0;

let totalOrder = 0;

let complete = 0;





let categoryData = {};

let itemData = {};







const q = query(

collection(db,"orders"),

orderBy(
"createdAt",
"desc"
)

);






const snapshot =

await getDocs(q);








snapshot.forEach(

orderDoc=>{



let order = orderDoc.data();





totalOrder++;







if(order.status==="Completed"){



complete++;



totalSale += Number(

order.totalAmount || 0

);





}








order.items?.forEach(

item=>{



let qty =

Number(item.quantity || 0);






let amount =

Number(item.price || 0)

*

qty;







// ITEM REPORT



if(!itemData[item.itemName]){


itemData[item.itemName]={

quantity:0,

amount:0

};


}






itemData[item.itemName].quantity += qty;



itemData[item.itemName].amount += amount;








// CATEGORY REPORT



let category =

item.category || "Other";






if(!categoryData[category]){


categoryData[category]=0;


}





categoryData[category]+=amount;





});






});









todaySales.innerText =

"RM "

+

totalSale.toFixed(2);






totalOrders.innerText =

totalOrder;






completedOrders.innerText =

complete;









// CATEGORY TABLE



categoryReport.innerHTML="";





Object.keys(categoryData)

.forEach(category=>{





categoryReport.innerHTML += `


<tr>


<td>

${category}

</td>



<td>

RM ${categoryData[category].toFixed(2)}

</td>


</tr>


`;




});









// ITEM TABLE



itemReport.innerHTML="";






Object.keys(itemData)

.forEach(item=>{





itemReport.innerHTML += `



<tr>


<td>

${item}

</td>




<td>

${itemData[item].quantity}

</td>




<td>

RM ${itemData[item].amount.toFixed(2)}

</td>



</tr>


`;





});








}









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









// EXPORT BUTTON PLACEHOLDER



document.getElementById(
"exportPdfBtn"
)

?.addEventListener(

"click",

()=>{


alert(
"PDF Export Module Coming Soon"
);


}

);








document.getElementById(
"exportExcelBtn"
)

?.addEventListener(

"click",

()=>{


alert(
"Excel Export Module Coming Soon"
);


}

);









loadReports();
