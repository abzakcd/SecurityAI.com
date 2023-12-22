// הכרזה על משתנים גלובליים
let video = null; // אלמנט וידאו
let detector = null; // אובייקט הזיהוי
let detections = []; // אחסון לתוצאות הזיהוי
let videoVisibility = true; // האם הוידאו גלוי
let detecting = false; // האם תהליך הזיהוי פעיל
let objectCount = 0;
var cunter=0; // ספירה לבדיקת אובייקט


// אלמנטי HTML גלובליים
const toggleVideoEl = document.getElementById('toggleVideoEl');
const toggleDetectingEl = document.getElementById('toggleDetectingEl');

// הגדרת סמן להמתנה עד שהוידאו יטען
document.body.style.cursor = 'wait';

// הפונקציה preload() נקראת אם קיימת, לפני הפונקציה setup()
function preload() {
  // יצירת אובייקט הזיהוי ממודל "cocossd"
  detector = ml5.objectDetector('cocossd');
  console.log('אובייקט הזיהוי נטען');
}

// הפונקציה setup() נקראת פעם אחת בעת התחלת התוכנית
function setup() {
  // יצירת אלמנט קנבס בגודל 640 רוחב על 480 גובה בפיקסלים
  createCanvas(640, 480);
  // יצירת אלמנט וידאו חדש המצלם את זרם האודיו/הוידאו ממצלמת הרשת
  // האלמנט נפרד מהקנבס ומוצג כברירת מחדל
  video = createCapture(VIDEO);
  video.size(640, 480);
  console.log('יצירת אלמנט הוידאו');
  video.elt.addEventListener('loadeddata', function() {
    // שינוי סמן העכבר למצב המחכה עד שהוידאו יהיה טעון
    if (video.elt.readyState >= 2) {
      document.body.style.cursor = 'default';
      console.log('אלמנט הוידאו מוכן! לחץ על "התחל זיהוי" כדי לראות את הקסם!');
    }
  });
}

// הפונקציה draw() מופעלת באופן תמידי עד שהפונקציה noLoop() נקראת
function draw() {
  if (!video || !detecting) return;
  // ציור הפריים של הוידאו על הקנבס ומצביע על הפינה השמאלית-עליונה
  image(video, 0, 0);
  // ציור כל האובייקטים שנזהו על הקנבס
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);

  }
}

/*
דוגמא לאובייקט שנזהה
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

// ציור מסגרת סביב האובייקט שנזהה
function drawBoundingBox(object) {
  // הגדרת צבע הקו
  stroke('green');
  // רוחב הקו
  strokeWeight(4);
  // ביטול צביעת המשטח
  noFill();
  // ציור מלבן - הקואורדינטות של הפינה השמאלית-עליונה, רוחב וגובה
  rect(object.x, object.y, object.width, object.height);
}

// ציור תווית של האובייקט שנזהה (בתוך המלבן)
function drawLabel(object) {
  // ביטול ציור קו הגבול
  noStroke();
  // הגדרת צבע המילוי
  fill('white');
  // הגדרת גודל הגופן
  textSize(24);
  // ציור מחרוזת טקסט על הקנבס
  text(object.label, object.x + 10, object.y + 24);
  countObjects(object);
}

// פונקציה callback - נקראת כאשר נמצא אובייקט
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  // המשך זיהוי אובייקטים
  if (detecting) {
    detect();
  }
}

// הפעלת פעולת הזיהוי
function detect() {
  // הוראה לאובייקט "detector" להתחיל לזהות אובייקטים מהוידאו
  // ולקרוא לפונקציה "onDetected" כאשר יתגלה אובייקט
  detector.detect(video, onDetected);
}

// פונקציה לשינוי נראות הווידאו
function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoEl.innerText = 'הצג וידאו';
  } else {
    video.show();
    toggleVideoEl.innerText = 'הסתר וידאו';
  }
  videoVisibility = !videoVisibility;
}

// פונקציה להפעלה/כיבוי של פעולת הזיהוי
function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingEl.innerText = 'עצור זיהוי';
  } else {
    toggleDetectingEl.innerText = 'התחל זיהוי';
  }
  detecting = !detecting;
}

function countObjects(object) {
  objectCount = detections.length;

  console.log('מספר האובייקטים: ' + objectCount);
  if(object.label === "person"){

    setInterval(function() {cunter++; console.log(cunter)}, 2000);

    if(cunter===5){
      cunter=0;
      alert('סכנה גנב');
      location.reload();
    }

  }

}





//----------------------------


function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("סכנה");
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("סכנה גנב");
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}



