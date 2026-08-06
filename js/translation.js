// pos/js/translation.js



const translations = {


en:{


home:"Home",

back:"Back",

refresh:"Refresh",

login:"Login",

menu:"Menu",

order:"Order Now",

cart:"Cart",

checkout:"Checkout",

dineIn:"Dine In",

takeAway:"Take Away",

language:"Language",

welcome:"Welcome",

menuOrderSystem:"Menu & Ordering System",

addToCart:"Add To Cart",

total:"Total",

placeOrder:"Place Order",

cancel:"Cancel",

confirm:"Confirm"




},






ms:{


home:"Laman Utama",

back:"Kembali",

refresh:"Muat Semula",

login:"Log Masuk",

menu:"Menu",

order:"Pesan Sekarang",

cart:"Troli",

checkout:"Bayar",

dineIn:"Makan Di Sini",

takeAway:"Bawa Pulang",

language:"Bahasa",

welcome:"Selamat Datang",

menuOrderSystem:"Menu & Sistem Pesanan",

addToCart:"Tambah Ke Troli",

total:"Jumlah",

placeOrder:"Buat Pesanan",

cancel:"Batal",

confirm:"Sahkan"




},







bn:{


home:"হোম",

back:"পিছনে",

refresh:"রিফ্রেশ",

login:"লগইন",

menu:"মেনু",

order:"অর্ডার করুন",

cart:"কার্ট",

checkout:"চেকআউট",

dineIn:"এখানে খাব",

takeAway:"নিয়ে যাব",

language:"ভাষা",

welcome:"স্বাগতম",

menuOrderSystem:"মেনু ও অর্ডারিং সিস্টেম",

addToCart:"কার্টে যোগ করুন",

total:"মোট",

placeOrder:"অর্ডার দিন",

cancel:"বাতিল",

confirm:"নিশ্চিত"




},







hi:{


home:"होम",

back:"वापस",

refresh:"रिफ्रेश",

login:"लॉगिन",

menu:"मेनू",

order:"ऑर्डर करें",

cart:"कार्ट",

checkout:"चेकआउट",

dineIn:"यहीं खाएं",

takeAway:"ले जाएं",

language:"भाषा",

welcome:"स्वागत है",

menuOrderSystem:"मेनू और ऑर्डरिंग सिस्टम",

addToCart:"कार्ट में जोड़ें",

total:"कुल",

placeOrder:"ऑर्डर करें",

cancel:"रद्द करें",

confirm:"पुष्टि करें"




},







ta:{


home:"முகப்பு",

back:"பின்",

refresh:"புதுப்பிக்க",

login:"உள்நுழை",

menu:"மெனு",

order:"ஆர்டர் செய்ய",

cart:"வண்டி",

checkout:"செலுத்த",

dineIn:"இங்கே சாப்பிட",

takeAway:"எடுத்து செல்ல",

language:"மொழி",

welcome:"வரவேற்கிறோம்",

menuOrderSystem:"மெனு மற்றும் ஆர்டர் அமைப்பு",

addToCart:"வண்டியில் சேர்",

total:"மொத்தம்",

placeOrder:"ஆர்டர் இடு",

cancel:"ரத்து",

confirm:"உறுதி"




},







zh:{


home:"主页",

back:"返回",

refresh:"刷新",

login:"登录",

menu:"菜单",

order:"立即订购",

cart:"购物车",

checkout:"结账",

dineIn:"堂食",

takeAway:"外带",

language:"语言",

welcome:"欢迎",

menuOrderSystem:"菜单和订购系统",

addToCart:"加入购物车",

total:"总计",

placeOrder:"下订单",

cancel:"取消",

confirm:"确认"




}



};









// CURRENT LANGUAGE



function getLanguage(){



return localStorage.getItem(

"language"

)

|| "en";



}









// TRANSLATE FUNCTION



function translate(key){



let lang = getLanguage();





return translations[lang][key]

||

translations["en"][key]

||

key;



}









// AUTO TRANSLATE ELEMENTS



function applyLanguage(){



document.querySelectorAll(

"[data-i18n]"

)

.forEach(element=>{



let key =

element.getAttribute(

"data-i18n"

);





element.innerText =

translate(key);



});



}









// EXPORT



export {

translate,

applyLanguage

};
