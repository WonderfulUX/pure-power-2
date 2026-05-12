import { addPowderHoverAnimation, resetHeight, toggleMenu } from "./utils.js";

window.addEventListener("load", () => {
  resetHeight();
  addPowderHoverAnimation();

  window.addEventListener("scroll", () => {
    requestAnimationFrame(scroll);
  });
  window.addEventListener("resize", resetHeight);
  window.addEventListener("resize", addPowderHoverAnimation);
});

function scroll() {
  document.querySelector("#scrollEle").style.translate =
    `0px ${-window.pageYOffset}px`;
  // requestAnimationFrame(scroll)
}

document.querySelector(".powder-grid").addEventListener("mouseleave", () => {
  document.querySelector(".powder-bg").classList.remove("highlighted");
});

document.querySelector(".mobile-menu").addEventListener("click", toggleMenu);
