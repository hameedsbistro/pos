// pos/js/auth.js

import { supabase } from "./supabase.js";


// LOGIN

export async function loginUser(email, password){


const { data, error } = await supabase.auth.signInWithPassword({

    email: email,

    password: password

});



if(error){

    throw error;

}



return data.user;


}






// LOGOUT

export async function logoutUser(){


await supabase.auth.signOut();


window.location.href="../login.html";


}






// GET CURRENT USER

export async function getCurrentUser(){


const { 

data:{user}

} = await supabase.auth.getUser();



return user;


}






// CHECK LOGIN

export async function checkAuth(){


const user = await getCurrentUser();



if(!user){


window.location.href="../login.html";


return false;


}



return true;


}
