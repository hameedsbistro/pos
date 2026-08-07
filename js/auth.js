// js/auth.js

import { supabase } from "./supabase.js";

const USER_KEY = "hameed_logged_user";


// ========================================
// SAVE USER
// ========================================

export function saveLocalUser(user) {

    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );

}


// ========================================
// GET LOCAL USER
// ========================================

export function getLocalUser() {

    const saved =
        localStorage.getItem(USER_KEY);

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    } catch (error) {

        localStorage.removeItem(USER_KEY);

        return null;

    }

}


// ========================================
// CLEAR USER
// ========================================

export function clearLocalUser() {

    localStorage.removeItem(
        USER_KEY
    );

}


// ========================================
// LOGIN USER
// ========================================

export async function loginUser(
    email,
    password
) {

    const cleanEmail =
        String(email || "")
            .trim()
            .toLowerCase();


    if (!cleanEmail) {

        return {
            success: false,
            message: "Email is required."
        };

    }


    if (!password) {

        return {
            success: false,
            message: "Password is required."
        };

    }


    // ------------------------------------
    // SUPABASE AUTH
    // ------------------------------------

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
            "Auth error:",
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
            message: "Login failed."
        };

    }


    // ------------------------------------
    // LOAD PUBLIC PROFILE
    // ------------------------------------

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
                "Profile access error: " +
                profileError.message
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


    // ------------------------------------
    // STATUS
    // ------------------------------------

    if (
        String(profile.status || "")
            .toLowerCase()
        !== "active"
    ) {

        await supabase.auth.signOut();

        return {
            success: false,
            message:
                "Your account is inactive."
        };

    }


    // ------------------------------------
    // CREATE USER OBJECT
    // ------------------------------------

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


    // ------------------------------------
    // SAVE LOCAL
    // ------------------------------------

    saveLocalUser(user);


    return {

        success: true,

        user: user

    };

}


// ========================================
// CURRENT USER
// ========================================

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
        String(
            data.user.email || ""
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


    if (
        profileError ||
        !profile
    ) {

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
            data.user.id,

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


// ========================================
// REQUIRE ROLE
// ========================================

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
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
            user.role
        )
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


// ========================================
// LOGOUT
// ========================================

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
