import {TaskDesk} from "./desk.js";

const loginUrl = 'https://cards.danit.com.ua/login';
const token = sessionStorage.getItem('token');

export class Modal {
  constructor(email, password, submitBtn) {
    this.form = document.createElement('form');
    this.closeBtn = document.createElement('button');
    this.formBody = document.createElement('div');
    this.email = document.createElement('input');
    this.password = document.createElement('input');
    this.submitBtn = document.createElement('button');
  }

  closeSigningForm(){
    document.body.addEventListener('click',(event)=>{
      if(event.target.classList.value===('signInForm')){
        this.form.style.display='none';
      }
    })
  }

  render() {
    this.form.className = "signInForm"
    this.closeBtn.className = "signInForm__closeBtn";
    this.formBody.className = "signInForm__body";
    this.email.className = "signInForm__email";
    this.password.className = "signInForm__password";
    this.submitBtn.className = "signInForm__submitBtn";

    this.closeBtn.textContent = "X";
    this.submitBtn.textContent = "Confirm";

    this.email.setAttribute("type", "email");
    this.password.setAttribute("type", "password");
    this.submitBtn.setAttribute("type", "submit");

    this.email.name = 'email';
    this.password.name = 'password';

    this.email.placeholder = "Enter your - email";
    this.password.placeholder = "Enter your - password";

    this.formBody.append(this.closeBtn, this.email, this.password, this.submitBtn);
    this.form.append(this.formBody);
    document.body.prepend(this.form);

    this.form.addEventListener('keypress', (event) => {
      const key = event.code;
      if (key === "Enter") {
        this.getLogin(this.email, this.password, this.form);
      }
    })

    this.submitBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.getLogin(this.email, this.password, this.form);
      document.querySelector('.signInForm').remove();
    })

    this.closeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.form.style.display = "none";
    })
    this.closeSigningForm();
  }

  changeBtn() {
    document.querySelector('.header__login-button').style.display = "none";
    document.querySelector('.header__create-button').style.display = "block";
  }

  getLogin(email, password, form) {
    fetch(loginUrl, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
      .then(resp => resp.json())
      .then(resp => {
        if (resp.token === null) {
          throw new Error('Введен неверный логин или пароль')
        } else {
          sessionStorage.setItem('token', resp.token);
          form.style.display = 'none';
          this.changeBtn();
          const bord = new TaskDesk().init();
        }
      })
      .catch(error => {
        alert(error);
      })
  }
}

export {token};