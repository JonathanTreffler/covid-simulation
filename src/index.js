const drawingCanvas = document.getElementById("drawingCanvas");
const canvas2D = drawingCanvas.getContext("2d");

console.log(canvas2D);

var persons = [];

let personCount = 20;
let initalialInfected = 5;

const circleRadius = 25;

class Person {
    constructor(x, y, infected) {
        this.x = x || 500;
        this.y = y || 500;
        this.infected = infected;

        this.speedX = Math.random(10);
        this.speedY = Math.random(10);
    }
    display(context) {
        context.beginPath();

        if(this.infected) {
            context.fillStyle = 'red';
        }else {
            context.fillStyle = 'green';
        }
        
        context.lineWidth = 0;
        context.arc(this.x, this.y, circleRadius, 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    checkWalls() {
        if(this.x < circleRadius || this.x + circleRadius > drawingCanvas.width) {
            this.speedX *= -1;
        }
        if(this.y < circleRadius || this.y + circleRadius > drawingCanvas.height) {
            this.speedY *= -1;
        }
    }
}

function random(val1, val2) {
    if(val2) {
        var min = Math.ceil(val1);
        var max = Math.floor(val2);
    }else {
        var min = 0;
        var max = Math.floor(val1);
    }

    return Math.floor(Math.random() * (max - min)) + min;
}

function randomCoordinates() {
    return {
        x: random(circleRadius, drawingCanvas.width - circleRadius),
        y: random(circleRadius, drawingCanvas.height - circleRadius)
    };
}

for(let i = 0; i < personCount - initalialInfected; i++) {
    let coordinates = randomCoordinates();
    console.log(coordinates);
    persons.push(new Person(coordinates.x, coordinates.y, false));
}

for(let i = 0; i < initalialInfected; i++) {
    let coordinates = randomCoordinates();
    persons.push(new Person(coordinates.x, coordinates.y, true));
}

// Draw Loop
setInterval(function() {
    //reset Canvas
    canvas2D.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    for(person of persons) {
        person.move();
        person.checkWalls();

        person.display(canvas2D);
    }
}, 10);