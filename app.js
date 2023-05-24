// Navbar menu
const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

//Display mobile menu
const mobileMenu = () => {
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
}

menu.addEventListener('click', mobileMenu)

// Accordian control

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

// Accordian control

// var acc = document.querySelectorAll('.collapsible');

// // Iterate to add event listeners
// acc.forEach(item => {
//     item.addEventListener('click', function () {
//         // When it's clicked, loop through all the items
//         acc.forEach(el => {
//             // Close any open items
//             if (el.classList.contains('active')) {
//                 closeAcc(el);
//                 // If it's the one that was clicked and it's closed, open it
//             } else if (el === item) {
//                 openAcc(el);
//             }
//         });
//     });
// });

// function closeAcc (el) {
//     el.classList.remove('active');
//     el.nextElementSibling.style.maxHeight = null;
// };

// function openAcc (el) {
//     el.classList.add('active');
//     el.nextElementSibling.style.maxHeight = el.nextElementSibling.scrollHeight + 'px';
// }


var acc = document.getElementsByClassName("blog_collapsible");
var panel = document.getElementsByClassName('content2');

for (var i = 0; i < acc.length; i++) {
    acc[i].onclick = function() {
    	var setClasses = !this.classList.contains('active');
        setClass(acc, 'active', 'remove');
        setClass(panel, 'show', 'remove');
        
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


import { Gradient } from "https://gist.githack.com/jordienr/64bcf75f8b08641f205bd6a1a0d4ce1d/raw/35a5c7c1ddc9f97ec84fe7e1ab388a3b726db85d/Gradient.js";

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");