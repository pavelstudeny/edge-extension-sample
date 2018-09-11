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
  switch (message.type) {
  case 'ping':
    sendResponse('pong');
    break;
  case 'reload':
    browser.runtime.reload();
    break;
  }

});
