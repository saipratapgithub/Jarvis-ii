var voices;

if (speechSynthesis) {

    // wait on voices to be loaded before fetching list
    speechSynthesis.onvoiceschanged = function() {
        voices = speechSynthesis.getVoices();
        voices.forEach(function (voice, index) {
            $('#voiceButtons').append('<li><button>' + voice.name + '</button></li>');
        });

        $('button').click(function () {
            var text = $('textarea').val();
            var voice = getVoiceFromName($(this).text());
            say(text, voice);
        });
    };

} else {
    alert("Bad news!  Your browser doesn't have the Speech Synthesis API this project requires.  Try opening this webpage using the newest version of Google Chrome.");
}

function getVoiceFromName (name) {
    var foundVoice = null;

    voices.forEach(function (voice, index) {
        if (voice.name === name) {
            foundVoice = voice;
        }
    });

    return foundVoice;
}

function say (text, voice) {
    var speech = new SpeechSynthesisUtterance(text);
    speech.voice = voice;
    speechSynthesis.speak(speech);
}