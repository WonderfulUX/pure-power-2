import {
  addPowderHoverAnimation,
  hideMobileMenu,
  resetHeight,
  scroll,
  scrollToContact,
  toggleMenu,
  updateForm,
} from "./utils.js";
const powderGrid = document.querySelector(".powder-grid")
const powerBG = document.querySelector(".powder-bg")
const customerFormTrigger = document.querySelector(".customer")
const businessFormTrigger = document.querySelector(".business")
const headerContactBTN = document.querySelector("header .contact-link")
const mobileContactBTN = document.querySelector(".mobile-nav-container .contact-link")
const mobileMenuLinks = document.querySelectorAll(".mobile-nav-container a")
const homeLogo = document.querySelector(".logo-area")
const mobileHomeLogo = document.querySelector(".mobile-nav .logo-area")


// INIT
window.addEventListener("load", () => {
  resetHeight();
  addPowderHoverAnimation();

  window.addEventListener("scroll", () => {
    requestAnimationFrame(scroll);
  });
  window.addEventListener("resize", resetHeight);
  window.addEventListener("resize", addPowderHoverAnimation);
});

document.querySelector('.mobile-nav-backdrop').addEventListener('click', e => {
  if (e.target.classList.contains('reveal')) hideMobileMenu()
})


// NAVIGATION
document.querySelector('.mobile-menu-btn').addEventListener('click', toggleMenu)

powderGrid.addEventListener("mouseleave", () => {
  powerBG.classList.remove("highlighted");
});

homeLogo.addEventListener('click', e => {
  e.preventDefault()
  document.scrollingElement.scrollTop = 0;
})
mobileHomeLogo.addEventListener('click', e => {
  e.preventDefault()
  document.scrollingElement.scrollTop = 0;
})

// CONTACT FORM
customerFormTrigger.addEventListener("click", e => {
  updateForm(e)
  resetHeight()
});
businessFormTrigger.addEventListener("click", e => {
  updateForm(e)
  resetHeight()
});

// SCROLL EVENTS
headerContactBTN.addEventListener("click", scrollToContact);
mobileContactBTN.addEventListener("click", () => {
  toggleMenu()
  setTimeout(() => { scrollToContact() }, 300)
});
mobileMenuLinks.forEach(link => {
  link.addEventListener("click", () => {
    toggleMenu()
    setTimeout(() => { scrollToContact() }, 300)
  });
})