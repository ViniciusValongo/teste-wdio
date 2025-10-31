const allure = require('@wdio/allure-reporter').default;
const fs = require('fs-extra');
const path = require('path');

class ReporterHelper {
    /**
     * Adiciona screenshot ao relatório
     * @param {string} name - Nome do screenshot
     * @param {string} screenshot - Screenshot em base64
     */
    static async addScreenshot(name, screenshot) {
        if (screenshot) {
            allure.addAttachment(
                name,
                Buffer.from(screenshot, 'base64'),
                'image/png'
            );
        }
    }

    /**
     * Adiciona texto ao relatório
     * @param {string} name - Nome do anexo
     * @param {string} content - Conteúdo
     */
    static addTextAttachment(name, content) {
        allure.addAttachment(
            name,
            content,
            'text/plain'
        );
    }

    /**
     * Adiciona JSON ao relatório
     * @param {string} name - Nome do anexo
     * @param {object} data - Dados em formato objeto
     */
    static addJsonAttachment(name, data) {
        allure.addAttachment(
            name,
            JSON.stringify(data, null, 2),
            'application/json'
        );
    }

    /**
     * Adiciona step ao relatório
     * @param {string} stepName - Nome do step
     * @param {Function} callback - Função a executar
     */
    static async addStep(stepName, callback) {
        allure.startStep(stepName);
        try {
            const result = await callback();
            allure.endStep('passed');
            return result;
        } catch (error) {
            allure.endStep('failed');
            throw error;
        }
    }

    /**
     * Adiciona issue/bug link
     * @param {string} issueId - ID da issue
     * @param {string} url - URL da issue
     */
    static addIssue(issueId, url) {
        allure.addIssue(issueId);
        if (url) {
            allure.addAttachment(
                `Issue ${issueId}`,
                url,
                'text/plain'
            );
        }
    }

    /**
     * Adiciona feature
     * @param {string} featureName - Nome da feature
     */
    static addFeature(featureName) {
        allure.addFeature(featureName);
    }

    /**
     * Adiciona story
     * @param {string} storyName - Nome da story
     */
    static addStory(storyName) {
        allure.addStory(storyName);
    }

    /**
     * Adiciona severidade
     * @param {string} severity - critical, blocker, normal, minor, trivial
     */
    static addSeverity(severity) {
        allure.addSeverity(severity);
    }

    /**
     * Adiciona descrição ao teste
     * @param {string} description - Descrição
     */
    static addDescription(description) {
        allure.addDescription(description, 'text');
    }

    /**
     * Captura screenshot e adiciona ao relatório
     * @param {string} name - Nome do screenshot
     */
    static async captureScreenshot(name) {
        try {
            const screenshot = await driver.takeScreenshot();
            await this.addScreenshot(name, screenshot);
            return screenshot;
        } catch (error) {
            console.error('Erro ao capturar screenshot:', error);
            return null;
        }
    }


    static async addDeviceInfo() {
        try {
            const capabilities = driver.capabilities;
            const deviceInfo = {
                platformName: capabilities.platformName,
                platformVersion: capabilities.platformVersion || capabilities['appium:platformVersion'],
                deviceName: capabilities.deviceName || capabilities['appium:deviceName'],
                automationName: capabilities.automationName || capabilities['appium:automationName'],
                app: capabilities.app || capabilities['appium:app']
            };

            this.addJsonAttachment('Device Information', deviceInfo);
        } catch (error) {
            console.error('Erro ao obter informações do dispositivo:', error);
        }
    }


    static async addConsoleLogs() {
        try {
            const logs = await driver.getLogs('logcat').catch(() => []);
            if (logs && logs.length > 0) {
                this.addJsonAttachment(
                    'Console Logs (últimas 50 entradas)',
                    logs.slice(-50)
                );
            }
        } catch (error) {
            console.error('Erro ao obter logs:', error);
        }
    }


    static addEnvironmentInfo() {
        const environmentInfo = {
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        this.addJsonAttachment('Environment Information', environmentInfo);
    }

    /**
     * Salva screenshot em arquivo
     * @param {string} name - Nome do arquivo
     * @param {string} screenshot - Screenshot em base64
     */
    static async saveScreenshotToFile(name, screenshot) {
        try {
            const screenshotsDir = path.join(process.cwd(), 'screenshots');
            await fs.ensureDir(screenshotsDir);

            const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
            const filename = `${name}_${timestamp}.png`;
            const filepath = path.join(screenshotsDir, filename);

            await fs.writeFile(filepath, screenshot, 'base64');
            console.log(`📸 Screenshot salvo: ${filename}`);
            return filepath;
        } catch (error) {
            console.error('Erro ao salvar screenshot:', error);
            return null;
        }
    }

    /**
     * Inicia um passo com screenshot
     * @param {string} stepName - Nome do step
     * @param {Function} callback - Função a executar
     * @param {boolean} captureScreenshot - Se deve capturar screenshot
     */
    static async stepWithScreenshot(stepName, callback, captureScreenshot = true) {
        allure.startStep(stepName);
        try {
            const result = await callback();
            
            if (captureScreenshot) {
                await this.captureScreenshot(`${stepName} - Sucesso`);
            }
            
            allure.endStep('passed');
            return result;
        } catch (error) {
            if (captureScreenshot) {
                await this.captureScreenshot(`${stepName} - Falha`);
            }
            
            allure.endStep('failed');
            throw error;
        }
    }
}

module.exports = ReporterHelper;
