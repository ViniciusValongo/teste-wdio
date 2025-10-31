const { expect } = require('chai');
const BasePage = require('../pageobjects/base.page');
const HomePage = require('../pageobjects/home.page');
const LoginPage = require('../pageobjects/login.page');
const FormsPage = require('../pageobjects/forms.page');

describe('Suite Básica - 10 Testes Principais', () => {
    
    // ======================
    // LOGIN - 3 testes
    // ======================
    describe('Login', () => {
        beforeEach(async () => {
            await driver.pause(1000);
            await HomePage.returnToHome();
            await HomePage.waitForHomeScreen();
        });

        it('TC01 - Deve fazer login com credenciais válidas', async () => {
            await HomePage.navigateToLogin();
            
            await LoginPage.waitForLoginScreen();
            await LoginPage.doLogin('test@example.com', 'Test@123');
            
            const successMessage = await LoginPage.getSuccessMessage();
            expect(successMessage).to.include('You are logged in!');
            await LoginPage.closeAlert();
        });

        it('TC02 - Deve validar email inválido', async () => {
            await HomePage.navigateToLogin();
            
            await LoginPage.waitForLoginScreen();
            await LoginPage.switchToLogin();
            await BasePage.setText(LoginPage.loginEmailInput, 'email-invalido');
            await BasePage.setText(LoginPage.loginPasswordInput, 'Test@123');
            await BasePage.hideKeyboard();
            await BasePage.clickElement(LoginPage.loginButton);
            
            // Verifica se a mensagem de validação inline está visível
            const isValidationVisible = await LoginPage.isEmailValidationVisible();
            expect(isValidationVisible).to.be.true;
        });

        it('TC03 - Deve validar campos vazios no login', async () => {
            await HomePage.navigateToLogin();
            
            await LoginPage.waitForLoginScreen();
            await LoginPage.switchToLogin();
            await BasePage.clickElement(LoginPage.loginButton);
            
            // Verifica se a mensagem de campo obrigatório inline está visível
            const isValidationVisible = await LoginPage.isRequiredFieldMessageVisible();
            expect(isValidationVisible).to.be.true;
        });
    });

    // ======================
    // CADASTRO - 2 testes
    // ======================
    describe('Cadastro', () => {
        beforeEach(async () => {
            await driver.pause(1000);
            await HomePage.returnToHome();
            await HomePage.waitForHomeScreen();
        });

        it('TC04 - Deve fazer cadastro com dados válidos', async () => {
            await HomePage.navigateToLogin();
            
            await LoginPage.waitForLoginScreen();
            const timestamp = Date.now();
            await LoginPage.doSignUp(`user${timestamp}@test.com`, 'Test@123', 'Test@123');
            
            const successMessage = await LoginPage.getSuccessMessage();
            expect(successMessage).to.include('signed up');
            await LoginPage.closeAlert();
        });

        it('TC05 - Deve validar senhas não coincidentes', async () => {
            await HomePage.navigateToLogin();
            
            await LoginPage.waitForLoginScreen();
            await LoginPage.switchToSignUp();
            await BasePage.setText(LoginPage.signUpEmailInput, 'test@example.com');
            await BasePage.setText(LoginPage.signUpPasswordInput, 'Test@123');
            await BasePage.setText(LoginPage.signUpRepeatPasswordInput, 'Different@123');
            await BasePage.hideKeyboard();
            await BasePage.clickElement(LoginPage.signUpButton);
            
            const isValidationVisible = await LoginPage.isPasswordMismatchVisible();
            expect(isValidationVisible).to.be.true;
        });
    });

    // ======================
    // FORMULÁRIOS - 3 testes
    // ======================
    describe('Formulários', () => {
        beforeEach(async () => {
            await driver.pause(1000);
            await HomePage.returnToHome();
            await HomePage.waitForHomeScreen();
        });

        it('TC06 - Deve clicar no botão Active e verificar popup', async () => {
            await HomePage.navigateToForms();
            await FormsPage.waitForFormsScreen();
            
            // Clica no botão Active
            const activeButton = await FormsPage.activeButton;
            await activeButton.click();
            await driver.pause(1500);
            
            
            const messagePopup = await FormsPage.messagePopup;
            const popupText = await messagePopup.getText();
            expect(popupText).to.include('This button is active');
            
            
            const okButton = await FormsPage.popupOkButton;
            await okButton.click();
            await driver.pause(500);
        });

        it('TC07 - Deve preencher campo de input', async () => {
            await HomePage.navigateToForms();
            await FormsPage.waitForFormsScreen();
            
            const testText = 'Texto de teste WebDriverIO';
            await FormsPage.fillInputField(testText);
            
            const inputValue = await FormsPage.getInputFieldValue();
            expect(inputValue).to.equal(testText);
        });

        it('TC08 - Deve alternar o switch', async () => {
            await HomePage.navigateToForms();
            await FormsPage.waitForFormsScreen();
            
            const initialState = await FormsPage.getSwitchState();
            await FormsPage.toggleSwitch();
            
            const newState = await FormsPage.getSwitchState();
            expect(newState).to.not.equal(initialState);
        });
    });

    // ======================
    // NAVEGAÇÃO - 1 teste
    // ======================
    describe('Navegação', () => {
        beforeEach(async () => {
            await driver.pause(1000);
            await HomePage.returnToHome();
            await HomePage.waitForHomeScreen();
        });

        it('TC09 - Deve navegar entre todas as telas', async () => {
            // Login
            await HomePage.waitForHomeScreen();
            await HomePage.navigateToLogin();
            await driver.pause(1000);
            
            // Forms
            await HomePage.navigateToForms();
            await driver.pause(1000);
            
            // Swipe
            await HomePage.navigateToSwipe();
            await driver.pause(1000);
        });
    });

    // ======================
    // INTERAÇÕES - 1 teste
    // ======================
    describe('Interações', () => {
        beforeEach(async () => {
            await driver.pause(1000);
            await HomePage.returnToHome();
            await HomePage.waitForHomeScreen();
        });

        it('TC10 - Deve clicar no botão Inactive', async () => {
            await HomePage.navigateToForms();
            await FormsPage.waitForFormsScreen();
            
            const inactiveButton = await FormsPage.inactiveButton;
            await inactiveButton.click();
            await driver.pause(1500);
            
            const isDisplayed = await inactiveButton.isDisplayed();
            expect(isDisplayed).to.be.true;
        });
    });
});
