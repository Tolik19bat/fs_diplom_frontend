const DELAY = 1000; // Устанавливаем задержку в 1000 мс (1 секунда) для работы лоадера

export default class Loader {
  // Создаем класс `Loader` для управления индикатором загрузки
  static loaderEl; // Статическое свойство для хранения элемента лоадера
  static endTime = 0; // Время, когда лоадер должен скрыться
  static timeId = 0; // Идентификатор таймера
  static start = false; // Флаг, указывающий, запущен ли лоадер

  static init() {
    // Метод инициализации лоадера
    const bodyEl = document.querySelector("body"); // Получаем ссылку на элемент <body>
    Loader.loaderEl = document.createElement("div"); // Создаем новый <div> для лоадера
    Loader.loaderEl.classList.add("loader"); // Добавляем класс "loader" для стилизации
    Loader.loaderEl.style.display = "none"; // Скрываем лоадер по умолчанию
    bodyEl.appendChild(Loader.loaderEl); // Добавляем лоадер в тело документа
  }

  static startLoader() {
    // Метод для запуска лоадера
    if (Loader.start) {
      // Проверяем, не запущен ли уже лоадер
      return; // Если лоадер уже активен, выходим из метода
    }
    Loader.start = true; // Устанавливаем флаг `start` в `true`
    Loader.renderLoader(); // Отображаем лоадер
  }

  static stopLoader() {
    // Метод для остановки лоадера
    clearTimeout(Loader.timeId); // Очищаем предыдущий таймер
    Loader.endTime = Date.now() + DELAY - 100; // Устанавливаем время окончания с учетом задержки
    Loader.timeId = setTimeout(() => {
      // Запускаем таймер перед скрытием лоадера
      if (Date.now() > Loader.endTime) {
        // Проверяем, прошло ли достаточно времени
        clearTimeout(Loader.timeId); // Очищаем таймер
        Loader.start = false; // Сбрасываем флаг `start`
        Loader.haideLoader(); // Скрываем лоадер
      }
    }, DELAY); // Задержка перед скрытием
  }

  static renderLoader() {
    // Метод для отображения лоадера
    Loader.loaderEl.style.display = ""; // Делаем элемент видимым
  }

  static haideLoader() {
    // Метод для скрытия лоадера (в названии опечатка, должно быть `hideLoader`)
    Loader.loaderEl.style.display = "none"; // Скрываем элемент
  }
}
