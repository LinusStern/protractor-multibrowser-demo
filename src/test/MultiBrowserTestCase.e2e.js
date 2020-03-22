var PMB = require("protractor-multibrowser/protractor-multibrowser.js");

describe('Demo Test Suite', () => {
    beforeEach(() => {
        const awaitPageLoad = () => {
            browser.driver.manage().window().maximize();
            browser.get("https://angular.io/");
    
            // Wait for the page to fully load, defined by several conditions below
            const until = protractor.ExpectedConditions;
            browser.wait(until.urlContains("https://angular.io/"), 9999); // Wait for the browser url to match the one specified above
            browser.wait(until.visibilityOf(element(by.css("aio-footer"))), 9999); // Wait for the footer DOM element to appear, as it is one of the last things to render
        }

        awaitPageLoad();
    });

    it ('Demo Test Case With Control Flow', () => {
        /* MAIN BROWSER
         * Here is the main browser instance defined in the conf.js file in the project root folder
         * In this demo it is a local instance of Chrome, but could be one of many browser/OS combinations specified in a multiCapabilities property intended for integration with a cross browser automation service
         * While using the main browser locators are written in the following manner: element(<locator>)
        */
        
        // Click on the Get Started button and wait for new content to appear
        const until = protractor.ExpectedConditions, getStartedButton = element(by.css('#intro > div.homepage-container > a'));
        browser.wait(until.elementToBeClickable(getStartedButton), 5000);
        getStartedButton.click();
        browser.wait(until.visibilityOf(element(by.css("#getting-started-with-angular-your-first-app"))), 5000);

        /* AUXILIARY BROWSER
         * Now imagine this is an integration test where we have to do something on a different site, which does not work in Chrome (or more realistically legacy browsers)
         * Open up an auxiliary browser as part of this unified test case, in a supported browser like Firefox
         * While using the auxiliary browser locators are written in the following manner: auxBrowser.element(<locator>)
        */

        /**
         * Default auxiliary browser configuration object, use as an example for creating your own but with the following caveats:
         * Always omit the *specs* property, as the auxiliary browser is not required to initiate any test case executions itself.
         * Use the *capabilities* property instead of *multiCapabilities* as running more than one browser/OS combination is not relevant.
         */
        const defaultAuxConf = {
            baseUrl: 'https://www.protractortest.org/#/', exclude: [], framework: 'jasmine2',
            allScriptsTimeout: 60000,
            jasmineNodeOpts: { showTiming: true, showColors: false, isVerbose: true, includeStackTrace: false, defaultTimeoutInterval: 60000 }, 
            directConnect: true,
            capabilities: { 'browserName': 'firefox', 'unexpectedAlertBehaviour': 'accept' },  
            useAllAngular2AppRoots: false
        }
        
        const auxBrowser = PMB.initAuxBrowser(
            defaultAuxConf.baseUrl, // The starting url (provide a string in the event a baseUrl is not specified in the conf object)
            defaultAuxConf, // Configuration object for the new browser instance
            true, // Set to true when the intended site is not made with Angular
            PMB.windowLayouts.MAXIMIZE // Determine the layout of the browsers on the screen (optional)
        );
        PMB.runAuxBrowser(
            auxBrowser, 
            () => {
                const until = protractor.ExpectedConditions, quickStartLink = auxBrowser.element(by.id("drop1"));
                quickStartLink.click();
                auxBrowser.sleep(250); // Not required - this is just to delay long enough for the user to see what is happening
                quickStartLink.element(by.xpath("..")).element(by.css("ul > li:nth-of-type(1) > a")).click();   
                auxBrowser.wait(until.visibilityOf(
                    auxBrowser.element(by.id("tutorial"))
                ));
                auxBrowser.sleep(2500); // Not required - this is just to delay long enough for the user to see what is happening
            }, 
            35000
        );

        /* MAIN BROWSER
         * Now that we're done with the auxiliary browser, continue with the main browser
        */
        
        element(by.css("aio-shell > div.toc-container > aio-lazy-ce > aio-toc > div > ul > li:last-of-type > a")).click();
        browser.sleep(2000);
    });
    
    it ('Demo Test Case With Async/Await', async () => {
        // MAIN BROWSER >>
        const until = protractor.ExpectedConditions, getStartedButton =  element(by.css("#intro > div.homepage-container > a"));
        browser.wait(until.elementToBeClickable(getStartedButton), 5000);
        getStartedButton.click();
        browser.wait(until.visibilityOf(element(by.css("#getting-started-with-angular-your-first-app"))), 5000);

        const defaultAuxConf = {
            baseUrl: 'https://www.protractortest.org/#/', exclude: [], framework: 'jasmine2',
            allScriptsTimeout: 60000,
            jasmineNodeOpts: { showTiming: true, showColors: false, isVerbose: true, includeStackTrace: false, defaultTimeoutInterval: 60000 }, 
            directConnect: true,
            capabilities: { 'browserName': 'firefox', 'unexpectedAlertBehaviour': 'accept' },  
            useAllAngular2AppRoots: false,
            SELENIUM_PROMISE_MANAGER: false // Disable in favour of ES7 async/await
        }

        // AUX BROWSER >>
        const auxBrowser = PMB.initAuxBrowser(defaultAuxConf.baseUrl, defaultAuxConf, true, PMB.windowLayouts.MAXIMIZE);
        PMB.runAuxBrowserAsync(
            auxBrowser,
            async () => {
                const quickStartLink = auxBrowser.element(by.id("drop1"));
                quickStartLink.click();
                auxBrowser.sleep(250); // Not required - this is just to delay long enough for the user to see what is happening
                quickStartLink.element(by.xpath("..")).element(by.css("ul > li:nth-of-type(1) > a")).click(); 
                await auxBrowser.element(by.id("tutorial"));
                auxBrowser.sleep(2500); // Not required - this is just to delay long enough for the user to see what is happening
            },
            25000
        );

        // MAIN BROWSER >>
        element(by.css("aio-shell > div.toc-container > aio-lazy-ce > aio-toc > div > ul > li:last-of-type > a")).click();
        browser.sleep(2000);
    });
});