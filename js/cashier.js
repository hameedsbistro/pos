// pos/js/cashier.js

import {
getCurrentUser,
logout
} from "./auth.js";

import {
supabase
} from "./supabase.js";

// ========================================
// USER
// ========================================

let user = null;

// ========================================
// ELEMENTS
// ========================================

const userName =
document.getElementById(
"userName"
);

const userRole =
document.getElementById(
"userRole"
);

const orderContainer =
document.getElementById(
"orderContainer"
);

const orderModal =
document.getElementById(
"orderModal"
);

const selectedOrderBox =
document.getElementById(
"selectedOrder"
);

const invoiceModal =
document.getElementById(
"invoiceModal"
);

// ========================================
// DATA
// ========================================

let orders = [];

let selectedOrder = null;

// ========================================
// AUTH CHECK
// ========================================

async function checkCashierAccess() {

try {

    user =
        await getCurrentUser();


    console.log(
        "Cashier current user:",
        user
    );


    if (!user) {

        window.location.href =
            "login.html";

        return false;

    }


    const role =
        String(
            user.role || ""
        )
        .trim()
        .toLowerCase();


    if (
        role !== "cashier" &&
        role !== "admin" &&
        role !== "manager"
    ) {

        alert(
            "You do not have permission to access the Cashier Panel."
        );


        window.location.href =
            "login.html";

        return false;

    }


    if (userName) {

        userName.innerText =
            user.name || "---";

    }


    if (userRole) {

        userRole.innerText =
            role;

    }


    return true;


} catch (error) {

    console.error(
        "Cashier authentication error:",
        error
    );


    window.location.href =
        "login.html";

    return false;

}

}

// ========================================
// LOAD ORDERS
// ========================================

async function loadOrders() {

if (!orderContainer) {
    return;
}


const {
    data,
    error
} =
    await supabase
        .from("orders")
        .select("*")
        .in(
            "status",
            [
                "New",
                "Accepted",
                "Ready"
            ]
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


if (error) {

    console.error(
        "Load orders error:",
        error
    );


    orderContainer.innerHTML = `

        <div class="order-error">

            Unable to load orders.

        </div>

    `;


    return;

}


orders =
    data || [];


showOrders();

}

// ========================================
// SHOW ORDERS
// ========================================

function showOrders() {

if (!orderContainer) {
    return;
}


orderContainer.innerHTML = "";


if (orders.length === 0) {

    orderContainer.innerHTML = `

        <div class="no-orders">

            No current orders.

        </div>

    `;


    return;

}


orders.forEach(
    order => {

        const total =
            Number(
                order.total_amount || 0
            );


        const table =
            order.table_number ||
            "Take Away";


        const status =
            order.status ||
            "New";


        const card =
            document.createElement(
                "div"
            );


        card.className =
            `order-card ${status}`;


        card.innerHTML = `

            <h3>
                Table: ${table}
            </h3>

            <p>
                Order:
                ${order.order_number || order.id}
            </p>

            <p>
                Status:
                ${status}
            </p>

            <p>
                Amount:
                RM ${total.toFixed(2)}
            </p>

            <button
                type="button"
                class="view-order-btn">
                View
            </button>

            ${
                status === "New"
                    ?
                    `
                    <button
                        type="button"
                        class="accept-order-btn">
                        Accept
                    </button>
                    `
                    :
                    ""
            }

        `;


        const viewBtn =
            card.querySelector(
                ".view-order-btn"
            );


        viewBtn?.addEventListener(
            "click",
            () => {

                openOrder(
                    order.id
                );

            }
        );


        const acceptBtn =
            card.querySelector(
                ".accept-order-btn"
            );


        acceptBtn?.addEventListener(
            "click",
            () => {

                acceptOrder(
                    order.id
                );

            }
        );


        orderContainer.appendChild(
            card
        );

    }
);

}

// ========================================
// OPEN ORDER
// ========================================

function openOrder(id) {

selectedOrder =
    orders.find(
        order =>
            String(order.id) ===
            String(id)
    );


if (!selectedOrder) {

    alert(
        "Order not found."
    );

    return;

}


localStorage.setItem(
    "paymentOrder",
    String(
        selectedOrder.id
    )
);


const total =
    Number(
        selectedOrder.total_amount ||
        0
    );


if (selectedOrderBox) {

    selectedOrderBox.innerHTML = `

        <h3>
            Table:
            ${
                selectedOrder.table_number ||
                "Take Away"
            }
        </h3>

        <p>
            Order:
            ${
                selectedOrder.order_number ||
                selectedOrder.id
            }
        </p>

        <p>
            Status:
            ${
                selectedOrder.status ||
                ""
            }
        </p>

        <p>
            Amount:
            RM ${total.toFixed(2)}
        </p>

    `;

}


if (orderModal) {

    orderModal.style.display =
        "flex";

}

}

// ========================================
// ACCEPT ORDER
// ========================================

async function acceptOrder(id) {

const {
    error
} =
    await supabase
        .from("orders")
        .update({
            status: "Accepted"
        })
        .eq(
            "id",
            id
        );


if (error) {

    console.error(
        "Accept order error:",
        error
    );


    alert(
        error.message
    );


    return;

}


await loadOrders();

}

// ========================================
// PAYMENT BUTTON
// ========================================

document
.getElementById(
"paymentBtn"
)
?.addEventListener(
"click",
() => {

        if (!selectedOrder) {

            alert(
                "Select an order first."
            );

            return;

        }


        localStorage.setItem(
            "paymentOrder",
            String(
                selectedOrder.id
            )
        );


        window.location.href =
            "payment.html";

    }
);

// ========================================
// INVOICE BUTTON
// ========================================

document
.getElementById(
"invoiceBtn"
)
?.addEventListener(
"click",
() => {

        if (invoiceModal) {

            invoiceModal.style.display =
                "flex";

        }

    }
);

// ========================================
// NEW ORDER
// ========================================

document
.getElementById(
"newOrderBtn"
)
?.addEventListener(
"click",
() => {

        window.location.href =
            "menu.html";

    }
);

// ========================================
// CLOSE ORDER MODAL
// ========================================

document
.getElementById(
"closeModalBtn"
)
?.addEventListener(
"click",
() => {

        if (orderModal) {

            orderModal.style.display =
                "none";

        }

    }
);

// ========================================
// CLOSE INVOICE MODAL
// ========================================

document
.getElementById(
"closeInvoiceBtn"
)
?.addEventListener(
"click",
() => {

        if (invoiceModal) {

            invoiceModal.style.display =
                "none";

        }

    }
);

// ========================================
// REFRESH
// ========================================

document
.getElementById(
"refreshBtn"
)
?.addEventListener(
"click",
async () => {

        await loadOrders();

    }
);

// ========================================
// LOGOUT
// ========================================

document
.getElementById(
"logoutBtn"
)
?.addEventListener(
"click",
async () => {

        await logout();

    }
);

// ========================================
// REALTIME ORDERS
// ========================================

const ordersChannel =
supabase
.channel(
"cashier-orders-channel"
)
.on(
"postgres_changes",
{
event: "*",
schema: "public",
table: "orders"
},
() => {

            loadOrders();

        }
    )
    .subscribe();

// ========================================
// INITIALIZE
// ========================================

async function initializeCashier() {

const allowed =
    await checkCashierAccess();


if (!allowed) {
    return;
}


await loadOrders();

}

initializeCashier();

// ========================================
// READY
// ========================================

console.log(
"Hameed's Bistro cashier.js loaded successfully."
);
