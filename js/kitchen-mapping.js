// pos/js/kitchen-mapping.js


import { supabase } from "./supabase.js";



const mappingList =
document.getElementById(
"kitchenMappingList"
);





const sections = [

"Main Kitchen",

"Tandoor",

"Drinks",

"Dessert",

"Packing"

];







// LOAD CATEGORY MAPPING


async function loadKitchenMapping(){



if(!mappingList) return;



mappingList.innerHTML =
"Loading...";






// Get menu categories

const {data:menu,error:menuError}=

await supabase

.from("menu")

.select("category");






if(menuError){

console.log(menuError);

return;

}






let categories = [

...new Set(

menu

.map(item=>item.category)

.filter(Boolean)

)

];






// Get existing mapping

const {data:mapping}=

await supabase

.from("kitchen_mapping")

.select("*");









mappingList.innerHTML="";







categories.forEach(category=>{



let old =

mapping?.find(

m=>

m.category===category

);







let div =

document.createElement("div");



div.className =
"mapping-row";





div.innerHTML = `


<div class="mapping-category">

${category}

</div>




<select class="section-select">


${sections.map(section=>`


<option value="${section}"

${old?.section===section?"selected":""}

>

${section}

</option>


`).join("")}



</select>




<button class="save-mapping-btn">

Save

</button>



`;







let select =

div.querySelector(
".section-select"
);





let saveBtn =

div.querySelector(
".save-mapping-btn"
);








saveBtn.onclick = async()=>{





if(old){



await supabase

.from("kitchen_mapping")

.update({

section:
select.value

})

.eq(

"id",

old.id

);



}

else{



await supabase

.from("kitchen_mapping")

.insert({

category:
category,


section:
select.value

});


}





alert(
"Kitchen Section Saved"
);



loadKitchenMapping();



};







mappingList.appendChild(div);



});



}








// REFRESH BUTTON


document.getElementById(
"refreshBtn"
)?.addEventListener(
"click",
()=>{

location.reload();

});








loadKitchenMapping();
