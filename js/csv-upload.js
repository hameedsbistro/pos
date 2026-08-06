// pos/js/csv-upload.js


import { db } from "./firebase.js";


import {

collection,

addDoc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";





const uploadBtn = document.getElementById("uploadCsvBtn");





if(uploadBtn){


uploadBtn.addEventListener(

"click",

async()=>{



const file = document.getElementById("csvFile").files[0];





if(!file){


alert("Please select CSV file");


return;


}







const reader = new FileReader();






reader.onload = async function(event){



const csvText = event.target.result;





const rows = csvText
.split("\n")
.map(row=>row.trim())
.filter(row=>row !== "");






if(rows.length < 2){


alert("CSV file is empty");


return;


}







// CSV HEADER


const headers = rows[0]
.split(",")
.map(header=>header.trim());








for(let i = 1; i < rows.length; i++){



const values = rows[i]
.split(",")
.map(value=>value.trim());






const item = {};





headers.forEach(

(header,index)=>{


item[header] = values[index] || "";


}

);









await addDoc(

collection(db,"menu"),

{


category:

item["Category"] || "",





itemName:

item["Item Name"] || "",






dineInPrice:

Number(
item["Dine In Price"]
) || 0,






takeAwayPrice:

Number(
item["Take Away Price"]
) || 0,






image:

item["Image"] || "",






popular:

String(
item["Popular"]
)
.toLowerCase()
===
"true",






createdAt:

new Date()



}



);



}







alert(

"CSV Upload Completed Successfully"

);






location.reload();




};






reader.readAsText(file);





}

);

}
