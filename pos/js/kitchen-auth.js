import { supabase } from "./supabase.js";



let currentUser = null;
let attendanceId = null;



// LOGIN CHECK

async function checkKitchenLogin(){


const {
data:{user}
}= await supabase.auth.getUser();



if(!user){

window.location.href="../login.html";

return;

}




const {data:userData,error}=

await supabase

.from("users")

.select("*")

.eq(
"email",
user.email
)

.single();





if(error || !userData){

await supabase.auth.signOut();

window.location.href="../login.html";

return;

}





// ONLY ADMIN AND COOK


if(

userData.role !== "admin" &&

userData.role !== "cook"

){


alert(
"Kitchen access denied"
);


await supabase.auth.signOut();


window.location.href="../login.html";


return;


}



currentUser = userData;



document.getElementById(
"userName"
).innerText =

userData.name;



document.getElementById(
"userRole"
).innerText =

userData.role;



loadAttendance();



}









// CHECK IN


document.getElementById(
"checkInBtn"
)?.addEventListener(
"click",
async()=>{



if(!currentUser)
return;




let now = new Date();





const {data,error}=

await supabase

.from("attendance")

.insert({

user_id:
currentUser.id,


name:
currentUser.name,


role:
currentUser.role,


date:
now.toISOString()
.split("T")[0],


check_in:
now.toISOString(),


status:
"working"


})

.select()

.single();





if(error){

alert(error.message);

return;

}



attendanceId=data.id;


alert(
"Checked In"
);



});









// CHECK OUT


document.getElementById(
"checkOutBtn"
)?.addEventListener(
"click",
async()=>{



if(!attendanceId){

alert(
"Please Check In first"
);

return;

}





await supabase

.from("attendance")

.update({

check_out:
new Date().toISOString(),


status:
"completed"


})

.eq(

"id",

attendanceId

);



alert(
"Checked Out"
);



});









// FIND TODAY ATTENDANCE


async function loadAttendance(){



const today =

new Date()

.toISOString()

.split("T")[0];




const {data}=

await supabase

.from("attendance")

.select("*")

.eq(
"user_id",
currentUser.id
)

.eq(
"date",
today
)

.maybeSingle();





if(data){

attendanceId=data.id;

}



}






// LOGOUT


document.getElementById(
"logoutBtn"
)?.addEventListener(
"click",
async()=>{


await supabase.auth.signOut();


window.location.href="../login.html";


});






checkKitchenLogin();
