import { supabase } from "./supabase.js";



let currentUser = null;



async function getCurrentUser(){


    const email = localStorage.getItem("userEmail");


    if(!email){
        return;
    }



    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();



    if(error){

        console.log(error);
        return;

    }


    currentUser = data;


}




// CHECK IN

document
.getElementById("checkInBtn")
.addEventListener("click", async()=>{


    if(!currentUser){

        await getCurrentUser();

    }



    const { error } = await supabase
    .from("attendance")
    .insert([

        {

        staff_id: currentUser.id,

        staff_name: currentUser.name,

        role: currentUser.role,

        check_in: new Date(),

        status:"Present"

        }

    ]);



    if(error){

        alert(error.message);

    }
    else{

        alert("Check In Successful");

    }



});






// CHECK OUT

document
.getElementById("checkOutBtn")
.addEventListener("click", async()=>{


    if(!currentUser){

        await getCurrentUser();

    }



    const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("staff_id", currentUser.id)
    .is("check_out", null)
    .order("created_at",{ascending:false})
    .limit(1)
    .single();



    if(error){

        alert("No active check-in found");

        return;

    }




    const { error:updateError } = await supabase
    .from("attendance")
    .update({

        check_out:new Date()

    })
    .eq("id", data.id);




    if(updateError){

        alert(updateError.message);

    }
    else{

        alert("Check Out Successful");

    }



});



getCurrentUser();
