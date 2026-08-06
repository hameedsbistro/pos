// pos/js/language.js


const translations = {


en: {


title:
"Menu & Ordering System",


dineIn:
"Dine In",


takeAway:
"Take Away",


companyProfile:
"Company Profile",


popular:
"Popular Top 15 Items",


myOrders:
"My Orders",


contact:
"Contact Us",


login:
"Login",


cart:
"Cart",


refresh:
"Refresh"


},






ms: {


title:
"Sistem Menu & Pesanan",


dineIn:
"Makan Di Sini",


takeAway:
"Bawa Pulang",


companyProfile:
"Profil Syarikat",


popular:
"15 Item Popular",


myOrders:
"Pesanan Saya",


contact:
"Hubungi Kami",


login:
"Log Masuk",


cart:
"Troli",


refresh:
"Segar Semula"


},






ta: {


title:
"மெனு மற்றும் ஆர்டர் அமைப்பு",


dineIn:
"இங்கே சாப்பிடுங்கள்",


takeAway:
"எடுத்து செல்லுங்கள்",


companyProfile:
"நிறுவன சுயவிவரம்",


popular:
"பிரபலமான 15 உணவுகள்",


myOrders:
"எனது ஆர்டர்கள்",


contact:
"எங்களை தொடர்பு கொள்ளவும்",


login:
"உள்நுழைவு",


cart:
"வண்டி",


refresh:
"புதுப்பிக்கவும்"


},






zh: {


title:
"菜单和订购系统",


dineIn:
"堂食",


takeAway:
"外带",


companyProfile:
"公司简介",


popular:
"热门15种商品",


myOrders:
"我的订单",


contact:
"联系我们",


login:
"登录",


cart:
"购物车",


refresh:
"刷新"


},






hi: {


title:
"मेनू और ऑर्डरिंग सिस्टम",


dineIn:
"यहीं खाएं",


takeAway:
"ले जाएं",


companyProfile:
"कंपनी प्रोफाइल",


popular:
"लोकप्रिय 15 आइटम",


myOrders:
"मेरे ऑर्डर",


contact:
"संपर्क करें",


login:
"लॉगिन",


cart:
"कार्ट",


refresh:
"रिफ्रेश"


},






bn: {


title:
"মেনু এবং অর্ডারিং সিস্টেম",


dineIn:
"এখানে খাবেন",


takeAway:
"নিয়ে যাবেন",


companyProfile:
"কোম্পানি প্রোফাইল",


popular:
"জনপ্রিয় ১৫টি আইটেম",


myOrders:
"আমার অর্ডার",


contact:
"যোগাযোগ করুন",


login:
"লগইন",


cart:
"কার্ট",


refresh:
"রিফ্রেশ"


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


let lang =
getLanguage();



document.querySelectorAll(
"[data-i18n]"
)
.forEach(element=>{


let key =
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
