```javascript
// js/auth.js

import { supabase } from "./supabase.js";

const USER_KEY = "hameed_logged_user";


// =====================================
// SAVE LOCAL USER
// =====================================

export function saveLocalUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

}


// =====================================
// GET LOCAL USER
// =====================================

export function getLocalUser() {

    const data =
        localStorage.getItem(USER_KEY);

    if (!data) {
        return null;
    }

    try {

        return JSON.parse(data);

    } catch {

        localStorage.removeItem(USER_KEY);

        return null;

    }

}


// =====================================
// CLEAR LOCAL USER
// =====================================

export function clearLocalUser() {

    localStorage.removeItem(USER_KEY);

}


// =====================================
// LOGIN
// =====================================

export async function loginUser(
    email,
    password
) {

    const cleanEmail =
        email.trim().toLowerCase();


    const {
        data,
        error
    } =
        await supabase.auth.signInWithPassword({

            email: cleanEmail,

            password: password

        });


    if (error) {

        return {

            success: false,

            message: error.message

        };

    }


    if (!data?.user) {

        return {

            success: false,

            message: "Login failed."

        };

    }


    // ---------------------------------
    // GET USER PROFILE
    // ---------------------------------

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
            "Profile error:",
            profileError
        );


        await supabase.auth.signOut();


        return {

            success: false,

            message:
                "Profile access error."

        };

    }


    if (!profile) {

        await supabase.auth.signOut();


        return {

            success: false,

            message:
                "User profile not found."

        };

    }


    if (
        String(profile.status)
            .toLowerCase()
        !== "active"
    ) {

        await supabase.auth.signOut();


        return {

            success: false,

            message:
                "User account is inactive."

        };

    }


    const user = {

        auth_id:
            data.user.id,

        id:
            profile.id,

        name:
            profile.name,

        email:
            profile.email,

        role:
            String(
                profile.role
            ).toLowerCase(),

        status:
            profile.status,

        created_at:
            profile.created_at

    };


    saveLocalUser(user);


    return {

        success: true,

        user: user

    };

}


// =====================================
// CURRENT USER
// =====================================

export async function getCurrentUser() {

    const {
        data,
        error
    } =
        await supabase.auth.getUser();


    if (
        error ||
        !data?.user
    ) {

        return null;

    }


    const email =
        data.user.email
            .trim()
            .toLowerCase();


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


    if (
        profileError ||
        !profile
    ) {

        return null;

    }


    const user = {

        auth_id:
            data.user.id,

        id:
            profile.id,

        name:
            profile.name,

        email:
            profile.email,

        role:
            String(
                profile.role
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
    roles = []
) {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    if (
        roles.length > 0 &&
        !roles.includes(user.role)
    ) {

        alert(
            "Access denied."
        );


        window.location.href =
            "index.html";


        return null;

    }


    return user;

}


// =====================================
// LOGOUT
// =====================================

export async function logout() {

    await supabase.auth.signOut();

    clearLocalUser();

    window.location.href =
        "login.html";

}
```
