const drawingCanvas = document.getElementById("drawingCanvas");
const canvas2D = drawingCanvas.getContext("2d");

console.log(canvas2D);

var persons = [];

let personCount = 60;
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

function randomCoordinatesNoCollisions() {
    let potentialCoordinates = {
        x: random(circleRadius, drawingCanvas.width - circleRadius),
        y: random(circleRadius, drawingCanvas.height - circleRadius)
    };

    for(person of persons) {
        if(personsColliding(person, potentialCoordinates)) {
            potentialCoordinates = randomCoordinatesNoCollisions();
            break;
        }
    }

    return potentialCoordinates;
    
}

function diff (num1, num2) {
  if (num1 > num2) {
    return (num1 - num2);
  } else {
    return (num2 - num1);
  }
}

function dist (x1, y1, x2, y2) {
  var deltaX = diff(x1, x2);
  var deltaY = diff(y1, y2);
  var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  return (dist);
}

function personsColliding(person1, person2) {
    let distance = dist(person1.x, person1.y, person2.x, person2.y);

    return (distance < circleRadius * 2);
}

function checkCollisions() {
    for(let person1Id = 0; person1Id < this.persons.length; person1Id++) {
        for(let person2Id = person1Id+1; person2Id < this.persons.length; person2Id++) {
            let person1 = persons[person1Id];
            let person2 = persons[person2Id];

            if(personsColliding(person1, person2)) {
                console.log("COLLISIONS");
                [person1.speedX, person2.speedX] = [person2.speedX, person1.speedX];
                [person1.speedY, person2.speedY] = [person2.speedY, person1.speedY];

                if(person1.infected) {
                    person2.infected = true;
                }else if(person2.infected) {
                    person1.infected = true;
                }
            }
        }
    }
}

for(let i = 0; i < personCount - initalialInfected; i++) {
    let coordinates = randomCoordinatesNoCollisions();
    console.log(coordinates);
    persons.push(new Person(coordinates.x, coordinates.y, false));
}

for(let i = 0; i < initalialInfected; i++) {
    let coordinates = randomCoordinatesNoCollisions();
    persons.push(new Person(coordinates.x, coordinates.y, true));
}

// Draw Loop
setInterval(function() {
    //reset Canvas
    canvas2D.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    for(person of persons) {
        person.move();
        person.checkWalls();
    }

    checkCollisions();

    for(person of persons) {
        person.display(canvas2D);
    }
}, 10);