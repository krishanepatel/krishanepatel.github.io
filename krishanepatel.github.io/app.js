const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

//Display mobile menu
const mobileMenu = () => {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
}

menu.addEventListener('click', mobileMenu)

//Collapsible section
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else{
        content.style.maxHeight = content.scrollHeight + "px";
    }
    });
}

//Limit collapsible
var acc = document.getElementsByClassName("block");
var panelA = document.getElementsByClassName('content');

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
    	var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panelA, 'show', 'remove');

       	if (setClasses) {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
}

function setClass(els, className, fnName) {
    for (var i = 0; i < els.length; i++) {
        els[i].classList[fnName](className);
    }
}

var $myGroup = $('#Block');
    $myGroup.on('show','.content', function() {
        $myGroup.find('.content').collapse('hide');
    });
var $myGroup = $('#Block');
    $myGroup.on('show','.content2', function() {
        $myGroup.find('.content2').collapse('hide');
    });

    var parcel_2 = document.getElementById("#parcel_2");   
    var currentPos = 0;
    
    var requestAnimationFrame = window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame;
   
   function movething(){
   currentPos+=5;
   parcel_2.style.left = currentPos+"px";
   
   if(Math.abs(currentPos) >=900){
   currentPos=300;
   }

   requestAnimationFrame(movething);

  }
  