/* COMPLETE js/index.js - Connected with Supabase & LocalStorage */

import { supabase } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    // ---------------- UI ELEMENTS ----------------
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const sideMenu = document.getElementById('sideMenu');

    const languageBtn = document.getElementById('languageBtn');
    const languageBox = document.getElementById('languageBox');

    const dineInBtn = document.getElementById('dineInBtn');
    const takeAwayBtn = document.getElementById('takeAwayBtn');
    const cartCount = document.getElementById('cartCount');
    const refreshBtn = document.getElementById('refreshBtn');

    const userLoggedInMenu = document.getElementById('userLoggedInMenu');
    const userLoggedOutMenu = document.getElementById('userLoggedOutMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    // ---------------- 1. SIDE MENU (DRAWER) ----------------
    if (menuBtn && sideMenu && closeMenu) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('active');
        });

        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
        });
    }

    // ---------------- 2. USER AUTHENTICATION & SESSION CHECK ----------------
    async function checkUserSession() {
        // Supabase এর একটিভ সেশন দেখা
        const { data: { session } } = await supabase.auth.getSession();
        const localUser = JSON.parse(localStorage.getItem('currentUser'));

        if (session || localUser) {
            if (userLoggedInMenu) userLoggedInMenu.classList.remove('hidden');
            if (userLoggedOutMenu) userLoggedOutMenu.classList.add('hidden');
        } else {
            if (userLoggedInMenu) userLoggedInMenu.classList.add('hidden');
            if (userLoggedOutMenu) userLoggedOutMenu.classList.remove('hidden');
        }
    }

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('currentUser');
            alert('Logged out successfully!');
            window.location.reload();
        });
    }

    // ---------------- 3. LANGUAGE DROPDOWN ----------------
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

        languageBox.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const langCode = e.target.getAttribute('data-lang');
                localStorage.setItem('selectedLanguage', langCode);
                languageBtn.innerHTML = `🌐 ${langCode.toUpperCase()}`;
                languageBox.classList.remove('active');
            });
        });

        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        languageBtn.innerHTML = `🌐 ${savedLang.toUpperCase()}`;
    }

    // ---------------- 4. DINE IN / TAKE AWAY HANDLER ----------------
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

    // ---------------- 5. CART BADGE COUNT ----------------
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        if (cartCount) {
            cartCount.innerText = totalQty;
        }
    }

    // ---------------- 6. REFRESH PAGE ----------------
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // INITIALIZATION
    await checkUserSession();
    updateCartBadge();
});
