import { supabase } from "./supabase.js";


const loginBtn = document.getElementById("loginBtn");


loginBtn?.addEventListener("click", async()=>{


    const email =
    document.getElementById("email").value.trim();


    const password =
    document.getElementById("password").value;



    const message =
    document.getElementById("message");



    if(!email || !password){

        message.innerText =
        "Enter email and password";

        return;

    }



    const {data,error} =
    await supabase.auth.signInWithPassword({

        email,
        password

    });




    if(error){

        message.innerText =
        error.message;

        return;

    }





    const {data:user,error:userError} =

    await supabase

    .from("users")

    .select("*")

    .eq("email",email)

    .single();






    if(userError || !user){


        await supabase.auth.signOut();


        message.innerText =
        "User not found";


        return;

    }





    if(

        user.role !== "admin" &&

        user.role !== "cook"

    ){


        await supabase.auth.signOut();


        message.innerText =
        "Kitchen access denied";


        return;

    }







    if(user.status !== "active"){


        await supabase.auth.signOut();


        message.innerText =
        "Account inactive";


        return;

    }







    localStorage.setItem(

        "kitchenUser",

        JSON.stringify(user)

    );






    window.location.href =
    "/kitchen/index.html";



});
