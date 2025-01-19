import CalendarDay from "./CalendarDay.js";

// Экспортируемый класс для работы с календарем
export default class Calendar {
  constructor() {
    // Выбранный день по умолчанию
    this.chosenDay = null;
    // Первая отображаемая дата, по умолчанию текущая
    this.firstDay = new Date();
    // Коллбэк для изменения даты, будет задан позже
    this.onChangeDate = null;
  }

  // Инициализация календаря
  init() {
    this.bindToDom();  // Привязка к DOM-элементу
    this.renderDays(); // Отрисовка дней
    this.onChangeDate(this.chosenDay); // Вызов коллбэка при изменении даты
  }

  // Привязка календаря к элементу с классом "page-nav"
  bindToDom() {
    this.containerEl = document.querySelector(".page-nav");
  }

  // Отрисовка дней календаря
  renderDays() {
    // Если первая дата меньше текущей, обновляем её
    if (this.firstDay.getTime() < (new Date()).getTime()) {
      this.firstDay = new Date();
    }
    const date = new Date(this.firstDay); // Копируем первую дату

    let countDays;  // Количество отображаемых дней
    let firstDayNextGroup; // Первая дата следующей группы дней

    // Если сегодня, показываем 6 дней, иначе 5
    if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
      countDays = 6;
    } else {
      countDays = 5;
    }

    const endData = new Date(date);  // Дата конца группы
    endData.setDate(endData.getDate() + countDays - 1);

    // Если выбранный день не задан или выходит за границы, устанавливаем текущий
    if (!this.chosenDay || date.getTime() > this.chosenDay.getTime() || endData.getTime() < this.chosenDay.getTime()) {
      this.chosenDay = new Date(date);
    }

    this.containerEl.innerHTML = ""; // Очищаем контейнер

    // Цикл для отрисовки каждого дня
    for (let i = 0; i < countDays; i += 1) {
      const calendarDay = new CalendarDay(date); // Создаем объект дня
      const element = calendarDay.getElement(); // Получаем DOM-элемент

      // Если дата совпадает с выбранной, добавляем класс выделения
      if (new Date(+element.dataset.date).toLocaleDateString() === this.chosenDay.toLocaleDateString()) {
        element.classList.add("page-nav__day_chosen");
      } else {
        element.classList.remove("page-nav__day_chosen");
      }

      // Привязка обработчика клика к элементу дня
      this.onClickElelement = this.onClickElelement.bind(this);
      element.addEventListener("click", this.onClickElelement);

      // Добавляем элемент дня в контейнер
      this.containerEl.appendChild(element);

      date.setDate(date.getDate() + 1); // Переход к следующему дню
      firstDayNextGroup = new Date(date); // Сохраняем первую дату следующей группы
    }

    // Создаем элемент для перехода к следующим дням
    const nextDaysEl = document.createElement("a");
    nextDaysEl.classList.add("page-nav__day", "page-nav__day_next");
    nextDaysEl.setAttribute("href", "#");
    nextDaysEl.addEventListener("click", this.onClickNextDays.bind(this, firstDayNextGroup));
    this.containerEl.appendChild(nextDaysEl);

    // Если отображаем 5 дней, добавляем элемент для перехода к предыдущим
    if (countDays === 5) {
      const previousDaysEl = document.createElement("a");
      previousDaysEl.classList.add("page-nav__day", "page-nav__day_previous");
      previousDaysEl.setAttribute("href", "#");
      previousDaysEl.addEventListener("click", this.onClickPreviousDays.bind(this, this.firstDay));
      this.containerEl.prepend(previousDaysEl);
    }
  }

  // Обработчик клика по дню
  onClickElelement(e) {
    e.preventDefault(); // Отмена стандартного поведения ссылки

    // Проверка, если уже выбранный день совпадает с нажатым
    if (this.chosenDay.toLocaleDateString() === (new Date(+e.currentTarget.dataset.date)).toLocaleDateString()) {
      return;
    }

    this.chosenDay = new Date(+e.currentTarget.dataset.date); // Устанавливаем новую выбранную дату
    this.renderDays(); // Перерисовываем календарь
    this.onChangeDate(this.chosenDay); // Вызываем коллбэк изменения даты
  }

  // Установка выбранного дня из внешнего кода
  setChosenDay(date) {
    this.chosenDay = new Date(date);
  }

  // Обработчик перехода к следующей группе дней
  onClickNextDays(firstDay) {
    this.firstDay = firstDay; // Устанавливаем новую первую дату
    this.renderDays(); // Перерисовываем дни
    this.onChangeDate(this.chosenDay); // Вызов изменения даты
  }

  // Обработчик перехода к предыдущей группе дней
  onClickPreviousDays(argDate) {
    let startDate = new Date(argDate); // Копируем дату
    startDate.setDate(startDate.getDate() - 6); // Смещаем на 6 дней назад

    // Если смещение совпадает с текущим днем, оставляем
    if (startDate.toLocaleDateString() === (new Date()).toLocaleDateString()) {
    } else {
      startDate = new Date(argDate);
      startDate.setDate(startDate.getDate() - 5); // Иначе смещаем на 5 дней
    }

    this.firstDay = startDate; // Обновляем первую дату
    this.renderDays(); // Перерисовываем дни
    this.onChangeDate(this.chosenDay); // Вызов изменения даты
  }
}
