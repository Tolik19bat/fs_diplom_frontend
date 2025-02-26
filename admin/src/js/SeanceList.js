import HallSeances from "./HallSeances.js";

export default class SeancesList {
  constructor(movies, halls = []) {
    // Сохраняем список фильмов и создаём массивы для залов и их сеансов.
    this.movies = movies; 
    this.halls = halls;
    this.hallsSeances = [];
    this.init();
    // Логирование созданного объекта
   console.log("Создан новый объект SeancesList:", this);
  }

  // Метод инициализации, вызывающий привязку событий к элементам DOM.
  init() {
    this.bindToDom();
    this.getHallsSeances(this.halls);
    this.renderHallsSeances();
  }

  // Метод привязки элементов и событий DOM.
  bindToDom() {
    // Получаем главный элемент с классом "main".
    this.mainEl = document.querySelector(".main");

    // Привязываем обработчик события "updateHall" к контексту текущего экземпляра.
    this.hallUpdateHandler = this.hallUpdateHandler.bind(this);
    this.mainEl.addEventListener("updateHall", this.hallUpdateHandler);

    // Привязываем обработчик события "updateHallsSeances".
    this.updateHallsSeances = this.updateHallsSeances.bind(this);
    this.mainEl.addEventListener("updateHallsSeances", this.updateHallsSeances);

    // Получаем контейнер для отображения сеансов.
    this.containerEl = document.querySelector(".conf-step__seances");
  }

  // Обработчик события "updateHall", обновляющий список залов и сеансов.
  hallUpdateHandler(e) {
    // Получаем массив залов из данных события.
    this.halls = e.detail.data;
    // Инициализируем сеансы для полученных залов.
    this.getHallsSeances(this.halls);
    // Отрисовываем обновлённые сеансы.
    this.renderHallsSeances();
  }

  // Метод создания объектов HallSeances для каждого зала.
  getHallsSeances(halls) {
    // Очищаем текущий список сеансов залов.
    this.hallsSeances = [];
    // Для каждого зала создаём новый объект HallSeances и добавляем его в массив.
    halls.forEach((hall) => {
      const hallSeances = new HallSeances(hall, this.movies);
      this.hallsSeances.push(hallSeances);
    });
  }

  // Метод отрисовки всех сеансов для залов.
  async renderHallsSeances() {
    // Очищаем контейнер перед добавлением новых элементов.
    this.containerEl.innerHTML = "";
    // Добавляем элементы сеансов для каждого зала.
    for (const item of this.hallsSeances) {
      const element = await item.getSeancesHallElement();
      this.containerEl.appendChild(element);
  }
  }

  // Обновляет список сеансов, вызывая соответствующие методы.
  updateHallsSeances() {
    this.getHallsSeances(this.halls);
    this.renderHallsSeances();
  }
}
