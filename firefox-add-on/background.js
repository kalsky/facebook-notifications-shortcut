
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  if (~tab.url.indexOf('github.com') && changeInfo.status=='complete') {
    browser.pageAction.show(tabId);
    //console.log('on updated');
    browser.tabs.sendMessage(tabId, {type: 'getDoc'}, function (doc) {
        //console.log('after sending');
    });
  }

});


browser.pageAction.onClicked.addListener((tab) => {
  //console.log('onClicked');
  browser.tabs.executeScript(null,{file:"myscript.js"});
});
