import { _URL } from "./app.js";
import HallList from "./HallList.js";

// Объявление класса OpenSales для управления продажами билетов
export default class OpenSales {
  constructor() {
    this.halls = []; // Массив для хранения залов
    this.activeHallId = null; // ID активного зала
    this.sales = false; // Статус продаж (открыты/закрыты)
    this.init(); // Инициализация класса
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязка элементов DOM к свойствам объекта
    this.getHalls().then(() => {
      // После получения данных о залах создаём новый экземпляр HallList
      this.hallList = new HallList(this.hallsListEl);
      // Привязываем метод обновления залов
      this.hallList.handlerUpdate = this.updateHalls.bind(this);
    });
  }

  // Привязка элементов DOM к свойствам класса
  bindToDom() {
    this.paragraphEl = document.querySelector(".footer__paragrarh"); // Абзац для отображения информации
    this.buttonEl = document.querySelector(".footer__button"); // Кнопка для управления продажами
    this.onClickBtn = this.onClickBtn.bind(this); // Привязка метода к контексту
    this.buttonEl.addEventListener("click", this.onClickBtn); // Добавление обработчика на кнопку
    this.hallsListEl = document.querySelector(".footer-halls-list"); // Элемент для списка залов
  }

  // Обновление информации о залах
  updateHalls(activeHall) {
    this.activeHallId = activeHall.id; // Устанавливаем ID активного зала
    this.getHalls().then(() => {
      // Получаем обновленные данные
      this.sales = this.halls.find(
        (hall) => hall.id === this.activeHallId
      ).sales; // Обновляем статус продаж
      this.renderTextBtn(); // Обновляем текст кнопки
    });
  }

  // Обработчик клика на кнопку
  onClickBtn(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение
    this.setSales().then(() => {
      // Изменяем статус продаж
      this.getHalls().then(() => {
        // Получаем обновленные данные
        this.sales = this.halls.find(
          (hall) => hall.id === this.activeHallId
        ).sales; // Обновляем статус
        this.renderTextBtn(); // Обновляем текст кнопки
      });
    });
  }

  // Отображение текста на кнопке в зависимости от статуса продаж
  renderTextBtn() {
    if (this.sales) {
      this.buttonEl.textContent = "Приостановить продажу билетов"; // Если продажи открыты
    } else {
      this.buttonEl.textContent = "Открыть продажу билетов"; // Если продажи закрыты
    }
  }

  // Асинхронный метод для получения залов с сервера
  async getHalls() {
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
    try {
      const jsonResponse = await fetch(`${_URL}hall`, {
        method: "GET", // Метод GET для получения данных
        headers: { Authorization: `Bearer ${token}` }, // Заголовок авторизации
      });
      this.halls = await jsonResponse.json(); // Сохраняем полученные данные
    } catch (error) {
      console.error(error); // Обрабатываем ошибки
    }
  }

  // Асинхронный метод для изменения статуса продаж
  async setSales() {
    const token = localStorage.getItem("token"); // Получаем токен
    try {
      await fetch(`${_URL}hall/${this.activeHallId}/sales`, {
        method: "PUT", // Метод PUT для обновления данных
        headers: {
          "Content-Type": "application/json", // Заголовок с типом контента
          Authorization: `Bearer ${token}`, // Заголовок авторизации
        },
        body: JSON.stringify({
          sales: !this.sales, // Инвертируем текущий статус продаж
        }),
      });
    } catch (error) {
      console.error(error); // Обрабатываем ошибки
    }
  }
}
