// js/payment.js

import { supabase } from "./supabase.js";


// ===============================
// SETTINGS
// ===============================

const SST_RATE = 0.06;


// ===============================
// ORDER
// ===============================

let orderId =
    localStorage.getItem("paymentOrder");

let selectedMethod = "";

let orderData = null;

let subtotal = 0;

let sst = 0;

let total = 0;


// ===============================
// ELEMENTS
// ===============================

const orderNo =
    document.getElementById("orderNo");

const tableNo =
    document.getElementById("tableNo");

const paymentItems =
    document.getElementById("paymentItems");

const subtotalAmount =
    document.getElementById("subtotalAmount");

const sstAmount =
    document.getElementById("sstAmount");

const totalAmount =
    document.getElementById("totalAmount");

const cashBox =
    document.getElementById("cashBox");

const cashAmount =
    document.getElementById("cashAmount");

const changeAmount =
    document.getElementById("changeAmount");

const payBtn =
    document.getElementById("payBtn");

const message =
    document.getElementById("message");

const addMoreItemsBtn =
    document.getElementById("addMoreItemsBtn");

const backBtn =
    document.getElementById("backBtn");


// ===============================
// MONEY FORMAT
// ===============================

function money(value) {

    return "RM " +
        Number(value || 0).toFixed(2);

}


// ===============================
// LOAD ORDER
// ===============================

async function loadOrder() {

    if (!orderId) {

        showMessage(
            "No order selected."
        );

        if (payBtn) {
            payBtn.disabled = true;
        }

        return;
    }


    const {
        data,
        error
    } = await supabase

        .from("orders")

        .select("*")

        .eq(
            "id",
            orderId
        )

        .single();


    if (error) {

        console.error(
            "Load order error:",
            error
        );

        showMessage(
            "Unable to load order."
        );

        return;
    }


    orderData = data;


    await loadOrderItems();

}


// ===============================
// LOAD ORDER ITEMS
// ===============================

async function loadOrderItems() {

    const {
        data,
        error
    } = await supabase

        .from("order_items")

        .select("*")

        .eq(
            "order_id",
            orderId
        )

        .order(
            "id",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Load order items error:",
            error
        );

        showMessage(
            "Unable to load order items."
        );

        return;
    }


    orderData.order_items =
        data || [];


    showOrder();

}


// ===============================
// SHOW ORDER
// ===============================

function showOrder() {

    if (!orderData) {
        return;
    }


    if (orderNo) {

        orderNo.innerText =
            String(orderData.id)
                .slice(0, 8);

    }


    if (tableNo) {

        tableNo.innerText =
            orderData.table_number ||
            "Take Away";

    }


    if (paymentItems) {

        paymentItems.innerHTML = "";

    }


    subtotal = 0;


    const items =
        orderData.order_items || [];


    if (items.length === 0) {

        if (paymentItems) {

            paymentItems.innerHTML = `

                <p class="empty-payment">
                    No items in this order.
                </p>

            `;

        }

    }


    items.forEach(item => {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 1);

        const amount =
            price * quantity;


        subtotal += amount;


        if (paymentItems) {

            paymentItems.innerHTML += `

                <div class="payment-item">

                    <div class="payment-item-name">
                        ${item.item_name || "Item"}
                    </div>

                    <div class="payment-item-quantity">
                        x${quantity}
                    </div>

                    <div class="payment-item-price">
                        ${money(amount)}
                    </div>

                </div>

            `;

        }

    });


    calculateBill();

}


// ===============================
// CALCULATE BILL
// ===============================

function calculateBill() {

    sst =
        subtotal * SST_RATE;


    total =
        subtotal + sst;


    if (subtotalAmount) {

        subtotalAmount.innerText =
            money(subtotal);

    }


    if (sstAmount) {

        sstAmount.innerText =
            money(sst);

    }


    if (totalAmount) {

        totalAmount.innerText =
            money(total);

    }


    updateChange();

}


// ===============================
// PAYMENT METHOD
// ===============================

document
    .querySelectorAll(".method-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".method-btn")
                    .forEach(btn => {

                        btn.classList
                            .remove("active");

                    });


                button.classList
                    .add("active");


                selectedMethod =
                    button.dataset.method ||
                    "";


                if (
                    selectedMethod === "Cash"
                ) {

                    if (cashBox) {

                        cashBox.style.display =
                            "block";

                    }

                } else {

                    if (cashBox) {

                        cashBox.style.display =
                            "none";

                    }


                    if (cashAmount) {

                        cashAmount.value =
                            "";

                    }


                    if (changeAmount) {

                        changeAmount.innerText =
                            money(0);

                    }

                }

            }
        );

    });


// ===============================
// CASH CHANGE
// ===============================

if (cashAmount) {

    cashAmount.addEventListener(
        "input",
        updateChange
    );

}


function updateChange() {

    if (!changeAmount) {
        return;
    }


    const cash =
        Number(
            cashAmount?.value || 0
        );


    let change =
        cash - total;


    if (change < 0) {

        change = 0;

    }


    changeAmount.innerText =
        money(change);

}


// ===============================
// ADD MORE ITEMS
// ===============================

if (addMoreItemsBtn) {

    addMoreItemsBtn.addEventListener(
        "click",
        () => {

            if (!orderId) {

                alert(
                    "No order selected."
                );

                return;
            }


            localStorage.setItem(
                "cashierOrderMode",
                "add"
            );


            localStorage.setItem(
                "cashierOrderId",
                orderId
            );


            window.location.href =
                "cashier-menu.html";

        }
    );

}


// ===============================
// BACK
// ===============================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "cashier.html";

        }
    );

}


// ===============================
// PAY
// ===============================

if (payBtn) {

    payBtn.addEventListener(
        "click",
        processPayment
    );

}


async function processPayment() {

    if (!orderData) {

        alert(
            "Order not loaded."
        );

        return;
    }


    if (subtotal <= 0) {

        alert(
            "This order has no items."
        );

        return;
    }


    if (!selectedMethod) {

        alert(
            "Please select payment method."
        );

        return;
    }


    if (
        selectedMethod === "Cash"
    ) {

        const cash =
            Number(
                cashAmount?.value || 0
            );


        if (cash < total) {

            alert(
                "Insufficient cash amount."
            );

            return;
        }

    }


    payBtn.disabled = true;


    showMessage(
        "Processing payment..."
    );


    const {
        error
    } = await supabase

        .from("orders")

        .update({

            subtotal: subtotal,

            sst: sst,

            total: total,

            payment_status: "Paid",

            payment_method:
                selectedMethod,

            paid_at:
                new Date().toISOString(),

            status:
                "Completed"

        })

        .eq(
            "id",
            orderId
        );


    if (error) {

        console.error(
            "Payment error:",
            error
        );


        showMessage(
            "Payment failed."
        );


        payBtn.disabled = false;


        return;
    }


    showMessage(
        "Payment Successful"
    );


    localStorage.setItem(
        "lastPaidOrder",
        orderId
    );


    setTimeout(
        () => {

            window.location.href =
                "invoice.html";

        },
        700
    );

}


// ===============================
// MESSAGE
// ===============================

function showMessage(text) {

    if (!message) {
        return;
    }


    message.innerText =
        text;

}


// ===============================
// START
// ===============================

loadOrder();
