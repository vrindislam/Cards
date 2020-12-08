import {Modal} from "./modal.js";
import {Form} from "./form.js";

export class App {
    constructor() {
        this.wrapper = document.createElement('div');
        this.header = document.createElement('header');
        this.headerLogo = document.createElement('div');
        this.logoText = document.createElement('p');
        this.logoTextGreen = document.createElement('span');
        this.headerButtons = document.createElement('div');
        this.loginButton = document.createElement('button');
        this.createButton = document.createElement('button');
    }

    render() {
        this.wrapper.className = "wrapper";
        this.header.className = 'header';
        this.headerLogo.className = "header__logo";
        this.logoText.className = "header__logo-text";
        this.logoTextGreen.className = "header__logo-text green"
        this.headerButtons.className = 'header__buttons';
        this.loginButton.className = "header__login-button";
        this.createButton.className = "header__create-button";

        this.logoText.textContent = "health";
        this.logoTextGreen.textContent = "care";
        this.loginButton.textContent = "LogIn";
        this.createButton.textContent = "Create Visit";

        this.logoText.append(this.logoTextGreen);
        this.headerLogo.append(this.logoText);
        this.headerButtons.append(this.loginButton, this.createButton);
        this.header.append(this.headerLogo, this.headerButtons);
        this.wrapper.append(this.header);
        document.body.prepend(this.wrapper);

        this.loginButton.addEventListener('click', async (event) => {
            const modal = new Modal().render();
        })

        this.createButton.addEventListener('click', async (event) => {
            if (!document.querySelector('.doctor-select')) {
                const form = new Form().render();
            }
            document.querySelector('.doctor-select').className = 'doctor-select';
        })
    }
}

const app = new App().render();
export {app};










