/* js/history.js - Customer Order History Page Logic */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const ordersList = document.getElementById('ordersList');
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');
    const refreshBtn = document.getElementById('refreshBtn');
    const languageBtn = document.getElementById('languageBtn');
    const languageBox = document.getElementById('languageBox');
    const cartCount = document.getElementById('cartCount');
    const logoutBtn = document.getElementById('logoutBtn');
    const userLoggedInMenu = document.getElementById('userLoggedInMenu');
    const userLoggedOutMenu = document.getElementById('userLoggedOutMenu');

    // 1. Update Cart Badge Count
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCount) {
            cartCount.innerText = totalQty;
        }
    }
    updateCartBadge();

    // 2. Side Menu Drawer Toggle Logic
    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sideMenu.classList.add('active');
        });
    }

    if (closeMenu && sideMenu) {
        closeMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            sideMenu.classList.remove('active');
        });
    }

    // Close Side Menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sideMenu && sideMenu.classList.contains('active')) {
            if (!sideMenu.contains(e.target) && e.target !== menuBtn) {
                sideMenu.classList.remove('active');
            }
        }
    });

    // 3. Header Refresh Button Action
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // 4. Language Selection Popup Logic
    if (languageBtn && languageBox) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageBox.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!languageBox.contains(e.target) && e.target !== languageBtn) {
                languageBox.classList.remove('active');
            }
        });

        const langButtons = languageBox.querySelectorAll('button');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedLang = btn.getAttribute('data-lang');
                localStorage.setItem('appLanguage', selectedLang);
                if (languageBtn) {
                    languageBtn.innerText = `🌐 ${selectedLang.toUpperCase()}`;
                }
                languageBox.classList.remove('active');
            });
        });
    }

    // 5. Auth State Checking for Menu
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            if (userLoggedInMenu) userLoggedInMenu.classList.remove('hidden');
            if (userLoggedOutMenu) userLoggedOutMenu.classList.add('hidden');
        } else {
            if (userLoggedInMenu) userLoggedInMenu.classList.add('hidden');
            if (userLoggedOutMenu) userLoggedOutMenu.classList.remove('hidden');
        }
    } catch (err) {
        console.warn('Auth check error:', err);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    // 6. Fetch Order History from Supabase
    async function loadOrders() {
        if (!ordersList) return;
        ordersList.innerHTML = '<p style="text-align:center; padding: 30px; color: #666;">Loading your orders...</p>';

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders:', error.message);
            ordersList.innerHTML = `
                <div class="empty-history-box">
                    <p style="color: #e74c3c;">Failed to load order history!</p>
                    <button id="retryBtn" class="empty-history-btn">Try Again</button>
                </div>
            `;
            const retryBtn = document.getElementById('retryBtn');
            if (retryBtn) retryBtn.addEventListener('click', loadOrders);
            return;
        }

        if (!orders || orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-history-box">
                    <p>No previous orders found.</p>
                    <a href="menu.html" class="empty-history-btn">Order Food Now</a>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = '';

        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card';

            const statusLower = (order.status || 'pending').toLowerCase();
            let statusClass = 'status-pending';
            if (statusLower === 'accepted') statusClass = 'status-accepted';
            else if (statusLower === 'preparing') statusClass = 'status-preparing';
            else if (statusLower === 'ready') statusClass = 'status-ready';
            else if (statusLower === 'completed') statusClass = 'status-completed';
            else if (statusLower === 'cancelled') statusClass = 'status-cancelled';

            const orderDisplayId = order.id ? order.id.toString().slice(0, 8).toUpperCase() : 'N/A';
            const orderDate = order.created_at 
                ? new Date(order.created_at).toLocaleString() 
                : 'N/A';

            card.innerHTML = `
                <div class="order-card-header">
                    <span class="order-id">Order #${orderDisplayId}</span>
                    <span class="status-badge ${statusClass}">${order.status || 'Pending'}</span>
                </div>
                
                <div class="order-card-body">
                    <div class="order-info-row">
                        <span class="order-info-label">Order Type:</span>
                        <span class="order-info-value">${order.order_type || 'Dine In'}</span>
                    </div>

                    ${order.table_no ? `
                    <div class="order-info-row">
                        <span class="order-info-label">Table Number:</span>
                        <span class="order-info-value">${order.table_no}</span>
                    </div>
                    ` : ''}

                    ${order.customer_name ? `
                    <div class="order-info-row">
                        <span class="order-info-label">Customer Name:</span>
                        <span class="order-info-value">${order.customer_name}</span>
                    </div>
                    ` : ''}

                    <div class="order-info-row">
                        <span class="order-info-label">Payment Method:</span>
                        <span class="order-info-value" style="text-transform: capitalize;">${order.payment_method || 'Cash Counter'}</span>
                    </div>

                    <div class="order-info-row" style="margin-top: 6px; padding-top: 6px; border-top: 1px dashed #eee;">
                        <span class="order-info-label">Total Amount (inc. 6% SST):</span>
                        <span class="order-price-value">RM ${(order.total_amount || 0).toFixed(2)}</span>
                    </div>

                    <div class="order-date">
                        🕒 ${orderDate}
                    </div>
                </div>
            `;

            ordersList.appendChild(card);
        });
    }

    await loadOrders();
});
