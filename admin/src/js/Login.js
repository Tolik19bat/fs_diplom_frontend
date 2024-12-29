import { _URL, _URL_ADMIN_INDEX } from "./app.js";

export default class Login {
  constructor() {
    this.init();
  }

  init() {
    this.bindToDom(); // Привязываем элементы DOM
    if (this.getTokenFromLocalStorage()) {
      this.removeToken(); // Удаляем существующий токен, если он есть
    }
  }

  bindToDom() {
    this.containerEl = document.querySelector("main"); // Главный контейнер
    this.loginFormEl = document.querySelector(".login__form"); // Форма входа
    this.loginFormEl.addEventListener("submit", this.onSubmitLoginForm.bind(this)); // Обработчик события отправки формы
    this.loginInputEmailEl = document.querySelector(".login__input_email"); // Поле email
    this.loginInputPasswordEl = document.querySelector(".login__input_password"); // Поле password
  }

  onSubmitLoginForm(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    this.sendForm(); // Отправляем форму
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
      const jsonResponse = await fetch(`${_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.loginInputEmailEl.value, // Значение из поля email
          password: this.loginInputPasswordEl.value, // Значение из поля password
          device_name: "windows", // Указываем устройство
        }),
      });

      if (jsonResponse.ok) {
        const response = await jsonResponse.json();
        this.putTokenIntoLocalStorage(response.token); // Сохраняем токен
        window.location.href = _URL_ADMIN_INDEX; // Перенаправляем на админскую панель
      } else {
        const errorResponse = await jsonResponse.json();
        console.error(errorResponse);
        alert("Ошибка авторизации. Проверьте данные и попробуйте снова.");
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка. Попробуйте снова позже.");
    }
  }
}
