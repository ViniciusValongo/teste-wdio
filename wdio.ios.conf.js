/**
 * Configuração do WebDriverIO para iOS
 * Para usar esta configuração, execute: wdio run wdio.ios.conf.js
 */

const { config } = require('./wdio.conf.js');

// Sobrescreve as capabilities para iOS
config.capabilities = [{
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 14',
    'appium:platformVersion': '16.0',
    'appium:automationName': 'XCUITest',
    'appium:app': './apps/ios/wdio-demo.app',
    'appium:autoAcceptAlerts': true,
    'appium:newCommandTimeout': 240,
    'appium:noReset': false
}];

exports.config = config;
