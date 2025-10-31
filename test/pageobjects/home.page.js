const BasePage = require('./base.page');


class HomePage {

    get homeContainer() {
        return $('~Home-screen');
    }

    get loginButton() {
        return $('~Login');
    }

    get formsButton() {
        return $('~Forms');
    }

    get swipeButton() {
        return $('~Swipe');
    }

    get dragButton() {
        return $('~Drag');
    }

    get webviewButton() {
        return $('~Webview');
    }


    async waitForHomeScreen() {
        await BasePage.waitForElement(this.homeContainer);
    }


    async navigateToLogin() {
        await BasePage.clickElement(this.loginButton);
    }


    async navigateToForms() {
        await BasePage.clickElement(this.formsButton);
    }

    async navigateToSwipe() {
        await BasePage.clickElement(this.swipeButton);
    }

    async navigateToDrag() {
        await BasePage.clickElement(this.dragButton);
    }


    async navigateToWebview() {
        await BasePage.clickElement(this.webviewButton);
    }

    /**
     * Verifica se está na tela Home
     * @returns {Promise<boolean>}
     */
    async isOnHomePage() {
        return await BasePage.isElementVisible(this.homeContainer);
    }


    async returnToHome() {
        const maxAttempts = 5;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            const isHome = await this.isOnHomePage();
            if (isHome) {
                console.log('Já está na tela Home');
                return;
            }
            
            console.log(`Pressionando back (tentativa ${attempts + 1}/${maxAttempts})`);
            await driver.back();
            await driver.pause(1000);
            attempts++;
        }
        
        console.log('Não conseguiu retornar à Home após 5 tentativas');
    }
}

module.exports = new HomePage();
