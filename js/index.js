/* js/index.js - Home Page Logic & Direct Link Redirection */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // UI Elements
    const dineInBtn = document.getElementById('dineInBtn');
    const takeAwayBtn = document.getElementById('takeAwayBtn');
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');
    const languageBtn = document.getElementById('languageBtn');
    const languageBox = document.getElementById('languageBox');
    const cartCount = document.getElementById('cartCount');
    const logoutBtn = document.getElementById('logoutBtn');
    const userLoggedInMenu = document.getElementById('userLoggedInMenu');
    const userLoggedOutMenu = document.getElementById('userLoggedOutMenu');
    const myOrdersLink = document.getElementById('myOrdersLink');

    // 1. Force "My Orders" button to redirect strictly to history.html
    if (myOrdersLink) {
        myOrdersLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'history.html';
        });
    }

    // 2. Update Cart Badge Count
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCount) {
            cartCount.innerText = totalQty;
        }
    }
    updateCartBadge();

    // 3. Dine In & Take Away Button Actions
    if (dineInBtn) {
        dineInBtn.addEventListener('click', () => {
            localStorage.setItem('selectedOrderType', 'Dine In');
            window.location.href = 'menu.html';
        });
    }

    if (takeAwayBtn) {
        takeAwayBtn.addEventListener('click', () => {
            localStorage.setItem('selectedOrderType', 'Take Away');
            window.location.href = 'menu.html';
        });
    }

    // 4. Side Drawer Navigation Open/Close
    if (menuBtn && sideMenu && closeMenu) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });

        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });
    }

    // 5. Language Selection Dropdown Toggle
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

    // 6. Check Auth State for Side Menu
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
        console.warn('Supabase Auth status check error:', err);
    }

    // 7. Logout Button Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
});
