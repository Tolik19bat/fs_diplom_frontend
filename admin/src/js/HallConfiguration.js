// Импорт зависимостей
import Fetch from "./Fetch.js"; // Модуль для работы с HTTP-запросами
import HallList from "./HallList.js"; // Модуль для работы со списком залов
import HallSize from "./HallSize.js"; // Модуль для работы с размерами зала

// Класс для управления конфигурацией зала
export default class HallConfiguration {
  constructor(halls = []) {
    // Инициализация свойств класса
    this.halls = halls; // Массив залов
    this.activeHallId = null; // ID активного зала
    this.selectedElement = null; // Выбранный элемент (кресло)
    this.chairs = []; // Массив кресел в текущем зале
    this.chairsCopy = []; // Копия массива кресел для отмены изменений
    this.init(); // Вызов метода инициализации
    console.log({ HallConfiguration: this }); // Логирование объекта для отладки
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязка элементов DOM
    this.hallList = new HallList(this.hallsListEl, this.halls); // Инициализация списка залов
    this.hallList.handlerUpdate = this.renderConfigurationOptions.bind(this); // Привязка обработчика обновления
    this.hallList.init(); // Инициализация списка залов
    this.hallSize = new HallSize(); // Инициализация объекта для управления размерами зала
    this.hallSize.handlerChangeSize = this.changeSize.bind(this); // Привязка обработчика изменения размера
  }

  // Метод для привязки элементов DOM
  bindToDom() {
    // Поиск контейнера для конфигурации зала
    this.containerEl = document.querySelector(".hall-configuration");
    // Поиск списка залов внутри контейнера
    this.hallsListEl = this.containerEl.querySelector(
      ".hall-configuration-halls-list"
    );
    // Поиск элемента для отображения зала
    this.hallEl = this.containerEl.querySelector(".conf-step__hall-wrapper");
    // Поиск модального окна для выбора типа кресла
    this.modalEl = this.containerEl.querySelector(".modal-chair-type");

    // Привязка обработчика клика по модальному окну
    this.onClickModal = this.onClickModal.bind(this);
    this.modalEl.addEventListener("click", this.onClickModal);

    // Поиск кнопки "Отмена" и привязка обработчика
    this.btnCancelEl = this.containerEl.querySelector(
      ".hall-configuration-btn-cancel"
    );
    this.onClickBtnCancel = this.onClickBtnCancel.bind(this);
    this.btnCancelEl.addEventListener("click", this.onClickBtnCancel);

    // Поиск кнопки "Сохранить" и привязка обработчика
    this.btnSaveEl = this.containerEl.querySelector(
      ".hall-configuration-btn-save"
    );
    this.onClickBtnSave = this.onClickBtnSave.bind(this);
    this.btnSaveEl.addEventListener("click", this.onClickBtnSave);
  }

  // Метод для отображения конфигурации активного зала
  async renderConfigurationOptions(activeHall) {
    if (!activeHall) return; // Если активный зал не передан, выходим
    // console.log("Active Hall:", activeHall); // Логируем активный зал

    // Устанавливаем ID активного зала и загружаем кресла
    this.activeHallId = activeHall.id;
    await this.getChairs().then(() => {
      // Отображаем размеры зала и кресла
      this.hallSize.renderHallSize(this.getSizeHall(this.chairs));
      this.renderHall(this.chairs);
    });
  }

  // Метод для изменения размеров зала
  changeSize(arg) {
    // Сохраняем копию кресел, если она еще не создана
    if (this.chairsCopy.length === 0) {
      this.chairs.forEach((element) => {
        this.chairsCopy.push({ ...element });
      });
    }

    // Создаем новый массив кресел с новыми размерами
    const chairs = [];
    for (let i = 1; i <= arg.rows; i += 1) {
      for (let j = 1; j <= arg.places; j += 1) {
        chairs.push({
          row: i,
          place: j,
          type: "1", // Тип кресла по умолчанию
        });
      }
    }

    // Отображаем зал с новыми креслами
    this.renderHall(chairs);
  }

  // Метод для отображения модального окна
  showModal() {
    this.modalEl.classList.remove("hidden"); // Убираем класс "hidden" для показа модального окна
  }

  // Метод для скрытия модального окна
  hideModal() {
    this.modalEl.classList.add("hidden"); // Добавляем класс "hidden" для скрытия модального окна
  }

  // Обработчик клика по модальному окну
  onClickModal(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение
    if (!e.target.classList.contains("conf-step__chair")) {
      this.hideModal(); // Если клик не по креслу, скрываем модальное окно
      return;
    }

    // Обновляем классы выбранного элемента
    this.selectedElement.className = "conf-step__chair"; // Очищаем классы, оставляя только базовый
    [...e.target.classList].forEach((currentClass) => {
      if (currentClass !== "conf-step__chair") {
        this.selectedElement.classList.add(currentClass); // Добавляем классы из выбранного кресла
      }
    });

    this.hideModal(); // Скрываем модальное окно
  }

  // Обработчик кнопки "Отмена"
  onClickBtnCancel() {
    if (this.chairsCopy.length > 0) {
      // Восстанавливаем кресла из копии
      this.selectedPlace = null;
      this.chairs = [];
      this.chairsCopy.forEach((element) => {
        this.chairs.push({ ...element });
      });
      this.chairsCopy = []; // Очищаем копию
      this.hallSize.renderHallSize(this.getSizeHall(this.chairs)); // Обновляем размеры зала
      this.renderHall(this.chairs); // Отображаем зал
    }
  }

  // Обработчик кнопки "Сохранить"
  async onClickBtnSave() {
    if (this.chairsCopy.length === 0) return; // Если изменений нет, выходим

    // Получаем текущую конфигурацию кресел
    const chairs = this.getChairsFormHall();
    if (chairs.length === 0) {
      this.onClickBtnCancel(); // Если кресел нет, отменяем изменения
      return;
    }
    this.chairsCopy = []; // Очищаем копию

    // Обновляем или создаем кресла в зависимости от наличия ID
    if (chairs.every((chair) => chair.id)) {
      await this.updateChairs(chairs); // Обновляем существующие кресла
    } else {
      const savedChairs = await this.createChairs(chairs, this.activeHallId); // Создаем новые кресла
      this.renderHall(savedChairs); // Отображаем зал с новыми креслами
    }
    await this.getChairs(); // Обновляем список кресел
  }

  // Метод для обновления кресел
  async updateChairs(chairs) {
    await Fetch.send("PUT", "chair", { bodyJson: { chairs } }); // Отправляем запрос на обновление кресел
  }

  // Метод для создания новых кресел
  async createChairs(chairs, hallId) {
    return await Fetch.send("PUT", `chair/${hallId}`, { bodyJson: { chairs } }); // Отправляем запрос на создание кресел
  }

  // Метод для получения кресел из зала
  async getChairs() {
    this.chairs = await Fetch.send("GET", `hall/${this.activeHallId}/chairs`); // Получаем кресла для активного зала
  }

  // Метод для отображения зала с креслами
  renderHall(chairs) {
    this.hallEl.innerHTML = ""; // Очищаем контейнер зала
    const { rows: rowsCount, places: chairsInRow } = this.getSizeHall(chairs); // Получаем размеры зала

    // Создаем ряды и кресла
    for (let i = 1; i <= rowsCount; i += 1) {
      const rowEl = document.createElement("div");
      rowEl.classList.add("conf-step__row");
      rowEl.dataset.row = i;

      for (let j = 1; j <= chairsInRow; j += 1) {
        const chairEl = document.createElement("span");
        chairEl.classList.add("conf-step__chair");
        chairEl.dataset.place = j;

        // Находим кресло в массиве
        const chair = chairs.find((el) => +el.row === i && +el.place === j);
        if (chair.id) {
          chairEl.dataset.chairId = chair.id; // Устанавливаем ID кресла
        }

        // Устанавливаем тип кресла
        if (+chair.type === 2) {
          chairEl.classList.add("conf-step__chair_vip");
        } else if (+chair.type === 1) {
          chairEl.classList.add("conf-step__chair_standart");
        } else {
          chairEl.classList.add("conf-step__chair_disabled");
        }

        // Добавляем обработчик клика по креслу
        chairEl.addEventListener("click", this.onClickChair.bind(this));
        rowEl.appendChild(chairEl); // Добавляем кресло в ряд
      }
      this.hallEl.appendChild(rowEl); // Добавляем ряд в зал
    }
  }

  // Обработчик клика по креслу
  onClickChair(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение
    this.selectedElement = e.currentTarget; // Сохраняем выбранное кресло

    // Сохраняем копию кресел, если она еще не создана
    if (this.chairsCopy.length === 0) {
      this.chairs.forEach((element) => {
        this.chairsCopy.push({ ...element });
      });
    }

    this.showModal(); // Показываем модальное окно
  }

  // Метод для получения конфигурации кресел из зала
  getChairsFormHall() {
    const chairElArray = this.hallEl.querySelectorAll(".conf-step__chair"); // Получаем все кресла
    const chairs = [...chairElArray]
      .map((element) => {
        let type;
        // Определяем тип кресла
        if (element.classList.contains("conf-step__chair_vip")) {
          type = "2";
        } else if (element.classList.contains("conf-step__chair_standart")) {
          type = "1";
        } else {
          type = "0";
        }

        // Если у кресла есть ID, возвращаем его
        if (element.dataset.chairId) {
          return {
            id: +element.dataset.chairId,
            type,
          };
        }

        // Иначе возвращаем ряд и место
        const row = element.parentNode.dataset.row;
        const place = element.dataset.place;
        return {
          row,
          place,
          type,
        };
      })
      .sort((a, b) => a.id < b.id); // Сортируем кресла по ID
    return chairs;
  }

  // Метод для получения размеров зала
  getSizeHall(chairs) {
    return {
      rows: Math.max(...chairs.map((chair) => chair.row)), // Максимальное количество рядов
      places: Math.max(...chairs.map((chair) => chair.place)), // Максимальное количество кресел в ряду
    };
  }
}