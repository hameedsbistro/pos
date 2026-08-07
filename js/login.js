// js/login.js

import { loginUser } from "./auth.js";


// ========================================
// ELEMENTS
// ========================================

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageBox = document.getElementById("loginMessage");


// ========================================
// MESSAGE
// ========================================

function showMessage(message) {

    if (messageBox) {

        messageBox.textContent = message;
        messageBox.style.display = "block";

    } else {

        alert(message);

    }

}


// ========================================
// BUTTON LOADING
// ========================================

function setLoading(isLoading) {

    const button =
        form?.querySelector(
            'button[type="submit"]'
        );

    if (!button) return;

    if (isLoading) {

        button.disabled = true;
        button.textContent = "Logging in...";

    } else {

        button.disabled = false;
        button.textContent = "Login";

    }

}


// ========================================
// REDIRECT
// ========================================

function redirectUser(user) {

    const role =
        String(user?.role || "")
            .trim()
            .toLowerCase();


    console.log("Logged user:", user);
    console.log("Role:", role);


    if (role === "admin") {

        window.location.href = "admin.html";
        return;

    }


    if (role === "manager") {

        window.location.href = "admin.html";
        return;

    }


    if (role === "cashier") {

        window.location.href = "cashier.html";
        return;

    }


    if (role === "waiter") {

        window.location.href = "waiter.html";
        return;

    }


    if (role === "cook") {

        window.location.href = "kitchen.html";
        return;

    }


    showMessage(
        "Unknown user role: " + role
    );

}


// ========================================
// LOGIN
// ========================================

async function handleLogin(event) {

    event.preventDefault();


    const email =
        emailInput?.value
            ?.trim()
            .toLowerCase();


    const password =
        passwordInput?.value || "";


    if (!email) {

        showMessage(
            "Please enter your email."
        );

        return;

    }


    if (!password) {

        showMessage(
            "Please enter your password."
        );

        return;

    }


    setLoading(true);

    showMessage("Logging in...");


    try {

        const result =
            await loginUser(
                email,
                password
            );


        console.log(
            "Login result:",
            result
        );


        if (!result?.success) {

            showMessage(
                result?.message ||
                "Login failed."
            );

            setLoading(false);

            return;

        }


        if (!result.user) {

            showMessage(
                "User profile not found."
            );

            setLoading(false);

            return;

        }


        showMessage(
            "Login successful."
        );


        redirectUser(
            result.user
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            error?.message ||
            "Unexpected login error."
        );


        setLoading(false);

    }

}


// ========================================
// FORM EVENT
// ========================================

if (form) {

    form.addEventListener(
        "submit",
        handleLogin
    );

} else {

    console.error(
        "loginForm not found."
    );

}


// ========================================
// ENTER KEY
// ========================================

passwordInput?.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            form?.requestSubmit();

        }

    }
);


// ========================================
// READY
// ========================================

console.log(
    "Hameed's Bistro login.js loaded."
);
```
