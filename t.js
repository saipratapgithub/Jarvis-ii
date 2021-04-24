window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

const icon = document.querySelector('i.fa.fa-microphone')
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');
var vVoice, introFin;
icon.addEventListener('click', () => {
    sound.play();
    dictate();

});


const dictate = () => {
    console.log("OOOOOOOOOOOO",recognition)
    recognition.start();

    speak(vSpeak);
    if(introFin){
        console.log("OOOOOOOOOOOOp-introFin",introFin)

        recognition.onresult = (event) => {

            const speechToText = event.results[0][0].transcript;
            console.log("speechToText-0000000", speechToText)

            paragraph.textContent = speechToText;
            vVoice=speechToText;
            console.log("speechToText-11111111", paragraph.textContent)


            if (event.results[0].isFinal) {
                console.log("speechToText-2222222",event.results[0].isFinal)

                if (speechToText.includes('what is the time')) {
                    console.log("speechToText-3333333333",speechToText.includes('what is the time'))
                    speak(getTime);
                }

                if (speechToText.includes('what is today\'s date')) {
                    speak(getDate);
                }

                if (speechToText.includes('what is the weather in')) {
                    getTheWeather(speechToText);
                }
                else {
                    console.log("speechToText-elseelseelseelse",speechToText)

                    speak(vSpeak);
                }


            }
        }

    }

};

const speak = (action) => {
    console.log("speechToText-444444444444444", action)

    utterThis = new SpeechSynthesisUtterance(action());
    console.log("speechToText-66666666", utterThis)

    synth.speak(utterThis);
};

const vSpeak=()=>{
    var xx;
    if(vVoice){
        xx= vVoice;
    }
    else{
        introFin=true;
        xx="Hello this is Alex, how can i help you"
    }
    return xx;
};

const getTime = () => {

    const time = new Date(Date.now());
    console.log("speechToText-5555555555",time)

    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const getDate = () => {
    const time = new Date(Date.now())
    return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
        .then(function(response){
            return response.json();
        })
        .then(function(weather){
            if (weather.cod === '404') {
                utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
                synth.speak(utterThis);
                return;
            }
            utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
            synth.speak(utterThis);
        });
};





////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

//recognition.continous = true;
//recognition.interimResults = true;
//recognition.lang = 'en-US';

console.log("LLLLLLLLLLL",recognition);

var vVoice, count = 1, name = "sir";
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
}, 2500);

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
            else if (vVoice.match("hi")) {
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
    var ww = 'Hello Sir, please to meet you';
    return ww;
};
const vSpeak1 = () => {
    var ww1 = 'I am fine, what about u';
    return ww1;
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


const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`
};

const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
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


//////////////////////////11/12/2018///////////////////////////////////////////
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
console.log("llllllllllllll", recognition)
console.log("mmmmmmmmmmmmmm", synth)
//recognition.continuous = true;
//recognition.lang = 'te-IN';
var vVoice, count = 1,cntry;
const icon = document.querySelector('i.fa.fa-microphone');
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {
    sound.play();
    dictate();
});
setInterval(function () {
    dictate();
}, 3000);

const dictate = () => {
    console.log("nnnnnnnnn", synth,count)

    recognition.start();
    if (count == 1) {

        speak(introSpeach);
        count = count + 1;

    }
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        vVoice = speechToText;
        console.log("speechToText", vVoice)
        paragraph.textContent = speechToText;
        if (event.results[0].isFinal) {
            console.log("speechToText-isFinal", vVoice)
            /* if(recognition.lang = 'te-IN'&&vVoice){
                 console.log("speechToText-lang", vVoice)
                 speak(introSpeach);
             }*/
            if (vVoice.match("stop") || vVoice.match("cancel") || vVoice.match("reject") || vVoice.match("enough")) {
                synth.cancel();
            }
            if (vVoice.match("how are you")) {
                speak(introSpeach1);
            }
            if (speechToText.includes('what is the time')) {
                speak(getTime);
            }
            else if (speechToText.includes('what is today\'s date')) {
                speak(getDate);
            }
            else if (vVoice.match('what is the capital city of')||vVoice.match('what is the population of')) {
                console.log("capital-1111111111111")
                cntry=vVoice.replace("what is the capital city of ", "");

                speak(countrySearch);
            }
            else if (speechToText.includes('what is the weather in')) {
                getTheWeather(speechToText);
            }
            else if (vVoice.match("hi")) {
                console.log("speechToText-1111111111111", vVoice)
                synth.resume();
                speak(introWish);
            }
            else if (vVoice.match("search for") || vVoice.match("describe")) {
                var res;
                if (vVoice.match("search for")) {
                    res = vVoice.replace("search for", "");
                    wikiSeach(res);
                }
                if (vVoice.match("describe")) {
                    res = vVoice.replace("describe", "");
                    wikiSeach(res);
                }
            }
            /* else {
                 console.log("speechToText-22222222222", vVoice)
                 speak(dontKnow);
             }*/
        }
    }
};

//////////////////...............Voice Speek Control.....///////////////////////////
const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
};
////////////////////////////////////////////////////////////////////////////////

//////////////////...............Intro Formalities.....///////////////////////////

const introWish = () => {
    var ww = 'jarvis At your service sir';
    return ww;
};
const introSpeach1 = () => {
    var ww1 = 'i am fine, what about u';
    return ww1;
};
const dontKnow = () => {
    var ww12 = "I'm sorry, i dont have a answer";
    return ww12;
};
const introSpeach = () => {
    var xx;
    xx = "Hello this is Jarvis, how can i help you";

    /*  if (vVoice) {
          //xx = vVoice;
          //xx = "I'm sorry, i dont have a answer";
      }
      else {
          xx = "Hello this is Jarvis, how can i help you"
      }*/
    return xx;
};
////////////////////////////////////////////////////////////////////////////////


//////////////////...............Voice Wiki and apis Search.....///////////////////////////
const wikiSeach = (data) => {
    fetch("https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=" + data + "i&limit=5").then(function (resp) {
        console.log(resp);
        return resp.json()
    }).then(function (data) {
        console.log(data[2]);
        utterThis = new SpeechSynthesisUtterance(data[2]);
        console.log("JJJJJJJJJJJJ", utterThis);
        synth.speak(utterThis);
    });
};

const countrySearch = () => {
    var ctryUrl="https://restcountries.eu/rest/v2/name/" + cntry + "";
    ctryUrl.match("%20","");
    fetch(ctryUrl).then(function (resp) {
        return resp.json()
    }).then(function (data) {
        if(data.length>=0){
            console.log("ooooooooooopppppuuuuuuuuuuuuuu-00000000000",data);
            for (var i=0;i<=data.length;i++){
                var sendCtry;
                console.log("ooooooooooopppppuuuuuuuuuuuuuu-11111111111",data[i].name,cntry);
                if(cntry===data[i].name){
                    sendCtry="the capital city of"+cntry+"is"+data[i].capital;
                    utterThis = new SpeechSynthesisUtterance(sendCtry);
                    synth.speak(utterThis);
                }
            }
        }
        else{
            console.log("ooooooooooopppppuuuuuuuuuuuuuu-2222222222222222");
            sendCtry="sorry, icant find the capital city for"+cntry;
            utterThis = new SpeechSynthesisUtterance(sendCtry);
            synth.speak(utterThis);
        }
    });
};

const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}`
};
const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
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
////////////////////////////////////////////////////////////////////////////////

//https://restcountries.eu/rest/v2/capital/delhi
//https://restcountries.eu/rest/v2/alpha/aus
//https://restcountries.eu/rest/v2/name/china


