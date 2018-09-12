var _currentTest = null;
var _currentSuite = null;
function performOnBackground() {
  return new Promise(function (resolve) {
    browser.runtime.sendMessage({type: 'runtest', id: { suite: _currentSuite.description, test: _currentTest.description } }, resolve);
  });
}

describe('jasmine', function () {
  it('runs a sync test', function () {
    expect(true).toBeTruthy();
  });
  
  it('runs an async test', function (done) {
    setTimeout(function () {
      expect(true).toBeTruthy();
      done();
    }, 0);
  });
});

describe('runtime', function () {
  it('receives a sendMessage callback', function (done) {
    browser.runtime.sendMessage({type: 'ping'}, function (result) {
      expect(result).toBe('pong');
      done();
    });
  });

  it('returns manifest', async function () {
    var result = await performOnBackground();
    expect(result.version).toBeDefined();
  });
});

describe('tabs', function () {
  it('queries by url', async function () {
    var result = await performOnBackground();
    var myUrl = window.location.href;
    expect(result).toEqual(jasmine.arrayContaining([jasmine.objectContaining({ url: myUrl })]));
  });

  it('sends messages to tabs', function () {
    return new Promise(function (resolve) {
      browser.runtime.onMessage.addListener(function (message) {
        expect(message).toEqual(jasmine.objectContaining({ type: 'bing' }));
        resolve();
      });

      performOnBackground();
    });
  });

  it('gets a tab by id', async function () {
    var result = await performOnBackground();
    expect(result).toBe(true);
  });
});

describe('i18n', function () {
  it('returns browser language', function () {
    var lang = browser.i18n.getUILanguage();
    expect(lang).toMatch(/[a-z]{2}(_[0-9A-Za-z]+)?/);
  });

  it('translates a string', function () {
    var str = browser.i18n.getMessage('product_name');
    expect(str).toBe('Hello World');
  });
});




jasmine.getEnv().addReporter({
  jasmineDone: function () {
    var button = document.createElement('button');
    button.innerText = 'reload extension'
    button.addEventListener('click', function () {
      var loader = document.createElement('div');
      loader.classList.add('loader');
      this.appendChild(loader);

      browser.runtime.sendMessage({type: 'reload'});
      setTimeout(function () {
        location.reload();
      }, 2000);
    });
    button.style.borderColor = '#007069';
    button.style.borderStyle = 'solid';
    button.style.color = '#007069';
    button.style.backgroundColor = '#bababa';
    button.style.height = '2em';
    document.body.appendChild(button);
  },
  jasmineStarted: function () {},
  specDone: function () {},
  specStarted: function (desc) { _currentTest = desc; },
  suiteDone: function () {},
  suiteStarted: function (desc) { _currentSuite = desc; }
});
