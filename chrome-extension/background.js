
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (~tab.url.indexOf('www.facebook.com') && changeInfo.status=='complete') {
    chrome.pageAction.show(tabId);
    //console.log('on updated');
    chrome.tabs.sendMessage(tabId, {type: 'getDoc'}, function (doc) {
        //console.log(doc);
    });
  }

});

chrome.pageAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(null,{file:"myscript.js"});
});
