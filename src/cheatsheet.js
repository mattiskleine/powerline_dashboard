//onload
window.onload = function() {
    var box = document.getElementById('box');

    //eventListener
    box.addEventListener('mouseenter', hoverBox);

    //timeout
    setTimeout( ()=> {
        console.log('pumpernickel');
    }, 1000);
}

function hoverBox(e) {
    e.currentTarget.style.transform = 'scale(1.2)';
}

//map number to range
function mapRange (number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }