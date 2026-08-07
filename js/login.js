// js/login.js

import { loginUser } from "./auth.js";


// ==========================================
// GET ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageBox = document.getElementById("loginMessage");


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message, type = "error") {

    if (messageBox) {

        messageBox.textContent = message;

        messageBox.className = `login-message ${type}`;

        messageBox.style.display = "block";

    } else {

        alert(message);

    }

}


// ==========================================
// DISABLE / ENABLE LOGIN BUTTON
// ==========================================

function setLoading(loading) {

    const button =
        loginForm?.querySelector(
            'button[type="submit"]'
        );

    if (!button) return;


    if (loading) {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            "Logging in...";

    } else {

        button.disabled = false;

        button.textContent =
            button.dataset.originalText ||
            "Login";

    }

}


// ==========================================
// REDIRECT BY ROLE
// ==========================================

function redirectByRole(user) {

    if (!user) {

        showMessage(
            "User profile not found.",
            "error"
        );

        return;

    }


    const role =
        String(user.role || "")
            .trim()
            .toLowerCase();


    console.log(
        "Logged in user:",
        user
    );


    console.log(
        "User role:",
        role
    );


    switch (role) {


        // ==================================
        // ADMIN
        // ==================================

        case "admin":

            window.location.replace(
                "admin.html"
            );

            break;


        // ==================================
        // MANAGER
        // ==================================

        case "manager":

            window.location.replace(
                "admin.html"
            );

            break;


        // ==================================
        // CASHIER
        // ==================================

        case "cashier":

            window.location.replace(
                "cashier.html"
            );

            break;


        // ==================================
        // WAITER
        // ==================================

        case "waiter":

            window.location.replace(
                "waiter.html"
            );

            break;


        // ==================================
        // COOK
        // ==================================

        case "cook":

            window.location.replace(
                "kitchen.html"
            );

            break;


        // ==================================
        // UNKNOWN ROLE
        // ==================================

        default:

            showMessage(
                `Unknown user role: ${role || "not assigned"}`,
                "error"
            );

            console.error(
                "Unknown role:",
                user
            );

            break;

    }

}


// ==========================================
// LOGIN
// ==========================================

async function handleLogin(event) {

    event.preventDefault();


    // --------------------------------------
    // GET VALUES
    // --------------------------------------

    const email =
        emailInput?.value
            ?.trim()
            .toLowerCase();


    const password =
        passwordInput?.value || "";


    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!email) {

        showMessage(
            "Please enter your email.",
            "error"
        );

        emailInput?.focus();

        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password.",
            "error"
        );

        passwordInput?.focus();

        return;

    }


    // --------------------------------------
    // LOADING
    // --------------------------------------

    setLoading(true);


    showMessage(
        "Checking login...",
        "loading"
    );


    try {


        // ==================================
        // LOGIN THROUGH AUTH.JS
        // ==================================

        const result =
            await loginUser(
                email,
                password
            );


        console.log(
            "Login result:",
            result
        );


        // ==================================
        // LOGIN FAILED
        // ==================================

        if (
            !result ||
            result.success !== true
        ) {

            showMessage(
                result?.message ||
                "Login failed.",
                "error"
            );

            setLoading(false);

            return;

        }


        // ==================================
        // USER PROFILE
        // ==================================

        const user =
            result.user;


        if (!user) {

            showMessage(
                "User profile not found.",
                "error"
            );

            setLoading(false);

            return;

        }


        // ==================================
        // SUCCESS
        // ==================================

        showMessage(
            `Welcome ${user.name || ""}`,
            "success"
        );


        // ==================================
        // ROLE REDIRECT
        // ==================================

        setTimeout(
            () => {

                redirectByRole(user);

            },
            300
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            error?.message ||
            "Unexpected login error.",
            "error"
        );


        setLoading(false);

    }

}


// ==========================================
// FORM EVENT
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

} else {

    console.error(
        "loginForm element not found."
    );

}


// ==========================================
// ENTER KEY SUPPORT
// ==========================================

passwordInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            loginForm?.requestSubmit();

        }

    }
);


// ==========================================
// EMAIL ENTER SUPPORT
// ==========================================

emailInput?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            passwordInput?.focus();

        }

    }
);


// ==========================================
// CLEAR MESSAGE WHEN USER TYPES
// ==========================================

emailInput?.addEventListener(
    "input",
    () => {

        if (messageBox) {

            messageBox.style.display =
                "none";

        }

    }
);


passwordInput?.addEventListener(
    "input",
    () => {

        if (messageBox) {

            messageBox.style.display =
                "none";

        }

    }
);


// ==========================================
// PAGE READY
// ==========================================

console.log(
    "Hameed's Bistro login.js loaded successfully."
);
```
