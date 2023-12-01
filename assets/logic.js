$('.search-button').on('click', function displayDefinition(event) {
    event.preventDefault();
    
    var word = $("#form-input").val();
    
    var queryURL = 'https://wordsapiv1.p.rapidapi.com/words/' + word;
    var apiKey = 'd369bb24d5mshf62ee822d5e4068p1c525djsn86e8ff53feb8';
    
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
        var definitionDiv = $('.definition');
        $('#definition').empty();
        $('.definition').empty();
  
        var definitionData = data.results[0].definition;
        var defP = $("<p id= 'defintion'>").text("Definition of the word " + "'" + word + "'" + ": " + definitionData);
        definitionDiv.append(defP);

        localStorage.setItem('definitionText', defP.text());
        
      })
      .catch(function (error) {
        console.error('Error:', error);
      });


});


// API fetch from RapidAPI
function translateText() {
    // Get the input text from the HTML input element with the id 'inputText'
    var word = $("#form-input").val();

    // Define the URL for the Google Translate API
    var url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';

    // Define your RapidAPI key for authentication
    var apiKey = 'd369bb24d5mshf62ee822d5e4068p1c525djsn86e8ff53feb8';

    // Create a URLSearchParams object to handle the request body
    var bodyData = new URLSearchParams();
    bodyData.append('q', word);  // Add the text to be translated
    bodyData.append('source', 'en');   // Add the source language
    bodyData.append('target', 'es');   // Add the target language

    // Set up the options for the API request
    var options = {
        method: 'POST',  // Use the HTTP POST method
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': apiKey,  // Include your RapidAPI key for authentication
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        body: bodyData  // Include the URLSearchParams object as the request body
    };

    // Log the details of the API request for debugging purposes
    console.log('API Request:', { url, options });

    // Make the API request using the fetch function
    fetch(url, options)
        .then(response => response.json())  // Parse the JSON response
        .then(resultJSON => {
            // Extract the translation from the JSON response
            var translation = resultJSON.data.translations[0].translatedText;

            // Log the translation for debugging purposes
            console.log('Translation:', translation);

            // Display the translation in the 'result' div of the HTML
            $('#result').text(translation);

            // Store the translation in localStorage
            localStorage.setItem('Translation: ', translation);
        })
        .catch(error => {
            // Log any errors that occur during the API call
            console.error('API Error:', error);
        });
}
