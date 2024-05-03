// Global variable to keep track of the current rendering ID
var currentRenderingId = 0;
var messages = [
  "Which video shows a more natural <b>SAD</b> facial expression?", // Message for 1 click
  "Which video shows a more natural <b>SAD</b> facial expression?", // Message for 2 clicks
  "Which video shows a more natural <b>SURPRISED</b> facial expression?", // and so on...
  "Which video shows a more natural <b>SURPRISED</b> facial expression?",
  "Which video shows a more natural <b>SURPRISED</b> facial expression?",
  "Which video shows a more natural <b>SURPRISED</b> facial expression?",
  "Which video shows a more natural <b>SURPRISED</b> facial expression?",
  "Which video shows a more natural <b>SURPRISED</b> facial expression?",
  "Which video shows a more natural <b>ANGRY</b> facial expression?",
  "Which video shows a more natural <b>ANGRY</b> facial expression?"
];

function clickImage(imgId){
  getLock()
  img0_src = getCleanerPath(img0.src)
  img1_src = getCleanerPath(img1.src)

  if(imgId == "0") {
    methodPreference = img0_src[0]
  } else if(imgId == "1") {
    methodPreference = img1_src[0]
  } else {
    methodPreference = "None"
  }

  sendData({"UserName": userId,
            "Img0": img0_src, 
            "Img1": img1_src,
            "imgPreference": imgId,
            "methodPreference": methodPreference})

  // Delay display the next 2 images
  setTimeout(function(){
    sampleImages()
    setTimeout(function(){
      releaseLock()
    }, 1000);
  }, 1000);
  updateClickCount();

}

function getRandomInt(max){ 
  return Math.floor(Math.random()*(max))+1 
}

function getCleanerPath(path){
  /* Given a filepath, removes all directories except for the last one
      Ex. : a/b/d/e/f.txt -> e/f.txt */
  split = path.split("/")
  return split[split.length - 2] + "/" + split[split.length - 1]
}

function shuffleArray(arr){
  return arr.sort(function () {
    return Math.random() - 0.5;
  })
}

function sampleImages(){
  num_renderings = 5
  num_methods = 2

  other = shuffleArray(["b", "c"])[0]
  draping_modes = shuffleArray([other, "a"])


  // Body/garment combination is randomized
  //rendering_id = getRandomInt(num_renderings)
  rendering_id = Math.floor(currentRenderingId / num_methods)+1
  methods = Math.floor(currentRenderingId % num_methods)
  if (methods ==0){
    draping_modes = shuffleArray(["b", "a"])
  }
  else if (methods ==1){
    draping_modes = shuffleArray(["a", "c"])
  }
  //else{draping_modes = shuffleArray(["a", "c"])}

  currentRenderingId++;

  // Display corresponding images
  base_url = "https://raw.githubusercontent.com/emoeval/emoeval.github.io/video/"
  //https://github.com/emoeval/emoeval.github.io/blob/video/b/1.mp4
  img0.src = base_url + draping_modes[0] + "/" + rendering_id + ".mp4"
  img1.src = base_url + draping_modes[1] + "/" + rendering_id + ".mp4"
  //img1.src = 'https://raw.githubusercontent.com/emoeval/emoeval.github.io/video/a/1.mp4'

}

function greyOutImages(){
  greyOutImage(img0)
  greyOutImage(img1)
  greyOutImage(imgNone)
}

function greyOutImage(img){
  img.classList.add("desaturate")
  img.classList.remove("imgHover")
}

function UNgreyOutImages(){
  UNgreyOutImage(img0)
  UNgreyOutImage(img1)
  UNgreyOutImage(imgNone)
}

function UNgreyOutImage(img){
  img.classList.remove("desaturate")
  img.classList.add("imgHover")
}

function getLock(){
  img0.onclick = (event) => {}
  img1.onclick = (event) => {}
  imgNone.onclick = (event) => {}
  greyOutImages()
}

function releaseLock(){
  img0.onclick = (event) => {clickImage('0')}
  img1.onclick = (event) => {clickImage('1')}
  imgNone.onclick = (event) => {clickImage('none')}
  UNgreyOutImages()
}

function sendData(data) {
  console.log('data', data  )
  const XHR = new XMLHttpRequest();
  const FD = new FormData();

  // Push our data into our FormData object
  for (const [name, value] of Object.entries(data)) {
    FD.append(name, value);
  }

  // Define what happens on successful data submission
  XHR.addEventListener('load', (event) => {
    console.log('Sucessfully sent response.', event);
  });

  // Define what happens in case of error
  XHR.addEventListener('error', (event) => {
    alert('Oops! Something went wrong. Try refreshing the page. If the issue persists, please read the message at the bottom of the page.');
  });

  // Set up our request
  XHR.open('POST','https://script.google.com/macros/s/AKfycbwEzX6Oxpt_5vh9O2C9_HSyJ8dKxruxqMifWkFcm81Z04oydJ0bWNgMLgXbL0AjzBsB/exec');
  //OLD: https://script.google.com/macros/s/AKfycbzXof_89vtE22akqC6dV02CVDrUP3LX6xGN1sdHHIATjE0ZZru8L8lRCAMHN-e9O1Q/exec

  // Send our FormData object; HTTP headers are set automatically
  XHR.send(FD);
}

function stringGen(len){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(getRandomInt(possible.length));
  return text;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

function userIdSetup(){
  userId = getCookie("userId")
  if(userId == ""){
    userId = stringGen(10)
    setCookie("userId", userId, 100)
  }
  return userId
}
function updateClickCount() {
  var countDisplay = document.getElementById('clickCount');
  displayID = currentRenderingId +1
  countDisplay.innerHTML = "Question " + displayID + "/10: "  ;
  if (currentRenderingId <= messages.length) {
    countDisplay.innerHTML = countDisplay.innerHTML + messages[currentRenderingId];
}
    
  // Check if clickCounter has reached 15
  if (currentRenderingId >= 10) {
    showFinishButton();
  }
}
function showFinishButton() {

  var finishButton = document.getElementById('finishButton');
  var video0 = document.getElementById('img0');
  var video1 = document.getElementById('img1');
  var divNone = document.getElementById('imgNone');
  var startButton = document.getElementById('startButton');
  var clickCount = document.getElementById('clickCount');

  // Show the finish button
  finishButton.style.display = 'block';

  // Hide the videos
  video0.style.display = 'none';
  video1.style.display = 'none';

  // Hide the "no winner" box
  divNone.style.display = 'none';

  // Hide the start button if it's still visible
  startButton.style.display = 'none';

  clickCount.style.display = 'none';
}
function startEvaluation() {
  updateClickCount()
  sampleImages()

  
  var video0 = document.getElementById('img0');
  var video1 = document.getElementById('img1');
  var divNone = document.getElementById('imgNone');

  var message = document.getElementById('clickCount');



  message.style.display = 'block';
  video0.style.display = 'block'; // Show the first video
  video1.style.display = 'block'; // Show the second video
  divNone.style.display = 'block'; // Show the "no winner" box

  video0.play(); // Start playing the first video
  video1.play(); // Start playing the second video

  video0.muted = false; // Ensure the first video has sound
  video1.muted = true; // Mute the second video

  var btn = document.getElementById('startButton');
  btn.style.display = 'none'; // Hide the button
}