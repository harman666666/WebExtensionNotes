// content.js

/*

To inject the script, we need to tell our manifest.json file about it.

Add this to your manifest.json file:

"content_scripts": [
  {
    "matches": [
      "<all_urls>"
    ],
    "js": ["content.js"]
  }
]
This tells Chrome to inject content.js into every page we visit using the special <all_urls> URL pattern. 
If we want to inject the script on only some pages, we can use match patterns. 
Here are a few examples of values for "matches":
*/

// ["https://mail.google.com/*", "http://mail.google.com/*"] injects our script into HTTPS and HTTP Gmail. 
// If we have / at the end instead of /*, it matches the URLs exactly, and so 
// would only inject into https://mail.google.com/, not https://mail.google.com/mail/u/0/#inbox. Usually that isn’t what you want.
// http://*/* will match any http URL, but no other scheme. For example, this won’t inject your script into https sites.
// Reload your Chrome extension. Every single page you visit now pops up an alert. Let’s log the first URL on the page instead.


// alert("Hello from your Chrome extension!")

// content.js

/*
Note that we don’t need to use jQuery to check if the document has loaded. By default, Chrome injects content scripts after the DOM is complete.

Try it out - you should see the output in your console on every page you visit.

*/
var firstHref = $("a[href^='http']").eq(0).attr("href");

console.log(firstHref);

console.log($)

/*

In order to use the browser action, we need to add message passing.

Message passing

A content script has access to the current page, but is limited in the APIs it can access. 
For example, it cannot listen for clicks on the browser action. We need to add a different 
type of script to our extension, a background script, which has access to every Chrome API but cannot access the current page. As Google puts it:

Content scripts have some limitations. They cannot use chrome.* APIs, with the exception of extension, i18n, runtime, and storage.

So the content script will be able to pull a URL out of the current page, but will need to hand that URL over 
to the background script to do something useful with it. In order to communicate, we’ll use what Google calls 
message passing, which allows scripts to send and listen for messages. It is the only way for content 
scripts and background scripts to interact.

Add the following to tell manifest.json about the background script:

"background": {
  "scripts": ["background.js"]
}

*/


// content.js
// message passing
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        var firstHref = $("a[href^='http']").eq(0).attr("href");
  
        console.log(firstHref);

        /*

        // We can use the chrome.tabs API to open a new tab:

        // chrome.tabs.create({"url": "http://google.com"});
        
        But chrome.tabs can only be used by background.js, 
        so we’ll have to add some more message passing since background.js 
        can open the tab, but can’t grab the URL. Here’s the idea:

        Listen for a click on the browser action in background.js. 
        When it’s clicked, send a clicked_browser_action event to content.js.

        When content.js receives the event, it grabs the URL of the first 
        link on the page. Then it sends open_new_tab back to background.js 
        with the URL to open.
        
        background.js listens for open_new_tab and opens a new tab 
        with the given URL when it receives the message.

        Clicking on the browser action will trigger background.js, 
        which will send a message to content.js, which will send a 
        URL back to background.js, 
        which will open a new tab with the given URL.

        First, we need to tell content.js to send the URL to background.js. 
        Change content.js to use this code:


        
        */

       chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});

      }
    }
  );



