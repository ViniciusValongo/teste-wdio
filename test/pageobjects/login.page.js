const BasePage = require('./base.page');

class LoginPage {

    get loginContainer() {
        return $('~Login-screen');
    }

    get signUpTab() {
        return $('~button-sign-up-container');
    }

    get loginTab() {
        return $('~button-login-container');
    }


    get loginEmailInput() {
        return $('~input-email');
    }

    get loginPasswordInput() {
        return $('~input-password');
    }

    get loginButton() {
        return $('~button-LOGIN');
    }


    get emailValidationMessage() {
        return $('android=new UiSelector().textContains("Please enter a valid email address")');
    }

    get requiredFieldMessage() {
        return $('android=new UiSelector().textContains("Please enter a valid")');
    }

    get passwordMismatchMessage() {
        return $('android=new UiSelector().textContains("Please enter the same password")');
    }

    get signUpEmailInput() {
        return $('~input-email');
    }

    get signUpPasswordInput() {
        return $('~input-password');
    }

    get signUpRepeatPasswordInput() {
        return $('~input-repeat-password');
    }

    get signUpButton() {
        return $('~button-SIGN UP');
    }

    get successMessage() {
        return $('//*[@resource-id="android:id/message"]');
    }

    get errorMessage() {
        return $('//*[@resource-id="android:id/message"]');
    }

    get alertOkButton() {
        return $('//*[@resource-id="android:id/button1"]');
    }


    async waitForLoginScreen() {
        await BasePage.waitForElement(this.loginContainer);
    }


    async switchToSignUp() {
        await BasePage.clickElement(this.signUpTab);
        await driver.pause(500);
    }


    async switchToLogin() {
        await BasePage.clickElement(this.loginTab);
        await driver.pause(500);
    }

    /**
     * Realiza o login no aplicativo
     * @param {string} email 
     * @param {string} password 
     */
    async doLogin(email, password) {
        await this.switchToLogin();
        await BasePage.setText(this.loginEmailInput, email);
        await BasePage.setText(this.loginPasswordInput, password);
        await BasePage.hideKeyboard();
        await BasePage.clickElement(this.loginButton);
    }

    /**
     * Realiza o cadastro no aplicativo
     * @param {string} email 
     * @param {string} password 
     * @param {string} repeatPassword 
     */
    async doSignUp(email, password, repeatPassword) {
        await this.switchToSignUp();
        await BasePage.setText(this.signUpEmailInput, email);
        await BasePage.setText(this.signUpPasswordInput, password);
        await BasePage.setText(this.signUpRepeatPasswordInput, repeatPassword);
        await BasePage.hideKeyboard();
        await BasePage.clickElement(this.signUpButton);
    }

    /**
     * Obtém a mensagem de sucesso
     * @returns {Promise<string>}
     */
    async getSuccessMessage() {
        await BasePage.waitForElement(this.successMessage);
        return await BasePage.getText(this.successMessage);
    }

    /**
     * Obtém a mensagem de erro
     * @returns {Promise<string>}
     */
    async getErrorMessage() {
        await BasePage.waitForElement(this.errorMessage);
        return await BasePage.getText(this.errorMessage);
    }


    async closeAlert() {
        await BasePage.clickElement(this.alertOkButton);
    }

    /**
     * Verifica se a mensagem de validação inline está visível
     * @returns {Promise<boolean>}
     */
    async isEmailValidationVisible() {
        try {
            await this.emailValidationMessage.waitForDisplayed({ timeout: 5000 });
            return await this.emailValidationMessage.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se a mensagem de campo obrigatório está visível
     * @returns {Promise<boolean>}
     */
    async isRequiredFieldMessageVisible() {
        try {
            await this.requiredFieldMessage.waitForDisplayed({ timeout: 5000 });
            return await this.requiredFieldMessage.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se a mensagem de senhas diferentes está visível
     * @returns {Promise<boolean>}
     */
    async isPasswordMismatchVisible() {
        try {
            await this.passwordMismatchMessage.waitForDisplayed({ timeout: 5000 });
            return await this.passwordMismatchMessage.isDisplayed();
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica se está na tela de Login
     * @returns {Promise<boolean>}
     */
    async isOnLoginPage() {
        return await BasePage.isElementVisible(this.loginContainer);
    }
}

module.exports = new LoginPage();
