// js/language.js



import { translations } from "./translation.js";




// ===============================
// CURRENT LANGUAGE
// ===============================


let currentLanguage =

localStorage.getItem(
"language"
)

||

"en";









// ===============================
// CHANGE LANGUAGE
// ===============================


export function changeLanguage(lang){



if(!translations[lang]){


lang="en";


}





currentLanguage = lang;



localStorage.setItem(

"language",

lang

);






applyLanguage();



}









// ===============================
// APPLY LANGUAGE
// ===============================


export function applyLanguage(){



const elements =

document.querySelectorAll(

"[data-i18n]"

);






elements.forEach(

element=>{



const key =

element.dataset.i18n;






if(

translations[currentLanguage]

&&

translations[currentLanguage][key]

){



element.innerText =

translations[currentLanguage][key];



}





});





}









// ===============================
// GET LANGUAGE
// ===============================


export function getLanguage(){


return currentLanguage;


}









// ===============================
// LANGUAGE BUTTON
// ===============================


document.addEventListener(

"click",

(e)=>{



if(

e.target.classList.contains(
"language-option"
)

){



const lang =

e.target.dataset.lang;



changeLanguage(lang);



}



});









// START


applyLanguage();
