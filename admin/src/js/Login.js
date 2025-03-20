import { _URL_ADMIN_INDEX } from "./app.js";
import Fetch from "./Fetch.js";

// Определяем класс Login для управления логикой входа
export default class Login {
  constructor() {
    this.init(); // Инициализируем класс при создании экземпляра
  }

  init() {
    this.bindToDom(); // Привязываем элементы DOM
    if (this.getTokenFromLocalStorage()) {
      this.removeToken(); // Удаляем существующий токен, если он найден
    }
  }

  bindToDom() {
    this.containerEl = document.querySelector("main"); // Находим главный контейнер
    this.loginFormEl = document.querySelector(".login__form"); // Находим форму входа
    this.loginFormEl.addEventListener(
      "submit",
      this.onSubmitLoginForm.bind(this)
    );
    // Привязываем обработчик события отправки формы
    this.loginInputEmailEl = document.querySelector(".login__input_email"); // Поле для ввода email
    this.loginInputPasswordEl = document.querySelector(
      ".login__input_password"
    ); // Поле для ввода пароля
  }

  onSubmitLoginForm(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    this.sendForm(); // Вызываем метод отправки формы
  }

  getTokenFromLocalStorage() {
    return localStorage.getItem("token"); // Получаем токен из локального хранилища
  }

  removeToken() {
    localStorage.removeItem("token"); // Удаляем токен из локального хранилища
  }

  putTokenIntoLocalStorage(token) {
    localStorage.setItem("token", token); // Сохраняем токен в локальное хранилище
  }

  /**
   * Функция отправляет данные авторизации
   *
   * @async
   * @returns {*}
   */
  async sendForm() {
    const jsonResponse = await Fetch.send(
      // Отправляем асинхронный POST-запрос и сохраняем ответ в переменную `jsonResponse`
      "POST", // Указываем метод запроса - POST (отправка данных)
      "login", // Указываем URL эндпоинта, который обрабатывает создание токена
      {
        cleanResponse: true, // Возможно, указывает серверу вернуть "чистый" ответ без обертки
        bodyJson: {
          // Передаем тело запроса в формате JSON
          email: this.loginInputEmailEl.value, // Значение поля email из формы авторизации
          password: this.loginInputPasswordEl.value, // Значение поля password из формы авторизации
          // device_name: "windows", // Указываем имя устройства для идентификации
        },
      }
    );
    // console.log(jsonResponse);
    if (jsonResponse.ok) {
      // Проверяем, успешно ли выполнен запрос (статус ответа 200-299)
      const response = await jsonResponse.json(); // Асинхронно парсим JSON-ответ от сервера и сохраняем в переменную `response`
      this.putTokenIntoLocalStorage(response.token); // Вызываем метод, который сохраняет полученный токен в локальное хранилище
      window.location.href = _URL_ADMIN_INDEX; // Перенаправляем пользователя на страницу администратора
      // console.log(response);
    } else {
      console.log("error"); // Логируем ошибку сети
        alert("Ooops! Данные не сходятся."); // Выводим сообщение о сетевой ошибке
    }
    // try {
    //   // Отправляем запрос на сервер для авторизации
      // const jsonResponse = await fetch(`${_URL}login`, {
      //   method: "POST", // Метод POST для отправки данных
      //   headers: {
      //     "Content-Type": "application/json", // Тип содержимого
      //   },
      //   body: JSON.stringify({
      //     email: this.loginInputEmailEl.value, // Передаем email из поля ввода
      //     password: this.loginInputPasswordEl.value, // Передаем пароль из поля ввода
      //     device_name: "windows", // Указываем устройство
      //   }),
      // });

    // } catch (error) {
    //   console.log(error); // Логируем ошибку сети
    //   alert("Произошла ошибка. Попробуйте снова позже."); // Выводим сообщение о сетевой ошибке
    // }
  }
}
