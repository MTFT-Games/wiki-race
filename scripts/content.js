let chom = document.createElement("a");
chom.textContent = "Race";

document.querySelector("#vector-main-menu").appendChild(chom);

// chrome examples just chrome.runtime.sendmessage and presumably have a service worker handle it...
// so now i need to make one of those. or figure out an easier way to get a tabid

// apparently with the tabs permission, i can 'very easily' run this query to get it.

// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
//   }

  chom.onclick = () => chrome.runtime.sendMessage({ type: 'open_side_panel' });


  // Fuck
  // I cant do that. I need to have a service worker do that aaaaaaaaaaaaaaaaaaaaaaaahhhhhh