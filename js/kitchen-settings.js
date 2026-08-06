// pos/js/kitchen-settings.js


import { supabase } from "./supabase.js";



const sectionSelect =
document.getElementById("sectionSelect");


const categoryList =
document.getElementById("categoryList");


const saveBtn =
document.getElementById("saveKitchenMappingBtn");


const addSectionBtn =
document.getElementById("addSectionBtn");



const newSectionName =
document.getElementById("newSectionName");




let categories = [];

let selectedSection = null;







// LOAD SECTIONS

async function loadSections(){



const {data,error}=

await supabase

.from("kitchen_sections")

.select("*")

.eq(
"status",
"active"
)

.order(
"section_name"
);





if(error){

console.log(error);

return;

}



sectionSelect.innerHTML =

`
<option value="">
Select Section
</option>
`;




data.forEach(section=>{


sectionSelect.innerHTML +=

`
<option value="${section.id}">

${section.section_name}

</option>
`;



});



}









// LOAD CATEGORIES


async function loadCategories(){



const {data,error}=

await supabase

.from("menu")

.select("category");





if(error){

console.log(error);

return;

}





categories = [

...new Set(

data

.map(item=>item.category)

.filter(Boolean)

)

];



showCategories();



}









// SHOW CATEGORY CHECKBOX


function showCategories(){



categoryList.innerHTML="";





categories.forEach(category=>{


categoryList.innerHTML +=


`

<label style="display:block;margin:8px 0;">


<input

type="checkbox"

class="category-check"

value="${category}">


${category}


</label>


`;



});



}









// SECTION CHANGE


sectionSelect.addEventListener(

"change",

async()=>{


selectedSection =

sectionSelect.value;



if(!selectedSection){

return;

}



await loadExistingMapping();



}

);









// LOAD SAVED CATEGORY


async function loadExistingMapping(){



const {data}=

await supabase

.from("kitchen_section_categories")

.select("category")

.eq(

"section_id",

selectedSection

);






document

.querySelectorAll(
".category-check"
)

.forEach(check=>{


check.checked =

data?.some(

item=>

item.category===check.value

);


});



}









// SAVE MAPPING


saveBtn.onclick = async()=>{



if(!selectedSection){


alert(
"Select Section First"
);


return;

}






await supabase

.from("kitchen_section_categories")

.delete()

.eq(

"section_id",

selectedSection

);







let selected=[];



document

.querySelectorAll(
".category-check:checked"
)

.forEach(check=>{


selected.push({

section_id:
selectedSection,


category:
check.value


});



});






if(selected.length){



await supabase

.from("kitchen_section_categories")

.insert(selected);



}





alert(
"Kitchen Mapping Saved"
);



};









// ADD NEW SECTION


addSectionBtn.onclick = async()=>{



let name =

newSectionName.value.trim();





if(!name){

alert(
"Enter Section Name"
);

return;

}






const {error}=

await supabase

.from("kitchen_sections")

.insert({

section_name:name

});





if(error){

alert(error.message);

return;

}





alert(
"New Section Added"
);



newSectionName.value="";



loadSections();



};









loadSections();

loadCategories();
