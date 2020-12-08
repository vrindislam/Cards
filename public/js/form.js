import {Visit,VisitCardiologist, VisitDentist, VisitTherapist} from './visit.js';

export class  Form {
    constructor(disabledOption, cardiologist, dentist, therapist, formDiv) {
        this.disabledOption = disabledOption
        this.cardiologist = cardiologist
        this.dentist = dentist
        this.therapist = therapist
        this.formDiv = formDiv
        this.elements = {
            select: document.createElement('select'),
            disabledOption: document.createElement('option'),
            cardiologist: document.createElement('option'),
            dentist: document.createElement('option'),
            therapist: document.createElement('option'),
            formDiv: document.createElement('div')
        }
    }

    clearDiv(el) {
        el = this.elements.formDiv
        el.innerHTML = ''
    }

    createForm(event) {
        const container = document.querySelector('.wrapper'),
            showCardiologist = new VisitCardiologist(),
            showDentist = new VisitDentist(),
            showTherapist = new VisitTherapist();

        container.append(this.elements.formDiv)

        if (event.value === 'Cardiologist') {
            this.clearDiv()
            showCardiologist.render(this.elements.formDiv)
        } else if (event.value === 'Dentist') {
            this.clearDiv()
            showDentist.render(this.elements.formDiv)
        } else {
            this.clearDiv()
            showTherapist.render(this.elements.formDiv)
        }
    }


    render() {
        const {disabledOption, cardiologist, dentist, therapist, select} = this.elements
        disabledOption.textContent = 'Choose your specialist:';
        disabledOption.disabled = true;
        disabledOption.selected = true;
        cardiologist.textContent = 'Cardiologist';
        dentist.textContent = 'Dentist';
        therapist.textContent = 'Therapist';

        select.append(disabledOption, cardiologist, dentist, therapist);

        select.addEventListener('change', (e) => {
            let event = e.target;
            this.createForm(event);
        })
        document.querySelector('.wrapper').append(select);
        select.classList.add('doctor-select');
    }
}