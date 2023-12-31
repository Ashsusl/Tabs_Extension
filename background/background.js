// This array will store information about open tabs.
let openTabs = [];

// Function to add a tab to the openTabs array.
function addTab(tab) {
  openTabs.push({
    tabId: tab.id,
    url: tab.url,
    title: tab.title, // Add the tab title
  });
}

// Function to remove a tab from the openTabs array.
function removeTab(tabId) {
  const tabIndex = openTabs.findIndex((tab) => tab.tabId === tabId);
  if (tabIndex !== -1) {
    openTabs.splice(tabIndex, 1);
  }
}

// Initialize openTabs with currently open tabs.
chrome.tabs.query({}, function (tabs) {
  tabs.forEach(function (tab) {
    addTab(tab);
  });
});

// Listen for tab creation events.
chrome.tabs.onCreated.addListener(function (tab) {
  addTab(tab);
});

// Listen for tab removal events.
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  removeTab(tabId);
});

// Expose the openTabs array to other scripts if needed.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getOpenTabs') {
    sendResponse(openTabs);
  }
});

// Function to handle user preferences for showing URLs
function handleUserPreference(request, sendResponse) {
  if (request.action === 'getShowUrlsPreference') {
    chrome.storage.sync.get('showUrls', function (data) {
      const showUrls = data.showUrls === true;
      sendResponse(showUrls);
    });
  } else if (request.action === 'setShowUrlsPreference') {
    chrome.storage.sync.set({ 'showUrls': request.showUrls });
  }
}

// Function to refresh and update the list of open tabs
function refreshTabsList() {
  chrome.tabs.query({}, function (tabs) {
    openTabs = tabs.map((tab) => ({
      tabId: tab.id,
      url: tab.url,
      title: tab.title,
    }));
  });
}

// Create an alarm to periodically refresh the list of open tabs
chrome.alarms.create('tabRefreshAlarm', { periodInMinutes: 0.25 }); // Adjust the refresh interval as needed

// Listen for the alarm to refresh tabs
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tabRefreshAlarm') {
    refreshTabsList();
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'getOpenTabs') {
    sendResponse(openTabs);
  } else {
    handleUserPreference(request, sendResponse);
  }
});