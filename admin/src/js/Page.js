// Импортируем зависимости для управления разными частями приложения
import accordeon from "./accordeon.js"; // Модуль для аккордеона
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
    accordeon(); // Инициализируем аккордеон
    this.hallManagement = new HallManagement(); // Создаем экземпляр для управления залами
    this.hallConfiguration = new HallConfiguration(); // Экземпляр для конфигурации залов
    this.priceConfiguration = new PriceConfiguration(); // Экземпляр для настройки цен
    this.seanceGrid = new SeanceGrid(); // Экземпляр для сетки сеансов
    this.openSales = new OpenSales(); // Экземпляр для управления продажами билетов
    this.loadHalls(); // Загружаем данные о залах
  }

  // Асинхронный метод для загрузки залов с обработкой ошибок
  async loadHalls() {
    try {
      this.halls = await getHalls(); // Ждем получения данных о залах и сохраняем их
      console.log("Полученные залы:", this.halls); // Выводим полученные залы в консоль
    } catch (error) {
      console.error("Ошибка при загрузке залов:", error); // Обрабатываем ошибки при загрузке
    }
  }
}
