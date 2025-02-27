// import { _URL } from "./app.js";
// import Fetch from "./Fetch.js";

// Класс для обработки информации о билете
export default class Ticket {
  constructor() {
    this.init(); // Инициализируем класс при создании экземпляра
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязываем элементы DOM
    this.getDataFromSessionStorage(); // Загружаем данные из sessionStorage

    // Получаем QR-код и после успешного выполнения отображаем информацию
    this.getQrCode().then((resolve) => {
      this.renderInfo(resolve);
    });
  }

  // Привязка элементов DOM
  bindToDom() {
    this.containerEl = document.querySelector("main"); // Главный контейнер
    this.ticketDateEl = this.containerEl.querySelector(".ticket__date"); // Дата сеанса
    this.ticketTitleEl = this.containerEl.querySelector(".ticket__title"); // Название фильма
    this.ticketChairsEl = this.containerEl.querySelector(".ticket__chairs"); // Выбранные места
    this.ticketHallEl = this.containerEl.querySelector(".ticket__hall"); // Название зала
    this.ticketStartEl = this.containerEl.querySelector(".ticket__start"); // Время начала сеанса
    this.ticketInfoQrEl = this.containerEl.querySelector(".ticket__info-qr"); // Контейнер для QR-кода
  }

  // Отображение информации о билете
  renderInfo(qrCodeUrl) {
    this.ticketDateEl.textContent = new Date(
      this.paymentInfo.date
    ).toLocaleString("ru", { day: "numeric", month: "long", year: "numeric" });
    this.ticketTitleEl.textContent = this.paymentInfo.movieTitle;

    // Формируем строку с номерами рядов и мест
    this.ticketChairsEl.textContent = this.paymentInfo.chairs
      .map((chair) => `ряд:${chair.row} место:${chair.place}`)
      .join(", ");

    this.ticketHallEl.textContent = this.paymentInfo.hallName;
    this.ticketStartEl.textContent = this.paymentInfo.seance.start;
    this.ticketInfoQrEl.src = qrCodeUrl; // Устанавливаем QR-код
  }

  // Получение данных о платеже из sessionStorage
  getDataFromSessionStorage() {
    this.paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
  }

  // Получение QR-кода через API
  async getQrCode() {
    const response = await Fetch.send("POST", "qrcode", {
      // Отправляем POST-запрос для создания QR-кода, передавая данные билета
      bodyJson: {
        // Передаем данные в формате JSON в теле запроса
        ticketTitle: this.paymentInfo.movieTitle, // Заголовок билета — название фильма
        ticketChairs: this.paymentInfo.chairs // Формирование строки с информацией о креслах
          .map((chair) => `ряд:${chair.row} место:${chair.place}`) // Для каждого кресла формируем строку вида "ряд:<row> место:<place>"
          .join(", "), // Объединяем все строки через запятую для удобства отображения
        ticketHall: this.paymentInfo.hallName, // Название зала, где проходит сеанс
        ticketStart: this.paymentInfo.seance.start, // Время начала сеанса
      },
    });

    return response; // Возвращаем полученный ответ, содержащий информацию о созданном QR-коде

    // try {
    //   const jsonResponse = await fetch(`${_URL}qrcode`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       ticketTitle: this.paymentInfo.movieTitle, // Название фильма
    //       ticketChairs: this.paymentInfo.chairs
    //         .map((chair) => `ряд:${chair.row} место:${chair.place}`)
    //         .join(", "), // Места
    //       ticketHall: this.paymentInfo.hallName, // Название зала
    //       ticketStart: this.paymentInfo.seance.start, // Время начала сеанса
    //     }),
    //   });

    //   const response = await jsonResponse.json(); // Парсим ответ
    //   return response;
    // } catch (error) {
    //   console.error(error); // Логируем ошибку, если запрос не удался
    // }
  }
}
