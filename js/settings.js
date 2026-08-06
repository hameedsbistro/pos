// pos/js/settings.js



import { db } from "./firebase.js";


import {

doc,

setDoc,

getDoc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";








const languageSelect =

document.getElementById(
"defaultLanguage"
);





const saveBtn =

document.getElementById(
"saveLanguageBtn"
);









// LOAD CURRENT LANGUAGE



async function loadLanguage(){



let savedLanguage =

localStorage.getItem(
"language"
);





if(savedLanguage){



languageSelect.value = savedLanguage;



}







try{



const settingDoc =

await getDoc(

doc(

db,

"settings",

"language"

)

);






if(settingDoc.exists()){


let data = settingDoc.data();




languageSelect.value =

data.defaultLanguage;




localStorage.setItem(

"language",

data.defaultLanguage

);



}



}

catch(error){



console.log(error);



}



}









// SAVE LANGUAGE



saveBtn.addEventListener(

"click",

async()=>{





let language =

languageSelect.value;








localStorage.setItem(

"language",

language

);








await setDoc(

doc(

db,

"settings",

"language"

),

{


defaultLanguage:

language



}

);







alert(

"Language Saved"

);






location.reload();





}

);









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








loadLanguage();
