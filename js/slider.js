var Slider = function(options){
    this.options = options;
    this.init();
    // return {
    //     setActiveSlide : this.setActiveSlide.bind(this)
    // }

}

Slider.prototype.setElements = function() {
    this.containerEl = document.querySelector(this.options.element);
    this.slidesHolderEl = this.containerEl.querySelector('.slides-holder');
    this.controlsHolderEl = this.containerEl.querySelector('.controls-holder');
    this.slides = this.slidesHolderEl.querySelectorAll('.slide');
    this.controls = this.slidesHolderEl.querySelectorAll('.control');
    this.previousSlide = this.containerEl.querySelector( ".arrow-left" );
    this.nextSlide = this.containerEl.querySelector( ".arrow-right" );
    this.currentDirection = '>';
    // console.log(this);
}

Slider.prototype.init = function() {
    this.setElements();
    this.createControls();
    this.setInitialElementsState();
    this.attachEvents();
    this.startInterval();
}

Slider.prototype.attachEvents = function() {
    // console.log(this.options);
    // this.containerEl.addEventListener('mouseleave',this.stopInterval.bind(this));
    // this.containerEl.addEventListener('mouseleave', this.startInterval.bind(this));
    this.previousSlide.addEventListener('mouseup', this.setPreviousSlide.bind(this));
    this.nextSlide.addEventListener('mouseup', this.setNextSlide.bind(this));

    for (var i = 0; i < this.controls.length; i++) {
        this.controls[i].addEventListener('mouseup', this.controlsClick.bind(this));
    }
}

Slider.prototype.setNextSlide = function () {
	this.currentDirection= '>';
	// console.log(this.getPreviousSlideIndex());
    this.setActiveSlide(this.getNextSlideIndex())
}

Slider.prototype.setPreviousSlide = function () {
	this.currentDirection= '<';
	// console.log(this.getPreviousSlideIndex());
    this.setActiveSlide(this.getPreviousSlideIndex());
}

Slider.prototype.stopInterval = function () {
    clearInterval(this.refreshInterval)
}

Slider.prototype.startInterval = function () {
    var me = this;
    this.refreshInterval = setInterval(function () {
    	this.currentDirection='>';
       me.setActiveSlide(me.getNextSlideIndex())
    }, this.options.slideInterval || 3000);
}

Slider.prototype.getNextSlideIndex = function () {
    var isLastSlide = this.currentActiveIndex+1 === (this.slides.length);
    return isLastSlide ? 0 : this.currentActiveIndex + 1
}

Slider.prototype.getPreviousSlideIndex = function () {
    var isFirstSlide = this.currentActiveIndex === 0;
    var val = isFirstSlide ? this.slides.length-1 : this.currentActiveIndex-1;

    // console.log(isFirstSlide)
    // console.log(val)

    return val
}

Slider.prototype.controlsClick = function (event) {
    var noda = event.target;
    var index = this.controls.indexOf(noda);
    this.setActiveSlide(index);
}

Slider.prototype.setInitialElementsState = function() {
    var firstSlideToShow  = typeof this.options.firstSlideToShow != 'undefined' ? this.options.firstSlideToShow : 0;
    this.slides[firstSlideToShow].classList.add('active');
    this.controls[firstSlideToShow].classList.add('active');
    this.currentActiveIndex = firstSlideToShow;
}
// add navigation from js
Slider.prototype.createControls = function() {
    var slidesLength = this.slides.length;
    this.controls = [];
    for (var i = 0; i < slidesLength; i++) {
        var newControl = this.buildControl();
        this.controls.push(newControl)
        this.controlsHolderEl.appendChild(newControl);
    }
}

Slider.prototype.buildControl = function() {
    var control = document.createElement('div');
    control.classList.add('control');
    return control;
} 

Slider.prototype.setActiveSlide = function(slideIndex){
    var isLastSlide =  this.currentActiveIndex === (this.slides.length-1);

    this._resetSlider();

    if (isLastSlide && this.currentDirection === '>') {
        this.slides[0].classList.add('active');
        this.controls[0].classList.add('active');
    }else{
        this.slides[slideIndex].classList.add('active');
        this.controls[slideIndex].classList.add('active');
    }

    this.currentActiveIndex = slideIndex;
};

Slider.prototype._resetSlider = function () {
    this._deactivateAllSlides();
    this._deactivateAllControls();
}

Slider.prototype._deactivateAllSlides = function () {
    for (var i = 0; i < this.slides.length; i++) {
        this.slides[i].classList.remove('active');
    }
}

Slider.prototype._deactivateAllControls = function () {
    this.controls.forEach(function (control) {
        control.classList.remove('active');
    })
}