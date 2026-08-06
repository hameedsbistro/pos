// pos/js/admin.js


import { db } from "./firebase.js";


import {


collection,

getDocs,

query,

where,

orderBy


}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";








const todaySalesElement =

document.getElementById(

"todaySales"

);




const todayOrdersElement =

document.getElementById(

"todayOrders"

);




const pendingOrdersElement =

document.getElementById(

"pendingOrders"

);




const staffOnlineElement =

document.getElementById(

"staffOnline"

);









// LOAD DASHBOARD DATA



async function loadDashboard(){



try{





let totalSales = 0;


let totalOrders = 0;


let pendingOrders = 0;







const today =

new Date();



today.setHours(

0,

0,

0,

0

);









const ordersSnapshot =

await getDocs(

query(

collection(

db,

"orders"

),

orderBy(

"createdAt",

"desc"

)

)

);









ordersSnapshot.forEach(orderDoc=>{



const order =

orderDoc.data();







let orderDate =

order.createdAt?.toDate();








if(orderDate && orderDate >= today){





totalOrders++;






if(order.status === "Pending"){



pendingOrders++;



}








if(order.status === "Completed"){



totalSales +=

Number(order.total || 0);



}



}





});












// STAFF ONLINE



let staffOnline = 0;







const staffSnapshot =

await getDocs(

collection(

db,

"staff"

)

);







staffSnapshot.forEach(staff=>{



const data =

staff.data();







if(data.status === "active"){



staffOnline++;



}



});











// UPDATE UI



if(todaySalesElement){



todaySalesElement.innerText =


"RM " +

totalSales.toFixed(2);



}








if(todayOrdersElement){



todayOrdersElement.innerText =


totalOrders;



}








if(pendingOrdersElement){



pendingOrdersElement.innerText =


pendingOrders;



}








if(staffOnlineElement){



staffOnlineElement.innerText =


staffOnline;



}





}

catch(error){



console.log(

"Dashboard Error:",

error

);



}



}












// REFRESH BUTTON



document.getElementById(

"refreshBtn"

)

?.addEventListener(

"click",

()=>{


loadDashboard();



}

);











// LANGUAGE BUTTON



document.getElementById(

"languageBtn"

)

?.addEventListener(

"click",

()=>{



window.location.href =

"../language.html";



}

);









// PROFILE BUTTON



document.getElementById(

"adminProfileBtn"

)

?.addEventListener(

"click",

()=>{



alert(

"Admin Profile"

);



}

);











// START



loadDashboard();
