// js/cashier.js

import { supabase } from "./supabase.js";

// =====================================================
// USER
// =====================================================

const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

if (!user) {
    window.location.href = "login.html";
}

// =====================================================
// ELEMENTS
// =====================================================

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");

const orderContainer =
    document.getElementById("orderContainer");

const invoiceModal =
    document.getElementById("invoiceModal");

const invoiceList =
    document.getElementById("invoiceList");

const orderModal =
    document.getElementById("orderModal");

const selectedOrderBox =
    document.getElementById("selectedOrder");

const tableSection =
    document.getElementById("tableSection");

const tableGrid =
    document.getElementById("tableGrid");

const customerSection =
    document.getElementById("customerSection");

const customerOrders =
    document.getElementById("customerOrders");

const orderSection =
    document.getElementById("orderSection");

const selectedTableNumber =
    document.getElementById("selectedTableNumber");

const orderTableNumber =
    document.getElementById("orderTableNumber");

const orderNumber =
    document.getElementById("orderNumber");

const cashierMenuContainer =
    document.getElementById("cashierMenuContainer");

const categorySelect =
    document.getElementById("categorySelect");

const cashierCartItems =
    document.getElementById("cashierCartItems");

const cashierSubtotal =
    document.getElementById("cashierSubtotal");

const cashierSst =
    document.getElementById("cashierSst");

const cashierTotal =
    document.getElementById("cashierTotal");


// =====================================================
// USER INFO
// =====================================================

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


// =====================================================
// STATE
// =====================================================

let orders = [];

let menuItems = [];

let selectedOrder = null;

let selectedTable = null;

let selectedOrderId = null;

let cashierCart = [];

let cashierOrderType = null;

let selectedFloor = "Indoor";


// =====================================================
// SST
// =====================================================

const SST_RATE = 0.06;


// =====================================================
// HELPERS
// =====================================================

function calculateCartTotals() {

    let subtotal = 0;

    cashierCart.forEach(item => {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 1);

    });

    const sst =
        subtotal * SST_RATE;

    const total =
        subtotal + sst;

    return {
        subtotal,
        sst,
        total
    };
}


function money(value) {

    return (
        "RM " +
        Number(value || 0).toFixed(2)
    );

}


// =====================================================
// HIDE ALL ORDER SCREENS
// =====================================================

function hideOrderScreens() {

    if (tableSection) {
        tableSection.style.display = "none";
    }

    if (customerSection) {
        customerSection.style.display = "none";
    }

    if (orderSection) {
        orderSection.style.display = "none";
    }

}


// =====================================================
// SHOW MAIN CASHIER
// =====================================================

function showMainCashier() {

    hideOrderScreens();

    const currentOrdersSection =
        document.getElementById(
            "currentOrdersSection"
        );

    if (currentOrdersSection) {
        currentOrdersSection.style.display = "block";
    }

}


// =====================================================
// LOAD CURRENT ORDERS
// =====================================================

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
            "Failed to load orders:",
            error
        );

        return;
    }

    orders = data || [];

    renderCurrentOrders();

}


// =====================================================
// RENDER CURRENT ORDERS
// =====================================================

function renderCurrentOrders() {

    if (!orderContainer) {
        return;
    }

    orderContainer.innerHTML = "";

    if (orders.length === 0) {

        orderContainer.innerHTML = `
            <div class="empty-orders">
                <h3>No Active Orders</h3>
                <p>There are currently no pending orders.</p>
            </div>
        `;

        return;
    }


    orders.forEach(order => {

        const subtotal =
            Number(
                order.subtotal ||
                order.total ||
                0
            );

        const sst =
            Number(
                order.sst ||
                subtotal * SST_RATE
            );

        const total =
            Number(
                order.total ||
                subtotal + sst
            );


        const card =
            document.createElement("div");

        card.className =
            "order-card";


        card.innerHTML = `

            <h3>
                Order #${String(order.id).slice(0, 8)}
            </h3>

            <p>
                Table:
                ${order.table_number || "Take Away"}
            </p>

            <p>
                Status:
                ${order.status || "New"}
            </p>

            <p>
                Subtotal:
                ${money(subtotal)}
            </p>

            <p>
                SST (6%):
                ${money(sst)}
            </p>

            <strong>
                Total:
                ${money(total)}
            </strong>

            <div class="order-card-buttons">

                <button class="open-current-btn">
                    View
                </button>

                <button class="payment-current-btn">
                    Payment
                </button>

            </div>
        `;


        card
            .querySelector(
                ".open-current-btn"
            )
            .addEventListener(
                "click",
                () => openExistingOrder(order)
            );


        card
            .querySelector(
                ".payment-current-btn"
            )
            .addEventListener(
                "click",
                () => openPayment(order)
            );


        orderContainer.appendChild(card);

    });

}


// =====================================================
// NEW ORDER
// =====================================================

document
    .getElementById("newOrderBtn")
    ?.addEventListener(
        "click",
        () => {

            cashierOrderType = null;

            cashierCart = [];

            localStorage.removeItem("cashierOrderId");
            localStorage.removeItem("paymentOrder");

            showOrderTypeSelection();

        }
    );


// =====================================================
// ORDER TYPE SELECTION
// =====================================================

function showOrderTypeSelection() {

    hideOrderScreens();

    if (!tableSection) {
        return;
    }

    tableSection.style.display = "block";

    if (tableGrid) {

        tableGrid.innerHTML = `

            <div class="order-type-selection">

                <h2>
                    Select Order Type
                </h2>

                <p>
                    Please choose the order type for this transaction.
                </p>

                <div class="order-type-buttons">

                    <button
                        id="cashierDineInBtn"
                        class="order-type-btn">

                        Dine In

                    </button>

                    <button
                        id="cashierTakeAwayBtn"
                        class="order-type-btn">

                        Take Away

                    </button>

                </div>

            </div>

        `;

    }


    document
        .getElementById("cashierDineInBtn")
        ?.addEventListener(
            "click",
            () => {

                cashierOrderType = "Dine In";

                showFloorSelection();

            }
        );


    document
        .getElementById("cashierTakeAwayBtn")
        ?.addEventListener(
            "click",
            () => {

                cashierOrderType = "Take Away";

                startTakeAwayOrder();

            }
        );

}


// =====================================================
// FLOOR SELECTION
// =====================================================

function showFloorSelection() {

    if (!tableGrid) {
        return;
    }

    tableGrid.innerHTML = `

        <div class="floor-selection">

            <h2>
                Select Area
            </h2>

            <button class="floor-btn" data-floor="Indoor">
                Indoor
            </button>

            <button class="floor-btn" data-floor="Outdoor">
                Outdoor
            </button>

            <button class="floor-btn" data-floor="First Floor">
                First Floor
            </button>

        </div>

    `;


    document
        .querySelectorAll(".floor-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedFloor = button.dataset.floor;

                    loadTableGrid(selectedFloor);

                }
            );

        });

}


// =====================================================
// TABLE GRID
// =====================================================

async function loadTableGrid(floor) {

    if (!tableGrid) {
        return;
    }

    tableGrid.innerHTML = `<p>Loading tables...</p>`;

    let prefix = "A";

    if (floor === "Outdoor") prefix = "B";
    if (floor === "First Floor") prefix = "C";

    const tableNumbers = [];

    for (let i = 1; i <= 30; i++) {
        tableNumbers.push(prefix + i);
    }

    const {
        data,
        error
    } = await supabase
        .from("orders")
        .select("*")
        .in("table_number", tableNumbers)
        .in("status", ["New", "Accepted", "Preparing", "Ready"]);

    if (error) {
        console.error("Failed to load table data:", error);
    }

    const activeOrders = data || [];

    tableGrid.innerHTML = "";

    tableNumbers.forEach(tableNumber => {

        const tableOrders =
            activeOrders.filter(
                order => order.table_number === tableNumber
            );

        const busy = tableOrders.length > 0;

        const card = document.createElement("div");

        card.className =
            busy ? "table-card busy" : "table-card available";

        card.innerHTML = `
            <h3>${tableNumber}</h3>
            <span>${busy ? "BUSY" : "AVAILABLE"}</span>
        `;

        card.addEventListener(
            "click",
            () => selectTable(tableNumber, tableOrders)
        );

        tableGrid.appendChild(card);

    });

    const takeAwayCard = document.createElement("div");

    takeAwayCard.className = "table-card takeaway";

    takeAwayCard.innerHTML = `
        <h3>Take Away</h3>
        <span>ORDER</span>
    `;

    takeAwayCard.addEventListener(
        "click",
        startTakeAwayOrder
    );

    tableGrid.appendChild(takeAwayCard);

}


// =====================================================
// SELECT TABLE
// =====================================================

async function selectTable(tableNumber, existingOrders) {

    selectedTable = tableNumber;

    if (existingOrders?.length) {
        showCustomerOrders(tableNumber, existingOrders);
        return;
    }

    showNewCustomer(tableNumber);

}


// =====================================================
// CUSTOMER SCREEN
// =====================================================

function showCustomerOrders(tableNumber, tableOrders) {

    hideOrderScreens();

    if (!customerSection) return;

    customerSection.style.display = "block";

    if (selectedTableNumber) {
        selectedTableNumber.innerText = tableNumber;
    }

    if (!customerOrders) return;

    customerOrders.innerHTML = "";

    tableOrders.forEach(order => {

        const card = document.createElement("div");

        card.className = "customer-order-card";

        card.innerHTML = `

            <h3>Order #${String(order.id).slice(0, 8)}</h3>

            <p>Table: ${tableNumber}</p>

            <p>Status: ${order.status}</p>

            <p>Total: ${money(order.total)}</p>

            <button class="open-customer-order">View</button>

            <button class="payment-customer-order">Payment</button>

        `;

        card.querySelector(".open-customer-order")
            .addEventListener("click", () => openExistingOrder(order));

        card.querySelector(".payment-customer-order")
            .addEventListener("click", () => openPayment(order));

        customerOrders.appendChild(card);

    });

}


// =====================================================
// NEW CUSTOMER
// =====================================================

function showNewCustomer(tableNumber) {

    hideOrderScreens();

    if (!customerSection) return;

    customerSection.style.display = "block";

    if (selectedTableNumber) {
        selectedTableNumber.innerText = tableNumber;
    }

    if (customerOrders) {

        customerOrders.innerHTML = `
            <div class="no-customer">
                <h3>No Active Customer</h3>
                <p>This table is currently available.</p>
            </div>
        `;

    }

}


// =====================================================
// NEW CUSTOMER BUTTON
// =====================================================

document
    .getElementById("newCustomerBtn")
    ?.addEventListener(
        "click",
        () => {

            if (!selectedTable) {
                alert("Please select a table first.");
                return;
            }

            startNewDineInOrder();

        }
    );


// =====================================================
// START DINE-IN ORDER
// =====================================================

function startNewDineInOrder() {

    cashierCart = [];

    selectedOrderId = null;

    localStorage.removeItem("cashierOrderId");

    showCashierMenu();

}


// =====================================================
// TAKE AWAY
// =====================================================

function startTakeAwayOrder() {

    selectedTable = "Take Away";

    cashierOrderType = "Take Away";

    cashierCart = [];

    selectedOrderId = null;

    localStorage.removeItem("cashierOrderId");

    showCashierMenu();

}


// =====================================================
// OPEN EXISTING ORDER
// =====================================================

async function openExistingOrder(order) {

    selectedOrder = order;

    selectedOrderId = order.id;

    selectedTable = order.table_number || "Take Away";

    cashierOrderType = order.order_type || "Dine In";

    localStorage.setItem("cashierOrderId", order.id);

    await loadExistingOrderItems(order.id);

    showCashierMenu();

}


// =====================================================
// LOAD EXISTING ORDER ITEMS
// =====================================================

async function loadExistingOrderItems(orderId) {

    cashierCart = [];

    const {
        data,
        error
    } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

    if (error) {
        console.error("Failed to load order items:", error);
        return;
    }

    (data || []).forEach(item => {

        cashierCart.push({

            id: item.item_id || item.id,
            itemName: item.item_name,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            category: item.category || "",
            section_id: item.section_id || null

        });

    });

}


// =====================================================
// CASHIER MENU
// =====================================================

async function showCashierMenu() {

    hideOrderScreens();

    if (!orderSection) return;

    orderSection.style.display = "block";

    if (orderTableNumber) {
        orderTableNumber.innerText = selectedTable || "Take Away";
    }

    if (orderNumber) {
        orderNumber.innerText = selectedOrderId
            ? String(selectedOrderId).slice(0, 8)
            : "New Order";
    }

    await loadCashierMenu();

    renderCashierCart();

}


// =====================================================
// LOAD MENU
// =====================================================

async function loadCashierMenu() {

    if (!cashierMenuContainer) return;

    cashierMenuContainer.innerHTML = "<p>Loading menu...</p>";

    const {
        data,
        error
    } = await supabase
        .from("menu")
        .select(`
            id,
            category,
            item_name,
            image,
            dine_in_price,
            take_away_price,
            section_id
        `)
        .eq("status", "active")
        .order("category");

    if (error) {
        console.error("Failed to load menu:", error);
        cashierMenuContainer.innerHTML = "<p>Unable to load menu.</p>";
        return;
    }

    menuItems = data || [];

    loadCategories();

    showCashierMenuItems(menuItems);

}


// =====================================================
// CATEGORY
// =====================================================

function loadCategories() {

    if (!categorySelect) return;

    categorySelect.innerHTML = `<option value="all">All Categories</option>`;

    const categories = [...new Set(menuItems.map(item => item.category))];

    categories.forEach(category => {

        if (!category) return;

        const option = document.createElement("option");

        option.value = category;
        option.innerText = category;

        categorySelect.appendChild(option);

    });

    categorySelect.onchange = () => {

        const value = categorySelect.value;

        if (value === "all") {
            showCashierMenuItems(menuItems);
        } else {
            showCashierMenuItems(
                menuItems.filter(item => item.category === value)
            );
        }

    };

}


// =====================================================
// SHOW MENU ITEMS
// =====================================================

function showCashierMenuItems(items) {

    if (!cashierMenuContainer) return;

    cashierMenuContainer.innerHTML = "";

    items.forEach(item => {

        const price =
            cashierOrderType === "Take Away"
                ? item.take_away_price
                : item.dine_in_price;

        const card = document.createElement("div");

        card.className = "cashier-menu-card";

        card.innerHTML = `

            <img src="${item.image || "images/no-image.png"}" alt="${item.item_name}">

            <h3>${item.item_name}</h3>

            <p>${item.category || ""}</p>

            <strong>$
