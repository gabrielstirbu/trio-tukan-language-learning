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
          'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com', // the domain of the web API
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

          var definitionData = data.results[0].definition;
          var defP = $("#definition").text("Definition of the word " + word + " is " + definitionData);
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
  var apiKey = '48fdf6a013msh2875caa8793d562p170376jsn735f22cc6562'; // ADD MY KEY FOR TRANSLATE

  // Create a URLSearchParams object to handle the request body
  var bodyData = new URLSearchParams();
    // new URLSearchParam - creates a new instance to redifine the parameters for the API search.
  // url + q + textToTranslate + source + en + target + es 
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

  // Make the API request using the fetch function
  fetch(url, options)
      .then(response => response.json())
      // takes the bulk information from the API and creates a readable object.
      .then(resultJSON => {
          // Extract the translation from the JSON response
          var translation = resultJSON.data.translations[0].translatedText;

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

// Speech Recognition if statement
if ('webkitSpeechRecognition' in window) {

  var recognition = new webkitSpeechRecognition();
  // creates a new instance in the dom called using webkit and speech recognition API
  recognition.continuous = true; // makes the speech recognition continously active.
  recognition.interimResults = true;  // gives back the results whilst you keep talking
  recognition.lang = 'es'; // Set the language to Spanish

  var startButton = document.getElementById('startButton');
  var stopButton = document.getElementById('stopButton');
  var transcription = document.getElementById('transcription');

  // Event listener for starting speech recognition
  startButton.addEventListener('click', () => {
      recognition.start();
      startButton.disabled = true; // 
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
      var transcript = event.results[0][0].transcript;
      transcription.textContent = 'Speech recognized: ' + transcript;
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