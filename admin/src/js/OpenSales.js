// import { _URL } from "./app.js";
import HallList from "./HallList.js";
import Fetch from "./Fetch.js";

// Объявление класса OpenSales для управления продажами билетов
export default class OpenSales {
  constructor(halls = []) {
    this.halls = halls; // Массив для хранения залов
    this.activeHallId = this.halls.length > 0 ? this.halls[0].id : null; // ID активного зала
    this.sales = false; // Статус продаж (открыты/закрыты)
    this.requestSeances(this.activeHallId) // Вызываем метод `requestSeances`, передавая ID активного зала (this.activeHallId), чтобы получить данные о сеансах
      .then((resolve) => {
        // После выполнения запроса, обрабатываем результат в `.then()`
        this.btnActivity = resolve; // Сохраняем результат в `this.btnActivity` (предположительно, это активность кнопки)
        this.init(); // Инициализируем компонент или выполняем другие действия, связанные с полученными данными
      });
    // Логирование созданного объекта
    console.log("Создан новый объект OpenSales:", this);
  }

  // Метод инициализации
  init() {
    this.bindToDom(); // Привязка элементов DOM к свойствам объекта
    this.hallList = new HallList(this.hallsListEl, this.halls);
    this.hallList.handlerUpdate = this.updateHalls.bind(this);
    this.hallList.init();
  }

  // Привязка элементов DOM к свойствам класса
  bindToDom() {
    this.mainEl = document.querySelector("main"); // Находим элемент <main> на странице и сохраняем его в переменную `this.mainEl`
    this.mainEl.addEventListener(
      // Добавляем обработчик события для элемента `this.mainEl`
      "updateHallsSeances", // Указываем тип события (в данном случае, "updateHallsSeances")
      this.onUpdateSeances.bind(this) // Устанавливаем метод `onUpdateSeances` как обработчик события, связывая его с текущим контекстом (чтобы `this` в методе указывал на текущий объект)
    );
    this.paragraphEl = document.querySelector(".footer__paragrarh"); // Абзац для отображения информации
    this.buttonEl = document.querySelector(".footer__button"); // Кнопка для управления продажами
    this.onClickBtn = this.onClickBtn.bind(this); // Привязка метода к контексту
    this.buttonEl.addEventListener("click", this.onClickBtn); // Добавление обработчика на кнопку
    this.hallsListEl = document.querySelector(".footer-halls-list"); // Элемент для списка залов
  }

  // Обновление информации о залах
  updateHalls(activeHall) {
    if (!activeHall) {
      return;
    }
    this.activeHallId = activeHall.id; // Устанавливаем ID активного зала
    this.getHalls().then(() => {
      this.requestSeances(this.activeHallId) // Вызываем метод `requestSeances`, передавая ID активного зала (this.activeHallId), чтобы получить данные о сеансах
        .then((resolve) => {
          // После выполнения запроса, обрабатываем результат в `.then()`
          this.btnActivity = resolve; // Сохраняем результат в `this.btnActivity` (это активность кнопки)
          this.sales = this.halls.find(
            (hall) => hall.id === this.activeHallId
          ).sales; // Находим зал с активным ID (this.activeHallId) и сохраняем его свойство `sales` в `this.sales`
          this.renderTextBtn(); // Вызываем метод для обновления текста на кнопке или перерисовываем интерфейс с новым состоянием
        });
    });
  }

  // Обработчик клика на кнопку
  onClickBtn(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение
    if (!this.activeHallId) {
      return;
    }
    this.setSales().then(() => {
      // Изменяем статус продаж
      this.getHalls().then(() => {
        this.requestSeances(this.activeHallId) // Отправляем запрос для получения сеансов для активного зала, используя его ID (this.activeHallId)
          .then((resolve) => {
            // Когда запрос завершится, обрабатываем результат в методе `.then()`
            this.btnActivity = resolve; // Сохраняем результат в `this.btnActivity` (это активность кнопки)
            this.sales = this.halls.find(
              (hall) => hall.id === this.activeHallId
            ).sales; // Ищем зал в массиве `this.halls`, у которого ID совпадает с `this.activeHallId`, и сохраняем его продажи (`sales`) в `this.sales`
            this.renderTextBtn(); // Обновляем текст на кнопке или перерисовываем интерфейс, используя обновленные данные
          });
      });
    });
  }

  // Отображение текста на кнопке в зависимости от статуса продаж
  renderTextBtn() {
    if (this.btnActivity) {
      // Проверяем, если значение `this.btnActivity` истинно (например, кнопка активна)
      this.buttonEl.style.display = ""; // Отображаем кнопку, убирая стиль, который скрывает элемент
      this.paragraphEl.textContent = "Всё готово, теперь можно:"; // Устанавливаем текст в параграфе, сообщая, что все готово и можно продолжить
    } else {
      // Если `this.btnActivity` ложное (например, кнопка неактивна)
      this.buttonEl.style.display = "none"; // Скрываем кнопку, устанавливая стиль для скрытия элемента
      this.paragraphEl.textContent = ""; // Очищаем текст в параграфе
      if (this.sales) {
        // Если имеются данные о продажах (`this.sales`)
        this.setSales(); // Вызываем метод `setSales` для работы с продажами (например, отображаем или обрабатываем данные о продажах)
      }
    }
    if (this.sales) {
      this.buttonEl.textContent = "Приостановить продажу билетов"; // Если продажи открыты
    } else {
      this.buttonEl.textContent = "Открыть продажу билетов"; // Если продажи закрыты
    }
  }

  // Асинхронный метод для получения залов с сервера
  async getHalls() {
    this.halls = await Fetch.send("GET", "hall"); // Отправляем асинхронный GET-запрос на сервер для получения списка залов (ресурса "hall")
    // Используем `await` для того, чтобы дождаться получения ответа от сервера и сохранить его результат в переменную `this.halls`

    // const token = localStorage.getItem("token"); // Получаем токен из localStorage
    // try {
    //   const jsonResponse = await fetch(`${_URL}hall`, {
    //     method: "GET", // Метод GET для получения данных
    //     headers: { Authorization: `Bearer ${token}` }, // Заголовок авторизации
    //   });
    //   this.halls = await jsonResponse.json(); // Сохраняем полученные данные
    // } catch (error) {
    //   console.error(error); // Обрабатываем ошибки
    // }
  }

  // Асинхронный метод для изменения статуса продаж
  async setSales() {
    await Fetch.send("PUT", `hall/${this.activeHallId}/sales`, {
      // Отправляем асинхронный PUT-запрос на сервер для обновления информации о продажах в конкретном зале
      bodyJson: {
        // Передаем данные в теле запроса в формате JSON
        sales: !this.sales, // Переключаем состояние продаж: если `this.sales` истинно, ставим ложь, и наоборот
      },
    });

    // const token = localStorage.getItem("token"); // Получаем токен
    // try {
    //   await fetch(`${_URL}hall/${this.activeHallId}/sales`, {
    //     method: "PUT", // Метод PUT для обновления данных
    //     headers: {
    //       "Content-Type": "application/json", // Заголовок с типом контента
    //       Authorization: `Bearer ${token}`, // Заголовок авторизации
    //     },
    //     body: JSON.stringify({
    //       sales: !this.sales, // Инвертируем текущий статус продаж
    //     }),
    //   });
    // } catch (error) {
    //   console.error(error); // Обрабатываем ошибки
    // }
  }

  async requestSeances(hallId) {
    // Асинхронный метод для запроса сеансов конкретного зала
    if (!hallId) {
      // Проверяем, передан ли `hallId`
      return null; // Если нет, возвращаем `null`
    }
    const response = await Fetch.send("GET", `hall/${hallId}/seances`); // Отправляем GET-запрос на сервер, чтобы получить сеансы для указанного зала
    return response.length > 0 ? true : false; // Проверяем, есть ли сеансы: если массив не пустой, возвращаем `true`, иначе `false`

    // const token = localStorage.getItem('token'); // Получаем токен авторизации из локального хранилища
    // try {
    //   const jsonResponse = await fetch(`${_URL}hall/${hallId}/seances`, { // Отправляем GET-запрос на сервер
    //     method: "GET", // Указываем метод запроса
    //     headers: { Authorization: `Bearer ${token}` }, // Добавляем заголовок с токеном авторизации
    //   });
    //   const response = await jsonResponse.json(); // Преобразуем полученный ответ в JSON
    //   return response.length > 0 ? true : false; // Возвращаем `true`, если есть сеансы, иначе `false`
    // } catch (error) {
    //   console.error(error); // В случае ошибки выводим её в консоль
    // }
  }

  onUpdateSeances() {
    // Метод для обновления информации о сеансах
    this.getHalls().then(() => {
      // Сначала вызываем `getHalls()`, который загружает список залов
      this.requestSeances(this.activeHallId).then((resolve) => {
        // После получения залов, запрашиваем сеансы для активного зала
        this.btnActivity = resolve; // Записываем результат в `this.btnActivity` (указывает, есть ли сеансы)
        this.sales = this.halls.find(
          (hall) => hall.id === this.activeHallId
        ).sales; // Находим активный зал и сохраняем его `sales`
        this.renderTextBtn(); // Обновляем интерфейс, изменяя текст на кнопке
      });
    });
  }
}
