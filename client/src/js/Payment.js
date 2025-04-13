import { _URL_TICKET } from "./app.js";
import Fetch from "./Fetch.js";

// Класс для обработки платежей
export default class Payment {
  constructor() {
    this.error = null; // Переменная для хранения ошибки
    this.init(); // Инициализация класса
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязываем элементы DOM
    this.getDataFromSessionStorage(); // Загружаем данные из sessionStorage
    this.renderInfo(); // Отображаем информацию о платеже
  }

  // Привязка элементов DOM
  bindToDom() {
    this.containerEl = document.querySelector("main"); // Получаем главный контейнер
    this.ticketDateEl = this.containerEl.querySelector(".ticket__date"); // Дата сеанса
    this.ticketTitleEl = this.containerEl.querySelector(".ticket__title"); // Название фильма
    this.ticketChairsEl = this.containerEl.querySelector(".ticket__chairs"); // Выбранные места
    this.ticketHallEl = this.containerEl.querySelector(".ticket__hall"); // Название зала
    this.ticketStartEl = this.containerEl.querySelector(".ticket__start"); // Время начала сеанса
    this.ticketCostEl = this.containerEl.querySelector(".ticket__cost"); // Стоимость билета
    this.acceptinButtonEl = this.containerEl.querySelector(".acceptin-button"); // Кнопка подтверждения

    // Добавляем обработчик события на кнопку подтверждения
    this.acceptinButtonEl.addEventListener(
      "click",
      this.onClickAcceptinButtonEl.bind(this)
    );
  }

  // Отображение информации о билете
  renderInfo() {
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
    this.ticketCostEl.textContent = this.paymentInfo.cost;
  }

  // Получение данных о платеже из sessionStorage
  getDataFromSessionStorage() {
    this.paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));
  }

  // Обработчик нажатия на кнопку подтверждения
  async onClickAcceptinButtonEl() {
    // console.log("onClickAcceptinButtonEl");
    // console.log(this.paymentInfo.chairs);
    // Перебираем все выбранные места и сохраняем информацию о каждом
    this.paymentInfo.chairs.forEach((chair, idx) => {
      this.saveTicketInformation(chair.id).then(() => {
        // Если это последнее место, проверяем, есть ли ошибка, и перенаправляем пользователя
        if (this.paymentInfo.chairs.length === idx + 1) {
          if (!this.error) {
            window.location.href = _URL_TICKET; // Переход на страницу с билетом
          }
        }
      });
    });
  }

  // Метод сохранения информации о билете
  async saveTicketInformation(chairId) {
    // console.log(chairId);
    
  // Преобразуем дату в формат YYYY-MM-DD
  const date = new Date(this.paymentInfo.date);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // Формируем тело запроса
  const requestBody = {
    date: formattedDate, // Используем отформатированную дату
    seance_id: this.paymentInfo.seance.id, // ID сеанса
    chair_id: chairId, // ID кресла
  };

  // Выводим тело запроса в консоль
  // console.log("Тело запроса для создания билета:", JSON.stringify(requestBody, null, 2));


    try {
      // Отправляем POST-запрос для создания билета
      const response = await Fetch.send("POST", "ticket", {
        bodyJson: requestBody,
        cleanResponse: true, // Опция cleanResponse: true означает, что метод Fetch.send вернет "сырой" response,
        // а не автоматически обработанный JSON или текст
      });
      if (!response.ok) {
        
      alert("Это кресло уже занято. Выбери другое");
        throw new Error(response.status);
      }
    } catch (error) {
      this.error = error;
    }

    // try {
    //   const response = await fetch(`${_URL}ticket`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       date: new Date(this.paymentInfo.date).toLocaleDateString(), // Форматируем дату
    //       seance_id: this.paymentInfo.seance.id, // ID сеанса
    //       chair_id: chairId, // ID кресла
    //     }),
    //   });

    //   // Проверяем, успешно ли выполнен запрос
    //   if (!response.ok) {
    //     throw new Error(response.status); // Выбрасываем ошибку, если статус не 200
    //   }
    // } catch (error) {
    //   this.error = error; // Сохраняем ошибку
    // }
  }
}
