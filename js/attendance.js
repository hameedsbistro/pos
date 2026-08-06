// pos/js/attendance.js



import { db } from "./firebase.js";



import {

collection,

getDocs,

addDoc,

updateDoc,

doc,

query,

where,

orderBy

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";








const staffSelect =

document.getElementById(
"staffSelect"
);



const attendanceTable =

document.getElementById(
"attendanceTable"
);









// LOAD STAFF LIST



async function loadStaff(){



const snapshot =

await getDocs(

collection(
db,
"users"
)

);







snapshot.forEach(

staffDoc=>{



let staff = staffDoc.data();






if(

staff.role !== "admin"

&&

staff.role !== "customer"

){



let option =

document.createElement(
"option"
);





option.value = staffDoc.id;



option.textContent =

staff.name +

" (" +

staff.role +

")";





staffSelect.appendChild(option);



}



});



}











// CHECK IN



document.getElementById(
"checkInBtn"
)

.addEventListener(

"click",

async()=>{





let staffId =

staffSelect.value;






if(!staffId){


alert(
"Select Staff"
);


return;


}







const staffDoc =

await getDocs(

query(

collection(db,"users"),

where(

"uid",

"==",

staffId

)

)

);








let staffData = null;







staffDoc.forEach(

doc=>{


staffData = doc.data();


}

);








await addDoc(

collection(

db,

"attendance"

),

{


staffId:staffId,


staffName:

staffData?.name || "",




role:

staffData?.role || "",





checkIn:

new Date(),





checkOut:null,





status:"Present"





}

);







alert(
"Check In Successful"
);





loadAttendance();



}

);











// LOAD ATTENDANCE



async function loadAttendance(){



attendanceTable.innerHTML="";







const q = query(

collection(db,"attendance"),

orderBy(

"checkIn",

"desc"

)

);







const snapshot =

await getDocs(q);








snapshot.forEach(

attendanceDoc=>{



let data = attendanceDoc.data();






let row =

document.createElement(
"tr"
);







row.innerHTML = `



<td>

${data.staffName}

</td>




<td>

${data.role}

</td>





<td>

${data.checkIn?.toDate().toLocaleTimeString() || ""}

</td>





<td>

${data.checkOut ? data.checkOut.toDate().toLocaleTimeString() : "-"}

</td>





<td>

${calculateTime(

data.checkIn,

data.checkOut

)}

</td>





<td>

<span class="attendance-status">

${data.status}

</span>

</td>



`;






attendanceTable.appendChild(row);



});





}









// WORKING TIME



function calculateTime(

start,

end

){



if(!start)

return "-";






let startTime =

start.toDate();






let endTime =

end ?

end.toDate()

:

new Date();







let diff =

endTime - startTime;







let hours =

Math.floor(

diff /

(1000*60*60)

);






let minutes =

Math.floor(

(diff %

(1000*60*60))

/

(1000*60)

);







return hours+"h "+minutes+"m";



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







loadStaff();

loadAttendance();
