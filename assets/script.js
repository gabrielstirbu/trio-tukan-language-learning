// Handle click event on search button
$('.search-button').on('click', function displayDefinition(event) {
    event.preventDefault();

    // Get the word from the input field
    var word = $("#form-input").val();

    // Define the API endpoint for word definition
    var queryURL = 'https://wordsapiv1.p.rapidapi.com/words/' + word;

    // Add your RapidAPI key for authentication
    var apiKey = ''; // ADD WORD KEY (FROM RADU)

    // Make a fetch request to get word definition
    fetch(queryURL, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
            'X-RapidAPI-Key': apiKey,
        },
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Display the definition in the UI
            var definitionDiv = $('.definition');
            $('#definition').empty();
            $('.definition').empty();

            var definitionData = data.results[0].definition;
            var defP = $("<p id='definition'>").text("Definition of the word " + word + " is " + definitionData);
            definitionDiv.append(defP);

            // Store the definition text in localStorage
            localStorage.setItem('definitionText', defP.text());

            // Call translateText function with the definition text
            translateText(defP.text());
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
});

// API fetch from RapidAPI for translation
function translateText(textToTranslate) {
    // Define the URL for the Google Translate API
    var url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';

    // Add your RapidAPI key for translation
    var apiKey = ''; // ADD MY KEY FOR TRANSLATE

    // Create a URLSearchParams object to handle the request body
    var bodyData = new URLSearchParams();
    bodyData.append('q', textToTranslate);
    bodyData.append('source', 'en');
    bodyData.append('target', 'es');

    // Set up the options for the API request
    var options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: bodyData
    };

    // Log the details of the API request for debugging purposes
    console.log('API Request:', { url, options });

    // Make the API request using the fetch function
    fetch(url, options)
        .then(response => response.json())
        .then(resultJSON => {
            // Extract the translation from the JSON response
            var translation = resultJSON.data.translations[0].translatedText;

            // Log the translation for debugging purposes
            console.log('Translation:', translation);

            // Display the translation in the 'result' div of the HTML
            $('#result').text(translation);

            // Store the translation in localStorage
            localStorage.setItem('Translation', translation);
        })
        .catch(error => {
            // Log any errors that occur during the API call
            console.error('API Error:', error);
        });
}

// Speech Recognition
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es'; // Set the language to Spanish

    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const transcription = document.getElementById('transcription');

    // Event listener for starting speech recognition
    startButton.addEventListener('click', () => {
        recognition.start();
        startButton.disabled = true;
        stopButton.disabled = false;
        startButton.textContent = 'Listening...';
    });

    // Event listener for stopping speech recognition
    stopButton.addEventListener('click', () => {
        recognition.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
        startButton.textContent = 'Start Speech Recognition';
    });

    // Event listener for speech recognition results
    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        transcription.textContent = 'Speech recognized: ' + transcript;
    };

    // Event listener for speech recognition errors
    recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
    };

    // Event listener for the end of speech recognition
    recognition.onend = function () {
        startButton.disabled = false;
        stopButton.disabled = true;
        startButton.textContent = 'Start Speech Recognition';
    };
} else {
    console.error('Web Speech API is not supported in this browser.');
}


