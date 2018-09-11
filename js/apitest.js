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
