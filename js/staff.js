// pos/js/staff.js



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





import {

createUserWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";





import {

auth

}

from "./firebase.js";









const staffTable =

document.getElementById(
"staffTable"
);









// LOAD STAFF



async function loadStaff(){



staffTable.innerHTML="";







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








if(staff.role !== "customer" && staff.role !== "admin"){



let row =

document.createElement(
"tr"
);







row.innerHTML = `



<td>

${staff.name || ""}

</td>





<td>

${staff.email || ""}

</td>





<td>

<span class="role-badge">

${staff.role}

</span>

</td>





<td>


<span class="${staff.status==="active" ? "active-badge":"inactive-badge"}">


${staff.status}


</span>


</td>





<td>


<button class="delete-staff-btn">

Delete

</button>


</td>



`;








row.querySelector(

".delete-staff-btn"

)

.onclick=async()=>{



if(confirm("Delete Staff?")){



await deleteDoc(

doc(

db,

"users",

staffDoc.id

)

);



loadStaff();



}



};








staffTable.appendChild(row);



}



});




}









// ADD STAFF



document.getElementById(

"addStaffBtn"

)

.addEventListener(

"click",

async()=>{





let name =

document.getElementById(
"staffName"
).value;






let email =

document.getElementById(
"staffEmail"
).value;







let password =

document.getElementById(
"staffPassword"
).value;







let role =

document.getElementById(
"staffRole"
).value;








try{



const userCredential =

await createUserWithEmailAndPassword(

auth,

email,

password

);






const user =

userCredential.user;








await addDoc(

collection(db,"users"),

{


uid:user.uid,


name:name,


email:email,


role:role,


status:"active",


createdAt:new Date()



}



);






alert(
"Staff Added Successfully"
);






loadStaff();





}

catch(error){



alert(
error.message
);



}




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







loadStaff();
