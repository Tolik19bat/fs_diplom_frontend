export default class CalendarDay {
  // Конструктор принимает объект даты и инициализирует свойства.
  constructor(date) {
    this.date = date; // Сохраняем переданную дату.
    this.element = null; // HTML-элемент, который будет создан для отображения дня.
    this.daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]; // Массив с названиями дней недели.
  }

  // Метод для создания элемента HTML, представляющего день календаря.
  createElement() {
    // Создаём элемент "a" (ссылка).
    this.element = document.createElement("a");
    this.element.classList.add("page-nav__day"); // Добавляем CSS-класс для стилизации.
    this.element.dataset.date = this.date.getTime(); // Сохраняем дату в формате метки времени.

    // Проверяем, является ли эта дата сегодняшней.
    if (this.date.toLocaleDateString() === new Date().toLocaleDateString()) {
      this.element.classList.add("page-nav__day_today"); // Добавляем класс для сегодняшнего дня.
    }

    // Проверяем, является ли день недели субботой или воскресеньем.
    if (this.date.getDay() === 0 || this.date.getDay() === 6) {
      this.element.classList.add("page-nav__day_weekend"); // Добавляем класс для выходного дня.
    }

    // Устанавливаем атрибут href для ссылки.
    this.element.setAttribute("href", "#");

    // Создаём элемент для отображения дня недели.
    const dayWeekEl = document.createElement("span");
    dayWeekEl.classList.add("page-nav__day-week"); // Добавляем класс для стилизации.
    dayWeekEl.textContent = this.daysWeek[this.date.getDay()]; // Устанавливаем название дня недели.

    // Создаём элемент для отображения числа месяца.
    const dayNumberEl = document.createElement("span");
    dayNumberEl.classList.add("page-nav__day-number"); // Добавляем класс для стилизации.
    dayNumberEl.textContent = this.date.getDate(); // Устанавливаем число месяца.

    // Вставляем элементы дня недели и числа в основной элемент.
    this.element.appendChild(dayWeekEl);
    this.element.appendChild(dayNumberEl);
  }

  // Метод возвращает созданный HTML-элемент.
  getElement() {
    this.createElement(); // Создаём элемент.
    return this.element; // Возвращаем его.
  }
}

//====================================================================================
//улучшенный вариант
// export default class CalendarDay {
//     // Статическое свойство для массива с днями недели.
//     static daysWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  
//     // Конструктор принимает объект даты и инициализирует свойства.
//     constructor(date) {
//       this.date = date;  // Сохраняем переданную дату.
//       this.element = null;  // HTML-элемент, который будет создан для отображения дня.
//     }
  
//     // Метод для создания элемента HTML, представляющего день календаря.
//     createElement() {
//       // Создаём элемент "a" (ссылка).
//       this.element = document.createElement("a");
//       this.element.classList.add("page-nav__day");  // Добавляем CSS-класс для стилизации.
//       this.element.dataset.date = this.date.getTime();  // Сохраняем дату в формате метки времени.
  
//       // Определяем, является ли текущий день сегодняшним и выходным.
//       const today = new Date();
//       const isToday = this.date.toLocaleDateString() === today.toLocaleDateString();
//       const isWeekend = this.date.getDay() === 0 || this.date.getDay() === 6;
  
//       if (isToday) {
//         this.element.classList.add("page-nav__day_today");  // Добавляем класс для сегодняшнего дня.
//       }
//       if (isWeekend) {
//         this.element.classList.add("page-nav__day_weekend");  // Добавляем класс для выходного дня.
//       }
  
//       // Устанавливаем атрибут href для ссылки.
//       this.element.setAttribute("href", "#");
  
//       // Создаём элемент для отображения дня недели.
//       const dayWeekEl = document.createElement("span");
//       dayWeekEl.classList.add("page-nav__day-week");
//       dayWeekEl.textContent = new Intl.DateTimeFormat('ru', { weekday: 'short' }).format(this.date);
  
//       // Создаём элемент для отображения числа месяца.
//       const dayNumberEl = document.createElement("span");
//       dayNumberEl.classList.add("page-nav__day-number");
//       dayNumberEl.textContent = this.date.getDate();
  
//       // Вставляем элементы дня недели и числа в основной элемент.
//       this.element.appendChild(dayWeekEl);
//       this.element.appendChild(dayNumberEl);
//     }
  
//     // Метод возвращает созданный HTML-элемент.
//     getElement() {
//       if (!this.element) {
//         this.createElement();  // Создаём элемент только один раз.
//       }
//       return this.element;
//     }
//   }
