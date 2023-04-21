
const URL = "http://localhost:8080/api/quotes/"

let quotes =[]
let lastQuote


document.getElementById("btn").onclick=initApp

async function initApp(){
  console.log("initApp()")
  createAndAppendVideoElement()
  createAndAppendBackgroundAudioElement()
 await getToken()
 await getQuotes()
 getSpokenQuote()
 document.getElementById("bgm").volume=0.2
 document.getElementById("quote").onended=getSpokenQuote
}






async function getToken(){
    try {
        const token = await fetch(URL+"token").then(handleHttpErrors)
        console.log(token)
        localStorage.setItem("token",token.token)
    } catch (error) {
        
    }
}

async function getQuotes(){
  try {
     quotes = await fetch(URL).then(handleHttpErrors)
     console.log(quotes)
  } catch (error) {
    console.log(error)
  }
}

function getSpokenQuote() {
  document.getElementById("quote-text").remove()
  const quoteBox = document.getElementById("quote-box")
  console.log("in quote function")
  console.log(quotes)
  try {
    let body = quotes[Math.floor(Math.random()*quotes.length)]
  if(body==lastQuote){
    if(quotes.indexOf(body)==quotes.length){
      body = quotes[quotes.indexOf(body)-1]
    }
    body = quotes[quotes.indexOf(body)+1]
  }
  lastQuote=body
  
  const parts = body.quote.split("*")
  body = body.quote.replace(/\*/g, '')
  let request = new XMLHttpRequest();
  request.open("POST","https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1");
  request.setRequestHeader("X-Microsoft-OutputFormat","audio-16khz-32kbitrate-mono-mp3");
  request.setRequestHeader("Content-Type","application/ssml+xml");
  request.setRequestHeader("Authorization","Bearer "+localStorage.getItem("token"));

  request.responseType = "blob"; // Set the response type to blob

  request.onloadend = function() {
    // Create a Blob object from the response data
    let blob = new Blob([request.response], { type: "audio/mp3" });

    // Create a temporary URL object to access the Blob data
    let url = window.URL.createObjectURL(blob);

    // Create an audio element and set its src attribute to the URL
    const audio = document.getElementById("quote")
    audio.src = url;

    //Play the audio 
    const quoteText = document.createElement("p")
    quoteText.setAttribute("id","quote-text")
    quoteText.setAttribute("class","fade-in")
    quoteText.innerHTML=parts[1]
    quoteBox.appendChild(quoteText)
    audio.play()
  };
  request.send(body);
  } catch (error) {
    console.log(error)
  }
  
}

function createAndAppendBackgroundAudioElement() {
  const audio = document.createElement("audio");
  audio.setAttribute("src", "bgm.mp3");
  audio.setAttribute("id", "bgm");
  audio.setAttribute("autoplay", true);
  audio.setAttribute("loop",true)
  document.body.appendChild(audio);
}

function createAndAppendVideoElement() {
  const video = document.createElement("video");
  video.setAttribute("src", "bgv.mp4");
  video.setAttribute("autoplay", true);
  video.setAttribute("muted", true);
  video.setAttribute("loop", true);
  video.setAttribute("id", "bgv");
  document.body.appendChild(video);
}



 async function handleHttpErrors(res) {
  if (!res.ok) {
    const errorResponse = await res.json();
    const error = new Error(errorResponse.message)
    //@ts-ignore
    error.fullError = errorResponse
    throw error
  }
  return res.json()
}