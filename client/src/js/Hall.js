import { _URL_PAYMENT } from "./app.js"; // Импортируем URL-ы для запросов
import ChairsInHall from "./ChairsInHall.js"; // Импортируем класс для управления креслами в зале
import Fetch from "./Fetch.js";

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
      this.chairsInHall = new ChairsInHall(
        this.hall.id,
        this.seance,
        this.date
      ); // Инициализируем класс для кресел
      this.chairsInHall.setChairsId = this.setChairsId.bind(this); // Привязываем метод для установки ID кресел
    });
  }

  bindToDom() {
    // Получаем элементы DOM для последующего использования
    this.containerEl = document.querySelector("main");
    this.buyingInfoDateEl =
      this.containerEl.querySelector(".buying__info-date");
    this.buyingInfoTitleEl = this.containerEl.querySelector(
      ".buying__info-title"
    );
    this.buyingInfoStartEl = this.containerEl.querySelector(
      ".buying__info-start"
    );
    this.buyingInfoHallEl =
      this.containerEl.querySelector(".buying__info-hall");
    this.priceStandartEl = this.containerEl.querySelector(
      ".buying-scheme__chair_standart + .buying-scheme__legend-value"
    );
    this.priceVipEl = this.containerEl.querySelector(
      ".buying-scheme__chair_vip + .buying-scheme__legend-value"
    );

    // Привязываем кнопку подтверждения и добавляем обработчик
    this.acceptinBtnEl = this.containerEl.querySelector(".acceptin-button");
    this.acceptinBtnEl.addEventListener(
      "click",
      this.onClickAcceptinBtn.bind(this)
    );
  }
  getDataFromSessionStorage() {
    // Получаем строку даты из sessionStorage
    const rawDate = sessionStorage.getItem("date");
    this.date = rawDate;
  
    // Преобразуем строку в объект Date
    const selectedDateObj = new Date(rawDate);
  
    // Форматируем выбранную дату в YYYY-MM-DD
    const selectedDate = selectedDateObj.toISOString().split("T")[0];
  
    const clickedTime = sessionStorage.getItem("startTime");
  
    // Получаем текущую дату и время
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0]; // формат YYYY-MM-DD
  
    // Преобразуем текущее время в строку HH:MM
    const currentHours = now.getHours().toString().padStart(2, "0");
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${currentHours}:${currentMinutes}`;
  
    // Преобразуем время в минуты
    const [clickedHours, clickedMinutes] = clickedTime.split(":").map(Number);
    const [currentHoursNum, currentMinutesNum] = currentTime.split(":").map(Number);
    const clickedTotalMinutes = clickedHours * 60 + clickedMinutes;
    const currentTotalMinutes = currentHoursNum * 60 + currentMinutesNum;
  
    // ✅ Сравнение даты и времени
    if (selectedDate === todayDate) {
      if (clickedTotalMinutes <= currentTotalMinutes) {
        alert(`На это время ${clickedTime} сегодня билет уже нельзя купить. Выберите другое время`);
        window.history.back();
        return;
      }
    }
  
    // console.log("Выбранное время сеанса:", clickedTime);
    // console.log("Выбранная дата (оригинал):", rawDate);
    // console.log("Выбранная дата (нормализованная):", selectedDate);
    // console.log("Сегодняшняя дата:", todayDate);
  
    return sessionStorage.getItem("seanceId");
  }
  

  async getBuyingInfo(seanceId) {
    const response = await Fetch.send("GET", `seance/${seanceId}`); // Отправляем асинхронный GET-запрос для получения информации о конкретном сеансе по его ID
    this.hall = response.hall; // Сохраняем данные зала
    this.movie = response.movie; // Сохраняем данные фильма
    this.seance = response.seance; // Сохраняем данные сеанса

    // try {
    //   const jsonResponse = await fetch(`${_URL}seance/${seanceId}`);
    //   const response = await jsonResponse.json();
    //   this.hall = jsonResponse.hall; // Сохраняем данные зала
    //   this.movie = jsonResponse.movie; // Сохраняем данные фильма
    //   this.seance = jsonResponse.seance; // Сохраняем данные сеанса
    // } catch (error) {
    //   console.error("Ошибка при получении информации о покупке:", error);
    // }
  }

  renderBuyingInfo() {
    if (!this.date || !this.movie || !this.seance || !this.hall) {
      console.error("Недостаточно данных для отображения.");
      return;
    }
    // Отображаем дату, название фильма, начало сеанса и зал
    this.buyingInfoDateEl.textContent = new Date(this.date).toLocaleString(
      "ru",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
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

  // кнопка забронировать билет
  async onClickAcceptinBtn(e) {
    e.preventDefault(); // Предотвращаем стандартное действие кнопки
    if (this.selectedChairsId.length === 0) {
      alert("Нет выбраных кресел.");
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
      if (
        !this.date ||
        !this.movie ||
        !this.selectedChairs.length ||
        !this.hall.name ||
        !this.seance
      ) {
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
    return await Fetch.send("GET", `chair/${chairId}`); // Отправляем асинхронный GET-запрос для получения информации о конкретном кресле по его ID

    // try {
    //   const jsonResponse = await fetch(`${_URL}chair/${chairId}`); // Запрос на получение данных кресла
    //   return jsonResponse.json(); // Возвращаем результат
    // } catch (error) {
    //   console.error(error);
    // }
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
