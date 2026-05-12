const scrollEle = document.querySelector("#scrollEle");
const scrollEleCTN = document.querySelector("#scrollEleCTN");

export function resetHeight() {
  const height =
    scrollEle.getBoundingClientRect().height +
    parseInt(getComputedStyle(scrollEleCTN).paddingTop) +
    parseInt(getComputedStyle(scrollEleCTN).paddingBottom);
  document.body.style.height = `${height}px`;
}

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

      document.querySelector(".powder-bg").style.top = `${pos.y}px`;
      document.querySelector(".powder-bg").style.left = `${pos.x}px`;
      document.querySelector(".powder-bg").classList.add("highlighted");
    });
  });
}

export function toggleMenu() {
  if (!document.querySelector(".slideIn")) {
    document.querySelector(".mobile-nav-backdrop").classList.add("reveal");
    setTimeout(() => {
      document.querySelector(".mobile-nav-container").classList.add("slideIn");
    }, 300);
    return;
  } else {
    document.querySelector(".mobile-nav-container").classList.remove("slideIn");
    setTimeout(() => {
      document.querySelector(".mobile-nav-backdrop").classList.remove("reveal");
    }, 300);
  }
}
