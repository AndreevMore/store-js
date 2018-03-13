"use strict"

document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        ready();
    }
}

var body = document.getElementsByTagName('body')[0],
    bagItemsContainer = document.getElementsByClassName('bagItems')[0],
    bagItemsCount = document.getElementById("bagItemsCount"),
    bagPriceCount = document.getElementById("bagPriceCount"),
    buyNowButton = document.getElementById('buyNow'),
    clearCartButton = document.getElementById('clear_cart'),
    totalCostContainer = document.getElementById("totalCost"),
    infoBuyContainer = document.getElementsByClassName('infoBuy')[0],
    infoEmptyContainer = document.getElementsByClassName('infoEmpty')[0],
    searchInput = document.getElementById("searchInput"),
    searchButton = document.getElementById("searchButton"),
    headerMenuButton = document.getElementById("header-menu");

function checkEmptyBag(){
    if(getBagCountValue() == 0){
        infoEmptyContainer.style.display='block';
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

function ready() {
    headerMenuButton.addEventListener("click", expandMenu);
    fillBagItems();
    bagCounter();
    searchButton.addEventListener("click", expand);
    buyNowButton.addEventListener("click", buyNowFunction);
    clearCartButton.addEventListener("click", clearCart);
    checkEmptyBag();
}

function clearCart(){
    localStorage.removeItem("cart");
    bagItemsContainer.innerHTML="";
    totalCostContainer.innerHTML= "&#163 0";
    infoEmptyContainer.style.display='block';
    infoBuyContainer.style.display='none';

    bagCounter();
}

function buyNowFunction(){
    localStorage.removeItem("cart");
    bagItemsContainer.innerHTML="";
    totalCostContainer.innerHTML= "&#163 0";
    infoBuyContainer.style.display='block';
    infoEmptyContainer.style.display='none';

    bagCounter();
}

function fillBagItems(){
    var cartData = getCartData(),
        cartPrice = 0,
        headerBagValue = '';

    if (cartData == null){
        return
    }
    
    for (var i = 0; i < cartData.length; i++) {

        var catalogItem = getDataById(cartData[i].id);
        var priceValue;
        var hasNew = "";
        var discount = "";

        if( catalogItem.price == null && catalogItem.discountedPrice == null ){
            priceValue =  0;
        } else if(  catalogItem.discountedPrice < catalogItem.price){
            priceValue = catalogItem.discountedPrice;
        } else {
            priceValue = catalogItem.price;
        }
        cartPrice += priceValue * cartData[i].count;

        var bagItemTemplate =  '<div class="bagItem"><div class="id">' +  cartData[i].id +
                        '</div><div class="bag-image floatLeft">    <a href="catalog.html">        <img src="' +
                        catalogItem.thumbnail +  '" alt=""><div class="overlay"><span class="overlay-text">View item</span></div> '+
                        '</a></div><div class="bagItemTotal floatLeft"><h4 class="itemTitle">Only Skinny Jeans</h4><p class="cost">&#163; ' +
                        priceValue.toFixed(2) +  '</p><p>Color: <span class="color">' + cartData[i].color +  '</span></p><p>Size: <span class="size">' +
                        cartData[i].size +  '</span></p><p>Quantity:<span class="subtraction red"> - </span><span class="quantity"> ' +
                        cartData[i].count +  ' </span><span class="addition red"> + </span></p><p class="removeItem red">Remove item</p> </div></div>';
                            
        bagItemsContainer.insertAdjacentHTML('afterBegin', bagItemTemplate);
        
    }

    totalPrice();
    addEvents(); 
}

function addEvents() {
    var bagItems = document.getElementsByClassName('bagItem'),
        subtractionButton = document.getElementsByClassName('subtraction'),
        additionButton = document.getElementsByClassName('addition'),
        removeItemButton = document.getElementsByClassName('removeItem');

    for (var i = 0; i < bagItems.length; i++) {
        bagItems[i].addEventListener("click", bagItemsEvent);
    }
}

function bagItemsEvent(e) {
    var me = this;
    var target = e.target;

    if (target.classList.contains('subtraction')) {
        changeItemCount(me, 'sub');
    } else if (target.classList.contains('addition')) {
        changeItemCount(me, 'add');
    } else if (target.classList.contains('removeItem')) {
        removeItem(me);
    } else {
        return
    }
}

function changeItemCount(me, operation) {
    var count = parseInt(me.getElementsByClassName('quantity')[0].textContent);
    
    if (operation == 'sub'){
        count--;
    } else {
        count++;
    }

    if(count == 0){
        count = 1;
    }

    me.getElementsByClassName('quantity')[0].textContent=count;

    var cartData = getCartData(),
        newArr = [],
        id = me.getElementsByClassName('id')[0].textContent,
        color = me.getElementsByClassName('color')[0].textContent,
        size = me.getElementsByClassName('size')[0].textContent;
    
    var obj = {
        id:id,
        color:color,
        size:size,
        count:count
    };

    for (var i = 0; i < cartData.length; i++) {
        if(!(obj.id === cartData[i].id && obj.color === cartData[i].color && obj.size === cartData[i].size)){
            newArr.push(cartData[i]);
        }else{
            newArr.push(obj);
        }
    }

    setCartData(newArr);
    bagCounter();
    totalPrice();
}

function totalPrice(){
    var cartData = getCartData() || 0;
    var cartPrice = 0;

    for (var i = 0; i < cartData.length; i++) {
        cartData[i]
        var catalogItem = getDataById(cartData[i].id);
        var priceValue;
        var hasNew = "";
        var discount = "";

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

function removeItem(me) {
    var cartData = getCartData(),
        newArr = [],
        id = me.getElementsByClassName('id')[0].textContent,
        color = me.getElementsByClassName('color')[0].textContent,
        size = me.getElementsByClassName('size')[0].textContent,
        count = parseInt(me.getElementsByClassName('quantity')[0].textContent);
    
    var obj = {
        id:id,
        color:color,
        size:size,
        count:count
    };

    for (var i = 0; i < cartData.length; i++) {
        if(!(obj.id === cartData[i].id && obj.color === cartData[i].color && obj.size === cartData[i].size)){
            newArr.push(cartData[i]);
        }
    }

    setCartData(newArr);
    bagItemsContainer.innerHTML = '';
    fillBagItems();
    bagCounter();
    checkEmptyBag();

}

function bagCounter() {
    var priceValue = getBagCountValue || 0;
    bagItemsCount.innerHTML = '(' + getBagCountValue() + ')';
}

function getBagCountValue(){
    var cartData = getCartData() || 0;
    var cartItemsCount = 0;
    var priceValue = 0;

    if (cartData.length == 0){
        return 0
    }
    
    for (var i = 0; i < cartData.length; i++) {
        cartItemsCount += cartData[i].count;
    }

    return cartItemsCount;
}

function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}

function setCartData(obj){
    localStorage.setItem('cart', JSON.stringify(obj));
    return false;
}

function setCartData(obj){
    localStorage.setItem('cart', JSON.stringify(obj));
    return false;
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

function getDataById(id){
    var obj;

    for (var i = 0; i < catalog.length; i++) {
        if(catalog[i].id == id){
            obj = catalog[i];
        }
    }

    return obj;
}