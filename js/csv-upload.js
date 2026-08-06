// pos/js/csv-upload.js


import { db } from "./firebase.js";


import {

collection,

addDoc

}

from

"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";





const uploadBtn =

document.getElementById(
"uploadCsvBtn"
);



if(uploadBtn){



uploadBtn.addEventListener(

"click",

async()=>{



const file =

document.getElementById(
"csvFile"
).files[0];





if(!file){


alert(
"Please select CSV file"
);


return;


}







const reader =

new FileReader();







reader.onload = async function(e){



let text = e.target.result;





let rows =

text.split("\n");






let headers =

rows[0]
.split(",")
.map(
x=>x.trim()
);








for(let i=1;i<rows.length;i++){



if(rows[i].trim()==="")

continue;







let values =

rows[i]
.split(",")
.map(
x=>x.trim()
);








let item = {};





headers.forEach(

(header,index)=>{


item[header]=values[index];


}

);







await addDoc(

collection(
db,
"menu"
),

{


category:

item["Category"],




item["itemName"]:

item["Item Name"],




dineInPrice:

Number(
item["Dine In Price"]
),





takeAwayPrice:

Number(
item["Take Away Price"]
),





image:

item["Image"],





popular:

item["Popular"]==="true",





createdAt:

new Date()



}



);





}





alert(
"CSV Upload Completed"
);






location.reload();





};







reader.readAsText(file);



}



);



}
