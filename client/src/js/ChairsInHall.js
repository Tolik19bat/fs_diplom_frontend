// Импортируем базовый URL из другого модуля
import { _URL } from "./app.js";
import Fetch from "./Fetch.js";

// Экспортируем класс ChairsInHall, который отвечает за управление креслами в зале
export default class ChairsInHall {
  constructor(hallId, seance, date) {
    // Инициализация параметров зала, сеанса и даты
    this.hallId = hallId;
    this.seance = seance;
    this.date = date;
    this.occupiedChairs = []; // Массив занятых кресел
    this.setChairsId = null; // Функция для установки выбранных кресел
    this.chairs = []; // Массив всех кресел
    this.selectedChairsId = []; // Массив выбранных кресел
    this.init(); // Вызов метода инициализации
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязываем элементы к DOM
    // Получаем кресла и занятые кресла, затем рендерим их
    this.getChairs().then(() => {
      this.getOccupiedChairs().then(() => {
        this.containerEl.innerHTML = ""; // Очищаем контейнер
        this.renderChairs(this.chairs); // Рендерим кресла
      });
    });
  }

  // Привязываем контейнер для кресел к DOM
  bindToDom() {
    this.containerEl = document.querySelector(".buying-scheme__wrapper");
  }

  // Асинхронный метод для получения всех кресел из API
  async getChairs() {
    // Отправляем асинхронный GET-запрос для получения данных о креслах в зале
    this.chairs = await Fetch.send("GET", `hall/${this.hallId}/chairs`);

    // try {
    //   const jsonResponse = await fetch(`${_URL}hall/${this.hallId}/chairs`);
    //   this.chairs = await jsonResponse.json(); // Сохраняем полученные кресла
    // } catch (error) {
    //   console.error(error); // Обработка ошибок
    // }
  }

  // Асинхронный метод для получения занятых кресел
  async getOccupiedChairs() {
    // Отправляем асинхронный GET-запрос для получения списка занятых кресел на конкретный сеанс в указанную дату
    this.occupiedChairs = await Fetch.send(
      "GET",
      `chair/seance/${this.seance.id}/date/${new Date(
        this.date
      ).toLocaleDateString()}`
    );

    // try {
    //   const jsonResponse = await fetch(
    //     `${_URL}chair/seance/${this.seance.id}/date/${new Date(
    //       this.date
    //     ).toLocaleDateString()}`
    //   );
    //   this.occupiedChairs = await jsonResponse.json(); // Сохраняем занятые кресла
    // } catch (error) {
    //   console.error(error); // Обработка ошибок
    // }
  }

  // Метод для рендеринга кресел в DOM
  renderChairs(chairs) {
    const { rows: rowsCount, places: chairsInRow } = this.getSizeHall(chairs); // Получаем размеры зала
    for (let i = 1; i <= rowsCount; i += 1) {
      const rowEl = document.createElement("div"); // Создаем элемент для строки
      rowEl.classList.add("buying-scheme__row"); // Добавляем класс для стилей
      for (let j = 1; j <= chairsInRow; j += 1) {
        const chairEl = document.createElement("span"); // Создаем элемент для кресла
        chairEl.classList.add("buying-scheme__chair"); // Добавляем класс для стилей
        const chair = chairs.find((el) => +el.row === i && +el.place === j); // Находим кресло по позиции
        if (chair.id) {
          chairEl.dataset.chairId = chair.id; // Устанавливаем ID кресла как дата-атрибут
        }
        // Проверяем, занято ли кресло
        if (this.occupiedChairs.includes(chair.id)) {
          chairEl.classList.add("buying-scheme__chair_taken"); // Кресло занято
        } else {
          // Определяем тип кресла и добавляем соответствующий класс
          if (+chair.type === 2) {
            chairEl.classList.add("buying-scheme__chair_vip");
            chairEl.addEventListener("click", this.onClickChair.bind(this)); // Обработчик клика
          } else if (+chair.type === 1) {
            chairEl.classList.add("buying-scheme__chair_standart");
            chairEl.addEventListener("click", this.onClickChair.bind(this)); // Обработчик клика
          } else {
            chairEl.classList.add("buying-scheme__chair_disabled"); // Кресло отключено
          }
        }
        rowEl.appendChild(chairEl); // Добавляем кресло в строку
      }
      this.containerEl.appendChild(rowEl); // Добавляем строку в контейнер
    }
  }

  // Метод обработки клика по креслу
  onClickChair(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение
    if (e.currentTarget.classList.contains("buying-scheme__chair_taken")) {
      return; // Если кресло занято, выходим из метода
    }
    // Переключаем класс для выбора кресла
    e.currentTarget.classList.toggle("buying-scheme__chair_selected");
    if (e.currentTarget.classList.contains("buying-scheme__chair_selected")) {
      this.addChairToArray(+e.currentTarget.dataset.chairId); // Добавляем кресло в массив выбранных
    } else {
      this.removeChairToArray(+e.currentTarget.dataset.chairId); // Убираем кресло из массива выбранных
    }
    this.setChairsId(this.selectedChairsId); // Устанавливаем выбранные кресла
  }

  // Метод для получения размера зала
  getSizeHall(chairs) {
    return {
      rows: Math.max(...chairs.map((chair) => chair.row)), // Максимальное количество рядов
      places: Math.max(...chairs.map((chair) => chair.place)), // Максимальное количество мест в ряду
    };
  }

  // Метод для добавления кресла в массив выбранных
  addChairToArray(chairId) {
    if (chairId && !this.selectedChairsId.includes(chairId)) {
      this.selectedChairsId.push(chairId); // Добавляем ID кресла
    }
  }

  // Метод для удаления кресла из массива выбранных
  removeChairToArray(chairId) {
    if (chairId && this.selectedChairsId.includes(chairId)) {
      this.selectedChairsId = [
        ...this.selectedChairsId.filter((item) => item != chairId), // Фильтруем массив
      ];
    }
  }

  // Метод для очистки массива выбранных кресел
  clearChairsId() {
    this.selectedChairsId = []; // Очищаем массив
  }
}
