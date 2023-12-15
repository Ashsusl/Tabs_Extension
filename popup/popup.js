document.addEventListener('DOMContentLoaded', function () {
  let showUrls = true; // Set to true to show URLs by default
  let openTabs = [];

  // Function to display open tabs
  function displayOpenTabs(tabs) {
    const tabList = document.getElementById('tabList');
    tabList.innerHTML = '';

    tabs.forEach(function (tab) {
      const tabBox = document.createElement('div');
      tabBox.className = 'tab-box-vertical';

      const tabName = document.createElement('div');
      tabName.textContent = truncateText(tab.title, 35); // Truncate to 25 characters
      tabName.className = 'tab-name';

      const tabURL = document.createElement('div');
      tabURL.textContent = showUrls ? truncateText(tab.url, 65) : ''; // Truncate to 50 characters
      tabURL.className = 'tab-url';

    //   const goToTabButton = document.createElement('div');
    //  // goToTabButton.textContent = 'Go To Tab';
    //   goToTabButton.className = 'go-to-tab-button';
    //   goToTabButton.addEventListener('click', function () {
    //     navigateToTab(tab.tabId);
    //   });

          // Attach a click event listener to the tab element
          tabBox.addEventListener('click', function () {
            navigateToTab(tab.tabId);
          });

      tabBox.appendChild(tabName);
      tabBox.appendChild(tabURL);
      // tabBox.appendChild(goToTabButton);
      tabList.appendChild(tabBox);
    });
  }

  // Function to toggle showing URLs
  function toggleShowUrls() {
    showUrls = !showUrls; // Toggle the state
    chrome.runtime.sendMessage({ action: 'setShowUrlsPreference', showUrls });
    displayOpenTabs(openTabs);
  }

  // Handle "Show URLs" button click event
  const toggleUrlsButton = document.getElementById('toggle-urls');
  toggleUrlsButton.addEventListener('click', toggleShowUrls);

  // Function to retrieve open tabs and display them
  function getOpenTabsAndDisplay() {
    chrome.runtime.sendMessage({ action: 'getOpenTabs' }, function (response) {
      openTabs = response;
      displayOpenTabs(openTabs);
    });
  }

  // Code to open the options page when the button is clicked
  const goToOptionsButton = document.getElementById('go-to-options');
  goToOptionsButton.addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('Options/options.html'));
    }
  });

  // Request open tabs and display them when the popup is opened
  getOpenTabsAndDisplay();

  // Function to truncate text and add an ellipsis if it's too long
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...'; // Add ellipsis
    }
    return text;
  }

  // Function to navigate to a specific tab by tabId
  function navigateToTab(tabId) {
    chrome.tabs.update(tabId, { active: true }, function (tab) {
      // Focus on the tab's window
      chrome.windows.update(tab.windowId, { focused: true });
    });
  }
});
