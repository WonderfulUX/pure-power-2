const scrollEle = document.querySelector("#scrollEle");
const scrollEleCTN = document.querySelector("#scrollEleCTN");
const powderBG = document.querySelector(".powder-bg");
const contactSection = document.querySelector(".contact");
const slideIn = document.querySelector(".slideIn");
const mobileNavBdrop = document.querySelector(".mobile-nav-backdrop");
const mobileNavCTN = document.querySelector(".mobile-nav-container");
const companyField = document.querySelector(".company-field");


// INIT
export function resetHeight() {
  const height =
    scrollEle.getBoundingClientRect().height +
    parseInt(getComputedStyle(scrollEleCTN).paddingTop) +
    parseInt(getComputedStyle(scrollEleCTN).paddingBottom);
  document.body.style.height = `${height}px`;
}


// EXPERIENCE
export function addPowderHoverAnimation() {
  document.querySelectorAll(".powder-grid .product-block").forEach((block) => {
    block.addEventListener("mouseenter", (e) => {
      let productEle = e.target;
      let productImg = e.target.querySelector("img");
      let pos = {
        x:
          Math.round(productEle.offsetLeft) +
          Math.round(productImg.offsetWidth) / 2,
        y:
          Math.round(productEle.offsetTop) +
          Math.round(productImg.offsetWidth) / 2,
      };

      powderBG.style.top = `${pos.y}px`;
      powderBG.style.left = `${pos.x}px`;
      powderBG.classList.add("highlighted");
    });
  });
}

// NAVIGATION
export function toggleMenu() {
  if (!document.querySelector(".slideIn")) slideInMobileMenu()
  else hideMobileMenu()
}

export function slideInMobileMenu() {
  mobileNavBdrop.classList.add("reveal");
  setTimeout(() => {
    mobileNavCTN.classList.add("slideIn");
  }, 300);
}
export function hideMobileMenu() {
  mobileNavCTN.classList.remove("slideIn")
  setTimeout(() => {
    mobileNavBdrop.classList.remove("reveal");
  }, 300);
}

export function updateForm(e) {
  document.querySelector(".active") && document.querySelector(".active").classList.remove("active");
  e.target.closest(".customer") ? companyField.classList.add("dn") : companyField.classList.remove("dn");
  e.target.closest("button").classList.add("active");
}


// SCROLL
export function scroll() {
  document.querySelector("#scrollEle").style.translate = `0px ${-window.pageYOffset}px`;
}
export function scrollToContact() {
  const footerHeight = document.querySelector("footer").getBoundingClientRect().height
  const contactSectionHeight = document.querySelector(".contact").getBoundingClientRect().height
  const fullHeight = scrollEle.getBoundingClientRect().height

  const translateYvalue = Math.round(fullHeight - footerHeight - contactSectionHeight)
  document.scrollingElement.scrollTop = translateYvalue;
}
