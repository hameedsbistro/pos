import { supabase } from "./supabase.js";


async function loadUser(){

    const email = localStorage.getItem("userEmail");

    if(!email){
        console.log("No user email found");
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


    document.getElementById("userName").innerText =
        data.name;


    document.getElementById("userRole").innerText =
        data.role;

}



document
.getElementById("logoutBtn")
.addEventListener("click",()=>{


    localStorage.clear();

    window.location.href="../index.html";


});



document
.getElementById("backBtn")
.addEventListener("click",()=>{


    window.history.back();


});



loadUser();
