// background.js


/*

Background Script
The background script is the extension's event handler; 
it contains listeners for browser events that are important to the extension. 
It lies dormant until an event is fired then performs the instructed logic. 
An effective background script is only loaded when it is needed and unloaded when it goes idle.

*/


// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
  });


/*
This sends an arbitrary JSON payload to the current tab. The keys of the JSON payload can be anything, 
but I chose "message" for simplicity. Now we need to listen for that message in content.js
*/

// This block is new!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "open_new_tab" ) {
        chrome.tabs.create({"url": request.url});
      }
    }
  );

