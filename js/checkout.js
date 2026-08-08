/* js/checkout.js - Order Placement with SST 6% & History Redirection */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const displayOrderType = document.getElementById('displayOrderType');
    const tableNoGroup = document.getElementById('tableNoGroup');
    const takeAwayGroup = document.getElementById('takeAwayGroup');
    const tableNoInput = document.getElementById('tableNo');
    const custNameInput = document.getElementById('custName');
    const custPhoneInput = document.getElementById('custPhone');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summarySst = document.getElementById('summarySst');
    const summaryTotal = document.getElementById('summaryTotal');
    const checkoutForm = document.getElementById('checkoutForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');

    // 1. Load Selected Order Type & Setup Inputs
    const orderType = localStorage.getItem('selectedOrderType') || 'Dine In';
    if (displayOrderType) displayOrderType.innerText = orderType;

    if (orderType === 'Take Away') {
        if (tableNoGroup) tableNoGroup.classList.add('hidden');
        if (takeAwayGroup) takeAwayGroup.classList.remove('hidden');
    } else {
        if (tableNoGroup) tableNoGroup.classList.remove('hidden');
        if (takeAwayGroup) takeAwayGroup.classList.add('hidden');
    }

    // 2. Calculate Cart Totals (RM & 6% SST)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty! Redirecting to menu...');
        window.location.href = 'menu.html';
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += (parseFloat(item.price) || 0) * (item.qty || 1);
    });

    const sst = subtotal * 0.06;
    const grandTotal = subtotal + sst;

    if (summarySubtotal) summarySubtotal.innerText = subtotal.toFixed(2);
    if (summarySst) summarySst.innerText = sst.toFixed(2);
    if (summaryTotal) summaryTotal.innerText = grandTotal.toFixed(2);

    // 3. Form Submit - Push Order to Supabase
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            let tableNo = null;
            let custName = null;
            let custPhone = null;

            if (orderType === 'Dine In') {
                tableNo = tableNoInput.value.trim();
                if (!tableNo) {
                    alert('Please enter your Table Number!');
                    return;
                }
            } else {
                custName = custNameInput.value.trim();
                custPhone = custPhoneInput.value.trim();
                if (!custName || !custPhone) {
                    alert('Please enter Customer Name and Phone Number!');
                    return;
                }
            }

            placeOrderBtn.disabled = true;
            placeOrderBtn.innerText = 'Processing Order...';

            // Insert into 'orders' table in Supabase
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([
                    {
                        order_type: orderType,
                        table_no: tableNo,
                        customer_name: custName,
                        customer_phone: custPhone,
                        payment_method: paymentMethodSelect.value,
                        subtotal: subtotal,
                        sst: sst,
                        total_amount: grandTotal,
                        status: 'pending'
                    }
                ])
                .select();

            if (orderError) {
                console.error('Order Error:', orderError.message);
                alert('Failed to place order. Please try again!');
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerText = 'Confirm & Place Order';
                return;
            }

            const newOrderId = orderData[0].id;

            // Insert Order Items into 'order_items' table
            const orderItemsPayload = cart.map(item => ({
                order_id: newOrderId,
                item_name: item.item_name,
                price: item.price,
                qty: item.qty,
                note: item.item_note || '',
                section_id: item.section_id || null
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsPayload);

            if (itemsError) {
                console.error('Order Items Error:', itemsError.message);
            }

            // Clear Cart and Redirect to history.html
            localStorage.removeItem('cart');
            alert('Order placed successfully!');
            window.location.href = 'history.html';
        });
    }

    // 4. UI Side Menu Logic
    if (menuBtn && sideMenu && closeMenu) {
        menuBtn.addEventListener('click', () => sideMenu.classList.add('active'));
        closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
    }
});
                                               
