class Helpers {
    /**
     * Gera um email aleatório para testes
     * @returns {string}
     */
    static generateRandomEmail() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `test${timestamp}${random}@webdriverio.com`;
    }

    /**
     * Gera uma senha aleatória
     * @param {number} length - Tamanho da senha
     * @returns {string}
     */
    static generateRandomPassword(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    /**
     * Aguarda um tempo específico
     * @param {number} ms - Milissegundos
     */
    static async wait(ms) {
        await driver.pause(ms);
    }

    /**
     * Tira um screenshot com nome personalizado
     * @param {string} name - Nome do arquivo
     */
    static async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const filename = `${name}_${timestamp}.png`;
        await driver.saveScreenshot(`./screenshots/${filename}`);
        console.log(`Screenshot salvo: ${filename}`);
    }

    /**
     * Retorna as dimensões da tela
     * @returns {Promise<{width: number, height: number}>}
     */
    static async getScreenSize() {
        return await driver.getWindowSize();
    }

    static async scrollToBottom() {
        const { width, height } = await this.getScreenSize();
        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: width / 2, y: height * 0.8 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerMove', duration: 500, x: width / 2, y: height * 0.2 },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
    }

    static async scrollToTop() {
        const { width, height } = await this.getScreenSize();
        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: width / 2, y: height * 0.2 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerMove', duration: 500, x: width / 2, y: height * 0.8 },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
    }

    /**
     * Verifica se o teclado está visível
     * @returns {Promise<boolean>}
     */
    static async isKeyboardVisible() {
        try {
            return await driver.isKeyboardShown();
        } catch (error) {
            return false;
        }
    }

    static async clearAppCache() {
        await driver.execute('mobile: clearApp', { appId: 'com.wdiodemoapp' });
    }

    static async restartApp() {
        await driver.closeApp();
        await driver.pause(1000);
        await driver.launchApp();
    }

    /**
     * Coloca o app em background por X segundos
     * @param {number} seconds 
     */
    static async backgroundApp(seconds = 5) {
        await driver.background(seconds);
    }

    /**
     * Obtém a orientação atual do dispositivo
     * @returns {Promise<string>} 'PORTRAIT' ou 'LANDSCAPE'
     */
    static async getOrientation() {
        return await driver.getOrientation();
    }

    /**
     * Define a orientação do dispositivo
     * @param {string} orientation - 'PORTRAIT' ou 'LANDSCAPE'
     */
    static async setOrientation(orientation) {
        await driver.setOrientation(orientation);
    }

    static async enableAirplaneMode() {
        await driver.execute('mobile: shell', {
            command: 'cmd',
            args: ['connectivity', 'airplane-mode', 'enable']
        });
    }

    static async disableAirplaneMode() {
        await driver.execute('mobile: shell', {
            command: 'cmd',
            args: ['connectivity', 'airplane-mode', 'disable']
        });
    }

    /**
     * Formata data para log
     * @returns {string}
     */
    static getFormattedDate() {
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    /**
     * Log personalizado
     * @param {string} message 
     * @param {string} level - 'INFO', 'ERROR', 'WARN'
     */
    static log(message, level = 'INFO') {
        const timestamp = this.getFormattedDate();
        console.log(`[${timestamp}] [${level}] ${message}`);
    }

    /**
     * Valida formato de email
     * @param {string} email 
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Valida força da senha
     * @param {string} password 
     * @returns {object} {isValid: boolean, strength: string}
     */
    static validatePassword(password) {
        const result = {
            isValid: false,
            strength: 'weak',
            issues: []
        };

        if (password.length < 6) {
            result.issues.push('Senha muito curta (mínimo 6 caracteres)');
        }

        if (!/[A-Z]/.test(password)) {
            result.issues.push('Falta letra maiúscula');
        }

        if (!/[a-z]/.test(password)) {
            result.issues.push('Falta letra minúscula');
        }

        if (!/[0-9]/.test(password)) {
            result.issues.push('Falta número');
        }

        if (result.issues.length === 0) {
            result.isValid = true;
            result.strength = 'strong';
        } else if (result.issues.length <= 2) {
            result.strength = 'medium';
        }

        return result;
    }
}

module.exports = Helpers;
