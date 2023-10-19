let sidepanelTab;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {
      if (message.type === 'open_side_panel') {
        // This will open a tab-specific side panel only on the current tab.
        await chrome.sidePanel.open({ tabId: sender.tab.id });
        // await chrome.sidePanel.setOptions({
        //   tabId: sender.tab.id,
        //   path: 'sidepanel.html',
        //   enabled: true
        // });
        sidepanelTab = sender.tab;
      }
      if (message.type == 'start_here'){
          const title = (await getCurrentTab()).title;
        sendResponse({'title': title});

      }
    })();
    return true;
  });

  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }