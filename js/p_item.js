"use strict"
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        ready();
    }
}

var body = document.getElementsByTagName('body')[0],
	itemsContainer = document.getElementById('item'),
	cost = document.getElementsByClassName("cost"),
	headerMenuButton = document.getElementById("header-menu"),
	searchInput = document.getElementById("searchInput");

function ready() {
    fillItem();
	bagCounter();
	var bagPriceCount = document.getElementById("bagPriceCount");
	var bagItemsCount = document.getElementById("bagItemsCount");
	var searchButton = document.getElementById("searchButton");
	var searchInput = document.getElementById("searchInput");
	searchButton.addEventListener("click", expand);
	totalPrice();
	attachNormalizeGallery();
    headerMenuButton.addEventListener("click", expandMenu);
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

function attachNormalizeGallery(){
	window.addEventListener('resize',function(e){
		var windowSize = e.target.innerWidth;
		normalizeGallery(windowSize);
	});
	
	var topGalleryContainer = document.getElementsByClassName("topGalleryView")[0];
	
	if (!topGalleryContainer) {return}
	
	var galleryImage = topGalleryContainer.getElementsByTagName('img')[0];
	
	galleryImage.addEventListener('load',function(e){
		normalizeGallery(window.innerWidth);
	});
}
function normalizeGallery(windowSize){
	var galleryContainer = document.getElementsByClassName('galleryView')[0],
		mainGalleryHolder= galleryContainer.getElementsByClassName('topGalleryView')[0],
		mainGalleryHolderHeight = mainGalleryHolder.clientHeight,
		thumbsHolder= galleryContainer.getElementsByClassName('bottomGalleryView')[0],
		thumnbsEls = thumbsHolder.getElementsByClassName('minithumb');
	
	if (windowSize>=768 || windowSize<=1024) {
		for (var i = 0; i < thumnbsEls.length; i++) {
			var thumbEl = thumnbsEls[i];
			thumbEl.style.height = mainGalleryHolderHeight/thumnbsEls.length+'px';
		}
	}else{
		for (var i = 0; i < thumnbsEls.length; i++) {
			var thumbEl = thumnbsEls[i];
			thumbEl.removeAttribute('style');
		}
	}

}

function replaceImage(e) {
    var topGalleryView = document.getElementsByClassName("topGalleryView")[0],
    	newTopImg = e.target.previousSibling.previousSibling,
    	mainImg = topGalleryView.firstElementChild,
		minithumbs = document.getElementsByClassName("minithumb");

    mainImg.src = newTopImg.src;

    for (var i = 0; i < minithumbs.length; i++) {

        if (minithumbs[i].classList.contains("active")) {
            minithumbs[i].classList.remove("active")
        }
    }
    e.target.parentNode.classList.add("active");
}

function activeClassCheck(className){
	var activeClass;
	
	for (var i = 0; i < className.length; i++) {
		if(className[i].classList.contains('active')){
			activeClass = className[i].textContent;
		}
	}
	return activeClass
}


function bagCounter() {
    bagItemsCount.innerHTML = '(' + getBagCountPriceValue() + ')';
}


function getBagCountPriceValue(){
	var cartData = getCartData() || 0,
		cartItemsCount = 0,
		priceValue = 0;

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

function addItemToBag() {
	var id = document.getElementsByClassName("id")[0],
		sizeOpts = document.getElementsByClassName("size"),
		colorOpts = document.getElementsByClassName("color"),
		sizeValue = activeClassCheck(sizeOpts),
		colorValue = activeClassCheck(colorOpts);
	
	var productItem = {
		id:id.textContent,
		color:colorValue,
		size:sizeValue,
		count:1
	};

	if(id&&colorValue&&sizeValue){
		calculateNewPrice();
		checkIfHasSameObj(productItem);
		totalPrice();
		bagCounter();
	} else {
		alert ('Select SIZE and COLOR values');
		return;
	}
}

function checkIfHasSameObj(obj){
	var cartData = getCartData() || [],
		elementExist = false;

	if (cartData.length == 0){
		setCartData([obj])
	}	else	{
		for (var i = 0; i < cartData.length; i++) {
			if( obj.id === cartData[i].id && obj.color === cartData[i].color && obj.size === cartData[i].size){	
				cartData[i].count++;
				elementExist = true;
			}
		}
	}

	if( elementExist == false ){
		cartData.push(obj);
	}

	localStorage.removeItem('cart');
	setCartData(cartData);
}

function calculateNewPrice() {
    var costValue = parseFloat(cost[0].innerText.slice(1)).toFixed(2),
    	bagPrice = parseFloat((bagPriceCount.innerText).slice(1)).toFixed(2),
    	costValueFloat = parseFloat(costValue),
    	bagPriceFloat = parseFloat(bagPrice),
    	newPrice = '&#163;' + ((costValueFloat + bagPriceFloat).toFixed(2));

    bagPriceCount.innerHTML = newPrice;
}

function fillItem() {
	var itemId = localStorage.getItem('selectedItem') ? JSON.parse(localStorage.getItem('selectedItem')).id : null;

	if(!itemId){return};

    var itemData = _.filter(catalog, { id: itemId }),
    	item = itemData[0],
    	priceValue="",
    	discount = "";

    if (item.price == null && item.discountedPrice == null) {
        priceValue = item.placeholder;
    } else if (item.discountedPrice < item.price) {
        priceValue = '&#163;' + item.discountedPrice;
    } else {
        priceValue = '&#163;' + item.price;
    }

    if (item.discountedPrice != item.price) {
        discount = "&#163;" + item.price + ' -' + (100 - (item.discountedPrice / item.price * 100)) + "%";
    }


	var template =  '<div class="container"><div class="id">' +
					item.id +'</div><div class="itemView clearfix"> <div class="descriptionContainer "><div class="galleryView">    <div class="topGalleryView"><img src="img/mini-gallery_1.jpg" alt="">    </div>    <div class="bottomGalleryView clearfix"><div class="minithumb active">    <img src="img/mini-gallery_1.jpg" alt="">    <div class="overlay"></div></div><div class="minithumb">    <img src="img/mini-gallery_2.jpg" alt="">    <div class="overlay"></div></div><div class="minithumb">    <img src="img/mini-gallery_1.jpg" alt="">    <div class="overlay"></div></div>    </div></div>    </div>    <div class="descriptionContainer "><div class="itemInfo">    <div><h3 class="itemTitle">' +
					item.title +'</h3><p class="itemDescription">' +
					item.description +'</p><p class="cost">&#163;' +
					item.price +'</p></div>  <div class="itemSelect "><div class="size-option clearfix">    <div class="label">Size:</div><div class="size option">' +
					item.sizes.join('</div><div class="size option">') +'</div></div><div class="color-option clearfix">    <div class="label">Color:</div><div class="color option">' +
					item.colors.join('</div><div class="color option">') +'</div></div></div>    <button id="addToBag" class="mainButton">Add To Bag</button></div>    </div></div></div>';



	itemsContainer.insertAdjacentHTML('afterBegin',template);
	var bottomGalleryView = document.getElementsByClassName("bottomGalleryView")[0];
	var addToBag = document.getElementById("addToBag");
    bottomGalleryView.addEventListener("click", replaceImage);
    addToBag.addEventListener("click", addItemToBag);
	body.addEventListener("click", setActive);	
}

function setActive(e){
    var target = e.target;
	
	if (target.classList.contains('option')){
	
		var childElems = e.target.parentNode.children;
	
		for (var i = 0; i < childElems.length; i++) {
			if(childElems[i].classList.contains('active')){
				childElems[i].classList.remove('active')
			}
		}
		target.classList.add('active');
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

function totalPrice(){
    var cartData = getCartData();
    var cartPrice = 0;

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


    }

    bagPriceCount.innerHTML = (cartData.length == 0)? '': '&#163;' + cartPrice.toFixed(2);
    
	if (typeof totalCostContainer!='undefined'){
    	totalCostContainer.innerHTML = (cartData.length == 0)? '&#163;0' : '&#163;' + cartPrice.toFixed(2);
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

function getCartData(){
    return JSON.parse(localStorage.getItem('cart'));
}
