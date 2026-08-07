import { supabase } from "./supabase.js";

const checkInBtn = document.getElementById("checkInBtn");
const checkOutBtn = document.getElementById("checkOutBtn");

async function getKitchenUser() {

    const localUser =
        JSON.parse(localStorage.getItem("kitchenUser"));

    if (localUser) return localUser;

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

    return data;

}



// ======================
// CHECK IN
// ======================

checkInBtn?.addEventListener("click", async () => {

    const user = await getKitchenUser();

    if (!user) {
        alert("User not found");
        return;
    }

    const today =
        new Date().toISOString().split("T")[0];



    const { data: existing } = await supabase
        .from("attendance")
        .select("*")
        .eq("staff_id", user.id)
        .eq("attendance_date", today)
        .maybeSingle();



    if (existing) {
        alert("Already Checked In");
        return;
    }



    const now =
        new Date().toLocaleTimeString();



    const { error } = await supabase
        .from("attendance")
        .insert({

            staff_id: user.id,

            staff_name: user.name,

            role: user.role,

            attendance_date: today,

            check_in: now,

            status: "Present"

        });



    if (error) {

        alert(error.message);

        return;

    }



    alert("Check In Successful");

});



// ======================
// CHECK OUT
// ======================

checkOutBtn?.addEventListener("click", async () => {

    const user = await getKitchenUser();

    if (!user) {

        alert("User not found");

        return;

    }



    const today =
        new Date().toISOString().split("T")[0];



    const now =
        new Date().toLocaleTimeString();



    const { error } = await supabase

        .from("attendance")

        .update({

            check_out: now

        })

        .eq("staff_id", user.id)

        .eq("attendance_date", today);



    if (error) {

        alert(error.message);

        return;

    }



    alert("Check Out Successful");

});
