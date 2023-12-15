document.addEventListener('DOMContentLoaded', function () {
  const showUrlsCheckbox = document.getElementById('showUrlsCheckbox');

  // Load the user's preference for showing URLs from storage.
  chrome.storage.sync.get('showUrls', function (data) {
    showUrlsCheckbox.checked = data.showUrls === true;
  });

  // Update the user's preference when the checkbox is changed.
  showUrlsCheckbox.addEventListener('change', function () {
    const showUrls = showUrlsCheckbox.checked;

    // Store the user's preference in Chrome storage.
    chrome.storage.sync.set({ 'showUrls': showUrls }, function () {
      // Send a message to the extension to notify it about the preference change.
      chrome.runtime.sendMessage({ action: 'updateShowUrlsPreference', showUrls: showUrls });
    });
  });
});
