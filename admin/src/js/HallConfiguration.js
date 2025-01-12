import { _URL } from "./app.js";
import HallList from "./HallList.js";
import HallSize from "./HallSize.js";

// Определение класса для конфигурации зала
export default class HallConfiguration {
    constructor() {
        // Инициализация свойств
        this.activeHallId = null; // Идентификатор активного зала
        this.selectedElement = null; // Выбранный элемент
        this.chairs = []; // Массив кресел в текущем зале
        this.chairsCopy = []; // Копия массива кресел для отмены изменений
        this.init(); // Вызов метода инициализации
    }

    init() {
        // Связывание элементов DOM и инициализация подмодулей
        this.bindToDom();
        this.hallList = new HallList(this.hallsListEl); // Инициализация списка залов
        this.hallList.handlerUpdate = this.renderConfigurationOptions.bind(this); // Привязка обработчика для обновления
        this.hallSize = new HallSize(); // Инициализация объекта размера зала
        this.hallSize.handlerCangeSize = this.changeSize.bind(this); // Обработчик изменения размера
    }

    bindToDom() {
        // Поиск элементов DOM для работы с конфигурацией зала
        this.containerEl = document.querySelector(".hall-configuration");
        this.hallsListEl = this.containerEl.querySelector(".hall-configuration-halls-list");
        this.hallEl = this.containerEl.querySelector(".conf-step__hall-wrapper");
        this.modalEl = this.containerEl.querySelector(".modal-chair-type");

        // Связывание методов с текущим контекстом
        this.onClickModal = this.onClickModal.bind(this);
        this.modalEl.addEventListener("click", this.onClickModal);

        this.btnCancelEl = this.containerEl.querySelector(".hall-configuration-btn-cancel");
        this.onClickBtnCancel = this.onClickBtnCancel.bind(this);
        this.btnCancelEl.addEventListener("click", this.onClickBtnCancel);

        this.btnSaveEl = this.containerEl.querySelector(".hall-configuration-btn-save");
        this.onClickBtnSave = this.onClickBtnSave.bind(this);
        this.btnSaveEl.addEventListener("click", this.onClickBtnSave);
    }

    renderConfigurationOptions(activeHall) {
        // Установка активного зала и отображение его конфигурации
        this.activeHallId = activeHall.Id;
        this.getChairs().then(() => {
            this.hallSize.renderHallSize(this.getSizeHall(this.chairs));
            this.hallEl.innerHTML = "";
            this.renderHall(this.chairs);
        });
    }

    changeSize(arg) {
        // Изменение размеров зала с сохранением предыдущей конфигурации
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
        // Показать модальное окно выбора типа кресла
        this.modalEl.classList.remove("hidden");
    }

    hideModal() {
        // Скрыть модальное окно
        this.modalEl.classList.add("hidden");
    }

    onClickModal(e) {
        // Обработчик клика по модальному окну
        e.preventDefault();
        if (!e.target.classList.contains("conf-step__chair")) {
            this.hideModal();
            return;
        }

        // Сначала очищаем все классы, оставляя только "conf-step__chair"  
        this.selectedElement.className = "conf-step__chair";

        // Затем добавляем классы из e.target, кроме "conf-step__chair"  
        [...e.target.classList].forEach((currentClass) => {
            if (currentClass !== "conf-step__chair") {
                this.selectedElement.classList.add(currentClass);
            }
        });
        // // Обновление классов для выбора типа кресла
        // [...this.selectedElement.classList].forEach((currentClass) => {
        //     if (currentClass != "conf-step__chair") {
        //         this.selectedElement.classList.remove(currentClass);
        //     }
        // });

        // [...e.target.classList].forEach((currentClass) => {
        //     if (currentClass != "conf-step__chair") {
        //         this.selectedElement.classList.add(currentClass);
        //     }
        // });

        this.hideModal();
    }

    onClickBtnCancel() {
        // Обработчик для кнопки отмены
        if (this.chairsCopy.length > 0) {
            this.selectedPlace = null;
            this.chairs = this.chairsCopy.map((element) => ({ ...element }));
            this.chairsCopy = [];
            this.hallSize.renderHallSize(this.getSizeHall(this.chairs));
            this.hallEl.innerHTML = "";
            this.renderHall(this.chairs);
        }
    }

    onClickBtnSave() {
        // Обработчик для кнопки сохранения
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
        // Асинхронное обновление кресел через API
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
                const errorMessage = await response.text();
                throw new Error(`Failed to update chairs: ${errorMessage}`);
            }
        } catch (error) {
            console.log("Error updating chairs:", error);
        }
    }

    async createChairs(chairs, hallId) {
        // Создание новых кресел через API
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
            console.log(error);
        }
    }

    async getChairs() {
        // Получение списка кресел через API
        const token = localStorage.getItem('token');
        try {
            const jsonResponse = await fetch(`${_URL}hall/${this.activeHallId}/chairs`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!jsonResponse.ok) {
                const errorMessage = await jsonResponse.text();
                throw new Error(`Failed to fetch chairs: ${errorMessage}`);
            }
            this.chairs = await jsonResponse.json();
        } catch (error) {
            console.log(error);
        }
    }

    renderHall(chairs) {
        // Рендеринг зала с указанными креслами
        const { rows: rowsCount, places: charsInRow } = this.getSizeHall(chairs);
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
        // Обработчик клика по креслу
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
        // Получение конфигурации кресел из зала
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
                };
            })
            .sort((a, b) => a.id < b.id);
        return chairs;
    }

    getSizeHall(chairs) {
        // Определение размеров зала
        return {
            rows: Math.max(...chairs.map((chair) => chair.row)),
            places: Math.max(...chairs.map((chair) => chair.place)),
        };
    }
}
