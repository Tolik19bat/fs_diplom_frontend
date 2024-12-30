import { _URL } from "./app.js";
import HallList from "./HallList.js";
import HallSize from "./HallSize.js";

export default class HallConfiguration {
    constructor() {
        this.activeHallId = null;
        this.selectedElement = null;
        this.chairs = [];
        this.chairsCopy = [];
        this.init();
    }

    init() {
        this.bindToDom();
        this.hallList = new HallList(this.hallsListEl);
        this.hallList.handlerUpdate = this.renderConfigurationOptions.bind(this);
        this.hallSize = new HallSize();
        this.hallSize.handlerCangeSize = this.changeSize.bind(this);
    }

    bindToDom() {
        this.containerEl = document.querySelector(".hall-configuration");

        this.hallsListEl = this.containerEl.querySelector(".hall-configuration-halls-list");

        this.hallEl = this.containerEl.querySelector(".conf-step__hall-wrapper");

        this.modalEl = this.containerEl.querySelector(".modal-chair-type");

        this.onClickModal = this.onClickModal.bind(this);

        this.modalEl.addEventListener("click", this.onClickModal);

        this.btnCancelEl = this.containerEl.querySelector(".hall-configuration-btn-cancel");
        this.onClickBtnCancel = this.onClickBtnCancel.bind(this);

        this.btnCancelEl.addEventListener("click",
            this.onClickBtnCancel,
        );

        this.btnSaveEl = this.containerEl.querySelector(".hall-configuration-btn-save");

        this.onClickBtnSave = this.onClickBtnSave.bind(this);
        this.btnSaveEl.addEventListener("click", this.onClickBtnSave);
    }

    renderConfigurations(activeHall) {
        this.activeHallId = activeHall.Id;
        this.getChairs().then(() => {
            this.hallSize.renderHallSize(this.getSizeHall(this.chairs));
            this.hallEl.innerHTML = "";
            this.renderHall(this.chairs);
        });
    }

    changeSize(arg) {
        if (this.chairsCopy.length === 0) {
            this.chairs.forEach((element) => {
                this.chairsCopy.push({ ...element });
            });
        }
        const chairs = [];
        for (let i = 1; i <= arg.rows; i += 1) {
            for (let j = 1; j <= arg.places; j += 1) {
                chairs.push({
                    row: i,
                    place: j,
                    type: "1",
                });
            }
        }
        this.hallEl.innerHTML = "";
        this.renderHall(chairs);
    }

    showModal() {
        this.modalEl.classList.remove("hidden");
    }

    hideModal() {
        this.modalEl.classList.add("hidden");
    }

    onClickModal(e) {
        e.preventDefault();
        if (!e.target.classList.contains("conf-step__chair")) {
            this.hideModal();
            return;
        }

        for (let i = 0; i < this.selectedElement.classList.length; i += 1) {
            const currentClass = this.selectedElement.classList[i];
            if (currentClass != "conf-step__chair") {
                this.selectedElement.classList.remove(currentClass);
            }
        }

        for (let i = 0; i < e.target.classList.length; i += 1) {
            const currentClass = e.target.classList[i];
            if (currentClass != "conf-step__chair") {
                this.selectedElement.classList.add(currentClass);
            }
        }

        this.hideModal();
    }

    onClickBtnCancel() {
        if (this.chairsCopy.length > 0) {
            this.selectedPlace = null;
            this.chairs = [];
            this.chairsCopy.forEach((element) => {
                this.chairs.push({ ...element });
            });
            this.chairsCopy = [];
            this.hallSize.renderHallSize(this.getSizeHall(this.chairs));
            this.hallEl.innerHTML = "";
            this.renderHall(this.chairs);
        }
    }

    onClickBtnSave() {
        if (this.chairsCopy.length == 0) {
            return;
        }
        this.chairsCopy = [];
        const chairs = this.getChairsFormHall();
        if (chairs.every((chair) => chair.id)) {
            this.updateChairs(chairs);
        } else {
            this.createChairs(chairs, this.activeHallId);
        }
    }

    async updateChairs(chairs) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${_URL}chair`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ chairs }),
            });
            if (!response.ok) {
                // Если ответ не успешен, генерируем ошибку с сообщением  
                const errorMessage = await response.text();
                throw new Error(`Failed to update chairs: ${errorMessage}`);
            }
        } catch (error) {
            // Логируем ошибку запроса  
            console.error("Error updating chairs:", error);
        }
    }

    async createChairs(chairs, hallId) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${_URL}chair/${hallId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ chairs }),
            });
        } catch (error) {
            console.error(error);
        }
    }

    async getChairs() {
        const token = localStorage.getItem('token');
        try {
            const jsonResponse = await fetch(`${_URL}hall/${this.activeHallId}/chairs`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );

            if (!jsonResponse.ok) {
                const errorMessage = await jsonResponse.text();
                throw new Error(`Failed to fetch chairs: ${errorMessage}`);
            }

            this.chairs = await jsonResponse.json();
        } catch (error) {
            console.error(error);
        }
    }

    renderHall(chairs) {
        const { rows: rowsCount, pleaces: charsInRow } = this.getSizeHall(chairs);
        for (let i = 1; i <= rowsCount; i += 1) {
            const rowEl = document.createElement("div");
            rowEl.classList.add("conf-step__row");
            rowEl.dataset.row = i;
            for (let j = 1; j <= charsInRow; j += 1) {
                const chairEl = document.createElement("span");
                chairEl.classList.add("conf-step__chair");
                chairEl.dataset.place = j;
                const chair = chairs.find((el) => +el.row === i && +el.place === j);
                if (chair.id) {
                    chairEl.dataset.chairId = chair.id;
                }
                if (+chair.type === 2) {
                    chairEl.classList.add("conf-step__chair_vip");
                } else if (+chair.type === 1) {
                    chairEl.classList.add("conf-step__chair_standart");
                } else {
                    chairEl.classList.add("conf-step__chair_disabled");
                }
                chairEl.addEventListener("click", this.onClickChair.bind(this));
                rowEl.appendChild(chairEl);
            }
            this.hallEl.appendChild(rowEl);
        }
    }

    onClickChair(e) {
        e.preventDefault();
        this.selectedElement = e.currentTarget;
        if (this.chairsCopy.length === 0) {
            this.chairs.forEach((element) => {
                this.chairsCopy.push({ ...element });
            });
        }
        this.showModal();
    }

    getChairsFormHall() {
        const chairElArray = this.hallEl.querySelectorAll(".conf-step__chair");
        const chairs = [...chairElArray]
            .map((element) => {
                let type;
                if (element.classList.contains(".conf-step__chair_vip")) {
                    type = "2";
                } else if (element.classList.contains(".conf-step__chair_standart")) {
                    type = "1";
                } else {
                    type = "0";
                }
                if (element.dataset.chairId) {
                    return {
                        id: +element.dataset.chairId,
                        type,
                    };
                }
                const row = element.parentNode.dataset.row;
                const place = element.dataset.place;
                return {
                    row, place, type,
                }
            })
            .sort((a, b) => a.id < b.id);
        return chairs;
    }

    getSizeHall(chairs) {
        return {
            rows: Math.max(...chairs.map((chair) => chair.row)),
            places: Math.max(...chairs.map((chair) => chair.place)),
        }
    }

}
