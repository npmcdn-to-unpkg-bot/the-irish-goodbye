function attachAnimationEndCallback(obj, method, callback) {
  var events = ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'];

  for (var i = 0; i < events.length; i++) {
    obj[method](events[i], callback)
  }
};

var Slideshow = {
  intervalID: null,

  advanceSlide: function() {
    var currentSlide      = document.querySelector(".slide-current");
    var nextSlide         = document.querySelector(".slide-next");

    if (!nextSlide) return;

    var oneAfterNextSlide = nextSlide.nextElementSibling || document.querySelector(".slide:first-child");

    function animationEnded(event) {
      oneAfterNextSlide.classList.add("slide-next");

      event.target.classList.remove("slide-previous");

      attachAnimationEndCallback(currentSlide, 'removeEventListener', animationEnded);
    }

    attachAnimationEndCallback(currentSlide, 'addEventListener', animationEnded);

    nextSlide.classList.add("slide-current");
    nextSlide.classList.remove("slide-next");

    currentSlide.classList.remove("slide-current")
    currentSlide.classList.add("slide-previous")
  },

  returnSlide: function() {
    var currentSlide  = document.querySelector(".slide-current");
    var nextSlide     = document.querySelector(".slide-next");

    if (!nextSlide) return;

    var previousSlide = currentSlide.previousElementSibling || document.querySelector(".slide:last-child");

    function animationEnded(event) {
      currentSlide.classList.remove("slide-current");
      currentSlide.classList.add("slide-next");

      event.target.classList.remove("slide-previous");
      event.target.classList.remove("reversed");
      event.target.classList.add("slide-current");

      nextSlide.classList.remove("slide-next");

      attachAnimationEndCallback(previousSlide, 'removeEventListener', animationEnded);
    }

    attachAnimationEndCallback(previousSlide, 'addEventListener', animationEnded);

    nextSlide.classList.remove("slide-next");
    previousSlide.classList.add("reversed");
    previousSlide.classList.add("slide-previous");
  },

  start: function() {
    this.intervalID = setInterval(this.advanceSlide, 5200);
  },

  stop: function() {
    clearInterval(this.intervalID);
  },

  handleKeydown: function(event) {
    if (event.which == 37 || event.which == 39) {
      if (this.intervalID) { this.stop(); this.start(); }

      event.which == 37 ? this.returnSlide() : this.advanceSlide();
    }
  },

  bindKeyboardControls: function() {
    document.addEventListener("keydown", this.handleKeydown.bind(this))
  },

  init: function() {
    this.bindKeyboardControls();
    this.start();
  }
};