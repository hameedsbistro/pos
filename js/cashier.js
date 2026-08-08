// js/cashier.js

import { supabase } from "./supabase.js";


// =====================================================
// AUTH / USER
// =====================================================

const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

if (!user) {
    window.location.href = "login.html";
    throw new Error("User not logged in");
}


// =====================================================
// ELEMENTS
// =====================================================

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");

const tableSection =
    document.getElementById("tableSection");

const customerSection =
    document.getElementById("customerSection");

const orderSection =
    document.getElementById("orderSection");

const tableGrid =
    document.getElementById("tableGrid");

const customerOrders =
    document.getElementById("customerOrders");

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
// USER DISPLAY
// =====================================================

if (userName) {
    userName.innerText =
        user.name || "---";
}

if (userRole) {
    userRole.innerText =
        user.role || "cashier";
}


// =====================================================
// STATE
// =====================================================

let tables = [];
let menuItems = [];
let selectedTable = null;

let currentOrder = null;
let currentCart = [];

let currentOrderType = "Dine In";


// =====================================================
// SST
// =====================================================

const SST_RATE = 0.06;


// =====================================================
// FORMAT MONEY
// =====================================================

function money(value) {

    return "RM " +
        Number(value || 0).toFixed(2);

}


// =====================================================
// CALCULATE BILL
// =====================================================

function calculateBill(cart) {

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price || 0) *
            Number(item.quantity || 0);

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


// =====================================================
// SHOW BILL
// =====================================================

function showBill() {

    const bill =
        calculateBill(currentCart);

    if (cashierSubtotal) {
        cashierSubtotal.innerText =
            money(bill.subtotal);
    }

    if (cashierSst) {
        cashierSst.innerText =
            money(bill.sst);
    }

    if (cashierTotal) {
        cashierTotal.innerText =
            money(bill.total);
    }

}


// =====================================================
// LOAD TABLES
// =====================================================

async function loadTables() {

    const {
        data,
        error
    } = await supabase
        .from("tables")
        .select("*")
        .order("table_number");

    if (error) {

        console.error(
            "Table loading error:",
            error
        );

        tableGrid.innerHTML = `
            <div class="empty-message">
                Unable to load tables.
            </div>
        `;

        return;
    }

    tables = data || [];

    await updateTableStatuses();

}


// =====================================================
// UPDATE TABLE STATUS
// =====================================================

async function updateTableStatuses() {

    const {
        data: activeOrders,
        error
    } = await supabase
        .from("orders")
        .select(
            "id, table_number, status, payment_status"
        )
        .neq(
            "payment_status",
            "Paid"
        );

    if (error) {

        console.error(
            "Order status error:",
            error
        );

        showTables(tables);

        return;
    }


    const activeTableNumbers =
        new Set(
            (activeOrders || [])
                .filter(order =>
                    order.table_number &&
                    order.payment_status !== "Paid"
                )
                .map(order =>
                    String(order.table_number)
                )
        );


    showTables(
        tables.map(table => ({

            ...table,

            calculatedStatus:
                activeTableNumbers.has(
                    String(table.table_number)
                )
                    ? "Busy"
                    : "Available"

        }))
    );

}


// =====================================================
// SHOW TABLE GRID
// =====================================================

function showTables(list) {

    tableGrid.innerHTML = "";


    if (!list.length) {

        tableGrid.innerHTML = `
            <div class="empty-message">
                No tables found.
            </div>
        `;

        return;
    }


    list.forEach(table => {

        const status =
            table.calculatedStatus ||
            table.status ||
            "Available";


        const card =
            document.createElement("button");


        card.type = "button";


        card.className =
            "table-card " +
            (
                status === "Busy"
                    ? "busy"
                    : "available"
            );


        card.innerHTML = `

            <span class="table-number">
                ${table.table_number}
            </span>

            <span class="table-status">
                ${
                    status === "Busy"
                        ? "BUSY"
                        : "AVAILABLE"
                }
            </span>

        `;


        card.onclick = () => {

            selectTable(table);

        };


        tableGrid.appendChild(card);

    });

}


// =====================================================
// SELECT TABLE
// =====================================================

async function selectTable(table) {

    selectedTable = table;


    selectedTableNumber.innerText =
        table.table_number;


    tableSection.style.display =
        "none";


    customerSection.style.display =
        "block";


    orderSection.style.display =
        "none";


    await loadCustomerOrders();

}


// =====================================================
// LOAD CUSTOMER ORDERS
// =====================================================

async function loadCustomerOrders() {

    customerOrders.innerHTML = `

        <div class="empty-message">
            Loading orders...
        </div>

    `;


    const {
        data,
        error
    } = await supabase
        .from("orders")
        .select("*")
        .eq(
            "table_number",
            selectedTable.table_number
        )
        .neq(
            "payment_status",
            "Paid"
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(
            "Customer orders error:",
            error
        );

        customerOrders.innerHTML = `

            <div class="empty-message">
                Unable to load orders.
            </div>

        `;

        return;
    }


    const orders =
        data || [];


    customerOrders.innerHTML = "";


    if (!orders.length) {

        customerOrders.innerHTML = `

            <div class="empty-message">

                No active customer orders.
                <br>
                Create a new customer below.

            </div>

        `;

        return;
    }


    orders.forEach(order => {

        const card =
            document.createElement("div");


        card.className =
            "customer-order-card";


        const customerName =
            order.customer_name ||
            order.ordered_by_name ||
            "Customer";


        const amount =
            Number(
                order.total_amount || 0
            );


        card.innerHTML = `

            <h3>
                ${customerName}
            </h3>

            <p>
                Order:
                ${order.order_number || order.id}
            </p>

            <p>
                Status:
                ${order.status || "New"}
            </p>

            <p>
                Amount:
                ${money(amount)}
            </p>

            <div class="customer-order-actions">

                <button
                    class="open-order-btn">

                    OPEN

                </button>

                <button
                    class="order-payment-btn">

                    PAYMENT

                </button>

            </div>

        `;


        card.querySelector(
            ".open-order-btn"
        ).onclick = () => {

            openExistingOrder(order);

        };


        card.querySelector(
            ".order-payment-btn"
        ).onclick = () => {

            openPaymentForOrder(order);

        };


        customerOrders.appendChild(card);

    });

}


// =====================================================
// OPEN EXISTING ORDER
// =====================================================

async function openExistingOrder(order) {

    currentOrder = order;


    currentCart =
        await loadOrderItems(
            order.id
        );


    openOrderScreen();

}


// =====================================================
// LOAD ORDER ITEMS
// =====================================================

async function loadOrderItems(orderId) {

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
        .order("created_at");


    if (error) {

        console.error(
            "Order items error:",
            error
        );

        return [];

    }


    return (data || []).map(item => ({

        id: item.id,

        menuId: null,

        itemName: item.item_name,

        price: Number(
            item.price || 0
        ),

        quantity: Number(
            item.quantity || 1
        ),

        category: "",

        section_id:
            item.section_id || null,

        item_note:
            item.item_note || ""

    }));

}


// =====================================================
// NEW CUSTOMER
// =====================================================

document
    .getElementById("newCustomerBtn")
    ?.addEventListener(
        "click",
        () => {

            currentOrder = null;

            currentCart = [];

            openOrderScreen();

        }
    );


// =====================================================
// OPEN ORDER SCREEN
// =====================================================

async function openOrderScreen() {

    tableSection.style.display =
        "none";

    customerSection.style.display =
        "none";

    orderSection.style.display =
        "block";


    orderTableNumber.innerText =
        selectedTable.table_number;


    if (currentOrder) {

        orderNumber.innerText =
            currentOrder.order_number ||
            currentOrder.id;

    }
    else {

        orderNumber.innerText =
            "New Customer";

    }


    await loadCashierMenu();

    showCart();

}


// =====================================================
// LOAD MENU
// =====================================================

async function loadCashierMenu() {

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
        .eq(
            "status",
            "active"
        )
        .order(
            "category"
        )
        .order(
            "item_name"
        );


    if (error) {

        console.error(
            "Menu error:",
            error
        );

        cashierMenuContainer.innerHTML = `

            <div class="empty-message">
                Unable to load menu.
            </div>

        `;

        return;
    }


    menuItems = data || [];


    populateCategories();

    showCashierMenu(
        menuItems
    );

}


// =====================================================
// CATEGORY LIST
// =====================================================

function populateCategories() {

    categorySelect.innerHTML = `

        <option value="all">
            Select Category
        </option>

    `;


    const categories =
        [
            ...new Set(
                menuItems
                    .map(item =>
                        item.category
                    )
                    .filter(Boolean)
            )
        ];


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category;


        option.textContent =
            category;


        categorySelect.appendChild(
            option
        );

    });

}


// =====================================================
// CATEGORY CHANGE
// =====================================================

categorySelect?.addEventListener(
    "change",
    () => {

        const category =
            categorySelect.value;


        if (category === "all") {

            showCashierMenu(
                menuItems
            );

            return;

        }


        showCashierMenu(
            menuItems.filter(
                item =>
                    item.category ===
                    category
            )
        );

    }
);


// =====================================================
// SHOW CASHIER MENU
// =====================================================

function showCashierMenu(items) {

    cashierMenuContainer.innerHTML =
        "";


    if (!items.length) {

        cashierMenuContainer.innerHTML = `

            <div class="empty-message">
                No menu items found.
            </div>

        `;

        return;
    }


    items.forEach(item => {

        const price =
            Number(
                item.dine_in_price || 0
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "cashier-menu-card";


        card.innerHTML = `

            <img
                src="${
                    item.image ||
                    "images/no-image.png"
                }"
                onerror="
                    this.src='images/no-image.png'
                "
            >

            <div class="cashier-menu-info">

                <h3>
                    ${item.item_name}
                </h3>

                <p class="cashier-menu-category">
                    ${item.category || ""}
                </p>

                <p class="cashier-menu-price">
                    ${money(price)}
                </p>

                <button
                    class="cashier-add-btn">

                    ADD

                </button>

            </div>

        `;


        card.querySelector(
            ".cashier-add-btn"
        ).onclick = () => {

            addItemToCashierCart(
                item
            );

        };


        cashierMenuContainer.appendChild(
            card
        );

    });

}


// =====================================================
// ADD ITEM
// =====================================================

function addItemToCashierCart(item) {

    const price =
        Number(
            item.dine_in_price || 0
        );


    const existing =
        currentCart.find(
            cartItem =>
                cartItem.menuId ===
                item.id
        );


    if (existing) {

        existing.quantity++;

    }
    else {

        currentCart.push({

            id: null,

            menuId: item.id,

            itemName:
                item.item_name,

            price: price,

            quantity: 1,

            category:
                item.category || "",

            section_id:
                item.section_id || null,

            item_note: ""

        });

    }


    showCart();

}


// =====================================================
// SHOW CART
// =====================================================

function showCart() {

    cashierCartItems.innerHTML =
        "";


    if (!currentCart.length) {

        cashierCartItems.innerHTML = `

            <div class="empty-message">

                No items added yet.

            </div>

        `;

        showBill();

        return;
    }


    currentCart.forEach(
        (item, index) => {

            const amount =
                Number(item.price) *
                Number(item.quantity);


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cashier-cart-item";


            row.innerHTML = `

                <div
                    class="cashier-cart-item-top">

                    <span
                        class="cashier-cart-item-name">

                        ${item.itemName}

                    </span>

                    <span
                        class="cashier-cart-item-price">

                        ${money(amount)}

                    </span>

                </div>


                <div
                    class="cashier-cart-controls">

                    <button
                        class="minus-btn">

                        −

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        class="plus-btn">

                        +

                    </button>


                    <button
                        class="cashier-remove-btn">

                        REMOVE

                    </button>

                </div>

            `;


            row.querySelector(
                ".minus-btn"
            ).onclick = () => {

                if (
                    item.quantity > 1
                ) {

                    item.quantity--;

                }
                else {

                    currentCart.splice(
                        index,
                        1
                    );

                }


                showCart();

            };


            row.querySelector(
                ".plus-btn"
            ).onclick = () => {

                item.quantity++;

                showCart();

            };


            row.querySelector(
                ".cashier-remove-btn"
            ).onclick = () => {

                currentCart.splice(
                    index,
                    1
                );

                showCart();

            };


            cashierCartItems.appendChild(
                row
            );

        }
    );


    showBill();

}


// =====================================================
// SEND ORDER
// =======
