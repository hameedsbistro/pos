```javascript
// js/login.js

import {
    loginUser
} from "./auth.js";


// =====================================
// ELEMENTS
// =====================================

const loginForm =
    document.getElementById(
        "loginForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const passwordInput =
    document.getElementById(
        "password"
    );

const messageBox =
    document.getElementById(
        "loginMessage"
    );


// =====================================
// LOGIN FORM
// =====================================

loginForm?.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            emailInput?.value
                ?.trim()
                .toLowerCase();


        const password =
            passwordInput?.value || "";


        if (!email || !password) {

            showMessage(
                "Please enter email and password."
            );

            return;

        }


        showMessage(
            "Logging in..."
        );


        const result =
            await loginUser(
                email,
                password
            );


        if (!result?.success) {

            showMessage(
                result?.message ||
                "Login failed."
            );

            return;

        }


        // =================================
        // USER PROFILE
        // =================================

        const user =
            result.user;


        if (!user) {

            showMessage(
                "User profile not found."
            );

            return;

        }


        // =================================
        // ROLE
        // =================================

        const role =
            String(
                user.role || ""
            )
            .trim()
            .toLowerCase();


        // =================================
        // REDIRECT
        // =================================

        switch (role) {


            case "admin":

                window.location.href =
                    "admin.html";

                break;


            case "manager":

                window.location.href =
                    "admin.html";

                break;


            case "cashier":

                window.location.href =
                    "cashier.html";

                break;


            case "waiter":

                window.location.href =
                    "waiter.html";

                break;


            case "cook":

                window.location.href =
                    "kitchen.html";

                break;


            default:

                showMessage(
                    "Unknown user role: " +
                    role
                );

        }

    }
);


// =====================================
// MESSAGE
// =====================================

function showMessage(message) {

    if (messageBox) {

        messageBox.textContent =
            message;

        return;

    }


    alert(message);

}
```
