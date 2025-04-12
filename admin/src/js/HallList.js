// Экспортируем класс HallList
export default class HallList {
  // Конструктор класса, принимает элемент контейнера и массив залов
  constructor(containerEl, halls = []) {
    this.containerEl = containerEl; // сохраняем элемент контейнера
    HallList.counterIncrement(); // увеличиваем счетчик классов
    this.objectId = HallList.counter; // присваиваем объекту уникальный идентификатор
    this.halls = halls; // массив для хранения залов
    this.activeHallId = this.halls.length > 0 ? this.halls[0].id : null; // идентификатор активного зала
    this.handlerUpdate = null; // обработчик обновления
    // Логирование созданного объекта
    // console.log("Создан новый объект HallList:", this);
  }

  // Статический счетчик для идентификации объектов класса
  static counter = 0;

  // Метод для увеличения счетчика
  static counterIncrement() {
    HallList.counter += 1; // увеличиваем счетчик на 1
  }

  // Инициализация логики класса
  init() {
    this.bindToDom(); // связываем DOM-элементы с методами
    this.renderHallsList();
    this.handlerUpdate(
      this.halls.find((hall) => hall.id === this.activeHallId)
    );
  }

  // Метод для связывания DOM-элементов с обработчиками событий
  bindToDom() {
    this.mainEl = document.querySelector(".main"); // находим основной элемент
    this.onUpdate = this.onUpdate.bind(this); // связываем контекст
    this.mainEl.addEventListener("updateHall", this.onUpdate); // добавляем слушатель события обновления зала
    this.onUpdateActiveHall = this.onUpdateActiveHall.bind(this); // связываем контекст
    this.mainEl.addEventListener("updateActiveHall", this.onUpdateActiveHall); // слушатель для обновления активного зала
    this.onChangeHallList = this.onChangeHallList.bind(this); // связываем контекст
  }

  // Обработчик события обновления залов
  onUpdate(e) {
    this.halls = e.detail.data; // обновляем список залов
    this.activeHallId = e.detail.activeHallId; // обновляем активный зал
    const activeHall = this.halls.find((hall) => hall.id === this.activeHallId); // находим активный зал
    this.renderHallsList(); // рендерим список залов
    this.handlerUpdate(activeHall); // вызываем обработчик обновления для активного зала
  }

  // Обработчик события обновления активного зала
  onUpdateActiveHall(e) {
    if (e.detail.objectId !== this.objectId) {
      // проверяем, что событие не от текущего объекта
      const activeHall = e.detail.activeHall; // получаем активный зал из события
      this.activeHallId = activeHall.id; // обновляем активный зал
      this.renderHallsList(); // рендерим список залов
      this.handlerUpdate(activeHall); // вызываем обработчик обновления
    }
  }

  // Метод для рендеринга списка залов
  renderHallsList() {
    this.containerEl.innerHTML = ""; // очищаем контейнер
    let name; // переменная для имени группы радио-кнопок
    // Определяем имя группы в зависимости от класса контейнера
    if (this.containerEl.classList.contains("hall-configuration-halls-list")) {
      name = "chairs-hall"; // имя для конфигурации стульев
    } else if (
      this.containerEl.classList.contains("price-configuration-halls-list")
    ) {
      name = "prices-hall"; // имя для конфигурации цен
    }
    // Итерация по списку залов
    this.halls.forEach((hall) => {
      const element = document.createElement("li"); // создаем элемент списка
      element.innerHTML = `<input type="radio" class="conf-step__radio" name=${name} value=${hall.name} aria-label="Зал ${hall.name}">  
                <span class="conf-step__selector">${hall.name}</span>`; // добавляем радио-кнопку и название зала
      element.addEventListener("change", () => this.onChangeHallList(hall)); // добавляем обработчик изменений
      if (hall.id === this.activeHallId) {
        // проверяем, является ли зал активным
        element.querySelector("input").setAttribute("checked", true); // устанавливаем радио-кнопку как выбранную
      }
      this.containerEl.appendChild(element); // добавляем элемент в контейнер
    });
  }

  // Обработчик изменения зала из списка
  onChangeHallList(hall) {
    this.setActiveHallId(hall.id); // устанавливаем идентификатор активного зала
    this.handlerUpdate(hall); // вызываем обработчик обновления для нового зала
    this.updateActiveHall(hall); // обновляем активный зал в других компонентах
  }

  // Метод для обновления активного зала
  updateActiveHall(activeHall) {
    const event = new CustomEvent("updateActiveHall", {
      detail: {
        activeHall, // передаем текущий активный зал
        objectId: this.objectId, // передаем идентификатор объекта
      },
    });
    this.mainEl.dispatchEvent(event); // отправляем событие обновления
  }

  // Метод для установки идентификатора активного зала
  setActiveHallId(id) {
    this.activeHallId = id; // сохраняем идентификатор активного зала
  }
}
