// Note: this is a WIP to interface with the Google Sheets API
// Not yet implemented b/c we need to set up a server-side backend
// to store API keys and handle API calls.

/*
|--------------------------------------------------------------------------
| Google Sheets API
|--------------------------------------------------------------------------
|
| Read and update from Google sheet
|
|
*/

// Load Google API client
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Auhorize client and load data
function initClient() {
  var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
  gapi.client.init({
    'apiKey': config.API_TOKEN,
    'clientId': config.CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    loadApiData();
  });
}

// Load data from Sheets API
function loadApiData() {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: config.SPREADSHEET_ID,
    // The A1 notation of the values to retrieve.
    range: '🚩 Official Filtered Word Bank'
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(function(response) {
    var reponseArray = response.result.values;
    // remove first value
    reponseArray.shift();

    // convert to Word objects
    var words = []
    reponseArray.forEach((word, i) => {
      words.push(Object.assign(new Word(word[1], word[2], word[3], word[6])))
    });

    // assign to word bank, sorted alphabetically
    wordBank = words.sort(function(a, b) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    })

    // display html
    completeDictionaryHTML = getHTMLForAllLetters()
    $("#dictionary").html(completeDictionaryHTML);

  }, function(reason) {
    console.error('error: ' + reason.result.error.message);
  });
}
