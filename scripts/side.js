let startTime = Date.now();
let endTime = Date.now();
const startText = document.querySelector("#startPoint");
const endText = document.querySelector("#endGoal");
const timeText = document.querySelector("#Time");
const listText = document.querySelector("#list");

document.querySelector("#startHere").onclick = async () => {
    console.log("Starting from current page");

    // Get the random end point because the service worker cant parse the title from it
    const endGoal = await getPage("https://en.wikipedia.org/wiki/Special:Random");

    // Tell the service worker we want to start here and end at the given url
    const response = await chrome.runtime.sendMessage({ type: 'start_here', targetUrl: endGoal.url }); 

    // It will get us the title of the current page.
    console.log("Starting at: " + response.startTitle);
    console.log("Ending at: " + endGoal.title);

    startText.textContent = response.startTitle;
    endText.textContent = endGoal.title;
    console.log("UI start and end set");

    timeText.textContent = "We'll figure this out later";
    startTime = Date.now();
    console.log("Need to set UI timer");
    console.log("Start time: " + startTime);
}

const getPage = async (url) => {  
    console.log("Getting page info");
    const response = await fetch(url);
    const finalUrl = response.url;
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelectorAll('title')[0].innerText;
    return {url: finalUrl, title};      
  };

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type == "win"){
        // Calculate and display time
        const finalMilis = Date.now() - startTime;
        timeText.textContent = finalMilis/1000/60 + ":" + finalMilis/1000%60 + "." +finalMilis%1000;

        // Add to scores list
        listText.textContent += "<li>" + startText.textContent + " to " + endText.textContent + " in " + timeText.textContent + "</li>"
      }
    }
  );
