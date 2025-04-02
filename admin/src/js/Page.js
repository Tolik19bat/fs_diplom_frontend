// Импортируем модули для управления различными частями приложения
import Fetch from "./Fetch.js"; // Модуль для выполнения HTTP-запросов
import HallManagement from "./HallManagement.js"; // Управление залами
import HallConfiguration from "./HallConfiguration.js"; // Настройка залов
import PriceConfiguration from "./PriceConfiguration.js"; // Конфигурация цен
import SeanceGrid from "./SeanceGrid.js"; // Управление сеансами
import OpenSales from "./OpenSales.js"; // Открытие продаж

// Определяем класс Page, который управляет всей страницей
export default class Page {
  /**
   * Конструктор класса Page
   * @param {HTMLElement} container - DOM-элемент, в котором будет инициализирована страница
   */
  constructor(container) {
    this.containerEl = container; // Сохраняем контейнер в свойство объекта
    this.halls = []; // Инициализируем пустой массив для хранения залов
  }

  /**
   * Асинхронный метод инициализации страницы
   * Загружает данные о залах и инициализирует все модули
   */
  async init() {
    try {
      // Загружаем данные о залах с сервера
      this.halls = await this.getHalls();

      // Проверяем, что данные загружены корректно
      if (!this.halls || !Array.isArray(this.halls)) {
        throw new Error("Данные о залах не загружены или имеют неверный формат");
      }

      // Инициализируем аккордеон
      this.initAccordeon();

      // Создаем экземпляры классов для управления различными модулями
      this.hallManagement = new HallManagement(this.halls);
      this.hallConfiguration = new HallConfiguration(this.halls);
      this.priceConfiguration = new PriceConfiguration(this.halls);
      this.seanceGrid = new SeanceGrid(this.halls);
      this.openSales = new OpenSales(this.halls);
    } catch (error) {
      // Логируем ошибку в консоль
      console.error("Ошибка при инициализации:", error);
      // Можно добавить обработку ошибки, например, показ уведомления пользователю
    }
  }

  /**
   * Метод для инициализации аккордеона
   * Добавляет обработчики событий на заголовки разделов
   */
  initAccordeon() {
    // Получаем список заголовков аккордеона
    const headers = Array.from(this.containerEl.querySelectorAll(".conf-step__header"));

    // Добавляем обработчик клика для каждого заголовка
    headers.forEach((header) =>
      header.addEventListener("click", () => {
        // Переключаем классы, чтобы скрыть или показать содержимое секции
        header.classList.toggle("conf-step__header_closed");
        header.classList.toggle("conf-step__header_opened");
      })
    );
  }

  /**
   * Асинхронный метод для получения списка залов с сервера
   * @returns {Promise<Array>} - Возвращает массив объектов с данными о залах
   */
  async getHalls() {
    // Отправляем GET-запрос на сервер для получения списка залов
    return await Fetch.send("GET", "hall");
  }
}