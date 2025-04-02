// Импортируем класс HallSeances, который отвечает за управление сеансами в зале
import HallSeances from "./HallSeances.js";

// Экспортируемый класс для управления списком сеансов
export default class SeancesList {
  /**
   * Конструктор класса
   * @param {Array} movies - Массив фильмов
   * @param {Array} halls - Массив залов (по умолчанию пустой)
   */
  constructor(movies, halls = []) {
    this.movies = movies; // Сохраняем список фильмов
    this.halls = halls; // Сохраняем список залов
    this.hallsSeances = []; // Создаём пустой массив для объектов HallSeances
    this.init(); // Инициализируем класс
  }

  /**
   * Метод инициализации
   * Привязывает события к DOM и вызывает отрисовку сеансов
   */
  init() {
    this.bindToDom(); // Привязываем обработчики событий к элементам DOM
    this.getHallsSeances(this.halls); // Создаём объекты HallSeances для залов
    this.renderHallsSeances(); // Отрисовываем сеансы в интерфейсе
  }

  /**
   * Метод привязки событий к элементам DOM
   */
  bindToDom() {
    // Получаем основной контейнер страницы
    this.mainEl = document.querySelector(".main");

    // Привязываем обработчик события "updateHall" к текущему контексту
    this.hallUpdateHandler = this.hallUpdateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.hallUpdateHandler); // Слушаем обновление залов

    // Привязываем обработчик события "updateHallsSeances" к текущему контексту
    this.updateHallsSeances = this.updateHallsSeances.bind(this);
    this.mainEl.addEventListener("updateHallsSeances", this.updateHallsSeances); // Слушаем обновление сеансов

    // Получаем контейнер, в который будут добавляться сеансы
    this.containerEl = document.querySelector(".conf-step__seances");
  }

  /**
   * Обработчик события обновления залов
   * @param {Event} e - Событие, содержащее новые данные о залах
   */
  hallUpdateHandler(e) {
    this.halls = e.detail.data; // Обновляем список залов
    this.getHallsSeances(this.halls); // Пересоздаём объекты HallSeances
    this.renderHallsSeances(); // Перерисовываем сеансы
  }

  /**
   * Метод создания объектов HallSeances для каждого зала
   * @param {Array} halls - Массив залов
   */
  getHallsSeances(halls) {
    this.hallsSeances = []; // Очищаем массив объектов HallSeances
    halls.forEach((hall) => {
      const hallSeances = new HallSeances(hall, this.movies); // Создаём объект HallSeances
      this.hallsSeances.push(hallSeances); // Добавляем его в массив
    });
  }

  /**
   * Метод отрисовки всех сеансов в DOM
   */
  async renderHallsSeances() {
    this.containerEl.innerHTML = ""; // Очищаем контейнер перед добавлением новых элементов
    for (const item of this.hallsSeances) {
      const element = await item.getSeancesHallElement(); // Получаем DOM-элемент с сеансами
      this.containerEl.appendChild(element); // Добавляем его в контейнер
    }
  }

  /**
   * Метод обновления списка сеансов (пересоздаёт объекты и перерисовывает их)
   */
  updateHallsSeances() {
    this.getHallsSeances(this.halls); // Обновляем объекты HallSeances
    this.renderHallsSeances(); // Перерисовываем сеансы в интерфейсе
  }
}