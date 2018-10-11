module.exports = {
  beforeEach: function () {
    console.log(123);
  },
  'search nightwatch on baidu': function (browser) {

    browser
      .url('http://localhost:8080')
      .waitForElementVisible('body', 1000)
    // browser.expect.element('#main').to.not.be.present


    

    // .setValue('#kw', 'nightwatch')
    // .click('#su')
    // .pause(3000)
    // .waitForElementVisible('#content_left', 3000)
    // .end();

    browser.end();
  }
};
