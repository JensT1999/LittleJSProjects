var allSliders = [];

//APPENDING

function appendSlider(slider) {
    let firstImages = firstAppend(slider);

    for(let i = 0; i < firstImages.length; i++) {
        if(i == 0) {
            firstImages[i].css("z-index", "1");
            firstImages[i].css("top", "0px");
        } else {
            firstImages[i].css("z-index", "0");
            applyBackSize(firstImages[i]);
        }

        firstImages[i].appendTo(slider.containment);
        addClickToIMG(slider, firstImages[i]);
    }

    if(parseInt(slider.delay) >= 500 && slider.clickable == false) {
        startDiashow(slider);
    }
}

function firstAppend(slider) {
    let temp_Array = [];
    temp_Array.push(slider.array[0]);
    temp_Array.push(slider.array[1]);
    return temp_Array;
}


function startDiashow(slider) {
    timeOutSlide(slider);
}

function timeOutSlide(slider) {
    setTimeout(function() {
        slideImage(slider, getCurrentImg(slider));
        timeOutSlide(slider);
    }, parseInt(slider.delay));
}

//SLIDING

function slideImage(slider, target) {
    slider.animating = true;
    target.animate({
        right: target.css("width")
    }, 1000, function() {
        slider.containment.find("#" + target.attr("id")).remove();
        let newIMGs = shift(slider);
        adjustIMGUnderneath(slider, newIMGs[0]);
        newIMGs[1].css("z-index", "0");
        applyBackSize(newIMGs[1]);
        newIMGs[1].css("right", "0px");
        newIMGs[1].appendTo(slider.containment);
        addClickToIMG(slider, newIMGs[1]);

        slider.animating = false;
    });
}

function adjustIMGUnderneath(slider, input) {
    let img = slider.containment.find("#" + input.attr("id"));

    img.css("z-index", "1");
    img.css("top", "0px");
}

function applyBackSize(target) {
    if(parseInt(target.css("border-width")) > 0) {
        let bordercomWidth = parseInt(target.css("border-width")) * 2;

        target.css("top", "-" + (parseInt(target.css("height")) + bordercomWidth) + "px");
    } else {
        target.css("top", "-" + target.css("height"));
    }
}

//INITIALIZING

function initSlider(con, input, width, height, clickable, delay) {
    let container = $("#" + con);
    container.css("width", width);
    container.css("height", height);
    container.css("overflow", "hidden");

    let composed = composeInput(input, container.attr("id"), width, height);

    let slider = new Slider(container, composed, clickable, delay);
    allSliders.push(slider);

    return slider;
}

function addClickToIMG(slider, target) {
    target.click(function() {
        if(slider.clickable == false) return;
        if(slider.animating == false) {
            slideImage(slider, target);
        }
    });
}

//COMPOSING IMAGES

function composeInput(input, containtmentId, width, height) {
    let temp_Array = [];

    for(let i = 0; i < input.length; i++) {
        let image = composeImg(input[i], containtmentId, i, width, height);

        temp_Array.push(image);
    }

    return temp_Array;
}

function composeImg(input, containmentId, counter, width, height) {
    let result = $("<img/>");

    result.attr("id", containmentId + "_img_" + parseInt(counter));
    result.attr("src", input);
    result.css("width", width);
    result.css("height", height);
    result.css("vertical-align", "middle");
    result.css("position", "relative");

    return result;
}

function getCurrentImg(slider) {
    return slider.array[slider.currentPos];
}

//SHIFTNG IN ARRAY

function shift(slider) {
    let temp_Array = [];
    if((slider.currentPos + 1) == slider.array.length) {
        slider.currentPos = 0;
        temp_Array.push(slider.array[slider.currentPos]);
        temp_Array.push(slider.array[slider.currentPos + 1]);
    } else if((slider.currentPos + 1) < slider.array.length) {
        if((slider.currentPos + 2) == slider.array.length) {
            slider.currentPos++;
            temp_Array.push(slider.array[slider.currentPos]);
            temp_Array.push(slider.array[0]);
        } else {
            slider.currentPos++;
            temp_Array.push(slider.array[slider.currentPos]);
            temp_Array.push(slider.array[slider.currentPos + 1]);
        }
    }

    return temp_Array;
}

//STYLING

function border(slider, radius, width, style, color) {
    let elements = slider.array;

    for(let i = 0; i < elements.length; i++) {
        elements[i].css("border-radius", radius + "px");
        elements[i].css("border-width", width + "px");
        elements[i].css("border-style", style);
        elements[i].css("border-color", color);
    }

    adjustDiv(slider, width);

    slider.array = elements;
}

function adjustDiv(slider, width) {
    let comWidth = parseInt(width) * 2;
    let container = slider.containment;

    slider.containment.css("width", parseInt(container.css("width")) + comWidth + "px");
    slider.containment.css("height", parseInt(container.css("height")) + comWidth + "px");
}

function Slider(containment, array, clickable, delay) {
    this.containment = containment;
    this.array = array;
    this.currentPos = 0;
    this.clickable = clickable;
    this.animating = false;
    this.delay = delay;
}