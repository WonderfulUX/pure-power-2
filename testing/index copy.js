import { feedExpander, resetHeight } from "../utils.js";

window.addEventListener("load", () => {
  resetHeight();

  window.addEventListener("scroll", () => {
    requestAnimationFrame(scroll);
  });
  window.addEventListener("resize", resetHeight);
});

document
  .querySelectorAll("#scrollEle img")
  .forEach((image) => image.addEventListener("click", feedExpander));

function scroll() {
  document.querySelector("#scrollEle").style.translate =
    `0px ${-window.pageYOffset}px`;
  // requestAnimationFrame(scroll)
}

console.log("updated");
