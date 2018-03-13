"use strict"

document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        ready();
    }
}

var headerMenuButton = document.getElementById("header-menu"),
    bagPriceCount = document.getElementById("bagPriceCount"),
    bagItemsCount = document.getElementById("bagItemsCount"),
    searchInput = document.getElementById("searchInput"),
    searchButton = document.getElementById("searchButton");

function ready () {
    headerMenuButton.addEventListener("click", expandMenu);
    searchButton.addEventListener("click", expand);
    totalPrice();
	bagCounter();
}


function expand(){
    var containerWidth = document.getElementsByClassName("container")[0].clientWidth;
    if (containerWidth > 1024){
        searchInput.classList.remove("mobileInputWidth");
        return ;
    } else  if (searchInput.classList.contains("mobileInputWidth")){
        searchInput.classList.toggle("mobileInputWidth");
    }else{
        searchInput.classList.toggle("mobileInputWidth");
    }
}

function expandMenu(e){
    var menuCheckbox = document.getElementById("header-mobile-menu"),
        bottomMenu = document.getElementsByClassName("header-bottom")[0];

    if(bottomMenu.style.display=='block'){
        bottomMenu.style.borderTop='0px';
        bottomMenu.style.display='none';
        headerMenuButton.classList.add('icon-menu');
        headerMenuButton.classList.remove('icon-close');
    }else{
        bottomMenu.style.borderTop='1px solid #e5e5e5';
        bottomMenu.style.display='block';
        headerMenuButton.classList.add('icon-close');
        headerMenuButton.classList.remove('icon-menu');
    }
}

function totalPrice(){
    var cartData = getCartData();
    var cartPrice = 0;

    if (cartData == null){
        return
    }
    
    for (var i = 0; i < cartData.length; i++) {
        var catalogItem = getDataById(cartData[i].id),
            priceValue,
            hasNew = "",
            discount = "";

        if( catalogItem.price == null && catalogItem.discountedPrice == null ){
            priceValue =  0;
        } else if(  catalogItem.discountedPrice < catalogItem.price){
            priceValue = catalogItem.discountedPrice;
        } else {
            priceValue = catalogItem.price;
        }
        cartPrice += priceValue * cartData[i].count;
    }
    
    bagPriceCount.innerHTML = (cartData.length == 0)? '': '&#163;' + cartPrice.toFixed(2);
    
    if (typeof totalCostContainer!='undefined'){
        totalCostContainer.innerHTML = (cartData.length == 0)? '&#163;0' : '&#163;' + cartPrice.toFixed(2);
    }
}

function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}

function getDataById(id){
    var obj;

    for (var i = 0; i < catalog.length; i++) {
        if(catalog[i].id == id){
            obj = catalog[i];
        }
    }

    return obj;
}

function bagCounter() {
    var priceValue = getBagCountValue || 0;
    bagItemsCount.innerHTML = '(' + getBagCountValue() + ')';
}

function getBagCountValue(){
    var cartData = getCartData() || 0,
        cartItemsCount = 0,
        priceValue = 0;

    if (cartData.length == 0){
        return 0
    }
    
    for (var i = 0; i < cartData.length; i++) {
        cartItemsCount += cartData[i].count;
    }

    return cartItemsCount;
}