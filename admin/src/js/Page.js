// Импортируем зависимости для управления разными частями приложения
import { _URL } from "./app.js";
//import accordeon from "./accordeon.js"; // Модуль для аккордеона
import { getHalls } from "./functions.js"; // Функция для получения данных о залах
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
  }

  // Метод для инициализации страницы
  init() {
    this.initAccordeon(); // Инициализируем аккордеон
    this.hallManagement = new HallManagement(); // Создаем экземпляр для управления залами
    this.hallConfiguration = new HallConfiguration(); // Экземпляр для конфигурации залов
    this.priceConfiguration = new PriceConfiguration(); // Экземпляр для настройки цен
    this.seanceGrid = new SeanceGrid(); // Экземпляр для сетки сеансов
    this.openSales = new OpenSales(); // Экземпляр для управления продажами билетов
    getHalls(); // Загружаем данные о залах
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
  // Асинхронный метод для загрузки залов с обработкой ошибок
  // async getHalls() {
  //   try {
  //     this.halls = await getHalls(); // Ждем получения данных о залах и сохраняем их
  //     console.log("Полученные залы:", this.halls); // Выводим полученные залы в консоль
  //   } catch (error) {
  //     console.error("Ошибка при загрузке залов:", error); // Обрабатываем ошибки при загрузке
  //   }
  // }
}
