export function moveElementsAntiClockwise() {
    if (document.querySelector('.product-item-CTN[data-pos="2"]')) {
        document.querySelector('.product-item-CTN[data-pos="2"]').setAttribute('data-pos', 4)
        document.querySelector('.product-item-CTN[data-pos="3"]').setAttribute('data-pos', 5)
        document.querySelector('.product-item-CTN[data-pos="1"]').setAttribute('data-pos', 6)
    }
    else {
        document.querySelector('.product-item-CTN[data-pos="5"]').setAttribute('data-pos', 1)
        document.querySelector('.product-item-CTN[data-pos="6"]').setAttribute('data-pos', 2)
        document.querySelector('.product-item-CTN[data-pos="4"]').setAttribute('data-pos', 3)
    }
}
export function moveElementsClockwise() {
    if (document.querySelector('.product-item-CTN[data-pos="2"]')) {
        document.querySelector('.product-item-CTN[data-pos="2"]').setAttribute('data-pos', 6)
        document.querySelector('.product-item-CTN[data-pos="3"]').setAttribute('data-pos', 4)
        document.querySelector('.product-item-CTN[data-pos="1"]').setAttribute('data-pos', 5)
    }
    else {
        document.querySelector('.product-item-CTN[data-pos="5"]').setAttribute('data-pos', 3)
        document.querySelector('.product-item-CTN[data-pos="6"]').setAttribute('data-pos', 1)
        document.querySelector('.product-item-CTN[data-pos="4"]').setAttribute('data-pos', 2)
    }

}