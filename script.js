

// function zoomin(){
//     var myImg = document.getElementById("content");
//     var currWidth = myImg.clientWidth;
//     //if(currWidth == 2500) return false;
//     // else{
//     //    myImg.style.width = (currWidth + 100) + "px";
//     //} 
//     myImg.style.width = (currWidth + 100) + "px";
// }
// function zoomout(){
//     var myImg = document.getElementById("content");
//     var currWidth = myImg.clientWidth;
//     if(currWidth == 100) return false;
//      else{
//         myImg.style.width = (currWidth - 100) + "px";
//     }
// }



// window.addEventListener('wheel', function(e) {

//     e.preventDefault()
//     // ...

//     // min width / min height is viewport width/height


//     var zoom = 1;
//     var zoomStep = 0.2;

//     document.getElementById("zoom In").addEventListener("click", function() {
//       zoom += zoomStep;
//       document.getElementById("zoomtext").style.transform = "scale(" + zoom + ")";
//     });
//     document.getElementById("zoomOut").addEventListener("click", function() {
//       if (zoom > zoomStep) {
//         zoom -= zoomStep;
//         document.getElementById("zoomtext").style.transform = "scale(" + zoom + ")";
//       }
//     });
  
//   }, {passive: false})







// How clustered the cards are around the center
// Lower values = less clustered
let clusterCentralityX = 1.2;
let clusterCentralityY = 1;

// T: Clustered, F: Random
let isClustered = true;

// Feel free to change these to match your own class names
const projectContainer = document.querySelector("#content"); // The class name for the element containing the draggable elements
const card = document.querySelectorAll(".collection-item"); // The class name for the draggable elements

//   let card = document.getElementsByClassName('collection-item');
const mobileBreakpoint = 992; // The screen pixel width at which the dragging is disabled



let container;
let content = document.getElementById('content');
let contentWidth = content.clientWidth;
let contentHeight = content.clientHeight;




// center content

// center content variables
let moveAmountX;
let moveAmountY;
let viewableArea = document.getElementById('container');


// move content left or top 50% then translate it -50%;
window.onload = function(e){ 
    moveAmountX = viewableArea.clientWidth/2 - content.clientWidth/2;
    moveAmountY = viewableArea.clientHeight/2 - content.clientHeight/2;
    content.style.left = moveAmountX + 'px';
    content.style.top = moveAmountY + 'px';
}


// draggable js

// instatiate placeholder variables
let selectedWidth;
let selectedHeight;
let rect;

// establishing viewport boundaries
let viewport = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
}

// mouseDown variable checks if there's something else being moved rn. if there is something else being moved it will not allow the draggable code to execute
let mouseDown = false;

// pause highlighting function
function pauseEvent(e){
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}


function dragElement(elmnt) {
    
    var cursorPosX = 0, cursorPosY = 0, intX = 0, intY = 0;

    elmnt.onmousedown = dragMouseDown;

    if (elmnt.className == 'collection-item') {
        container = document.getElementById('content');
        // bring element 1 layer up
        elmnt.style.zIndex = "99";
    } else {
        container = document.getElementById('container');
    }

    selectedWidth = elmnt.clientWidth;
    selectedHeight = elmnt.clientHeight;    

    function dragMouseDown(e) {

        if (elmnt.className == 'collection-item') {
            // bring element 1 layer up
            elmnt.style.zIndex = "99";
        } 

        mouseDown = true;

        e = e || window.event;
        pauseEvent(e);


        // get the mouse cursor position at startup:
        intX = e.clientX;
        intY = e.clientY;

        // store the current viewport and element dimensions when a drag starts
        rect = elmnt.getBoundingClientRect();

        // get container's width and height currently
        viewport.right = container.clientWidth;
        viewport.bottom = container.clientHeight;

        elmnt.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        elmnt.onmousemove = elementDrag;

    }

    function elementDrag(e) {

        e = e || window.event;
        // calculate the new cursor position relative to div boundary
        cursorPosX = intX - e.clientX;
        cursorPosY = intY - e.clientY;

        // reestablishing new cursor pos
        intX = e.clientX;
        intY = e.clientY;

        // check to make sure the element will be within our viewport boundary
        var cursorMovementX = elmnt.offsetLeft - cursorPosX;
        var cursorMovementY = elmnt.offsetTop - cursorPosY;

        let leftTop;
        let rightBottom;

        if (elmnt.classList.contains('collection-item')) {
            // for individual items boundaries, which is smaller than the viewport
            leftTop = (cursorMovementX < viewport.left 
                || cursorMovementY < viewport.top);
            rightBottom = (cursorMovementX > viewport.right - selectedWidth
                || cursorMovementY > viewport.bottom - selectedHeight);
        } else {
            // for map area, which is bigger than the viewport
            leftTop = (cursorMovementX > viewport.left 
                || cursorMovementY > viewport.top);
            rightBottom = (cursorMovementX < viewport.right - selectedWidth
                || cursorMovementY < viewport.bottom - selectedHeight);
        }

        if (leftTop) {
            // the element will hit the boundary, do nothing...
            // console.log(cursorMovementX +  '>' +  viewport.left ) 
        } else if (rightBottom) {
            // console.log('right and bottom') 
        } else {
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - cursorPosY) + "px";
            elmnt.style.left = (elmnt.offsetLeft - cursorPosX) + "px";      
        }
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        elmnt.onmouseup = null;
        elmnt.onmousemove = null;
        mouseDown = false;
        elmnt.onmouseup = function(){
            elmnt = null;
        };
        if (elmnt.classList.contains('collection-item')) {
            // bring element 1 layer up
            elmnt.style.zIndex = null;
        } 
    }

}
    
document.addEventListener('mouseover', function(e) {
    if (
        // if nothing else is being dragged
        (mouseDown == false && elmnt == null) 
        // if items being hovered over are draggable items
        && ((e.target.classList.contains('collection-item')) || (e.target.id == 'content'))
        // if viewport is bigger than mobile size
        && (document.documentElement.clientWidth > mobileBreakpoint)
    ) {
        e.preventDefault();
        dragElement(e.target);
    }
});










/**
 * USER CONFIG OPTIONS
 */


/**
 * Generate random position for a card
//  * @param {HTMLElement} content - The projectContainer element
//  * @param {HTMLElement} card - The card element
//  * @returns x and y coordinates for the card
 */

function getRandomPosition(projectContainer, card) {

    card.forEach(e => {
        cardWidth = e.style.width;
        cardHeight = e.style.height;
    });

    // Get the bounding rectangles
    const projectContainerRect = projectContainer.getBoundingClientRect();

    // Calculate the center of the projectContainer
    const centerX = projectContainerRect.width / 2;
    const centerY = projectContainerRect.height / 2;

    card.forEach(e => {
        const cardRect = e.getBoundingClientRect();
        // Generate a random position around clustered around the center
        if (isClustered) {
            // center of div + a random number * ( (the width of the project container - the width of the collection items so it doesn't go outside of the container) / by how clustered it should be ) - from the surrounding items
            const x = centerX + (Math.random() - 0.5) * ((projectContainerRect.width - parseInt(cardWidth)) / clusterCentralityX) - cardRect.width / 2;
            const y = centerY + (Math.random() - 0.5) * ((projectContainerRect.height - parseInt(cardHeight)) / clusterCentralityY) - cardRect.height / 2;
            e.style.left = x + 'px';
            e.style.top = y + 'px';
        }
        // Or generate a truly random position
        else {
            const x = Math.random() * ((projectContainerRect.width - parseInt(cardWidth)) - cardRect.width);
            const y = Math.random() * ((projectContainerRect.height - parseInt(cardHeight)) - cardRect.height);
            return { x, y };
            e.style.left = x + 'px';
            e.style.top = y + 'px';
        }
    });
    // const cardRect = card.getBoundingClientRect();



}

getRandomPosition(projectContainer, card)



