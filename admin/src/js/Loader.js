// Задаем задержку в 1000 миллисекунд (1 секунда)
const DELAY = 1000;

export default class Loader {
  // Статические свойства для хранения состояния загрузчика
  static loaderEl; // Элемент загрузчика (будет создан динамически)
  static endTime = 0; // Время, когда загрузчик должен исчезнуть
  static timeId = 0; // ID таймера, используемого в setTimeout
  static start = false; // Флаг, указывающий, активен ли загрузчик

  // Метод инициализации загрузчика, создающий HTML-элемент и добавляющий его в <body>
  static init() {
    const bodyEl = document.querySelector("body"); // Получаем элемент <body>
    Loader.loaderEl = document.createElement("div"); // Создаем новый <div>
    Loader.loaderEl.classList.add("loader"); // Добавляем CSS-класс "loader"
    Loader.loaderEl.style.display = "none"; // Изначально скрываем элемент
    bodyEl.appendChild(Loader.loaderEl); // Добавляем элемент в <body>
  }

  // Метод запуска загрузчика
  static startLoader() {
    if (Loader.start) {
      return; // Если загрузчик уже запущен, выходим из метода
    }
    Loader.start = true; // Устанавливаем флаг, что загрузчик активен
    Loader.renderLoader(); // Отображаем загрузчик
  }

  // Метод остановки загрузчика с задержкой
  static stopLoader() {
    clearTimeout(Loader.timeId); // Очищаем предыдущий таймер, если он был установлен
    Loader.endTime = Date.now() + DELAY - 100; // Запоминаем момент, когда загрузчик должен исчезнуть
    Loader.timeId = setTimeout(() => {
      if (Date.now() > Loader.endTime) { // Проверяем, прошло ли достаточно времени
        clearTimeout(Loader.timeId); // Очищаем таймер
        Loader.start = false; // Сбрасываем флаг активности загрузчика
        Loader.haideLoader(); // Скрываем загрузчик
      }
    }, DELAY);
  }

  // Метод для отображения загрузчика
  static renderLoader() {
    Loader.loaderEl.style.display = ""; // Показываем элемент (убираем display: none)
  }

  // Метод для скрытия загрузчика
  static haideLoader() {
    Loader.loaderEl.style.display = "none"; // Скрываем элемент
  }
}