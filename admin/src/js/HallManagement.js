// import { _URL } from "./app.js";  // URL для взаимодействия с API
// import { getHalls } from "./functions.js";  // Функция для получения списка залов
// import { defaultRows, defaultChairsInRow, ticketPrice, vipTicketPrice } from "./defaultHallData.js";  // Константы для настройки залов

// // Определяем класс управления залами
// export default 
class HallManagement {
    constructor() {
        this.init();  // Инициализация
        this.halls = [];  // Массив для хранения данных о залах
    }

    // Метод инициализации
    init() {
        this.bindToDom();  // Связываем обработчики событий с элементами DOM
    }

    // Метод связывания элементов DOM с обработчиками
    bindToDom() {
        this.mainEl = document.querySelector(".main");  // Основной элемент страницы
        console.log(this.mainEl);
        this.updateHandler = this.updateHandler.bind(this);  // Привязываем метод к контексту
        this.mainEl.addEventListener("updateHall", this.updateHandler);  // Добавляем обработчик события обновления зала
        this.containerEl = document.querySelector(".hall-management");  // Контейнер управления залами
        this.btnCreateHallEl = this.containerEl.querySelector(".create-hall");  // Кнопка для создания зала
        this.onClickBtnCreateHall = this.onClickBtnCreateHall.bind(this);  // Привязка метода к контексту
        this.btnCreateHallEl.addEventListener("click", this.onClickBtnCreateHall);  // Обработчик нажатия кнопки создания зала
        this.hallListEl = this.containerEl.querySelector(".hall-list");  // Список залов
        this.modalEl = this.containerEl.querySelector(".modal-create-hall");  // Модальное окно создания зала
        this.modalBtnCloseEl = this.modalEl.querySelector(".modal-create-hall__btn-close");  // Кнопка закрытия модального окна
        this.onClickBtnModalClose = this.onClickBtnModalClose.bind(this);  // Привязка метода к контексту
        this.modalBtnCloseEl.addEventListener("click", this.onClickBtnModalClose);  // Обработчик нажатия кнопки закрытия
        this.modalInputEl = this.modalEl.querySelector(".modal-create-hall__input");  // Поле ввода имени зала
        this.modalFormEl = this.mainEl.querySelector(".modal-create-hall__form");  // Форма для создания зала
        this.onSubmitModalForm = this.onSubmitModalForm.bind(this);  // Привязка метода к контексту
        this.modalFormEl.addEventListener("submit", this.onSubmitModalForm);  // Обработчик отправки формы
    }

    // Обработчик обновления зала
    updateHandler(e) {
        console.log(e);  // Выводим событие в консоль
        this.hall = e.detail.data;  // Сохраняем данные о зале
        this.renderHalls();  // Отображаем залы
    }

    // Метод для отрисовки списка залов
    renderHalls() {
        console.log('Отображаем залы:', this.halls);  // Логируем текущие залы
        this.hallListEl.innerHTML = "";  // Очищаем список залов
        this.halls.forEach((hall) => {  // Проходим по каждому залу
            const hallEl = document.createElement("li");  // Создаем элемент списка
            hallEl.textContent = `${hall.name}`;  // Устанавливаем название зала
            const btnRemoveEl = document.createElement("button");  // Кнопка удаления
            btnRemoveEl.classList.add("conf-step__button", "conf-step__button-trash");  // Добавляем классы для стиля
            btnRemoveEl.addEventListener("click", () => this.btnRemoveHandle(hall));  // Обработчик удаления зала
            hallEl.appendChild(btnRemoveEl);  // Добавляем кнопку в элемент
            this.hallListEl.appendChild(hallEl);  // Добавляем элемент в список
        });
    }

    // Обработчик кнопки удаления зала
    btnRemoveHandle(hall) {
        this.removeHall(hall).then(() => getHalls());  // Удаляем зал и обновляем список
    }

    // Метод для удаления зала
    async removeHall(hall) {
        const token = localStorage.getItem('token');  // Получаем токен авторизации
        try {
            // Удаляем кресла зала
            await fetch(`${_URL}chair/${hall.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            // Удаляем сам зал
            await fetch(`${_URL}hall/${hall.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.log(error);  // Логируем ошибку
            return null;
        }
    }

    // Обработчик кнопки создания зала
    onClickBtnCreateHall() {
        this.showModal();  // Показываем модальное окно
    }

    // Метод для показа модального окна
    showModal() {
        this.modalEl.classList.remove("hidden");  // Убираем класс скрытия
    }

    // Обработчик кнопки закрытия модального окна
    onClickBtnModalClose(e) {
        e.preventDefault();  // Предотвращаем перезагрузку страницы
        this.hideModal();  // Скрываем модальное окно
    }

    // Метод для скрытия модального окна
    hideModal() {
        this.modalInputEl.value = "";  // Очищаем поле ввода
        this.modalEl.classList.add("hidden");  // Добавляем класс скрытия
    }

    // Обработчик отправки формы модального окна
    async onSubmitModalForm(e) {
        e.preventDefault();  // Предотвращаем перезагрузку страницы
        const hallName = this.modalInputEl.value;  // Получаем имя нового зала
        this.hideModal();  // Скрываем модальное окно

        // Добавляем новый зал и создаем по умолчанию кресла
        this.addHall(hallName).then((hallId) => {
            const defaultChairs = this.createDefaultChairs(defaultRows, defaultChairsInRow, hallId);  // Создаем стандартные кресла
            this.sendDefaultChairs(defaultChairs).then(() => getHalls(hallId));  // Отправляем кресла на сервер и обновляем список залов
        });
    }

    // Метод для добавления нового зала
    async addHall(hall) {
        const token = localStorage.getItem('token');  // Получаем токен
        try {
            // Запрос на добавление нового зала
            const jsonResponse = await fetch(`${_URL}hall`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: hall,  // Имя зала
                    ticket_price: ticketPrice,  // Цена обычного билета
                    vip_ticket_price: vipTicketPrice,  // Цена VIP-билета
                    sales: false,  // Продажи выключены
                }),
            });
            const response = await jsonResponse.json();  // Преобразуем ответ в JSON
            return response.id;  // Возвращаем ID нового зала
        } catch (error) {
            console.log(error);  // Логируем ошибку
            return null;
        }
    }

    // Метод для отправки данных о креслах на сервер
    async sendDefaultChairs(chairs) {
        const token = localStorage.getItem('token');  // Получаем токен
        try {
            await fetch(`${_URL}chair`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ chairs }),  // Отправляем данные о креслах
            });
        } catch (error) {
            console.log(error);  // Логируем ошибку
            return null;
        }
    }

    // Метод для создания массива стандартных кресел
    createDefaultChairs(defaultRows, defaultChairsInRow, hallId) {
        const defaultChairs = [];  // Массив для хранения кресел
        for (let i = 1; i <= defaultRows; i += 1) {  // Цикл по рядам
            for (let j = 1; j <= defaultChairsInRow; j += 1) {  // Цикл по креслам в ряду
                defaultChairs.push({
                    hall_id: hallId,  // ID зала
                    row: i,  // Номер ряда
                    place: j,  // Номер места
                    type: "1",  // Тип кресла
                });
            }
        }
        return defaultChairs;  // Возвращаем массив кресел
    }
}
