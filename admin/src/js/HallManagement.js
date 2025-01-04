import { _URL } from "./app.js";
import { getHalls } from "./functions.js";
import { defaultRows, defaultChairsInRow, ticketPrice, vipTicketPrice } from "./defaultHallData.js";


export default class HallManagement {
    constructor() {
        this.init();
        this.halls = [];
    }

    init() {
        this.bindToDom();
    }

    bindToDom() {
        this.mainEl = document.querySelector(".main");
        // console.log(this.mainEl)
        this.updateHandler = this.updateHandler.bind(this);
        this.mainEl.addEventListener("updateHall", this.updateHandler);
        this.containerEl = document.querySelector(".hall-management");
        this.btnCreateHallEl = this.containerEl.querySelector(".create-hall");
        this.onClickBtnCreateHall = this.onClickBtnCreateHall.bind(this);
        this.btnCreateHallEl.addEventListener("click",
            this.onClickBtnCreateHall);
        this.hallListEl = this.containerEl.querySelector(".hall-list");
        this.modalEl = this.containerEl.querySelector(".modal-create-hall");
        this.modalBtnCloseEl = this.modalEl.querySelector(".modal-create-hall__btn-close");
        this.onClickBtnModalClose = this.onClickBtnModalClose.bind(this);
        this.modalBtnCloseEl.addEventListener("click", this.onClickBtnModalClose);
        this.modalInputEl = this.modalEl.querySelector(".modal-create-hall__input");
        this.modalFormEl = this.mainEl.querySelector(".modal-create-hall__form");
        this.onSubmitModalForm = this.onSubmitModalForm.bind(this);
        this.modalFormEl.addEventListener("submit", this.onSubmitModalForm);
    }

    updateHandler(e) {
        console.log(e);
        this.hall = e.detail.data;
        this.renderHalls();
    }

    renderHalls() {
        console.log('Отображаем залы:', this.halls); // Посмотреть, что в массиве  
        this.hallListEl.innerHTML = "";
        this.halls.forEach((hall) => {
            const hallEl = document.createElement("li");
            hallEl.textContent = `${hall.name}`;
            const btnRemoveEl = document.createElement("button");
            btnRemoveEl.classList.add("conf-step__button", "conf-step__button-trash");
            btnRemoveEl.addEventListener("click", () => this.btnRemoveHandle(hall));
            hallEl.appendChild(btnRemoveEl);
            this.hallListEl.appendChild(hallEl);
        });
    }

    btnRemoveHandle(hall) {
        this.removeHall(hall).then(() => getHalls());
    }

    async removeHall(hall) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${_URL}chair/${hall.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetch(`${_URL}hall/${hall.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    onClickBtnCreateHall() {
        this.showModal();
    }

    showModal() {
        this.modalEl.classList.remove("hidden");
    }

    onClickBtnModalClose(e) {
        e.preventDefault();
        this.hideModal();
    }

    hideModal() {
        this.modalInputEl.value = "";
        this.modalEl.classList.add("hidden");
    }

    async onSubmitModalForm(e) {
        e.preventDefault();
        const hallName = this.modalInputEl.value;
        this.hideModal();

        this.addHall(hallName).then((hallId) => {
            const defaultChairs = this.createDefaultChairs(defaultRows, defaultChairsInRow, hallId);
            this.sendDefaultChairs(defaultChairs).then(() => getHalls(hallId));
        });
    }

    async addHall(hall) {
        const token = localStorage.getItem('token');
        try {
            const jsonResponse = await fetch(`${_URL}hall`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: hall,
                    ticket_price: ticketPrice,
                    vip_ticket_price: vipTicketPrice,
                    sales: false,
                }),
            });
            const response = await jsonResponse.json();
            return response.id;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async sendDefaultChairs(chairs) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${_URL}chair`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    chairs,
                }),
            });
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    createDefaultChairs(defaultRows, defaultChairsInRow, hallId) {
        const defaultChairs = [];
        for (let i = 1; i <= defaultRows; i += 1) {
            for (let j = 1; j <= defaultChairsInRow; j += 1) {
                defaultChairs.push({
                    hall_id: hallId,
                    row: i,
                    place: j,
                    type: "1",
                });
            }
        }
        return defaultChairs;
    }


}
