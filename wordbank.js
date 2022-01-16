/**
 * wordbank.js
 *
 * file description
 *
 * @author Emma Anderson
 *
 */

const apiURL = "https://api.apispreadsheets.com/data/15904/"

// Retrieve words from API, convert them to Word objects, and log them in the console
async function logWords() {
  let data = await getDataFromAPI()
  let words = getWordsFromData(data)
  console.log(words)
}

// Retrieve words from API
async function getDataFromAPI() {
  const response = await fetch(apiURL)
  const data = await response.json()
  return data.data
}

// Convert API data into Word objects
function getWordsFromData(data) {
  var wordBank = []
  data.forEach((word, i) => {
    wordBank.push(Object.assign(new Word(word.word, word.hiragana, word.definition, word.author)))
  });
  return wordBank
}

/**
 * Class represenation of Uchinaaguchi Dictionary words.
 *
 * @param {string} title The title of the word in English.
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
