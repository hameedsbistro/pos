// pos/js/admin-menu.js

import { supabase } from "./supabase.js";



const csvFile =
document.getElementById("csvFile");


const uploadBtn =
document.getElementById("uploadCsvBtn");


const saveBtn =
document.getElementById("saveMenuBtn");


const menuTable =
document.getElementById("menuTable");





// LOAD MENU


async function loadMenu(){


menuTable.innerHTML="";


const { data, error } = await supabase
.from("menu")
.select("*")
.order("created_at", { ascending:false });



if(error){

console.log(error);
return;

}




data.forEach(item=>{


let row =
document.createElement("tr");



row.innerHTML = `


<td>
${item.category || ""}
</td>


<td>
${item.itemname || item.itemName || ""}
</td>


<td>
RM ${Number(item.dineinprice || item.dineInPrice).toFixed(2)}
</td>


<td>
RM ${Number(item.takeawayprice || item.takeAwayPrice).toFixed(2)}
</td>


<td>
${item.popular ? "YES" : "NO"}
</td>



<td>

<button class="delete-btn"
data-id="${item.id}">
Delete
</button>

</td>


`;




row.querySelector(".delete-btn")
.onclick = async()=>{


await supabase
.from("menu")
.delete()
.eq("id",item.id);



loadMenu();


};




menuTable.appendChild(row);



});



}








// SAVE SINGLE ITEM


saveBtn.onclick = async()=>{



let item = {


category:
document.getElementById("category").value,


itemName:
document.getElementById("itemName").value,


dineInPrice:
Number(
document.getElementById("dineInPrice").value
),


takeAwayPrice:
Number(
document.getElementById("takeAwayPrice").value
),


image:
document.getElementById("image").value,


popular:
document.getElementById("popular").checked,


status:
"active"


};




const {error}= await supabase
.from("menu")
.insert([item]);





if(error){

alert(error.message);

return;

}




alert("Menu Added");



loadMenu();


};









// CSV UPLOAD


uploadBtn.onclick = async()=>{



const file =
csvFile.files[0];



if(!file){

alert("Select CSV File");

return;

}




const text =
await file.text();



let rows =
text.trim().split("\n");





let headers =
rows[0]
.split(",")
.map(h=>h.trim());





let items=[];



for(let i=1;i<rows.length;i++){


let values =
rows[i]
.split(",");



let obj={};



headers.forEach((header,index)=>{


obj[header]=values[index];


});





items.push({

category:
obj.category,


itemName:
obj.itemName,


dineInPrice:
Number(obj.dineInPrice),


takeAwayPrice:
Number(obj.takeAwayPrice),


image:
obj.image || "",


popular:
obj.popular==="true",


status:
"active"


});



}





const {error}=await supabase
.from("menu")
.insert(items);





if(error){

alert(error.message);

return;

}



alert(
"CSV Uploaded Successfully"
);



loadMenu();



};









// REFRESH

document.getElementById(
"refreshBtn"
)?.addEventListener(
"click",
()=>{

location.reload();

});








loadMenu();
