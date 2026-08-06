// pos/js/language.js


const translations = {


en: {

title: "Menu & Ordering System",

welcome: "Welcome",

dineIn: "Dine In",

takeAway: "Take Away",

companyProfile: "Company Profile",

popular: "Popular Top 15 Items",

myOrders: "My Orders",

contact: "Contact Us",

login: "Login",

admin: "Admin",

cart: "Cart",

refresh: "Refresh",

home: "Home",

back: "Back",

language: "Language",

menu: "Menu",

order: "Order Now",

checkout: "Checkout",

total: "Total",

placeOrder: "Place Order",

cancel: "Cancel",

confirm: "Confirm"


},






ms: {


title: "Sistem Menu & Pesanan",

welcome: "Selamat Datang",

dineIn: "Makan Di Sini",

takeAway: "Bawa Pulang",

companyProfile: "Profil Syarikat",

popular: "15 Item Popular",

myOrders: "Pesanan Saya",

contact: "Hubungi Kami",

login: "Log Masuk",

admin: "Admin",

cart: "Troli",

refresh: "Segar Semula",

home: "Laman Utama",

back: "Kembali",

language: "Bahasa",

menu: "Menu",

order: "Pesan Sekarang",

checkout: "Bayaran",

total: "Jumlah",

placeOrder: "Buat Pesanan",

cancel: "Batal",

confirm: "Sahkan"


},






ta: {


title: "மெனு மற்றும் ஆர்டர் அமைப்பு",

welcome: "வரவேற்கிறோம்",

dineIn: "இங்கே சாப்பிடுங்கள்",

takeAway: "எடுத்து செல்லுங்கள்",

companyProfile: "நிறுவன சுயவிவரம்",

popular: "பிரபலமான 15 உணவுகள்",

myOrders: "எனது ஆர்டர்கள்",

contact: "எங்களை தொடர்பு கொள்ளவும்",

login: "உள்நுழைவு",

admin: "நிர்வாகி",

cart: "வண்டி",

refresh: "புதுப்பிக்கவும்",

home: "முகப்பு",

back: "பின்",

language: "மொழி",

menu: "மெனு",

order: "ஆர்டர் செய்ய",

checkout: "செலுத்த",

total: "மொத்தம்",

placeOrder: "ஆர்டர் இடு",

cancel: "ரத்து",

confirm: "உறுதி"


},






zh: {


title: "菜单和订购系统",

welcome: "欢迎",

dineIn: "堂食",

takeAway: "外带",

companyProfile: "公司简介",

popular: "热门15种商品",

myOrders: "我的订单",

contact: "联系我们",

login: "登录",

admin: "管理员",

cart: "购物车",

refresh: "刷新",

home: "主页",

back: "返回",

language: "语言",

menu: "菜单",

order: "立即订购",

checkout: "结账",

total: "总计",

placeOrder: "下订单",

cancel: "取消",

confirm: "确认"


},






hi: {


title: "मेनू और ऑर्डरिंग सिस्टम",

welcome: "स्वागत है",

dineIn: "यहीं खाएं",

takeAway: "ले जाएं",

companyProfile: "कंपनी प्रोफाइल",

popular: "लोकप्रिय 15 आइटम",

myOrders: "मेरे ऑर्डर",

contact: "संपर्क करें",

login: "लॉगिन",

admin: "व्यवस्थापक",

cart: "कार्ट",

refresh: "रिफ्रेश",

home: "होम",

back: "वापस",

language: "भाषा",

menu: "मेनू",

order: "ऑर्डर करें",

checkout: "चेकआउट",

total: "कुल",

placeOrder: "ऑर्डर करें",

cancel: "रद्द करें",

confirm: "पुष्टि करें"


},






bn: {


title: "মেনু এবং অর্ডারিং সিস্টেম",

welcome: "স্বাগতম",

dineIn: "এখানে খাবেন",

takeAway: "নিয়ে যাবেন",

companyProfile: "কোম্পানি প্রোফাইল",

popular: "জনপ্রিয় ১৫টি আইটেম",

myOrders: "আমার অর্ডার",

contact: "যোগাযোগ করুন",

login: "লগইন",

admin: "অ্যাডমিন",

cart: "কার্ট",

refresh: "রিফ্রেশ",

home: "হোম",

back: "পিছনে",

language: "ভাষা",

menu: "মেনু",

order: "অর্ডার করুন",

checkout: "চেকআউট",

total: "মোট",

placeOrder: "অর্ডার দিন",

cancel: "বাতিল",

confirm: "নিশ্চিত করুন"


}



};








function getLanguage(){


return localStorage.getItem(
"language"
)
||
"en";


}









function changeLanguage(){



const lang = getLanguage();




document.querySelectorAll(

"[data-i18n]"

)

.forEach(element=>{


const key =

element.dataset.i18n;




if(

translations[lang]

&&

translations[lang][key]

){


element.innerText =

translations[lang][key];


}



});



}









document.addEventListener(

"DOMContentLoaded",

changeLanguage

);








export {

changeLanguage,

getLanguage

};
