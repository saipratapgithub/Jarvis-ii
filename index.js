window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
console.log("llllllllllllll", recognition);
console.log("mmmmmmmmmmmmmm", synth);
recognition.continuous = true;
recognition.lang = 'en-US';
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
//////////////////...............Voice Speek Control.....///////////////////////////
const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    console.log("mmmmmmmmmmmmmmutterThis", synth);
    synth.speak(utterThis);
};
////////////////////////////////////////////////////////////////////////////////
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
             if (speechToText.includes('what is today\'s date')) {
                speak(getDate);
            }
             if (vVoice.match('what is the capital city of')||vVoice.match('what is the population of')) {
                console.log("capital-1111111111111")
                cntry=vVoice.replace("what is the capital city of ", "");

                speak(countrySearch);
            }
             if (speechToText.includes('what is the weather in')) {
                getTheWeather(speechToText);
            }
             if (vVoice.match("hi")) {
                console.log("speechToText-1111111111111", vVoice)
                synth.resume();
                speak(introWish);
            }
             if (vVoice.match("search for") || vVoice.match("describe")) {
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


