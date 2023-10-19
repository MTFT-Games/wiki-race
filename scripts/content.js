// Add buttons to start race
const buttonFromHere = document.createElement("button");
const buttonToHere = document.createElement("button");
const buttonRandom = document.createElement("button");
buttonFromHere.textContent = "Race from here";
buttonToHere.textContent = "Race to here";
buttonRandom.textContent = "Race random";

const infoContainer = document.createElement("dir");
const raceInfo = document.createElement("p");
const timeInfo = document.createElement("p");
infoContainer.appendChild(raceInfo);
infoContainer.appendChild(timeInfo);

let startTime;
let injected = false;

document.querySelector("#vector-page-tools").appendChild(buttonFromHere);
document.querySelector("#vector-page-tools").appendChild(buttonToHere);
document.querySelector("#vector-page-tools").appendChild(buttonRandom);


// Display data about current race if one is active
// TODO: ask service worker for details

chrome.runtime.sendMessage({ type: 'startup' }).then((initialInfo) => {
    console.log(initialInfo);
if (initialInfo.show) {
    raceInfo.textContent = "Racing from " + initialInfo.startPage.title + " to " + initialInfo.endGoal.title;
    if (initialInfo.startTime) {
        startTime = initialInfo.startTime;
        const timesince = Date.now() - startTime;
        timeInfo.textContent = Math.trunc(timesince/1000/60) + ":" + timesince/1000%60;

        setInterval(() => {const timesince = Date.now() - startTime; timeInfo.textContent = Math.trunc(timesince/1000/60) + ":" + timesince/1000%60;},1);
    }else{
        const timesince = initialInfo.finalTime;
        timeInfo.textContent = Math.trunc(timesince/1000/60) + ":" + timesince/1000%60;
    }
    injectInfo();
}});

function injectInfo(){
    if (injected) {
        return;
    }
    document.querySelector("#content").insertBefore(infoContainer, document.querySelector("#content > header"));
    injected = true;
}

buttonFromHere.onclick = async () => {

    // Get the random end point because the service worker cant parse the title from it
    const endGoal = await getPage("https://en.wikipedia.org/wiki/Special:Random");

    // Tell the service worker we want to start here and end at the given url
    const response = await chrome.runtime.sendMessage({ type: 'start_here', endGoal });

    // It will get us the title of the current page.

    raceInfo.textContent = "Racing from " + response.startTitle + " to " + endGoal.title;
    timeInfo.textContent = "0:0.0";
    injectInfo();
    startTime = Date.now();
    setInterval(() => {const timesince = Date.now() - startTime; timeInfo.textContent = Math.trunc(timesince/1000/60) + ":" + timesince/1000%60;},1);
};

buttonToHere.onclick = async () => {

    // Get the random end point because the service worker cant parse the title from it
    const startPage = await getPage("https://en.wikipedia.org/wiki/Special:Random");

    // Tell the service worker we want to start here and end at the given url
    const response = await chrome.runtime.sendMessage({ type: 'end_here', startPage });

    // It will get us the title of the current page.
    console.log("navigating");
    window.location.href = startPage.url;
};

buttonRandom.onclick = async () => {

    // Get the random end point because the service worker cant parse the title from it
    const startPage = await getPage("https://en.wikipedia.org/wiki/Special:Random");
    const endGoal = await getPage("https://en.wikipedia.org/wiki/Special:Random");


    // Tell the service worker we want to start here and end at the given url
    const response = await chrome.runtime.sendMessage({ type: 'rand', startPage, endGoal });

    // It will get us the title of the current page.
    console.log("navigating");
    window.location.href = startPage.url;
};

const getPage = async (url) => {  
    console.log("Getting page info");
    const response = await fetch(url);
    const finalUrl = response.url;
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelectorAll('title')[0].innerText;
    return {url: finalUrl, title};      
  };
  
