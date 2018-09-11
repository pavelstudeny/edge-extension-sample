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
  specStarted: function () {},
  suiteDone: function () {},
  suiteStarted: function () {}
});
