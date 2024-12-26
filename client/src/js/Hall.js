import { _URL, _URL_PAYMENT } from "./app.js";
import ChairsInHall from "./ChairsInHall.js";

export default class Hall {
    constructor() {
        this.seance = null;
        this.movie = null;
        this.hall = null;
        this.date = null;
        this.selectedChairsId = [];
        this.selectedChairs = [];
        this.init();
    }
    init() {  
        this.bindToDom(); // Привязка элементов DOM  
        const seanceId = this.getDataFromSessionStorage(); // Получение ID сеанса из sessionStorage  
        this.getBuyingInfo(seanceId).then(() => {  
            this.renderBuyingInfo(); // Отображение информации о покупке  
            this.renderPrices(); // Отображение цен  
            this.chairsInHall = new ChairsInHall(this.hall.id, this.seance, this.date); // Инициализация класса для кресел  
            this.chairsInHall.setChairsId = this.setChairsId.bind(this); // Привязка метода  
        });  
    }

    bindToDom() {  
        this.containerEl = document.querySelector("main");  
        
        // Привязываем элементы DOM  
        this.buyingInfoDateEl = this.containerEl.querySelector(".buying__info-date");  
        this.buyingInfoTitleEl = this.containerEl.querySelector(".buying__info-title");  
        this.buyingInfoStartEl = this.containerEl.querySelector(".buying__info-start");  
        this.buyingInfoHallEl = this.containerEl.querySelector(".buying__info-hall");  
        this.priceStandartEl = this.containerEl.querySelector(".buying-scheme__chair_standart + .buying-scheme__legend-value");  
        this.priceVipEl = this.containerEl.querySelector(".buying-scheme__chair_vip + .buying-scheme__legend-value");  
        
        // Привязываем кнопку и добавляем обработчик  
        this.acceptinBtnEl = this.containerEl.querySelector(".acceptin-button");  
        if (this.acceptinBtnEl) {  
            this.acceptinBtnEl.addEventListener("click", this.onClickAcceptinBtn.bind(this));  
        } else {  
            console.warn("Кнопка не найдена.");  
        }  
    }  
    
    getDataFromSessionStorage() {  
        this.date = sessionStorage.getItem("date");  
        const seanceId = sessionStorage.getItem("seanceId");  
        
        // Логируем, если данные не найдены  
        if (!this.date || !seanceId) {  
            console.warn("Не удалось получить данные из sessionStorage: дата или ID сеанса отсутствуют.");  
        }  
        
        return seanceId;  
    }  
    
    async getBuyingInfo(seanceId) {  
        if (!seanceId) {  
            console.warn("ID сеанса не указан.");  
            return;  
        }  
    
        try {  
            const response = await fetch(`${_URL}seance/${seanceId}`);  
            
            // Проверка статуса ответа  
            if (!response.ok) {  
                throw new Error(`Ошибка ${response.status}: ${response.statusText}`);  
            }  
            
            const jsonResponse = await response.json();  
            this.hall = jsonResponse.hall;  
            this.movie = jsonResponse.movie;  
            this.seance = jsonResponse.seance;  
        } catch (error) {  
            console.error("Ошибка при получении информации о покупке:", error);  
        }  
    }

    renderBuyingInfo() {  
        if (!this.date || !this.movie || !this.seance || !this.hall) {  
            console.error("Недостаточно данных для отображения информации о покупке.");  
            return;  
        }  
    
        this.buyingInfoDateEl.textContent = new Date(this.date).toLocaleString("ru", {  
            day: "numeric",  
            month: "long",  
            year: "numeric"  
        });  
        this.buyingInfoTitleEl.textContent = this.movie.title;  
        this.buyingInfoStartEl.textContent = "Начало сеанса: " + this.seance.start;  
        this.buyingInfoHallEl.textContent = this.hall.name;  
    }  
    
    renderPrices() {  
        if (!this.hall) {  
            console.error("Нет данных о зале для отображения цен.");  
            return;  
        }  
    
        this.priceVipEl.textContent = `${this.hall.vip_ticket_price} ₽`; // добавление символа рубля  
        this.priceStandartEl.textContent = `${this.hall.ticket_price} ₽`; // добавление символа рубля  
    }

    async onClickAcceptinBtn(e) {  
        e.preventDefault(); // предотвращаем стандартное поведение формы  
    
        // Проверяем, выбраны ли кресла  
        if (this.selectedChairsId.length === 0) {  
            console.warn("Не выбрано ни одного кресла."); // для уведомления пользователя  
            return;  
        }  
    
        // Получаем информацию о выбранных креслах  
        await this.getSelectedChairs();  
    
        // Очищаем идентификаторы кресел в зале  
        this.chairsInHall.clearChairsId();  
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

            // Валидация данных  
            if (!this.date || !this.movie || !this.selectedChairs.length || !this.hall.name || !this.seance) {
                throw new Error("Некоторые данные отсутствуют для сохранения.");
            }

            sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
            this.selectedChairs = []; // Очищаем выбранные кресла  
        } catch (error) {
            console.error("Ошибка при сохранении данных в sessionStorage:", error.message);
        }
    }

    setChairsId(chairsId) {
        this.selectedChairsId = [...chairsId];
    }

    async getSelectedChairs() {
        for (const chairId of this.selectedChairsId) {
            const resolve = await this.getChair(chairId);
            this.selectedChairs.push(resolve);
        }
        this.goToPagePayment();
    }

    async getChair(chairId) {
        try {
            const jsonResponse = await fetch(`${_URL}chair/${chairId}`);
            return jsonResponse.json();
        } catch (error) {
            console.error(error);
        }
    }

    getCost() {
        return this.selectedChairs.reduce((sum, chair) => {
            const type = +chair.type; // Приводим к числу  
            if (type === 1) {
                return sum + this.hall.ticket_price; // обычный билет  
            } else if (type === 2) {
                return sum + this.hall.vip_ticket_price; // VIP билет  
            } else {
                throw new Error("Некорректный тип места в зале");
            }
        }, 1);
    }

    goToPagePayment() {
        this.sendDataToSessionStorage();
        this.selectedChairsId = [];
        this.selectedChairs = [];
        window.location.href = _URL_PAYMENT;
    }
}
