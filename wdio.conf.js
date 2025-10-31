exports.config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: 'local',
    port: 4723,
    maxInstances: 1, // Executar apenas 1 teste por vez
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './test/specs/00-suite-basica.spec.js'  // Suite com 10 testes principais
    ],
    
    exclude: [],
    
    //
    // ============
    // Capabilities
    // ============
    capabilities: [{
        maxInstances: 1, // Executar apenas 1 teste por vez neste dispositivo
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:platformVersion': '15',
        'appium:automationName': 'UiAutomator2',
        'appium:app': './apps/android/app-debug.apk',
        'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 300,
        'appium:adbExecTimeout': 60000,
        'appium:androidInstallTimeout': 90000,
        'appium:uiautomator2ServerInstallTimeout': 60000,
        'appium:noReset': false, // Resetar o app para evitar sessões perdidas
        'appium:fullReset': false,
        'appium:disableIdLocatorAutocompletion': true,
        'appium:skipLogcatCapture': false,
        'appium:appWaitDuration': 30000, // Aumentar timeout de espera do app
        'appium:androidDeviceReadyTimeout': 30
    }],
    
    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'info',
    bail: 0,
    baseUrl: '',
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 3,
    
    services: ['appium'],
    
    framework: 'mocha',
    
    // Disable TypeScript auto-compilation
    autoCompileOpts: {
        autoCompile: false
    },
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: false,
            addConsoleLogs: true,
            reportedEnvironmentVars: {
                'Platform': 'Android',
                'Device': 'Android Emulator',
                'App Version': '0.4.0',
                'Test Environment': 'Local',
                'Appium Version': '2.0',
                'Node Version': process.version
            }
        }]
    ],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
    
    //
    // =====
    // Hooks
    // =====
    beforeSession: function (config, capabilities, specs) {
        console.log('Starting test session...');
    },
    
    before: function (capabilities, specs) {
        // Implicit wait
        driver.setTimeout({ 'implicit': 5000 });
        
        // Configuração do Allure
        const allure = require('@wdio/allure-reporter').default;
        
        // Adiciona informações do ambiente
        allure.addEnvironment('Platform', 'Android');
        allure.addEnvironment('Browser', 'Native App');
        allure.addEnvironment('Device', capabilities['appium:deviceName'] || 'Android Emulator');
        allure.addEnvironment('OS Version', capabilities['appium:platformVersion'] || 'Unknown');
        allure.addEnvironment('App Package', 'com.wdiodemoapp');
        allure.addEnvironment('Test Framework', 'WebdriverIO + Mocha');
        allure.addEnvironment('Assertion Library', 'Chai');
    },
    
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        // Captura screenshot em caso de falha
        if (error) {
            try {
                const screenshot = await driver.takeScreenshot();
                const allure = require('@wdio/allure-reporter').default;
                
                // Adiciona screenshot ao relatório Allure
                allure.addAttachment(
                    `Falha: ${test.title}`,
                    Buffer.from(screenshot, 'base64'),
                    'image/png'
                );
                
                // Adiciona informações do erro
                allure.addAttachment(
                    'Detalhes do Erro',
                    JSON.stringify({
                        message: error.message,
                        stack: error.stack,
                        duration: duration,
                        retries: retries
                    }, null, 2),
                    'application/json'
                );
            } catch (screenshotError) {
                console.log('Não foi possível capturar screenshot:', screenshotError.message);
            }
        }
        
        // Adiciona logs de console
        try {
            const allure = require('@wdio/allure-reporter').default;
            const logs = await driver.getLogs('logcat').catch(() => []);
            if (logs && logs.length > 0) {
                allure.addAttachment(
                    'Console Logs',
                    JSON.stringify(logs.slice(-50), null, 2),
                    'application/json'
                );
            }
        } catch (logError) {
            console.log('Não foi possível capturar logs:', logError.message);
        }
    },
    
    after: function (result, capabilities, specs) {
        console.log('Test session completed');
    }
}
