/* js/menu.js - Connected with Supabase */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');
    const languageBtn = document.getElementById('languageBtn');
    const languageBox = document.getElementById('languageBox');
    const cartCount = document.getElementById('cartCount');
    const refreshBtn = document.getElementById('refreshBtn');
    const userLoggedInMenu = document.getElementById('userLoggedInMenu');
    const userLoggedOutMenu = document.getElementById('userLoggedOutMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const orderTypeDisplay = document.getElementById('orderTypeDisplay');
    const categorySelect = document.getElementById('categorySelect');
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    const sectionTitle = document.getElementById('sectionTitle');

    // 1. Get Order Type from Local Storage (Dine In or Take Away)
    const orderType = localStorage.getItem('selectedOrderType') || 'Dine In';
    if (orderTypeDisplay) orderTypeDisplay.innerText = orderType;

    // 2. Fetch Menu Items directly from Supabase Database
    let menuItems = [];
    async function loadMenuFromSupabase() {
        if (!menuItemsGrid) return;
        menuItemsGrid.innerHTML = '<p style="text-align:center; width:100%;">Loading menu items...</p>';

        const { data, error } = await supabase
            .from('menu')
            .select('*')
            .eq('status', 'available');

        if (error) {
            console.error('Error fetching menu:', error.message);
            menuItemsGrid.innerHTML = '<p style="text-align:center; color:red; width:100%;">Failed to load menu items!</p>';
            return;
        }

        menuItems = data || [];
        renderCategoryOptions();
        renderTop15Items(); // ডিফল্টভাবে পেজ লোড হলে টপ ১৫ আইটেম দেখাবে
    }

    // 3. Render Category Dropdown Options
    function renderCategoryOptions() {
        if (!categorySelect) return;
        const categories = [...new Set(menuItems.map(item => item.category))];

        let options = `<option value="top15">Top 15 Items</option>`;
        categories.forEach(cat => {
            options += `<option value="${cat}">${cat}</option>`;
        });

        categorySelect.innerHTML = options;
    }

    // 4. Render Top 15 Items
    function renderTop15Items() {
        if (sectionTitle) sectionTitle.innerText = 'Top 15 Items';
        const top15 = menuItems.slice(0, 15); // প্রথম ১৫টি খাবার
        displayCards(top15);
    }

    // 5. Render Specific Category Items (Top 15 হাইড হয়ে ক্যাটাগরি আসবে)
    function renderCategoryItems(selectedCategory) {
        if (selectedCategory === 'top15') {
            renderTop15Items();
            return;
        }

        if (sectionTitle) sectionTitle.innerText = `Category: ${selectedCategory}`;
        const filtered = menuItems.filter(item => item.category === selectedCategory);
        displayCards(filtered);
    }

    // 6. Display Cards Generator
    function displayCards(itemsList) {
        if (!menuItemsGrid) return;
        menuItemsGrid.innerHTML = '';

        if (itemsList.length === 0) {
            menuItemsGrid.innerHTML = '<p style="text-align:center; width:100%;">No items found in this category.</p>';
            return;
        }

        itemsList.forEach(item => {
            // Dine In বা Take Away নির্বাচন অনুযায়ী সঠিক দাম
            const itemPrice = (orderType === 'Dine In') ? item.dine_in_price : item.take_away_price;
            const imageUrl = item.image || 'images/default-food.png';

            const card = document.createElement('div');
            card.className = 'food-card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${item.item_name}" class="food-img" onerror="this.src='images/logo.png'">
                <h4>${item.item_name}</h4>
                <p class="price-tag">৳ ${itemPrice || 0}</p>
                <button class="add-cart-btn" data-id="${item.id}">+ Add</button>
            `;
            menuItemsGrid.appendChild(card);
        });

        // Add to Cart Event
        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                addToCart(itemId);
            });
        });
    }

    // 7. Cart Management
    function addToCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = menuItems.find(p => p.id === id);
        if (!product) return;

        const price = (orderType === 'Dine In') ? product.dine_in_price : product.take_away_price;
        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                item_name: product.item_name,
                price: price,
                qty: 1,
                section_id: product.section_id
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        alert(`${product.item_name} added to cart!`);
    }

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCount) cartCount.innerText = totalQty;
    }

    // 8. Category Dropdown Listener
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            renderCategoryItems(e.target.value);
        });
    }

    // 9. Side Menu & Drawers
    if (menuBtn && sideMenu && closeMenu) {
        menuBtn.addEventListener('click', () => sideMenu.classList.add('active'));
        closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));
    }

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

    // Page Load Actions
    updateCartBadge();
    await loadMenuFromSupabase();
});
  
