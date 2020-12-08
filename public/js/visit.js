import {TaskDesk} from "./desk.js";
export class Visit {
    constructor({purpose, description, urgency, name, status, closeFormBtn} = {}) {
        this.purpose = purpose
        this.description = description
        this.urgency = urgency
        this.name = name
        this.status = status
        this.closeFormBtn = closeFormBtn
        this.elements = {
            form: document.createElement('form'),
            closeFormBtn: this.createCloseBtn('X', 'close-form-btn'),
            purpose: this.createInputElement('purpose', 'Purpose of your visit?', 'text', 'form-input', this.purpose),
            description: this.createInputElement('description', 'Short description?', 'textarea', 'form-input', this.description),
            urgency: this.createSelectElement('Hard', 'Medium', 'Low', 'Urgency', this.description),
            name: this.createInputElement('name', 'First/Lastname', 'text', 'form-input', this.name),
            status: this.createSelectStatus('Status of your visit', 'Open', 'Done'),
            btn: this.createInputElement('form-btn', 'Create', 'submit', 'form-submit', 'Send')
        }
    }
    createCloseBtn(textContent, className) {
        const el = document.createElement('button');
        el.textContent = textContent;
        el.className = className;
        return el
    }
    createInputElement(name, placeholder, type, className, value = "") {
        const el = document.createElement('input');
        el.name = name;
        el.required = true;
        el.placeholder = placeholder;
        el.type = type;
        el.className = className;
        el.value = value || "";
        return el;
    }
    createSelectElement(textHard, textMedium, textLow, textSelectOption) {
        const el = document.createElement('select')
        el.className = 'form-select'
        const hard = document.createElement('option'),
          medium = document.createElement('option'),
          low = document.createElement('option'),
          selectOption = document.createElement('option');
        selectOption.disabled = true;
        low.selected = true;
        selectOption.textContent = textSelectOption;
        hard.textContent = textHard;
        medium.textContent = textMedium;
        low.textContent = textLow;
        el.append(selectOption, hard, medium, low);
        return el;
    }
    createSelectStatus(defaultOp, open, done) {
        const el = document.createElement('select');
        el.className = 'form-select';
        const isOpen = document.createElement('option'),
          isDone = document.createElement('option'),
          defaultOption = document.createElement('option');
        defaultOption.disabled = true;
        isOpen.selected = true;
        isOpen.textContent = open;
        isDone.textContent = done;
        defaultOption.textContent = defaultOp
        el.append(defaultOption, isOpen, isDone);
        return el;
    }

    closeBtnListener(parent) {
        let select = document.querySelector('.doctor-select');
        this.elements.closeFormBtn.addEventListener('click', e => {
            e.preventDefault()
            if (select) {
                select.remove()
            }
            parent.remove();
            const btn = document.querySelectorAll('.edit-btn');
            btn.forEach(e => e.classList.remove("remove"));
        })
    }

    closeFormListener(){
        document.body.addEventListener('click',(event)=>{
            if(event.target.classList.value===('task-container') || event.target.classList.value===('wrapper')){
                document.querySelector('.doctor-select').classList.add('form-hidden');
                document.querySelector('.visit-form').classList.add('form-hidden')
            }
        })
    }
}

export class VisitCardiologist extends Visit {
    constructor({purpose, description, urgency, name, index, pressure, illnesses, age, status, id} = {}) {
        super({purpose, description, urgency, name, status});
        this.age = age;
        this.index = index;
        this.pressure = pressure;
        this.illnesses = illnesses;
        this.id = id;
    }

    render(container) {
        const {purpose, description, urgency, name, status, form, btn, closeFormBtn, id} = this.elements;
        this.cardiologistIndex = super.createInputElement('index', 'What is your body mass index?', 'number', 'form-input', `${this.index}`);
        this.cardiologistPressure = super.createInputElement('pressure', 'What is normal pressure', 'text', 'form-input', this.pressure);
        this.cardiologistIllnesses = super.createInputElement('illnesses', 'Have you got any disease before?', 'text', 'form-input', this.illnesses);
        this.cardiologistAge = super.createInputElement('age', 'How old are you?', 'number', 'form-input', `${this.age}`);
        form.append(closeFormBtn, purpose, description, urgency, name, status, this.cardiologistIndex, this.cardiologistPressure, this.cardiologistIllnesses, this.cardiologistAge, btn);
        form.className = 'visit-form'
        container.append(form)
        container.className = 'form-container'
        let select = document.querySelector('.doctor-select');
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove()
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://cards.danit.com.ua/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'cardiologist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        index: `${this.cardiologistIndex.value}`,
                        pressure: `${this.cardiologistPressure.value}`,
                        illnesses: `${this.cardiologistIllnesses.value}`,
                        age: `${this.cardiologistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            } else {
                await fetch(`https://cards.danit.com.ua/cards`, {
                    method: "Post",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'cardiologist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        index: `${this.cardiologistIndex.value}`,
                        pressure: `${this.cardiologistPressure.value}`,
                        illnesses: `${this.cardiologistIllnesses.value}`,
                        age: `${this.cardiologistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            }
            const VisitCardiologistCard = new TaskDesk();
            VisitCardiologistCard.clearCards();
            await VisitCardiologistCard.getCards();
        })
    }
}
export class VisitDentist extends Visit {
    constructor({purpose, description, urgency, name, lastVisit, closeFormBtn, id} = {}) {
        super({purpose, description, urgency, name, closeFormBtn});
        this.lastVisit = lastVisit;
        this.id = id;
    }
    render(container) {
        const {purpose, description, urgency, name, status, form, btn, closeFormBtn} = this.elements
        this.dentistLastVisit = super.createInputElement('lastVisit', 'When was your last visit?', 'date', 'form-input', `${this.lastVisit}`);
        form.append(closeFormBtn, purpose, description, urgency, name, this.dentistLastVisit, status, btn)
        form.className = 'visit-form'
        container.append(form)
        container.className = 'form-container';
        let select = document.querySelector('.doctor-select');
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove()
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://cards.danit.com.ua/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'dentist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        lastVisit: `${this.dentistLastVisit.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            } else {
                await fetch(`https://cards.danit.com.ua/cards`, {
                    method: "Post",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'dentist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        lastVisit: `${this.dentistLastVisit.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            }
            const VisitDentistCard = new TaskDesk();
            VisitDentistCard.clearCards();
            await VisitDentistCard.getCards();
        })
    }
}
export class VisitTherapist extends Visit {
    constructor({purpose, description, urgency, name, age, status, closeFormBtn, id} = {}) {
        super({purpose, description, urgency, name, closeFormBtn});
        this.age = age;
        this.id = id;
    }
    render(container) {
        const {purpose, description, urgency, name, form, age, status, btn, closeFormBtn} = this.elements;
        this.therapistAge = super.createInputElement('age', 'How old are you?', 'number', 'form-input', `${this.age}`);
        form.append(closeFormBtn, purpose, description, urgency, name, this.therapistAge, status, btn)
        form.className = 'visit-form'
        container.append(form);
        container.className = 'form-container';
        let select = document.querySelector('.doctor-select');
        super.closeBtnListener(container);
        super.closeFormListener();

        this.elements.form.addEventListener('submit', async (e) => {
            e.preventDefault()
            if (select) {
                select.remove()
            }
            container.remove();
            if (document.querySelector('.remove')) {
                await fetch(`https://cards.danit.com.ua/cards/${this.id}`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'therapist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        age: `${this.therapistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            } else {
                await fetch(`https://cards.danit.com.ua/cards`, {
                    method: "Post",
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        title: 'therapist',
                        purpose: `${purpose.value}`,
                        description: `${description.value}`,
                        age: `${this.therapistAge.value}`,
                        name: `${name.value}`,
                        status: `${status.value}`,
                        urgency: `${urgency.value}`
                    })
                })
            }
            const VisitTherapistCard = new TaskDesk();
            VisitTherapistCard.clearCards();
            await VisitTherapistCard.getCards();
        })
    }
}
