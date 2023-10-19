let endGoal;
let startTime;
let startPage;
let finalTime;
let loaded = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {
        if (message.type == 'start_here'){
            console.log("Starting from current page");

            finalTime = 0;
            chrome.storage.session.set({finalTime: 0});

            const currentTab = await getCurrentTab();
            startPage = {title: currentTab.title, url: currentTab.url};
            chrome.storage.session.set({startPage: {title: currentTab.title, url: currentTab.url}});

            endGoal = message.endGoal;
            chrome.storage.session.set({endGoal: message.endGoal});

            
            startTime = Date.now();
            chrome.storage.session.set({startTime});

            console.log("Saved start, end, and start time");
            console.log(startPage);
            console.log(endGoal);
            console.log(startTime);

            loaded = true;
            sendResponse({startTitle: startPage.title});
        }
        if (message.type == 'end_here'){
            console.log("ending at current page");

            finalTime = 0;
            chrome.storage.session.set({finalTime: 0});

            const currentTab = await getCurrentTab();
            endGoal = {title: currentTab.title, url: currentTab.url};
            chrome.storage.session.set({endGoal: {title: currentTab.title, url: currentTab.url}});

            startPage = message.startPage;
            chrome.storage.session.set({startPage: message.startPage});

            
            startTime = Date.now();
            chrome.storage.session.set({startTime});

            console.log("Saved start, end, and start time");
            console.log(startPage);
            console.log(endGoal);
            console.log(startTime);

            loaded = true;
            sendResponse();
        }
        if (message.type == 'rand'){
            console.log("ending at rand page");

            finalTime = 0;
            chrome.storage.session.set({finalTime: 0});

            endGoal = message.endGoal;
            chrome.storage.session.set({endGoal: message.endGoal});

            startPage = message.startPage;
            chrome.storage.session.set({startPage: message.startPage});

            
            startTime = Date.now();
            chrome.storage.session.set({startTime});

            console.log("Saved start, end, and start time");
            console.log(startPage);
            console.log(endGoal);
            console.log(startTime);

            loaded = true;
            sendResponse();
        }
        if (message.type == "startup") {
            if (!loaded) {
                let chom = await chrome.storage.session.get();
                endGoal = chom.endGoal;
                startTime = chom.startTime;
                startPage = chom.startPage;
                finalTime = chom.finalTime;
                loaded = true;
            }
            if (finalTime) {
                // Race won
                sendResponse({show: true, endGoal, startPage, finalTime});
                finalTime = null;
                startTime = null;
                chrome.storage.session.set({startTime});
                chrome.storage.session.set({finalTime});
            }
            else if (!startTime) {
                // no race
                sendResponse({show: false});
            }
            else {
                // Active race
                sendResponse({show: true, startTime, endGoal, startPage});
            }
        }
    })();
    return true;
  });

chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (!loaded) {
        let chom = await chrome.storage.session.get();
        endGoal = chom.endGoal;
        startTime = chom.startTime;
        startPage = chom.startPage;
        finalTime = chom.finalTime;
        loaded = true;
    }
    //console.log(details.url);
    if (startTime && endGoal && !finalTime && details.url == endGoal.url) {
        console.log("WIN.");
        finalTime = Date.now() - startTime;
        chrome.storage.session.set({finalTime});

        // TODO: Save scores so action can show them later
    }
});

  async function getCurrentTab() { // Now that i think about it i think theres a much easier way to do this but too late now
    console.log("Getting current tab");
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
