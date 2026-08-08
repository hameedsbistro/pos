// js/cashier.js

import { supabase } from "./supabase.js";


// ===============================
// USER
// ===============================

const user =
    JSON.parse(
        localStorage.getItem("user") || "null"
    );


if (!user) {

    window.location.href =
        "login.html";

}


// ===============================
// ELEMENTS
// ===============================

const userName =
    document.getElementById("userName");

const userRole =
    document.getElementById("userRole");

const orderContainer =
    document.getElementById("orderContainer");

const orderModal =
    document.getElementById("orderModal");

const selectedOrderBox =
    document.getElementById("selectedOrder");

const invoiceModal =
    document.getElementById("invoiceModal");

const invoiceList =
    document.getElementById("invoiceList");


// ===============================
// SHOW USER
// ===============================

if (userName) {

    userName.innerText =
        user.name ||
        user.email ||
        "---";

}


if (userRole) {

    userRole.innerText =
        user.role ||
        "cashier";

}


// ===============================
// ORDERS
// ===============================

let orders = [];

let selectedOrder = null;


// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {

    if (!orderContainer) {
        return;
    }


    const {
        data,
        error
    } = await supabase

        .from("orders")

        .select("*")

        .in(
            "status",
            [
                "New",
                "Accepted",
                "Preparing",
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

        return;
    }


    orders =
        data || [];


    showOrders();

}


// ===============================
// SHOW ORDERS
// ===============================

function showOrders() {

    orderContainer.innerHTML = "";


    if (orders.length === 0) {

        orderContainer.innerHTML = `

            <div class="empty-orders">

                <h3>
                    No Current Orders
                </h3>

                <p>
                    There are no pending orders.
                </p>

            </div>

        `;

        return;
    }


    orders.forEach(order => {

        const total =
            Number(order.total || 0);


        const card =
            document.createElement("div");


        card.className =
            "order-card " +
            String(
                order.status || ""
            ).toLowerCase();


        card.innerHTML = `

            <h3>
                Table:
                ${order.table_number || "Take Away"}
            </h3>

            <p>
                Status:
                ${order.status || "New"}
            </p>

            <p>
                Amount:
                RM ${total.toFixed(2)}
            </p>

            <button
                class="open-order-btn">

                Open

            </button>

            ${
                order.status === "New"
                    ? `
                        <button
                            class="accept-order-btn">

                            Accept

                        </button>
                    `
                    : ""
            }

        `;


        card
            .querySelector(
                ".open-order-btn"
            )
            .addEventListener(
                "click",
                () => {

                    openOrder(order.id);

                }
            );


        const acceptButton =
            card.querySelector(
                ".accept-order-btn"
            );


        if (acceptButton) {

            acceptButton.addEventListener(
                "click",
                () => {

                    acceptOrder(
                        order.id
                    );

                }
            );

        }


        orderContainer.appendChild(
            card
        );

    });

}


// ===============================
// OPEN ORDER
// ===============================

function openOrder(id) {

    selectedOrder =
        orders.find(
            order =>
                order.id === id
        );


    if (!selectedOrder) {

        return;
    }


    localStorage.setItem(
        "paymentOrder",
        selectedOrder.id
    );


    if (selectedOrderBox) {

        selectedOrderBox.innerHTML = `

            <h3>
                Table:
                ${selectedOrder.table_number || "Take Away"}
            </h3>

            <p>
                Status:
                ${selectedOrder.status}
            </p>

            <p>
                Amount:
                RM ${Number(
                    selectedOrder.total || 0
                ).toFixed(2)}
            </p>

        `;

    }


    if (orderModal) {

        orderModal.style.display =
            "flex";

    }

}


// ===============================
// ACCEPT
// ===============================

async function acceptOrder(id) {

    const {
        error
    } = await supabase

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


    loadOrders();

}


// ===============================
// PAYMENT
// ===============================

document
    .getElementById("paymentBtn")
    ?.addEventListener(
        "click",
        () => {

            if (!selectedOrder) {

                alert(
                    "Please select an order first."
                );

                return;
            }


            localStorage.setItem(
                "paymentOrder",
                selectedOrder.id
            );


            window.location.href =
                "payment.html";

        }
    );


// ===============================
// INVOICE LIST
// ===============================

document
    .getElementById("invoiceBtn")
    ?.addEventListener(
        "click",
        () => {

            if (invoiceModal) {

                invoiceModal.style.display =
                    "flex";

            }


            loadInvoices();

        }
    );


// ===============================
// LOAD INVOICES
// ===============================

async function loadInvoices() {

    if (!invoiceList) {
        return;
    }


    invoiceList.innerHTML = `

        <p>
            Loading invoices...
        </p>

    `;


    const {
        data,
        error
    } = await supabase

        .from("orders")

        .select("*")

        .eq(
            "payment_status",
            "Paid"
        )

        .order(
            "paid_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Invoice load error:",
            error
        );


        invoiceList.innerHTML = `

            <p>
                Unable to load invoices.
            </p>

        `;

        return;
    }


    if (!data || data.length === 0) {

        invoiceList.innerHTML = `

            <p>
                No invoices found.
            </p>

        `;

        return;
    }


    invoiceList.innerHTML = "";


    data.forEach(invoice => {

        const subtotal =
            Number(
                invoice.subtotal || 0
            );


        const invoiceSst =
            Number(
                invoice.sst ||
                subtotal * 0.06
            );


        const invoiceTotal =
            Number(
                invoice.total ||
                subtotal + invoiceSst
            );


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "invoice-list-item";


        box.innerHTML = `

            <div>

                <strong>
                    Invoice #
                    ${String(
                        invoice.id
                    ).slice(0, 8)}
                </strong>

                <p>
                    Table:
                    ${invoice.table_number || "Take Away"}
                </p>

                <p>
                    ${invoice.payment_method || "-"}
                </p>

            </div>


            <div>

                <p>
                    Subtotal:
                    RM ${subtotal.toFixed(2)}
                </p>

                <p>
                    SST (6%):
                    RM ${invoiceSst.toFixed(2)}
                </p>

                <strong>
                    Total:
                    RM ${invoiceTotal.toFixed(2)}
                </strong>

            </div>

        `;


        box.addEventListener(
            "click",
            () => {

                localStorage.setItem(
                    "lastPaidOrder",
                    invoice.id
                );


                window.location.href =
                    "invoice.html";

            }
        );


        invoiceList.appendChild(
            box
        );

    });

}


// ===============================
// CLOSE ORDER
// ===============================

document
    .getElementById("closeModalBtn")
    ?.addEventListener(
        "click",
        () => {

            if (orderModal) {

                orderModal.style.display =
                    "none";

            }

        }
    );


// ===============================
// CLOSE INVOICE
// ===============================

document
    .getElementById("closeInvoiceBtn")
    ?.addEventListener(
        "click",
        () => {

            if (invoiceModal) {

                invoiceModal.style.display =
                    "none";

            }

        }
    );


// ===============================
// NEW ORDER
// ===============================

document
    .getElementById("newOrderBtn")
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "cashierOrderMode"
            );


            localStorage.removeItem(
                "cashierOrderId"
            );


            window.location.href =
                "cashier-menu.html";

        }
    );


// ===============================
// REFRESH
// ===============================

document
    .getElementById("refreshBtn")
    ?.addEventListener(
        "click",
        () => {

            loadOrders();

        }
    );


// ===============================
// LOGOUT
// ===============================

document
    .getElementById("logoutBtn")
    ?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "paymentOrder"
            );

            localStorage.removeItem(
                "cashierOrderMode"
            );

            localStorage.removeItem(
                "cashierOrderId"
            );


            window.location.href =
                "login.html";

        }
    );


// ===============================
// REALTIME
// ===============================

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


// ===============================
// START
// ===============================

loadOrders();
