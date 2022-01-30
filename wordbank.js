/**
 * wordbank.js
 *
 * read/write to word bank
 *
 * @author Emma Anderson
 *
 */

let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
let wordBank = []
let completeDictionaryHTML = ""
let searchBank = []


$(document).ready(function(){
  loadFile();
});

/*
|--------------------------------------------------------------------------
| Data Loading
|--------------------------------------------------------------------------
|
| Load data from wordbank csv
|
|
*/

function loadFile() {
  $.get( "wordbank.csv", function(csvData) {
        data = $.csv.toObjects(csvData);

        // convert to Word objects
        var words = []
        data.forEach((word, i) => {
          words.push(Object.assign(new Word(word.romaji, word.hiragana, word.definition, word.author)))
        });

        // assign to word bank, sorted alphabetically
        wordBank = words.sort(function(a, b) {
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        })

        // display html
        completeDictionaryHTML = getHTMLForAllLetters()
        $("#dictionary").html(completeDictionaryHTML);
    });
}




/*
|--------------------------------------------------------------------------
| Data Parsing
|--------------------------------------------------------------------------
|
| Read and update from wordbank data
|
|
*/

function getHTMLForAllLetters() {
  htmlStr = ""
  var i = 0,
	arrLen = alphabet.length - 1
  for (; i <= arrLen; i++ ) {
    htmlStr += getHTMLForLetter(alphabet[i], false)
  }
  return htmlStr
}

function getHTMLForLetter(letter, isMobileView) {
  let upperCasedLetter = letter.toUpperCase()
  var headerHtml = '<h1 id="' + upperCasedLetter +'">' + upperCasedLetter + '</h1><br><br>';
  let words = wordBank.filter(word => String(word.title.toLowerCase()).startsWith(letter))
  return headerHtml += getHTMLContentFor(words, isMobileView)
}

function getHTMLContentFor(arrayOfWords, isMobileView) {
  let htmlStr = ""
  var i = 0, arrLen = arrayOfWords.length - 1
  for (; i <= arrLen; i++ ) {
    let isEvenIndex = i%2==0
    let hasNoNeighbor = ((i == arrLen) && isEvenIndex)

    if(isEvenIndex && !isMobileView && !hasNoNeighbor) {
      htmlStr += '<div class="flex-container">'
    }

    htmlStr += '<div class="flex-child">'
    htmlStr += '<p class="wordTitle">' + arrayOfWords[i].title + '&nbsp;&nbsp;&nbsp;</p>'
    htmlStr += '<input class="volume" type="image" src="icons/volumeLight.png" onclick="audioClicked(this)"/>'
    htmlStr += '<p class="wordHiragana">' + arrayOfWords[i].hiragana + '</p><br>'
    htmlStr += '<p class="wordDefinition">' + arrayOfWords[i].definition + '</p><br>'
    htmlStr += '<p class="wordAuthor">Submission by ' + arrayOfWords[i].author + '</p><br>'
    htmlStr += '<hr class="separator">'
    htmlStr += '</div>'

    if(!isEvenIndex && !isMobileView && !hasNoNeighbor) {
      htmlStr += '</div>'
    }
    htmlStr += '<br><br>'
  }
  return htmlStr
}

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
|
| Search word bank
|
|
*/

function searchDictionary() {
    let input = document.getElementById('searchInput').value

    if (input == "") {
      $("#dictionary").html(completeDictionaryHTML);
    } else {
      input=input.toLowerCase();

      searchBank = wordBank.filter(word =>
        word.title.toLowerCase().includes(input) ||
        word.definition.toLowerCase().includes(input) ||
        word.hiragana.includes(input)
      )

      let filteredHTML = getHTMLContentFor(searchBank, false)
      $("#dictionary").html(filteredHTML);
    }
}


/*
|--------------------------------------------------------------------------
| Word Object
|--------------------------------------------------------------------------
|
| Class represenation of dictionary words.
|
|
*/

/**
 * Class represenation of Uchinaaguchi Dictionary words.
 *
 * Word {title: "kwacchii", hiragana: "くゎっちー", definition: "feast", author: "Sherry Schafer"}
 *
 * @param {string} title The title of the word in romaji.
 * @param {string} hiragana The hiragana spelling of the word.
 * @param {string} definition The definition of the word in English.
 * @param {string} author The author of the word submission.
 *
 */
class Word {
  constructor(title, hiragana, definition, author) {
    this.title = title
    this.hiragana = hiragana
    this.definition = definition
    this.author = author
  }
}

/*
|--------------------------------------------------------------------------
| Audio
|--------------------------------------------------------------------------
|
|
|
|
*/

function audioClicked(image) {
  if (image.src.indexOf("icons/volumeLight.png")>-1) {
        image.src = "icons/volumeLightClicked.png";
    } else {
        image.src = "icons/volumeLight.png";
    }
}
