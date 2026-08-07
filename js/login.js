// js/login.js

import { loginUser } from "./auth.js";


// ========================================
// ELEMENTS
// ========================================

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const message =
    document.getElementById("message");


// ========================================
// MESSAGE
// ========================================

function showMessage(text) {

    if (message) {

        message.textContent = text;

    } else {

        console.log(text);

    }

}


// ========================================
// BUTTON STATE
// ========================================

function setLoading(loading) {

    if (!loginBtn) return;


    if (loading) {

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Logging in...";

    } else {

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Login";

    }

}


// ========================================
// REDIRECT BY ROLE
// ========================================

function redirectByRole(user) {

    const role =
        String(user?.role || "")
            .trim()
            .toLowerCase();


    console.log(
        "Logged user:",
        user
    );


    console.log(
        "User role:",
        role
    );


    // ADMIN

    if (role === "admin") {

        window.location.href =
            "admin.html";

        return;

    }


    // MANAGER

    if (role === "manager") {

        window.location.href =
            "admin.html";

        return;

    }


    // CASHIER

    if (role === "cashier") {

        window.location.href =
            "cashier.html";

        return;

    }


    // WAITER

    if (role === "waiter") {

        window.location.href =
            "waiter.html";

        return;

    }


    // COOK

    if (role === "cook") {

        window.location.href =
            "kitchen.html";

        return;

    }


    showMessage(
        "Unknown user role: " + role
    );

}


// ========================================
// LOGIN FUNCTION
// ========================================

async function handleLogin() {


    const email =
        emailInput?.value
            ?.trim()
            .toLowerCase();


    const password =
        passwordInput?.value || "";


    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (!email) {

        showMessage(
            "Please enter your email."
        );

        emailInput?.focus();

        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );

        passwordInput?.focus();

        return;

    }


    // ------------------------------------
    // LOADING
    // ------------------------------------

    setLoading(true);

    showMessage(
        "Logging in..."
    );


    try {


        // --------------------------------
        // LOGIN
        // --------------------------------

        const result =
            await loginUser(
                email,
                password
            );


        console.log(
            "Login result:",
            result
        );


        // --------------------------------
        // FAILED
        // --------------------------------

        if (
            !result ||
            result.success !== true
        ) {

            showMessage(
                result?.message ||
                "Login failed."
            );

            setLoading(false);

            return;

        }


        // --------------------------------
        // USER PROFILE
        // --------------------------------

        if (!result.user) {

            showMessage(
                "User profile not found."
            );

            setLoading(false);

            return;

        }


        // --------------------------------
        // SUCCESS
        // --------------------------------

        showMessage(
            "Login successful."
        );


        // --------------------------------
        // REDIRECT
        // --------------------------------

        redirectByRole(
            result.user
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            error?.message ||
            "Login failed."
        );


        setLoading(false);

    }

}


// ========================================
// LOGIN BUTTON
// ========================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        handleLogin
    );

} else {

    console.error(
        "loginBtn not found."
    );

}


// ========================================
// ENTER KEY
// ========================================

passwordInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            handleLogin();

        }

    }
);


// ========================================
// CLEAR MESSAGE
// ========================================

emailInput?.addEventListener(
    "input",
    () => {

        if (message) {

            message.textContent =
                "";

        }

    }
);


passwordInput?.addEventListener(
    "input",
    () => {

        if (message) {

            message.textContent =
                "";

        }

    }
);


// ========================================
// READY
// ========================================

console.log(
    "Hameed's Bistro login.js loaded successfully."
);
