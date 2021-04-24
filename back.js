window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

//recognition.continous = true;
//recognition.interimResults = true;
//recognition.lang = 'en-US';
console.log("MMMMMMMMMMMMMMMM",synth);

//console.log("LLLLLLLLLLL",recognition);

var vVoice, count = 1, name = "sir", searDtaa,launchSSpoeak=false;
const icon = document.querySelector('i.fa.fa-microphone');
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {
    sound.play();
    dictate();
});
/*var recognitionc = new webkitSpeechRecognition();
recognitionc.continuous = true;*/

setInterval(function () {
    dictate();
}, 3000);

const dictate = () => {
    //recognition.continuous=true;
    recognition.start();
    //speak(vSpeak);
    if (count == 1) {
        speak(vSpeak);
        count = count + 1;
    }
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        vVoice = speechToText;
        console.log("vVoice-vVoice-vVoice",vVoice)
        paragraph.textContent = speechToText;

        if (event.results[0].isFinal) {

            if (speechToText.includes('what is the time')) {
                speak(getTime);
            }

            else if (speechToText.includes('what is today\'s date')) {
                speak(getDate);
            }

            else if (speechToText.includes('what is the weather in')) {
                getTheWeather(speechToText);
            }
            else if (vVoice.match("stop")||vVoice.match("cancel")||vVoice.match("reject")||vVoice.match("enough")) {
                console.log("ooooooooooooo");
                synth.cancel();
            }
            else if(vVoice.match("search for")||vVoice.match("describe")){
                var res;
                if(vVoice.match("search for")){
                    res = vVoice.replace("search for", "");
                    console.log("lllllllllllll-search for", res)
                    searchtextt(res);
                }
                if(vVoice.match("describe")){
                    res = vVoice.replace("describe", "");
                    console.log("lllllllllllll-describe", res)
                    searchtextt(res);
                }

                //var res = vVoice.replace("search for", "");
                //console.log("lllllllllllll", res)

                /*  getArticleList();
                  if(launchSSpoeak&&searDtaa){
                      speak(searchSpeek(searDtaa));
                  }
  */

                //searchtextt(res);
                //speak(searchSpeek);
            }
            else if (vVoice.match("hi")) {
                synth.resume();
                console.log("ooooooooooooo");
                speak(vWish);
            }

            else if (vVoice.match("how are you")) {
                console.log("ooooooooooooo");
                speak(vSpeak1);
            }
            else {
                speak(vSpeak);
            }
        }
    }
};

const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
};
const vWish = () => {
    var ww = 'Hello, please to meet you';
    return ww;
};
const vSpeak1 = () => {
    var ww1 = 'I am fine, what about u';
    return ww1;
};
const searchSpeek = (data) => {
    /*if (data){
        console.log("DATATATATATATATAT",data);
        var ww12 = "The Delhi Metro is a metro system serving Delhi and its satellite cities of Bahadurgarh, Ballabhgarh, Faridabad, Ghaziabad, Gurgaon and Noida in the National Capital Region of India";
        return ww12;

    }*/
    //console.log("DATATATATATATATAT",data);
    var ww12 = "The Delhi Metro is a metro system serving Delhi and its satellite cities of Bahadurgarh, Ballabhgarh, Faridabad, Ghaziabad, Gurgaon and Noida in the National Capital Region of India";
    return ww12;

};
const vSpeak = () => {
    var xx;
    if (vVoice) {
        xx = vVoice;
    }
    else {
        xx = "Hello this is Jarvis, how can i help you"
    }
    return xx;
};
function getArticleList() {
    var searchFor;
    var response = "";
    searchFor="delhi";
    console.log(searchFor);
    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchFor + "&limit=5",
        dataType: 'jsonp',
        success: function (data) {
            response = data;
        }
    }).done(function (response) {
        console.log("response.object[1]",response[2]);
        var sss=response[2];

        console.log("response.objectsss",sss[1]);
        //searDtaa=sss[1];
        searDtaa ='The Delhi Metro is a metro system serving Delhi and its satellite cities of Bahadurgarh, Ballabhgarh, Faridabad, Ghaziabad, Gurgaon and Noida in the National Capital Region of India.';
        //searchSpeek(searDtaa);
        launchSSpoeak=true;
        //document.querySelector.artName.innerText = response.object[1];
        //document.querySelector.textArt.innerText = response.object[0];
        //document.querySelector.href = response.object[2];
    });
    //return searDtaa;

}

const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`
};

const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
};


const searchtextt =(data)=>{
    fetch("https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search="+data+"i&limit=5").then(function(resp) {
        console.log(resp);
        return resp.json()
    }).then(function(data) {
        console.log(data[2]);
        utterThis = new SpeechSynthesisUtterance( data[2]);
        console.log("JJJJJJJJJJJJ",utterThis)
        synth.speak(utterThis);
    });
};


const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            if (weather.cod === '404') {
                utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
                synth.speak(utterThis);
                return;
            }
            utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
            synth.speak(utterThis);
        });
};