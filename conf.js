exports.config = {
    // Project settings
    baseUrl: 'http://ptp.psychometrics.com/admin/',
    specs: [ 'src/test/*.e2e.js' ], // Run all scripts in the given file path with the .e2e.js extension
    exclude: [],
    framework: 'jasmine2',

    // Test case settings
    allScriptsTimeout: 60000,
    jasmineNodeOpts: {
        showTiming: true,
        showColors: false,
        isVerbose: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 60000
    },

    /**
     * Use either local testing or live testing (through a service such as *BrowserStack Automate* or *CrossBrowserTesting*)
     */
    directConnect: true,
    capabilities: {
        'browserName': 'chrome',
        'unexpectedAlertBehaviour': 'accept'
    },

    /**
     * Disable Angular specific behaviours for max site compatibility
     * Not required if the accessed sites are only built with Angular
     */
    onPrepare: () => {
        browser.ignoreSynchronization = true;
        browser.waitForAngularEnabled(false);
    },
    useAllAngular2AppRoots: false
}