var _tests = {};
var _currentSuite = null;


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
  case 'runtest':
    return runtest(message.id, sender, sendResponse);
  }

});

browser.browserAction.onClicked.addListener(function() {
  browser.tabs.create({ url: 'https://pamcdn.avast.com/pamcdn/extensions/install/mac/blank.html' });
});


describe('runtime', function () {
  body('returns manifest', function () {
    return browser.runtime.getManifest();
  });
});

describe('tabs', function () {
  body('queries by url', function (sender) {
    return new Promise(function (resolve) {
      browser.tabs.query({ url: sender.tab.url }, resolve);
    });
  });

  body('sends messages to tabs', function (sender) {
    browser.tabs.sendMessage(sender.tab.id, { type: 'bing' });
  });

  body('gets a tab by id', async function (sender) {
    return new Promise(function (resolve) {
      browser.tabs.get(sender.tab.id, function (tab) {
        resolve(tab.id === sender.tab.id && tab.url === sender.tab.url);
      });
    });
  });
});




function describe(name, describeBody) {
  _tests[name] = {};
  _currentSuite = _tests[name];
  describeBody();
}

function body(whatItDoes, testBody) {
  _currentSuite[whatItDoes] = testBody;
}

function runtest(id, sender, sendResponse) {
  var res = _tests[id.suite][id.test](sender);
  if (typeof res.then === 'function') {
    res.then(sendResponse);
    return true;
  }
  sendResponse(res);
  return false;
}
