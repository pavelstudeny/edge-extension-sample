browser.browserAction.onClicked.addListener(function(tab) {
  fetch('http://localhost')
    .then(resp => {
      console.log('ok', resp.status, resp.statusText);
      return resp.text();
    })
    .then(body => console.log(body))
    .catch(err => console.log('error', err));
});

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'ping') {
    sendResponse('pong');
  }
});
