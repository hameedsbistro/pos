// pos/js/index.js


// MENU SYSTEM


const menuBtn = document.getElementById("menuBtn");

const sideMenu = document.getElementById("sideMenu");

const closeMenu = document.getElementById("closeMenu");



if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        sideMenu.classList.add("active");

    });

}



if(closeMenu){

    closeMenu.addEventListener("click",()=>{

        sideMenu.classList.remove("active");

    });

}







// LANGUAGE SYSTEM


const languageBtn = document.getElementById("languageBtn");

const languageBox = document.getElementById("languageBox");



if(languageBtn){


    languageBtn.addEventListener("click",()=>{


        languageBox.classList.toggle("active");


    });


}






// LANGUAGE SELECT


const languageButtons = document.querySelectorAll(
    "[data-lang]"
);



languageButtons.forEach(button=>{


    button.addEventListener("click",()=>{


        let lang = button.dataset.lang;



        localStorage.setItem(
            "language",
            lang
        );



        location.reload();



    });


});







// REFRESH BUTTON


const refreshBtn = document.getElementById("refreshBtn");


if(refreshBtn){


    refreshBtn.addEventListener("click",()=>{


        location.reload();


    });


}







// LOGIN BUTTON


const loginBtn = document.getElementById("loginBtn");


const menuLoginBtn = document.getElementById(
    "menuLoginBtn"
);



function openLogin(){


    window.location.href =
    "login.html";


}




if(loginBtn){


    loginBtn.addEventListener(
        "click",
        openLogin
    );


}



if(menuLoginBtn){


    menuLoginBtn.addEventListener(
        "click",
        openLogin
    );


}







// CART BUTTON


const cartBtn = document.getElementById(
    "cartBtn"
);



if(cartBtn){


    cartBtn.addEventListener("click",()=>{


        window.location.href =
        "customer/cart.html";


    });


}








// CART COUNT


function loadCartCount(){


    let cart =
    JSON.parse(
        localStorage.getItem("cart")
    )
    ||
    [];



    let count = 0;



    cart.forEach(item=>{


        count += item.quantity;


    });



    let cartCount =
    document.getElementById(
        "cartCount"
    );



    if(cartCount){


        cartCount.innerText =
        count;


    }



}



loadCartCount();







// DINE IN BUTTON


const dineInBtn =
document.getElementById(
    "dineInBtn"
);



if(dineInBtn){


    dineInBtn.addEventListener(
        "click",
        ()=>{


            localStorage.setItem(
                "orderType",
                "Dine In"
            );



            window.location.href =
            "customer/menu.html";


        }
    );


}








// TAKE AWAY BUTTON


const takeAwayBtn =
document.getElementById(
    "takeAwayBtn"
);



if(takeAwayBtn){


    takeAwayBtn.addEventListener(
        "click",
        ()=>{


            localStorage.setItem(
                "orderType",
                "Take Away"
            );



            window.location.href =
            "customer/menu.html";


        }
    );


}
