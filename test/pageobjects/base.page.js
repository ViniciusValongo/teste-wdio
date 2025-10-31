
class BasePage {
    /**
     * Aguarda um elemento estar visível
     * @param {WebdriverIO.Element} element 
     * @param {number} timeout 
     */
    async waitForElement(element, timeout = 10000) {
        await element.waitForDisplayed({ timeout });
    }

    /**
     * Clica em um elemento
     * @param {WebdriverIO.Element} element 
     */
    async clickElement(element) {
        await this.waitForElement(element);
        await element.click();
    }

    /**
     * Preenche um campo de texto
     * @param {WebdriverIO.Element} element 
     * @param {string} text 
     */
    async setText(element, text) {
        await this.waitForElement(element);
        await element.clearValue();
        await element.setValue(text);
    }

    /**
     * Obtém o texto de um elemento
     * @param {WebdriverIO.Element} element 
     * @returns {Promise<string>}
     */
    async getText(element) {
        await this.waitForElement(element);
        return await element.getText();
    }

    /**
     * Verifica se um elemento está visível
     * @param {WebdriverIO.Element} element 
     * @returns {Promise<boolean>}
     */
    async isElementVisible(element) {
        try {
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Rola a tela até um elemento
     * @param {WebdriverIO.Element} element 
     */
    async scrollToElement(element) {
        await element.scrollIntoView();
    }

    
    async hideKeyboard() {
        try {
            await driver.hideKeyboard();
        } catch (error) {
            console.log('Teclado já estava oculto ou não pôde ser escondido');
        }
    }
}

module.exports = new BasePage();
