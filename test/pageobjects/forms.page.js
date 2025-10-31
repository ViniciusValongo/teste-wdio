const BasePage = require('./base.page');


class FormsPage {

    get formsContainer() {
        return $('~Forms-screen');
    }

    get inputField() {
        return $('~text-input');
    }

    get switchElement() {
        return $('~switch');
    }

    get switchText() {
        return $('~switch-text');
    }

    get activeButton() {
        return $('~button-Active');
    }

    get inactiveButton() {
        return $('~button-Inactive');
    }

    get messagePopup() {
        return $('//*[@resource-id="android:id/message"]');
    }

    get popupOkButton() {
        return $('//*[@resource-id="android:id/button1"]');
    }


    async waitForFormsScreen() {
        await BasePage.waitForElement(this.formsContainer);
    }

    /**
     * Preenche o campo de input
     * @param {string} text 
     */
    async fillInputField(text) {
        await BasePage.setText(this.inputField, text);
        await BasePage.hideKeyboard();
    }


    async toggleSwitch() {
        await BasePage.clickElement(this.switchElement);
    }

    /**
     * Obtém o valor do campo de input
     * @returns {Promise<string>}
     */
    async getInputFieldValue() {
        return await BasePage.getText(this.inputField);
    }

    /**
     * Obtém o estado do switch (ON/OFF)
     * @returns {Promise<string>}
     */
    async getSwitchState() {
        return await BasePage.getText(this.switchText);
    }
}

module.exports = new FormsPage();
