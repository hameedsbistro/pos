```javascript
// js/auth.js

import { supabase } from "./supabase.js";


// =====================================
// LOCAL USER KEY
// =====================================

const LOCAL_USER_KEY = "hameed_logged_user";


// =====================================
// LOGIN
// =====================================

export async function loginUser(email, password) {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    if (!cleanEmail || !password) {

        return {
            success: false,
            message: "Email and password are required."
        };

    }


    // ---------------------------------
    // SUPABASE AUTH LOGIN
    // ---------------------------------

    const {
        data: authData,
        error: authError
    } = await supabase.auth.signInWithPassword({

        email: cleanEmail,

        password: password

    });


    if (authError) {

        console.error(
            "Supabase login error:",
            authError
        );

        return {
            success: false,
            message: authError.message
        };

    }


    if (!authData?.user) {

        return {
            success: false,
            message: "Authentication failed."
        };

    }


    // ---------------------------------
    // LOAD USER PROFILE
    // ---------------------------------

    const {
        data: profile,
        error: profileError
    } = await supabase
        .from("users")
        .select(`
            id,
            name,
            email,
            role,
            status,
            created_at
        `)
        .eq(
            "email",
            cleanEmail
        )
        .maybeSingle();


    if (profileError) {

        console.error(
            "Profile query error:",
            profileError
        );


        await supabase.auth.signOut();


        return {
            success: false,
            message: "Unable to load user profile."
        };

    }


    if (!profile) {

        console.error(
            "No profile found for:",
            cleanEmail
        );


        await supabase.auth.signOut();


        return {
            success: false,
            message: "User profile not found."
        };

    }


    // ---------------------------------
    // CHECK STATUS
    // ---------------------------------

    if (
        String(profile.status || "")
            .toLowerCase()
        !== "active"
    ) {

        await supabase.auth.signOut();


        return {
            success: false,
            message: "Your account is inactive."
        };

    }


    // ---------------------------------
    // FINAL USER OBJECT
    // ---------------------------------

    const user = {

        auth_id:
            authData.user.id,

        id:
            profile.id,

        name:
            profile.name,

        email:
            profile.email,

        role:
            String(
                profile.role || ""
            ).toLowerCase(),

        status:
            profile.status,

        created_at:
            profile.created_at

    };


    // ---------------------------------
    // SAVE LOCAL SESSION
    // ---------------------------------

    localStorage.setItem(

        LOCAL_USER_KEY,

        JSON.stringify(user)

    );


    return {

        success: true,

        user: user

    };

}


// =====================================
// GET CURRENT AUTH USER
// =====================================

export async function getCurrentUser() {

    const {
        data,
        error
    } = await supabase.auth.getUser();


    if (error || !data?.user) {

        return null;

    }


    const authUser =
        data.user;


    // ---------------------------------
    // LOAD PROFILE BY EMAIL
    // ---------------------------------

    const {
        data: profile,
        error: profileError
    } = await supabase
        .from("users")
        .select(`
            id,
            name,
            email,
            role,
            status,
            created_at
        `)
        .eq(
            "email",
            String(
                authUser.email || ""
            )
            .trim()
            .toLowerCase()
        )
        .maybeSingle();


    if (profileError) {

        console.error(
            "Profile load error:",
            profileError
        );

        return null;

    }


    if (!profile) {

        return null;

    }


    if (
        String(profile.status || "")
            .toLowerCase()
        !== "active"
    ) {

        return null;

    }


    const user = {

        auth_id:
            authUser.id,

        id:
            profile.id,

        name:
            profile.name,

        email:
            profile.email,

        role:
            String(
                profile.role || ""
            ).toLowerCase(),

        status:
            profile.status,

        created_at:
            profile.created_at

    };


    localStorage.setItem(

        LOCAL_USER_KEY,

        JSON.stringify(user)

    );


    return user;

}


// =====================================
// LOCAL USER
// =====================================

export function getLocalUser() {

    try {

        const saved =
            localStorage.getItem(
                LOCAL_USER_KEY
            );


        if (!saved) {

            return null;

        }


        return JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "Local user error:",
            error
        );


        localStorage.removeItem(
            LOCAL_USER_KEY
        );


        return null;

    }

}


// =====================================
// LOGOUT
// =====================================

export async function logout() {

    try {

        await supabase.auth.signOut();

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }


    localStorage.removeItem(
        LOCAL_USER_KEY
    );


    window.location.href =
        "login.html";

}


// =====================================
// ROLE CHECK
// =====================================

export async function requireRole(
    allowedRoles = []
) {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
            user.role
        )
    ) {

        alert(
            "You do not have permission to access this page."
        );


        window.location.href =
            "index.html";


        return null;

    }


    return user;

}


// =====================================
// AUTH STATE LISTENER
// =====================================

supabase.auth.onAuthStateChange(

    async (
        event,
        session
    ) => {

        if (
            event === "SIGNED_OUT"
        ) {

            localStorage.removeItem(
                LOCAL_USER_KEY
            );

        }

    }

);
```
