
const URL = "http://localhost:8080/api/quotes/"

window.onload=initApp

let songs = ["./music/1.mp3","./music/2.mp3","./music/3.mp3","./music/4.mp3"]
let quotes =[]

async function initApp(){
 await getToken()
 quotes = getQuotes()
 document.getElementById("start").onclick=test
 document.getElementById("bgm").volume=0.5
  //setMood()
}


async function getToken(){
    try {
        const token = await fetch(URL+"token").then(handleHttpErrors)
        console.log(token)
        localStorage.setItem("token",token.token)
    } catch (error) {
        
    }
 


}
async function nextQuote(){
  const quote = document.getElementById("quote")

  let headers = new Headers()
  headers.set("X-Microsoft-OutputFormat","audio-16khz-32kbitrate-mono-mp3")
  headers.set("Content-Type","application/ssml+xml")
  headers.set("Host","northeurope.tts.speech.microsoft.com")
  headers.set("Authorization","Bearer "+localStorage.getItem("token"))

  let body = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Male'
  name='en-US-ChristopherNeural'>
      pee pee poo poo
</voice></speak>`

/*
  quote.onended=()=>{
    let body = `<speak version='1.0' xml:lang='en-US'>
    <voice xml:lang='en-US' xml:gender='Male'
    name='en-US-ChristopherNeural'>
        Microsoft Speech Service Text-to-Speech API
</voice>
</speak>`
   let request = new XMLHttpRequest()
   request.open("POST","https://northeurope.tts.speech.microsoft.com/cognitiveservices/v1")
   request.setRequestHeader("X-Microsoft-OutputFormat","audio-16khz-32kbitrate-mono-mp3")
   request.setRequestHeader("Content-Type","application/ssml+xml")
   request.setRequestHeader("Host","northeurope.tts.speech.microsoft.com")
   request.setRequestHeader("Authorization","Bearer "+localStorage.getItem("token"))

   request.send(body)
   console.log(request.responseType)

  }
  */
}

async function getQuotes(){
  try {
     quotes = await fetch(URL).then(handleHttpErrors)
     console.log(quotes)
  } catch (error) {
    console.log(error)
  }
}

function test() {
  let body = quotes[Math.floor(Math.random()*quotes.length)].quote
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

    // Play the audio
    audio.pause()
    audio.load()
    audio.play()
  };

  request.send(body);
}



 function setMood(){
  
  const audio = document.getElementById("bgm")

  audio.onended=()=>{
    let nextSong = Math.floor(Math.random()*4)
    audio.src=songs[nextSong]
    audio.pause()
    audio.load()
    audio.volume=0.5
    audio.play()
  }
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