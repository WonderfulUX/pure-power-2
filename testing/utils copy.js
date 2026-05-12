const scrollEle = document.querySelector('#scrollEle')
const scrollEleCTN = document.querySelector('#scrollEleCTN')

export function resetHeight(){
    const height = 
        scrollEle.getBoundingClientRect().height 
        + parseInt(getComputedStyle(scrollEleCTN).paddingTop)
        + parseInt(getComputedStyle(scrollEleCTN).paddingBottom)
    document.body.style.height = `${height}px`
}

export function feedExpander(e){
    if(document.querySelector('#expander')){
        document.body.remove(expander)        
        startExpanderAnimation(e)
        return
    }
    startExpanderAnimation(e)
}

export function shrinkExpander(){
    const{left,top,width,height} = JSON.parse(localStorage.getItem('currentTarget'))
    expander.animate(
        [
            {translate: `0 0`,width:'100%',height:'100%'},
            {translate: `${left}px ${top}px`,width:`${width}px`,height:`${height}px`}
        ],
        {duration: 500, fill: 'forwards', easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)'}
    )
    // .finished.then(()=> document.body.removeChild(expander))
    setTimeout(()=>{
        document.body.removeChild(expander)
    },380)


}

function startExpanderAnimation(e){
    const {left,top,width,height} = storeImgCoords(e)
    displayExpander(left,top,width,height,e.target.src)
    
    expander.animate(
        [{translate: `${left}px ${top}px`},{translate: `0px 0px`,width:'100%',height:'100%'}],
        {duration: 1200, fill: 'forwards', easing: 'cubic-bezier(0.075, 0.82, 0.165, 1)'}
    )
}


function storeImgCoords(e){
    const {left,top,width,height} = e.target.getBoundingClientRect()
    const currentTarget = { left, top, width, height }
    localStorage.setItem('currentTarget',JSON.stringify(currentTarget))
    return currentTarget
}

function displayExpander(l,t,w,h,src){
    createExpanderElements()
    positionExpanderElements(l,t,w,h,src,false)
    expander.addEventListener('click',shrinkExpander)
}

//EXPANDER
function createExpanderElements(){
    const HTMLexpander = document.createElement('div')
    HTMLexpander.id = 'expander'
    
    const expanderImg = document.createElement('img')
    expanderImg.id = 'expanderImg'
    
    document.body.append(HTMLexpander)
    HTMLexpander.append(expanderImg)
}

function positionExpanderElements(l,t,w,h,src,isDisplayed){
    expander.style.translate = `${l}px ${t}px`
    expander.style.width = `${w}px`
    expander.style.height = `${h}px`

    expanderImg.style.width = `${w}px`

    if(!isDisplayed){
        expanderImg.src = src
        if(l>innerWidth/2){
            expanderImg.style.left = 'unset'
            expanderImg.style.right = 0
        }
        else{
            expanderImg.style.right = 'unset'
            expanderImg.style.left = 0
        }
    }
}