// js/auth.js


import { supabase } from "./supabase.js";





// =================================
// GET AUTH SESSION
// =================================


export async function getSessionUser(){



const {

data

}=await supabase.auth.getSession();





if(!data.session){

return null;

}





return data.session.user;



}









// =================================
// GET PROFILE FROM USERS TABLE
// =================================


export async function getUserProfile(){



const authUser =

await getSessionUser();





if(!authUser){

return null;

}






const {

data,

error

}=await supabase

.from("users")

.select("*")

.eq(

"id",

authUser.id

)

.single();







if(error){


console.log(
"User profile error:",
error.message
);


return null;


}





return data;



}









// =================================
// LOGIN CHECK
// =================================


export async function requireLogin(){



const user =

await getUserProfile();





if(!user){


window.location.href =
"login.html";


return null;


}






if(user.status !== "active"){


alert(
"Account inactive"
);


await logout();


return null;


}







return user;



}









// =================================
// ROLE CHECK
// =================================


export async function requireRole(
roles=[]
){



const user =

await requireLogin();





if(!user){

return null;

}






if(
!roles.includes(
user.role
)

){



alert(
"You don't have permission"
);



window.history.back();



return null;



}






return user;



}









// =================================
// SAVE LOCAL USER
// =================================


export function saveLocalUser(user){



localStorage.setItem(

"user",

JSON.stringify(user)

);



}









// =================================
// GET LOCAL USER
// =================================


export function getLocalUser(){



const user =

localStorage.getItem(
"user"
);





if(!user){

return null;

}





return JSON.parse(user);



}









// =================================
// LOGOUT
// =================================


export async function logout(){



await supabase.auth.signOut();





localStorage.removeItem(
"user"
);





window.location.href =
"login.html";



}
