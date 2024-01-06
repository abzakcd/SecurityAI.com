// Global variable declarations
let video = null; // Video element
let detector = null; // Object detection object
let detections = []; // Storage for detection results
let videoVisibility = true; // Is the video visible
let detecting = false; // Is the detection process active
let objectCount = 0;
var counter = 0; // Object counter for checking
console.log(detections);

// Global HTML elements
const toggleVideoEl = document.getElementById('toggleVideoEl');
const toggleDetectingEl = document.getElementById('toggleDetectingEl');

// Set a cursor indicator while waiting for the video to load
document.body.style.cursor = 'wait';

// The preload() function is called, if it exists, before the setup() function
function preload() {
  // Create an object detector with the "cocossd" model
  detector = ml5.objectDetector('cocossd');
  console.log('Object detector loaded');
}

// The setup() function is called once at the beginning of the program
function setup() {
  // Create a canvas element with a width of 640 and height of 480 pixels
  createCanvas(640, 480);
  // Create a video element capturing the audio/video stream from the user's camera
  // The video element is separate from the canvas and initially visible
  video = createCapture(VIDEO);
  video.size(640, 480);
  console.log('Video element created');
  video.elt.addEventListener('loadeddata', function() {
    // Change the cursor indicator to default once the video is loaded
    if (video.elt.readyState >= 2) {
      document.body.style.cursor = 'default';
      console.log('Video element ready! Click "Start Detection" to see the magic!');
    }
  });
}

// The draw() function is called continuously until the noLoop() function is called
function draw() {
  if (!video || !detecting) return;
  // Draw the video frame on the canvas, pointing to the top-left corner
  image(video, 0, 0);
  // Draw all detected objects on the canvas
  for (let i = 0; i < detections.length; i++) {
    // Check if the object is a person
    if (isPerson(detections[i])) {
      drawResult(detections[i]);
    }
  }
}

// Additional function for checking the object type
function isPerson(object) {
  return object.label === 'person';
}

/*
Example of a detected object:
{
  "label": "person",
  "confidence": 0.8013999462127686,
  "x": 7.126655578613281,
  "y": 148.3782720565796,
  "width": 617.7880859375,
  "height": 331.60210132598877,
}
*/
function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
}

// Draw a bounding box around the detected object
function drawBoundingBox(object) {
  // Set the color of the outline
  stroke('green');
  // Set the width of the line
  strokeWeight(4);
  // Do not fill the area inside the rectangle
  noFill();
  // Draw a rectangle - coordinates of the top-left corner, width, and height
  rect(object.x, object.y, object.width, object.height);
}

// Draw a label inside the bounding box
function drawLabel(object) {
  // Do not draw the boundary line
  noStroke();
  // Set the fill color
  fill('white');
  // Set the font size
  textSize(24);
  // Draw a text string on the canvas
  text(object.label, object.x + 10, object.y + 24);
  countObjects(object);
}

// Function callback - called when an object is detected
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  // Continue detecting objects
  if (detecting) {
    detect();
  }
}

// Start the detection process
function detect() {
  // Instruct the "detector" object to start detecting objects from the video
  // and call the "onDetected" function when an object is detected
  detector.detect(video, onDetected);
}

// Function to toggle the visibility of the video
function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoEl.innerText = 'Show Video';
  } else {
    video.show();
    toggleVideoEl.innerText = 'Hide Video';
  }
  videoVisibility = !videoVisibility;
}

// Function to start/stop the detection process
function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingEl.innerText = 'Stop Detection';
  } else {
    toggleDetectingEl.innerText = 'Start Detection';
  }
  detecting = !detecting;
}

function countObjects(object) {
  objectCount = detections.length;

  console.log('Number of objects: ' + objectCount);
  if (isPerson(object)) {
    console.log(object);

    setInterval(function() {
      counter++;
      console.log(counter);
    }, 2000);

    if (counter === 5) {
      counter = 0;
      alert('Thief alert');
      location.reload();
    }
  }
}

// Notification function
function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("Alert");
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Thief alert");
        // …
      }
    });
  }

  // If the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}
