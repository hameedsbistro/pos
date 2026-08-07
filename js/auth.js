```javascript
// js/auth.js

import { supabase } from "./supabase.js";


// =====================================
// LOCAL STORAGE KEY
// =====================================

const LOCAL_USER_KEY = "hameed_logged_user";


// =====================================
// SAVE LOCAL USER
// =====================================

export function saveLocalUser(user) {

    try {

        localStorage.setItem(
            LOCAL_USER_KEY,
            JSON.stringify(user)
        );

        return true;

    } catch (error) {

        console.error(
            "saveLocalUser error:",
            error
        );

        return false;
    }
}


// =====================================
// GET LOCAL USER
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

    } catch (error) {

        console.error(
            "getLocalUser error:",
            error
        );

        localStorage.removeItem(
            LOCAL_USER_KEY
        );

        return null;
    }
}


// =====================================
// REMOVE LOCAL USER
// =====================================

export function clearLocalUser() {

    localStorage.removeItem(
        LOCAL_USER_KEY
    );
}


// =====================================
// LOGIN USER
// =====================================

export async function loginUser(
    email,
    password
) {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    if (!cleanEmail || !password) {

        return {
            success: false,
            message:
                "Email and password are required."
        };
    }


    // -----------------------------
    // SUPABASE AUTH
    // -----------------------------

    const {
        data: authData,
        error: authError
    } =
        await supabase.auth.signInWithPassword({

            email: cleanEmail,

            password: password

        });


    if (authError) {

        console.error(
            "Auth login error:",
            authError
        );

        return {
            success: false,
            message:
                authError.message
        };
    }


    if (!authData?.user) {

        return {
            success: false,
            message:
                "Authentication failed."
        };
    }


    // -----------------------------
    // LOAD PROFILE
    // -----------------------------

    const {
        data: profile,
        error: profileError
    } =
        await supabase
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
            "User profile query error:",
            profileError
        );

        await supabase.auth.signOut();

        return {
            success: false,
            message:
                "Unable to load user profile."
        };
    }


    if (!profile) {

        console.error(
            "No public.users profile found for:",
            cleanEmail
        );

        await supabase.auth.signOut();

        return {
            success: false,
            message:
                "User profile not found."
        };
    }


    // -----------------------------
    // STATUS
    // -----------------------------

    if (
        String(profile.status || "")
            .toLowerCase() !== "active"
    ) {

        await supabase.auth.signOut();

        return {
            success: false,
            message:
                "Your account is inactive."
        };
    }


    // -----------------------------
    // USER OBJECT
    // -----------------------------

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


    // -----------------------------
    // SAVE
    // -----------------------------

    saveLocalUser(user);


    return {

        success: true,

        user: user

    };
}


// =====================================
// GET CURRENT USER
// =====================================

export async function getCurrentUser() {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();


    if (error || !data?.user) {

        return null;
    }


    const authUser =
        data.user;


    const email =
        String(
            authUser.email || ""
        )
        .trim()
        .toLowerCase();


    if (!email) {

        return null;
    }


    const {
        data: profile,
        error: profileError
    } =
        await supabase
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
                email
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "Current profile error:",
            profileError
        );

        return null;
    }


    if (!profile) {

        return null;
    }


    if (
        String(profile.status || "")
            .toLowerCase() !== "active"
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


    saveLocalUser(user);


    return user;
}


// =====================================
// REQUIRE ROLE
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
        allowedRoles.length > 0
    ) {

        if (
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
    }


    return user;
}


// =====================================
// LOGOUT
// =====================================

export async function logout() {

    try {

        await supabase.auth.signOut();

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );
    }


    clearLocalUser();


    window.location.href =
        "login.html";
}


// =====================================
// AUTH STATE
// =====================================

supabase.auth.onAuthStateChange(

    (event) => {

        if (
            event === "SIGNED_OUT"
        ) {

            clearLocalUser();
        }
    }

);
```
