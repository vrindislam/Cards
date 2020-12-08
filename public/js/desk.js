import {Card} from "./card.js";

export class TaskDesk {
    constructor() {
        this.cards = [];

        this.elements = {
            desk: document.createElement("div"),
            taskContainer: document.createElement("div"),
            filterContainer: document.createElement("div"),
            searchContainer: document.createElement("div"),
            searchBtn: document.createElement("button"),
            searchInput: document.createElement('input'),
            statusSelect: document.createElement('select'),
            urgencySelect: document.createElement('select'),
        }
    }

    init() {
        this.getCards();
        this.renderTaskDesk();
        this.search();
        this.filter();
    }

    renderTaskDesk() {
        this.elements.searchBtn.classList.add("search-btn");
        this.elements.searchBtn.setAttribute('type', 'Submit');
        this.elements.searchContainer.classList.add("search-input-container");
        this.elements.desk.classList.add('task-desk');
        this.elements.taskContainer.classList.add('task-container');
        this.elements.filterContainer.classList.add('filter-container');
        this.elements.searchInput.setAttribute('placeholder', 'Search');
        this.elements.searchInput.setAttribute('type', 'text');
        this.elements.searchInput.classList.add('select-desk');


        const statuses = ['All', 'Open', 'Done'];
        const urgency = ['All', 'Low', 'Medium', 'Hard'];
        statuses.forEach(e => {
            const statusOption = document.createElement('option');
            statusOption.innerText = e;
            this.elements.statusSelect.append(statusOption);
            this.elements.statusSelect.classList.add('select-desk');
        })
        urgency.forEach(e => {
            const urgencyOption = document.createElement('option');
            urgencyOption.innerText = e;
            this.elements.urgencySelect.append(urgencyOption);
            this.elements.urgencySelect.classList.add('select-desk');
        })

        this.elements.searchContainer.append(this.elements.searchInput, this.elements.searchBtn);
        this.elements.filterContainer.append(this.elements.searchContainer, this.elements.urgencySelect, this.elements.statusSelect);
        this.elements.desk.append(this.elements.filterContainer, this.elements.taskContainer);
        document.querySelector(".wrapper").append(this.elements.desk);
    }

     async getCards() {
        await fetch('https://cards.danit.com.ua/cards', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        })
            .then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    return res;
                } else {
                    let error = new Error(res.statusText);
                    error.response = res;
                    throw error;
                }
            })
            .then(res => res.json())
            .then(cards => {
                if (cards.length === 0) {
                    if(document.querySelector('.desk-noMatches')) {
                        document.querySelector('.desk-noMatches').remove();
                    }
                    const deskInfo = document.createElement('div');
                    deskInfo.classList.add('desk-noInfo');
                    deskInfo.innerText = 'No visits have been added';
                    this.elements.filterContainer.after(deskInfo);
                } else if (cards.length > 0) {
                    if (document.querySelector(".desk-noInfo")) {
                        document.querySelector(".desk-noInfo").remove();
                    }
                    if(document.querySelector('.desk-noMatches')) {
                        document.querySelector('.desk-noMatches').remove();
                    }
                    cards.forEach(cardElem => {
                        this.cards.push(cardElem)
                    })
                    this.cards.forEach(e => new Card(e).render());
                }
            })
    }

    search() {
        this.elements.searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.inputSearchfilter();
            }
        });
        this.elements.searchBtn.addEventListener('click', () => this.inputSearchfilter());
    }

    inputSearchfilter() {
        this.clearCards();
        let searchCards = this.cards.filter(item => item.title.toLowerCase().includes(this.elements.searchInput.value.toLowerCase()));
        this.renderFilterInfo(searchCards);
    }

    renderFilterInfo(searchArr) {
        if (!searchArr.length) {
            if (document.querySelector(".desk-noInfo")) {
                document.querySelector(".desk-noInfo").remove();
            }
            if (!document.querySelector('.desk-noMatches')) {
                const deskFilterInfo = document.createElement('div');
                deskFilterInfo.classList.add('desk-noMatches');
                deskFilterInfo.innerText = 'No matches found for this request';
                this.elements.filterContainer.after(deskFilterInfo);
            }
        } else  {
            searchArr.forEach(e => new Card(e).render())
            if (document.querySelector('.desk-noMatches')) {
                document.querySelector('.desk-noMatches').remove();
            }
        }
    }

    clearCards() {
        document.querySelectorAll('.card').forEach(e => e.remove())
    }


    filter() {
        this.elements.statusSelect.addEventListener('change', () => {
            if (this.elements.statusSelect.value === 'All') {
                if (document.querySelector('.desk-noMatches')) {
                    document.querySelector('.desk-noMatches').remove();
                }
                this.cards = [];
                this.clearCards();
               this.getCards();
            } else {
                this.clearCards();
                let filterCards = this.cards.filter(item => item.status === this.elements.statusSelect.value);
                this.renderFilterInfo(filterCards);
            }
        })



        this.elements.urgencySelect.addEventListener('change', () => {
            this.clearCards();
            let urgencyCards = this.cards.filter(item => item.urgency === this.elements.urgencySelect.value);
            this.renderFilterInfo(urgencyCards);
            if (this.elements.urgencySelect.value === 'All') {
                if(document.querySelector('.desk-noMatches')) {
                    document.querySelector('.desk-noMatches').remove();
                }
                this.cards = [];
                this.clearCards();
                this.getCards();
            }
        })
    }
}

