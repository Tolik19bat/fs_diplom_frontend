// Импортируем зависимости для управления разными частями приложения
// import { _URL } from "./app.js";
import Fetch from "./Fetch.js";
//import accordeon from "./accordeon.js"; // Модуль для аккордеона
import HallManagement from "./HallManagement.js"; // Управление залами
import HallConfiguration from "./HallConfiguration.js"; // Конфигурация залов
import PriceConfiguration from "./PriceConfiguration.js"; // Конфигурация цен
import SeanceGrid from "./SeanceGrid.js"; // Сетка сеансов
import OpenSales from "./OpenSales.js"; // Управление продажами

// Класс для управления всей страницей
export default class Page {
  // Конструктор принимает элемент-контейнер для привязки страницы
  constructor(container) {
    this.containerEl = container; // Сохраняем контейнер для дальнейшего использования
    this.halls = []; // Инициализируем массив залов
    // Логирование созданного объекта
    // console.log("Создан новый объект Page:", this);
  }

  // Метод для инициализации страницы
  async init() {
    try {
      this.halls = await this.getHalls();
      this.initAccordeon();
      this.hallManagement = new HallManagement(this.halls);
      this.hallConfiguration = new HallConfiguration(this.halls);
      this.priceConfiguration = new PriceConfiguration(this.halls);
      this.seanceGrid = new SeanceGrid(this.halls);
      this.openSales = new OpenSales(this.halls);
    } catch (error) {
      console.error('Ошибка при инициализации:', error);
      // Дополнительная обработка ошибки, например, показ сообщения пользователю
    }
  }

  initAccordeon() {
    const headers = Array.from(
      this.containerEl.querySelectorAll(".conf-step__header")
    );
    headers.forEach((header) =>
      header.addEventListener("click", () => {
        header.classList.toggle("conf-step__header_closed");
        header.classList.toggle("conf-step__header_opened");
      })
    );
  }
  // Асинхронный метод для загрузки залов с сервера
  async getHalls() {
    return await Fetch.send("GET", "hall"); // Отправляем асинхронный GET-запрос на сервер для получения списка залов

    // try {
    //   // Отправляем GET-запрос к API для получения списка залов
    //   const jsonResponse = await fetch(`${_URL}hall`, {
    //     method: "GET", // Метод запроса
    //     headers: { Authorization: `Bearer ${token}` }, // Передаём токен авторизации в заголовках
    //   });

    //   // Преобразуем ответ в JSON и возвращаем результат
    //   return await jsonResponse.json();
    // } catch (error) {
    //   // Если произошла ошибка во время запроса, выводим её в консоль
    //   console.error("Ошибка при загрузке залов:", error);
    // }
  }
}
