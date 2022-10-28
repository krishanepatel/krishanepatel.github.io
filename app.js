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

var acc = document.querySelectorAll('.collapsible');

// Iterate to add event listeners
acc.forEach(item => {
    item.addEventListener('click', function () {
        // When it's clicked, loop through all the items
        acc.forEach(el => {
            // Close any open items
            if (el.classList.contains('active')) {
                closeAcc(el);
                // If it's the one that was clicked and it's closed, open it
            } else if (el === item) {
                openAcc(el);
            }
        });
    });
});

function closeAcc (el) {
    el.classList.remove('active');
    el.nextElementSibling.style.maxHeight = null;
};

function openAcc (el) {
    el.classList.add('active');
    el.nextElementSibling.style.maxHeight = el.nextElementSibling.scrollHeight + 'px';
}


// const accordions = Array.from(document.getElementsByClassName("collapsible"));
// accordions.forEach(accordion1 =>
//   accordion1.addEventListener("click", () =>
//     accordions.forEach(accordion2 =>
//       accordion2.nextElementSibling.classList.toggle(
//         "hidden",
//         accordion1 !== accordion2 ||
//         !accordion1.nextElementSibling.classList.contains("hidden")
//       )
//     )
//   )
// );