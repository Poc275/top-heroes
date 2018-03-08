describe('Protractor Demo Tests', function() {
  it('home page should have a title', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('Top C****!');
  });
});


describe('Card flip tests', function() {
	beforeEach(function() {
		browser.get('http://localhost:3000/#/auth/callback?user=poc275@gmail.com');
	});

	it('card should not be flipped initially', function() {
		var title = element(by.css('.md-headline'));

		expect(title.getText()).toEqual('Donald Trump');
	});

	it('card should flip when info button is clicked', function() {
		var infoButton = element(by.css('.md-icon-button'));
		infoButton.click();

		var title = element(by.css('.md-headline'));

		expect(title.getText()).toEqual('Biography');
	});
});