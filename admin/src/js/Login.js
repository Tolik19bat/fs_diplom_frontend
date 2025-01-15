import { _URL, _URL_ADMIN_INDEX } from "./app.js";

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
    this.loginFormEl.addEventListener("submit", this.onSubmitLoginForm.bind(this)); 
    // Привязываем обработчик события отправки формы
    this.loginInputEmailEl = document.querySelector(".login__input_email"); // Поле для ввода email
    this.loginInputPasswordEl = document.querySelector(".login__input_password"); // Поле для ввода пароля
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

  async sendForm() {
    try {
      // Отправляем запрос на сервер для авторизации
      const jsonResponse = await fetch(`${_URL}login`, {
        method: "POST", // Метод POST для отправки данных
        headers: {
          "Content-Type": "application/json", // Тип содержимого
        },
        body: JSON.stringify({
          email: this.loginInputEmailEl.value, // Передаем email из поля ввода
          password: this.loginInputPasswordEl.value, // Передаем пароль из поля ввода
          device_name: "windows", // Указываем устройство
        }),
      });

      if (jsonResponse.ok) {
        const response = await jsonResponse.json(); // Получаем ответ от сервера
        this.putTokenIntoLocalStorage(response.token); // Сохраняем токен в локальное хранилище
        window.location.href = _URL_ADMIN_INDEX; // Перенаправляем на страницу администратора
      } else {
        const errorResponse = await jsonResponse.json(); // Получаем ошибку
        console.log(errorResponse); // Логируем ошибку
        alert("Ошибка авторизации. Проверьте данные и попробуйте снова."); // Выводим сообщение об ошибке
      }
    } catch (error) {
      console.log(error); // Логируем ошибку сети
      alert("Произошла ошибка. Попробуйте снова позже."); // Выводим сообщение о сетевой ошибке
    }
  }
}
