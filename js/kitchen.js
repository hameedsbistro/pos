import { supabase } from "./supabase.js";


let currentStatus = "New";
let currentSection = "";





// LOAD STATIONS

async function loadStations(){


    const { data, error } = await supabase
    .from("kitchen_sections")
    .select("*")
    .eq("status","active")
    .order("section_name");



    if(error){

        console.log(error);
        return;

    }



    const select =
    document.getElementById("sectionSelect");



    data.forEach(section=>{


        const option =
        document.createElement("option");


        option.value = section.id;

        option.textContent =
        section.section_name;


        select.appendChild(option);


    });



}






// LOAD ORDERS


async function loadOrders(){



let query =
supabase
.from("orders")
.select(`

id,
order_number,
table_number,
status,
created_at,

order_items(
item_name,
quantity,
item_note
)

`)
.eq("status",currentStatus)
.order("created_at",{ascending:false});





const {data,error}=await query;



if(error){

console.log(error);

return;

}




const container =
document.getElementById("orderContainer");



container.innerHTML="";




if(!data || data.length===0){

container.innerHTML=
`
<h3>No Orders Found</h3>
`;

return;

}





data.forEach(order=>{


const card =
document.createElement("div");


card.className="order-card";



let items="";



order.order_items.forEach(item=>{


items +=`

<div class="item">

<b>${item.item_name}</b>

<br>

Qty: ${item.quantity}

<br>

Note:
${item.item_note ?? ""}

</div>

`;


});






card.innerHTML=`

<h3>
Order #${order.order_number}
</h3>


<p>
Table:
${order.table_number ?? "-"}
</p>


${items}



<button class="ready"
data-id="${order.id}">
READY
</button>


`;



container.appendChild(card);



});






// READY BUTTON

document
.querySelectorAll(".ready")
.forEach(btn=>{


btn.onclick=async()=>{


await updateStatus(
btn.dataset.id,
"Ready"
);


};


});





}








// UPDATE STATUS


async function updateStatus(id,status){



const {error}=await supabase
.from("orders")
.update({

status:status

})
.eq("id",id);




if(error){

alert(error.message);

}
else{

loadOrders();

}


}







// BUTTONS



document
.getElementById("refreshBtn")
.onclick=()=>loadOrders();




document
.getElementById("newBtn")
.onclick=()=>{


currentStatus="New";

loadOrders();


};




document
.getElementById("readyBtn")
.onclick=()=>{


currentStatus="Ready";

loadOrders();


};





document
.getElementById("completedBtn")
.onclick=()=>{


currentStatus="Completed";

loadOrders();


};





document
.getElementById("sectionSelect")
.onchange=(e)=>{


currentSection=e.target.value;

loadOrders();


};








loadStations();

loadOrders();
