module.exports = {

    validLogin: {
        email: 'test@webdriverio.com',
        password: 'Test1234!'
    },


    invalidLogin: {
        invalidEmail: 'invalid-email',
        emptyEmail: '',
        emptyPassword: '',
        wrongPassword: 'WrongPass123'
    },


    validSignUp: {
        email: 'newuser@webdriverio.com',
        password: 'NewUser123!',
        repeatPassword: 'NewUser123!'
    },


    invalidSignUp: {
        invalidEmail: 'invalid.email',
        mismatchPassword: 'Test123!',
        mismatchRepeatPassword: 'Test456!',
        shortPassword: '123'
    },


    formData: {
        inputText: 'WebdriverIO Automation Test',
        dropdownOptions: {
            option1: 'webdriver.io is awesome',
            option2: 'Appium is awesome',
            option3: 'This app is awesome'
        }
    },


    messages: {
        loginSuccess: 'Success',
        signUpSuccess: 'Signed Up',
        invalidEmail: 'enter a valid email',
        passwordMismatch: 'not match',
        buttonActive: 'This button is'
    },


    swipeTexts: {
        slide1: 'Swipe horizontal',
        slide2: 'Fully Open Source',
        slide3: 'GREAT COMMUNITY'
    }
};
