import { supabase } from "./supabase.js";



let attendanceId = null;





async function getCurrentUser(){



const userData =

JSON.parse(

localStorage.getItem("kitchenUser")

);



return userData;


}








async function loadTodayAttendance(){



const user = await getCurrentUser();



if(!user)
return;





const today =

new Date()

.toISOString()

.split("T")[0];







const {data,error}=

await supabase

.from("attendance")

.select("*")

.eq(

"user_id",

user.id

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








// CHECK IN


document

.getElementById("checkInBtn")

?.addEventListener(

"click",

async()=>{





const user =

await getCurrentUser();





if(!user){

alert(
"Login required"
);

return;

}





if(attendanceId){


alert(
"Already Checked In"
);


return;


}







const now =

new Date();







const {data,error}=

await supabase

.from("attendance")

.insert({

user_id:user.id,

name:user.name,

role:user.role,

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
"Check In Successful"
);



}

);











// CHECK OUT


document

.getElementById("checkOutBtn")

?.addEventListener(

"click",

async()=>{





if(!attendanceId){


alert(
"Please Check In First"
);


return;


}






const {error}=

await supabase

.from("attendance")

.update({

check_out:

new Date()

.toISOString(),


status:

"completed"


})

.eq(

"id",

attendanceId

);







if(error){


alert(error.message);


return;


}







attendanceId=null;



alert(
"Check Out Successful"
);



}

);









loadTodayAttendance();
