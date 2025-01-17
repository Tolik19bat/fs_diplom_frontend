import { _URL, _URL_PAYMENT } from "./app.js"; // Импортируем URL-ы для запросов
import ChairsInHall from "./ChairsInHall.js"; // Импортируем класс для управления креслами в зале

export default class Hall {
    constructor() {
        // Инициализируем свойства для хранения данных о сеансе, фильме, зале и т.д.
        this.seance = null;
        this.movie = null;
        this.hall = null;
        this.date = null;
        this.selectedChairsId = []; // Массив для хранения ID выбранных кресел
        this.selectedChairs = []; // Массив для хранения информации о выбранных креслах
        this.init(); // Вызываем инициализацию
    }
    
    init() {
        this.bindToDom(); // Привязываем элементы DOM для взаимодействия
        const seanceId = this.getDataFromSessionStorage(); // Получаем ID сеанса из sessionStorage
        this.getBuyingInfo(seanceId).then(() => {
            this.renderBuyingInfo(); // Отображаем информацию о покупке
            this.renderPrices(); // Отображаем цены на билеты
            this.chairsInHall = new ChairsInHall(this.hall.id, this.seance, this.date); // Инициализируем класс для кресел
            this.chairsInHall.setChairsId = this.setChairsId.bind(this); // Привязываем метод для установки ID кресел
        });
    }

    bindToDom() {
        // Получаем элементы DOM для последующего использования
        this.containerEl = document.querySelector("main");
        this.buyingInfoDateEl = this.containerEl.querySelector(".buying__info-date");
        this.buyingInfoTitleEl = this.containerEl.querySelector(".buying__info-title");
        this.buyingInfoStartEl = this.containerEl.querySelector(".buying__info-start");
        this.buyingInfoHallEl = this.containerEl.querySelector(".buying__info-hall");
        this.priceStandartEl = this.containerEl.querySelector(".buying-scheme__chair_standart + .buying-scheme__legend-value");
        this.priceVipEl = this.containerEl.querySelector(".buying-scheme__chair_vip + .buying-scheme__legend-value");
        
        // Привязываем кнопку подтверждения и добавляем обработчик
        this.acceptinBtnEl = this.containerEl.querySelector(".acceptin-button");
        if (this.acceptinBtnEl) {
            this.acceptinBtnEl.addEventListener("click", this.onClickAcceptinBtn.bind(this));
        } else {
            console.warn("Кнопка не найдена.");
        }
    }

    getDataFromSessionStorage() {
        // Извлекаем дату и ID сеанса из sessionStorage
        this.date = sessionStorage.getItem("date");
        const seanceId = sessionStorage.getItem("seanceId");

        if (!this.date || !seanceId) {
            console.warn("Не удалось получить данные из sessionStorage.");
        }
        return seanceId; // Возвращаем ID сеанса
    }

    async getBuyingInfo(seanceId) {
        if (!seanceId) {
            console.warn("ID сеанса не указан.");
            return;
        }
        try {
            const response = await fetch(`${_URL}seance/${seanceId}`); // Отправляем запрос для получения информации о сеансе
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
            }
            const jsonResponse = await response.json(); // Парсим ответ JSON
            this.hall = jsonResponse.hall; // Сохраняем данные зала
            this.movie = jsonResponse.movie; // Сохраняем данные фильма
            this.seance = jsonResponse.seance; // Сохраняем данные сеанса
        } catch (error) {
            console.error("Ошибка при получении информации о покупке:", error);
        }
    }

    renderBuyingInfo() {
        if (!this.date || !this.movie || !this.seance || !this.hall) {
            console.error("Недостаточно данных для отображения.");
            return;
        }
        // Отображаем дату, название фильма, начало сеанса и зал
        this.buyingInfoDateEl.textContent = new Date(this.date).toLocaleString("ru", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        this.buyingInfoTitleEl.textContent = this.movie.title;
        this.buyingInfoStartEl.textContent = "Начало сеанса: " + this.seance.start;
        this.buyingInfoHallEl.textContent = this.hall.name;
    }

    renderPrices() {
        if (!this.hall) {
            console.error("Нет данных о зале.");
            return;
        }
        // Устанавливаем цены на стандартные и VIP кресла
        this.priceVipEl.textContent = `${this.hall.vip_ticket_price} ₽`;
        this.priceStandartEl.textContent = `${this.hall.ticket_price} ₽`;
    }

    async onClickAcceptinBtn(e) {
        e.preventDefault(); // Предотвращаем стандартное действие кнопки
        if (this.selectedChairsId.length === 0) {
            console.warn("Не выбрано кресел.");
            return;
        }
        await this.getSelectedChairs(); // Получаем информацию о выбранных креслах
        this.chairsInHall.clearChairsId(); // Очищаем ID кресел
    }

    sendDataToSessionStorage() {
        try {
            const paymentInfo = {
                date: this.date,
                movieTitle: this.movie.title,
                chairs: this.selectedChairs,
                hallName: this.hall.name,
                seance: this.seance,
                cost: this.getCost(),
            };
            if (!this.date || !this.movie || !this.selectedChairs.length || !this.hall.name || !this.seance) {
                throw new Error("Отсутствуют данные для сохранения.");
            }
            sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo)); // Сохраняем информацию
            this.selectedChairs = [];
        } catch (error) {
            console.error("Ошибка при сохранении:", error.message);
        }
    }

    setChairsId(chairsId) {
        this.selectedChairsId = [...chairsId]; // Устанавливаем ID выбранных кресел
    }

    async getSelectedChairs() {
        for (const chairId of this.selectedChairsId) {
            const resolve = await this.getChair(chairId); // Получаем информацию о кресле
            this.selectedChairs.push(resolve); // Добавляем в массив выбранных
        }
        this.goToPagePayment(); // Переходим на страницу оплаты
    }

    async getChair(chairId) {
        try {
            const jsonResponse = await fetch(`${_URL}chair/${chairId}`); // Запрос на получение данных кресла
            return jsonResponse.json(); // Возвращаем результат
        } catch (error) {
            console.error(error);
        }
    }

    getCost() {
        return this.selectedChairs.reduce((sum, chair) => {
            const type = +chair.type;
            if (type === 1) {
                return sum + this.hall.ticket_price; // Цена обычного билета
            } else if (type === 2) {
                return sum + this.hall.vip_ticket_price; // Цена VIP билета
            } else {
                throw new Error("Некорректный тип кресла.");
            }
        }, 1);
    }

    goToPagePayment() {
        this.sendDataToSessionStorage(); // Сохраняем информацию о платеже
        this.selectedChairsId = []; // Сбрасываем выбор
        this.selectedChairs = [];
        window.location.href = _URL_PAYMENT; // Перенаправляем на страницу оплаты
    }
}
