const searchInput = document.getElementById("searchInput");
const BASE_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const searchHistoryList = document.getElementById("searchHistoryList");

// Function to add a search history item
const addSearchHistoryItem = (word) => {
  const listItem = document.createElement("li");
  listItem.textContent = word;
  searchHistoryList.appendChild(listItem);
};

// Event listener for search input
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  // Perform the search and then add the search term to the history
  addSearchHistoryItem(searchTerm);
});

   const getCountry = (audioLink) => {
            if (audioLink.indexOf("uk") > -1) {
                return "UK";
            } else if (audioLink.indexOf("us") > -1) {
                return "US";
            } else if (audioLink.indexOf("au") > -1) {
                return "AU"
            }
        };

const render = (datas) => {
  console.log("datas", datas);
    for (let data of datas) {
        const wordWrapper = document.createElement("div");
        wordWrapper.id = "word-wrapper";
        const headerContainer = document.createElement("div");
        const phoneticContainer = document.createElement("div");
        const meaningContainer = document.createElement("div");
        meaningContainer.id = "meanings-wrapper"
        const title = document.createElement("h1");
        const type = document.createElement("p");
        title.textContent = data?.word ?? "";
        type.textContent = data?.meanings[0].partOfSpeech ?? "";
        headerContainer.appendChild(title);
        
        // add phonetics for each word
        if (data.phonetics) {
            for (let p of data.phonetics) {
                // create audio dom element to play mp3
                const soundFile = document.createElement("audio");
                soundFile.preload = "auto";
                const src = document.createElement("source");
                src.src = p.audio;
                soundFile.appendChild(src);
                const wrapperPhonetic = document.createElement("span")

                // add svg auido icon which play mp3 when it is clicked
                const svg = document.createElement("img");
                svg.src = "https://img.icons8.com/ios-glyphs/512/high-volume.png"
                svg.style.width = "12px";
                svg.style.fontWeight = "bold";
                svg.style.marginLeft = "3px";
                svg.style.marginRight = "10px";
                wrapperPhonetic.style.marginRight = "10px";
                svg.onclick = () => {
                    //Set the current time for the audio file to the beginning
                    soundFile.currentTime = 0.01;
                    //Due to a bug in Firefox, the audio needs to be played after a delay
                    setTimeout(function(){soundFile.play();},1);
                };
                // create dom element for country and phonetic text
                const phoneticTextElement = document.createElement("span");
                const country = document.createElement("span");
                phoneticTextElement.textContent = p.text;
                country.textContent = getCountry(p.audio) ?? "";
                country.style.fontWeight = "bold";
                
                // wrap all the elements with div
                if (p.audio) {
                    wrapperPhonetic.appendChild(country);
                    wrapperPhonetic.appendChild(soundFile);
                    wrapperPhonetic.appendChild(svg);
                    wrapperPhonetic.appendChild(phoneticTextElement);
                }
                phoneticContainer.appendChild(wrapperPhonetic);
            }
        }
        // render each meanings
        if (data.meanings.length) {
            for (let meaning of data.meanings[0].definitions) {
                // create dom element to show definition and example of a meaning of a word
                const definition = document.createElement("p");
                definition.id = "definition"
                const example = document.createElement("p");
                example.id= "example"
                definition.innerText = meaning.definition
                example.innerText = meaning.example
                meaningContainer.appendChild(definition);
                meaningContainer.appendChild(example);
            }
        }
        // render all the elements on the screen
        wordWrapper.appendChild(headerContainer);
        wordWrapper.appendChild(type);
        wordWrapper.appendChild(phoneticContainer)
        wordWrapper.appendChild(meaningContainer)
        container.appendChild(wordWrapper);
    }
};

// fetch data from free dictionary web api
const search = (event) => {
  if (event.target.value) {
      fetch(`${BASE_API_URL}${event.target.value}`)
          .then((res) => res.json())
          .then((datas) => render(datas))
          .catch((err) => console.warn("Something went wrong!", err))
  }
};

// create debounce method to make sure that search method 
// is triggered only once per user input
const debounce = (callback, duration = 500) => {
    let timeout;
    return (argument) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(argument), duration);
    }
};

const debouncedSearchInput = debounce(search);

// searches for a word
searchInput.addEventListener("input", debouncedSearchInput);


// Assuming you have an array of words for the "Word of the Day"
function fetchWordOfTheDay() {
  const wordOfTheDayElement = document.getElementById("wordOfTheDay");
  const wordOfTheDayMeaningElement = document.getElementById("wordOfTheDayMeaning");

  // Replace this with your actual Word of the Day API endpoint
  const wordOfTheDayAPI = 'https://your-word-of-the-day-api.com';

  fetch(wordOfTheDayAPI)
    .then((response) => response.json())
    .then((data) => {
      // Assuming the API returns an object with 'word' and 'meaning' properties
      const wordOfTheDay = data.word;
      const meaningOfTheDay = data.meaning;

      wordOfTheDayElement.textContent = wordOfTheDay;
      wordOfTheDayMeaningElement.textContent = `Meaning of the Word of the Day: ${meaningOfTheDay}`;
    })
    .catch((error) => {
      console.error('Error fetching Word of the Day:', error);
      wordOfTheDayElement.textContent = 'Error fetching Word of the Day';
      wordOfTheDayMeaningElement.textContent = '';
    });
}

// Call the fetchWordOfTheDay function when the page loads
document.addEventListener("DOMContentLoaded", function () {
  fetchWordOfTheDay();
});

  
// Function to open a new window with a specific URL
function openNewWindow() {
    const newWindow = window.open('index.html', '_blank');
  }
function navigateTo(page) {
    // Redirect to the specified page when a button is clicked
    window.location.href = page;
  }

// Function to search for definitions when the "Search" button is clicked
function searchDefinition() {
  const searchTerm = searchInput.value;
  if (searchTerm) {
    // Perform the search and then add the search term to the history
    addSearchHistoryItem(searchTerm);

    fetch(`${BASE_API_URL}${searchTerm}`)
      .then((res) => res.json())
      .then((datas) => render(datas))
      .catch((err) => console.warn("Something went wrong!", err));
  }
}

// Add an event listener to the "Search" button
const searchButton = document.querySelector("button");
searchButton.addEventListener("click", searchDefinition);

// Function to fetch synonyms
function fetchSynonyms(word) {
  const apiUrl = `${BASE_API_URL}${word}`;
  
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data[0] && data[0].meanings && data[0].meanings[0].synonyms) {
        const synonyms = data[0].meanings[0].synonyms;
        console.log('Synonyms:', synonyms);
        // Handle synonyms, e.g., display them on the page
      } else {
        console.log('No synonyms found for the word.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Function to fetch antonyms
function fetchAntonyms(word) {
  const apiUrl = `${BASE_API_URL}${word}`;
  
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data[0] && data[0].meanings && data[0].meanings[0].antonyms) {
        const antonyms = data[0].meanings[0].antonyms;
        console.log('Antonyms:', antonyms);
        // Handle antonyms, e.g., display them on the page
      } else {
        console.log('No antonyms found for the word.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Usage: Fetch synonyms and antonyms for the word "digital"
fetchSynonyms(word);
fetchAntonyms(word);

var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');

let pathName = path.join(__dirname, 'Files');

btnCreate.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;

    fs.writeFile(file, contents, function (err) {
        if (err) {
            return console.log(err);
        }
        var txtfile = document.getElementById("fileName").value;
        alert(txtfile + " text file was created");
        console.log("The file was created");
    });
});

btnRead.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.readFile(file, function (err, data) {
        if (err) {
            return console.log(err);
        }
        fileContents.value = data;
        console.log("The file was read!");
    });
});

btnDelete.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.unlink(file, function (err) {
        if (err) {
            return console.log(err);
        }
        fileName.value = "";
        fileContents.value = "";
        console.log("The file was deleted!");
    });
});

btnUpdate.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    let contents = fileContents.value;

    fs.writeFile(file, contents, function (err) {
        if (err) {
            return console.log(err);
        }
        var txtfile = document.getElementById("fileName").value;
        alert(txtfile + " text file was updated");
        console.log("The file was updated");
    });
});

