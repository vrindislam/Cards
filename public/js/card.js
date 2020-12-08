import {VisitCardiologist, VisitDentist, VisitTherapist} from './visit.js';
import {DragDrop} from "./DragDrop.js";

export class Card {
    constructor(kard) {
        this.id = kard.id;
        this.kard = kard;

        this.elements = {
            cardContainer: document.createElement("div"),
            editBtn: document.createElement('button'),
            detailsBtn: document.createElement('button'),
            deleteBtn: document.createElement('button'),
            doctorDetailsFields: document.createElement('div'),
            editCardContainer: document.createElement("div")
        }
    }
    render() {
        this.elements.cardContainer.classList.add('card');
        this.elements.editBtn.classList.add('edit-btn');
        this.elements.detailsBtn.classList.add('details-btn');
        this.elements.deleteBtn.classList.add('delete-btn');
        this.elements.doctorDetailsFields.classList.add('doctorDetails');
        this.elements.editCardContainer.classList.add('editCardContainer');
        this.elements.editBtn.innerText = 'Edit';
        this.elements.detailsBtn.innerText = 'Details';
        this.elements.deleteBtn.innerText = 'X';


        /*   loop to fill cards fields */

        const cardContentInfo = Object.entries(this.kard);
        cardContentInfo.forEach(([key, value]) => {

                if (key.toLowerCase() === "age" || key.toLowerCase() === "bodyindex" ||
                    key.toLowerCase() === "illnesses" || key.toLowerCase() === "pressure" ||
                    key.toLowerCase() === "lastvisit" || key.toLowerCase() === "id") {

                    let detailsCardField = document.createElement("p");
                    detailsCardField.classList.add("card-fields");
                    detailsCardField.innerText = `${key.toUpperCase()}: ${value}`;
                    this.elements.doctorDetailsFields.append(detailsCardField);

                } else {
                    let mainCardField = document.createElement("p");
                    mainCardField.classList.add("card-fields");
                    mainCardField.innerText = `${key.toUpperCase()}: ${value}`;
                    this.elements.cardContainer.append(mainCardField);
                }
        })

        this.elements.cardContainer.append(this.elements.editBtn, this.elements.deleteBtn);
        this.elements.cardContainer.insertAdjacentElement('beforeend', this.elements.detailsBtn);
        document.querySelector('.task-container').append(this.elements.cardContainer);


        /*   Card Btn Listeners   */

        this.elements.deleteBtn.addEventListener('click', () => this.deleteCardRequest());
        this.elements.detailsBtn.addEventListener('click', () => {
            if (!document.querySelector('.doctorDetails')) {
                this.elements.cardContainer.append(this.elements.doctorDetailsFields);
                this.elements.detailsBtn.innerText = 'Hide';
            } else {
                this.elements.detailsBtn.innerText = 'Details';
                document.querySelector('.doctorDetails').remove();
            }
        })
        this.elements.editBtn.addEventListener('click', () => this.editCard());
        DragDrop('.card');
    }

    deleteCardRequest() {
        fetch(`https://cards.danit.com.ua/cards/${this.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        }).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res;
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error
            }
        })
            .then((res) => res.json())
            .then(res => {
                if (res.status === 'Success') {
                    this.elements.cardContainer.remove();
                    this.elements.deleteBtn.removeEventListener('click', () => this.deleteCardRequest());
                }
            })
    }

    editCard() {
        const removeBtn = document.querySelectorAll(".edit-btn");
        removeBtn.forEach(e => e.classList.add("remove"));

        if (this.kard.title.toLowerCase() === "cardiologist") {
            document.querySelector('.task-container').append(this.elements.editCardContainer);
            const editFormCardiologist = new VisitCardiologist(this.kard);
            editFormCardiologist.render(this.elements.editCardContainer);
        }
        if (this.kard.title.toLowerCase() === "therapist") {
            document.querySelector('.task-container').append(this.elements.editCardContainer);
            const editFormVisitTherapist = new VisitTherapist(this.kard);
            editFormVisitTherapist.render(this.elements.editCardContainer);
        } else if (this.kard.title.toLowerCase() === "dentist") {
            document.querySelector('.task-container').append(this.elements.editCardContainer);
            const editFormVisitDentist = new VisitDentist(this.kard);
            editFormVisitDentist.render(this.elements.editCardContainer);
        }
    }
}



