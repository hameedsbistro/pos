import { supabase } from "./supabase.js";



const user = 
JSON.parse(
localStorage.getItem("kitchenUser")
);



const checkInBtn =
document.getElementById("checkInBtn");


const checkOutBtn =
document.getElementById("checkOutBtn");





// ===========================
// CURRENT DATE
// ===========================


function today(){

    return new Date()
    .toISOString()
    .split("T")[0];

}



// ===========================
// CURRENT TIME
// ===========================


function currentTime(){

    return new Date()
    .toLocaleTimeString(
        "en-GB",
        {
            hour12:false
        }
    );

}





// ===========================
// CHECK IN
// ===========================


checkInBtn?.addEventListener(
"click",
async()=>{


    const date =
    today();



    const {data:existing}=

    await supabase

    .from("attendance")

    .select("*")

    .eq(
        "staff_id",
        user.id
    )

    .eq(
        "attendance_date",
        date
    )

    .maybeSingle();





    if(existing){

        alert(
        "Already Checked In"
        );

        return;

    }







    const {error}=

    await supabase

    .from("attendance")

    .insert({

        staff_id:user.id,

        staff_name:user.name,

        role:user.role,

        attendance_date:date,

        check_in:currentTime(),

        status:"Present"

    });





    if(error){

        console.log(error);

        alert(
        error.message
        );

        return;

    }



    alert(
    "Check In Successful"
    );


});









// ===========================
// CHECK OUT
// ===========================


checkOutBtn?.addEventListener(
"click",
async()=>{


    const date =
    today();





    const {data:attendance}=

    await supabase

    .from("attendance")

    .select("*")

    .eq(
        "staff_id",
        user.id
    )

    .eq(
        "attendance_date",
        date
    )

    .maybeSingle();







    if(!attendance){


        alert(
        "Check In First"
        );


        return;

    }







    const {error}=

    await supabase

    .from("attendance")

    .update({

        check_out:currentTime(),

        status:"Completed"

    })

    .eq(
        "id",
        attendance.id
    );







    if(error){

        console.log(error);

        alert(
        error.message
        );

        return;

    }



    alert(
    "Check Out Successful"
    );



});
