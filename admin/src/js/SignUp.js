// appSignUp.js
import { _URL } from "./app.js"; // Импортируем базовый URL из настроек

export default class SignUp {
  constructor() {
    this.init();
  }

  init() {
    this.bindToDom(); // Привязываем элементы DOM
  }

  bindToDom() {
    this.containerEl = document.querySelector("main"); // Главный контейнер
    this.signUpFormEl = document.querySelector(".login__form"); // Форма регистрации
    this.signUpFormEl.addEventListener("submit", this.onSubmitSignUpForm.bind(this)); // Обработчик события отправки формы
    this.signUpInputEmailEl = document.querySelector(".login__input_email"); // Поле email
    this.signUpInputPasswordEl = document.querySelector(".login__input_password"); // Поле password
  }

  async onSubmitSignUpForm(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    this.sendForm(); // Отправляем форму
  }

  async sendForm() {
    try {
      const jsonResponse = await fetch(`${_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Администратор", // Имя пользователя по умолчанию
          email: this.signUpInputEmailEl.value, // Значение из поля email
          password: this.signUpInputPasswordEl.value, // Значение из поля password
        }),
      });

      if (jsonResponse.ok) {
        alert("Регистрация успешна! Войдите в систему.");
        window.location.href = "/admin/src/html/login.html"; // Перенаправляем на страницу входа
      } else {
        const errorResponse = await jsonResponse.json();
        console.log(errorResponse);
        alert("Ошибка регистрации. Проверьте данные и попробуйте снова.");
      }
    } catch (error) {
      console.log(error);
      alert("Произошла ошибка. Попробуйте снова позже.");
    }
  }
}
