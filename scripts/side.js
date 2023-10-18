let endGoal = "";
let startPoint = "";
let startTime = Date.now();
let endTime = Date.now();

document.querySelector("#startHere").onclick = async () => {
    const response = await chrome.runtime.sendMessage({ type: 'start_here' }); 
    console.log(response.title);
    document.querySelector("#startPoint").textContent = "Start point: " + response.title;
    startPoint = response.title;
    startTime = Date.now() - 3000;
    document.querySelector("#Time").textContent = "Time: We'll figure this out later";
    endGoal = await getTitle("https://en.wikipedia.org/wiki/Special:Random");
    document.querySelector("#endGoal").textContent = "End point: " + endGoal;

    // get a random end point and start timer with 5 seconds extra or as soon as focus leaves sidebar again
}

const getTitle = (url) => {  
    return fetch(`${url}`)
      .then((response) => response.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const title = doc.querySelectorAll('title')[0];
        return title.innerText;
      });
  };