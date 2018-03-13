"use strict"

document.onreadystatechange = function(){
   if(document.readyState === 'complete'){
      ready();
   }
}

var bagPriceCount = document.getElementById("bagPriceCount"),
	bagItemsCount = document.getElementById("bagItemsCount"),
	filterMenuButton = document.getElementById("filter-menu-button"),
	searchInput = document.getElementById("searchInput");
var headerMenuButton = document.getElementById("header-menu");

function ready(){
	fillItems(catalog);
	window.addEventListener("resize", onresize);
    onresize();
    addEventToItems(); 
	var searchButton = document.getElementById("searchButton");
	var searchInput = document.getElementById("searchInput");
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener("click", setActive);
	searchButton.addEventListener("click", expand);
    headerMenuButton.addEventListener("click", expandMenu);
	filterMenuButton.addEventListener("click", mobileMenuToggle);
	totalPrice();
	bagCounter();
}

//combine func.... dry
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

function mobileMenuToggle() {
	var bottomMenu = document.getElementsByClassName('bottomMenu')[0];
	bottomMenu.style.display = (bottomMenu.style.display == 'block') ? 'none' : 'block';
	if(bottomMenu.style.display == 'block'){
		filterMenuButton.classList.add('icon-close');
		filterMenuButton.classList.remove('icon-menu');
	} else {
		filterMenuButton.classList.remove('icon-close');
		filterMenuButton.classList.add('icon-menu');
	}
}

function onresize(e) {
    var width = window.innerWidth;

    if ( width < 768 ) {
   		fillPromo(2);
    } 
    else if (width > 768 && width < 1024 ){
   		fillPromo(3);
    } 
    else {
   		fillPromo(4);
    }

}
   
function fillPromo(itemsCount){
	var promo = document.getElementsByClassName('banner-container')[0],
		items = document.getElementsByClassName('newItems'),
    	bannerTemplate = "<section class=\"banner-container \"><div class=\"bannerText \">"
    						+"<p class=\"messageTop\">Last weekend <span>extra 50%</span> off on all reduced boots and shoulder bags</p>"
    						+"<p class=\"messageBottom\">This offer is valid in-store and online. Prices displayed reflect this additional discount. This offer ends at 11:59 GMT on March 1st 2015</p>"
    					+"</div></section>",					    
		promoBannerPlace = items[0].children[itemsCount];
	promoBannerPlace.insertAdjacentHTML('beforeBegin',bannerTemplate);

	if (!promo){
		return
	} else {
		promo.parentNode.removeChild(promo);
	}				    
}

function fillItems(catalog){
	var itemsContainer = document.getElementsByClassName('newItems')[0],
		filteredCatalog = _.filter(catalog, {category: 'women', fashion: 'Casual style'});
	
	var sortedCatalog = _.sortBy(filteredCatalog, function(dateObj) {
		return new Date(dateObj.dateAdded);
	}).reverse();
	

	for (var i = 0; i < sortedCatalog.length; i++) {
		sortedCatalog[i]


		var priceValue;
		var hasNew="";
		var discount="";

		if( sortedCatalog[i].price == null && sortedCatalog[i].discountedPrice == null ){
			priceValue = sortedCatalog[i].placeholder;
		} else if(  sortedCatalog[i].discountedPrice < sortedCatalog[i].price ){
			priceValue = '&#163;'+ sortedCatalog[i].discountedPrice;
		} else {
			priceValue = '&#163;'+ sortedCatalog[i].price;
		}
		
		if(sortedCatalog[i].discountedPrice!=sortedCatalog[i].price){
			discount= "&#163;"+ sortedCatalog[i].price +' -'+ (100-(sortedCatalog[i].discountedPrice/sortedCatalog[i].price*100))+"%";
		}
		
		if(sortedCatalog[i].hasNew==true){
			hasNew='New';
		}


		var itemsContainerTemplate = '<div class="item"><div class="id">' +  sortedCatalog[i].id +
  									'</div><a href="item.html"><div class="catalog-image"><img src="' +
  									sortedCatalog[i].thumbnail +  '" alt=""><div class="overlay"><span class="overlay-text">View item</span></div></div><h4>' +
									sortedCatalog[i].title + "</h4><p><span> " +  discount + "</span>" + priceValue +  "<span>" + hasNew + "</span></p></a></div>";
		itemsContainer.insertAdjacentHTML('afterBegin',itemsContainerTemplate);
	}
}

function addEventToItems(){
	var items = document.getElementsByClassName('item');

	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener("click", selectedItemIdToLocalStorage);
	}
}

function setActive(e){
    var target = e.target,
    	filterBar = e.target.parentNode.parentNode;

	if (target.classList.contains('option')){
	
		var childElems = e.target.parentNode.children;
	
		for (var i = 0; i < childElems.length; i++) {
			if(childElems[i].classList.contains('active')){
				childElems[i].classList.remove('active')
			}
		}
		target.classList.add('active');
		filterBar.classList.add('selected');
		filterBar.children[1].textContent = target.textContent;

		if(target.textContent==='Not selected'){
			for (var i = 0; i < childElems.length; i++) {
				if(childElems[i].classList.contains('active')){
					childElems[i].classList.remove('active')
				}
			}
			filterBar.children[1].textContent = "";
			filterBar.classList.remove('selected');

		}
	}
}

function expand(){
	var containerWidth = document.getElementsByClassName("container")[0].clientWidth;
	if (containerWidth > 1024){
		searchInput.classList.remove("mobileInputWidth");
		return ;
	} else	if (searchInput.classList.contains("mobileInputWidth")){
		searchInput.classList.toggle("mobileInputWidth");
	}else{
		searchInput.classList.toggle("mobileInputWidth");
	}
}

function selectedItemIdToLocalStorage(e){
	var selectedItem = this.children[0].textContent;
    localStorage.setItem('selectedItem', JSON.stringify({id: this.children[0].textContent}));
}

function totalPrice(){
    var cartData = getCartData(),
    	cartPrice = 0;
   
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