/* js/cart.js - Cart Management with SST 6% & RM Currency */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummary');
    const cartCount = document.getElementById('cartCount');
    
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    // 1. Render Cart Items from LocalStorage
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div style="text-align: center; padding: 40px 10px;">
                    <p style="font-size: 18px; color: #666; margin-bottom: 15px;">Your cart is empty!</p>
                    <a href="menu.html" class="add-cart-btn" style="text-decoration: none; display: inline-block; width: auto; padding: 10px 20px;">Browse Menu</a>
                </div>
            `;
            if (cartSummary) cartSummary.classList.add('hidden');
            updateCartBadge();
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemSubtotal = itemPrice * item.qty;
            subtotal += itemSubtotal;

            const row = document.createElement('div');
            row.style.cssText = 'background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 8px;';
            
            row.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 16px; color: #003366;">${item.item_name}</strong>
                    <span style="font-weight: bold; color: #27ae60;">RM ${itemSubtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                    <small style="color: #666;">Price: RM ${itemPrice.toFixed(2)}</small>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button class="qty-btn" data-index="${index}" data-action="decrease" style="padding: 2px 8px; background: #ddd; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-index="${index}" data-action="increase" style="padding: 2px 8px; background: #ddd; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                        <button class="remove-btn" data-index="${index}" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; margin-left: 10px;">✕</button>
                    </div>
                </div>
                <div>
                    <input type="text" class="item-note" data-index="${index}" placeholder="Special note (e.g. less spicy)" value="${item.item_note || ''}" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; margin-top: 4px;">
                </div>
            `;
            cartItemsList.appendChild(row);
        });

        // SST 6% এবং গ্র্যান্ড টোটাল ক্যালকুলেশন
        const sst = subtotal * 0.06;
        const grandTotal = subtotal + sst;

        if (cartSummary) {
            cartSummary.innerHTML = `
                <div style="font-size: 15px; color: #333; line-height: 1.8;">
                    <p style="display: flex; justify-content: space-between;"><span>Subtotal:</span> <strong>RM ${subtotal.toFixed(2)}</strong></p>
                    <p style="display: flex; justify-content: space-between;"><span>SST (6%):</span> <strong>RM ${sst.toFixed(2)}</strong></p>
                    <hr style="margin: 8px 0; border: none; border-top: 1px dashed #ccc;">
                    <p style="display: flex; justify-content: space-between; font-size: 18px; color: #003366;"><span>Total:</span> <strong>RM ${grandTotal.toFixed(2)}</strong></p>
                </div>
                <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;">
                    <a href="menu.html" class="add-cart-btn" style="text-decoration: none; background: #666; display: inline-block; width: auto; padding: 10px 15px;">+ Add More Food</a>
                    <a href="checkout.html" class="add-cart-btn" style="text-decoration: none; background: #27ae60; display: inline-block; width: auto; padding: 10px 15px;">Proceed to Checkout →</a>
                </div>
            `;
            cartSummary.classList.remove('hidden');
        }

        updateCartBadge();
        attachCartEvents();
    }

    // 2. Quantity & Note Handlers
    function attachCartEvents() {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const action = e.target.getAttribute('data-action');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                if (action === 'increase') {
                    cart[index].qty += 1;
                } else if (action === 'decrease') {
                    if (cart[index].qty > 1) {
                        cart[index].qty -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        document.querySelectorAll('.item-note').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.getAttribute('data-index');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart[index].item_note = e.target.value;
                localStorage.setItem('cart', JSON.stringify(cart));
            });
        });
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCount) cartCount.innerText = totalQty;
    }

    // 3. UI Drawer Listeners
    if (menuBtn && sideMenu && closeMenu) {
        menuBtn.addEventListener('click', () => sideMenu.classList.add('active'));
        closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => window.location.reload());
    }

    // Initialize Page
    renderCart();
});
                  
