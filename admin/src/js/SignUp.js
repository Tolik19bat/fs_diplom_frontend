import { _URL } from "./app.js";

// Определяем класс для управления регистрацией пользователей
export default class SignUp {
  // Конструктор сразу вызывает инициализацию
  constructor() {
    this.init(); // Запускаем метод инициализации
  }

  // Метод для инициализации класса
  init() {
    this.bindToDom(); // Привязываем элементы DOM к свойствам класса
  }

  // Метод для привязки элементов DOM
  bindToDom() {
    this.containerEl = document.querySelector("main"); // Главный контейнер страницы
    this.signUpFormEl = document.querySelector(".login__form"); // Форма регистрации
    // Добавляем обработчик события отправки формы, привязываем метод с использованием bind
    this.signUpFormEl.addEventListener(
      "submit",
      this.onSubmitSignUpForm.bind(this)
    );
    this.signUpInputEmailEl = document.querySelector(".login__input_email"); // Поле ввода email
    this.signUpInputPasswordEl = document.querySelector(
      ".login__input_password"
    ); // Поле ввода пароля
  }

  // Метод для обработки события отправки формы
  async onSubmitSignUpForm(e) {
    e.preventDefault(); // Останавливаем стандартное поведение формы
    this.sendForm(); // Отправляем форму на сервер
  }

  // Метод для отправки данных формы на сервер
  async sendForm() {
    try {
      // Отправляем POST-запрос для регистрации
      const jsonResponse = await fetch(`${_URL}register`, {
        method: "POST", // Используем метод POST
        headers: {
          "Content-Type": "application/json", // Указываем тип передаваемых данных
        },
        body: JSON.stringify({
          name: "Администратор", // Имя по умолчанию
          email: this.signUpInputEmailEl.value, // Берем значение из поля email
          password: this.signUpInputPasswordEl.value, // Берем значение из поля password
        }),
      });

      // Если запрос успешен
      if (jsonResponse.ok) {
        alert("Регистрация успешна! Войдите в систему."); // Показываем уведомление
        window.location.href = "/admin/src/html/login.html"; // Перенаправляем пользователя на страницу входа
      } else {
        // Если запрос завершился с ошибкой
        const errorResponse = await jsonResponse.json(); // Получаем тело ответа с ошибкой
        console.log(errorResponse); // Логируем ошибку
        alert("Ошибка регистрации. Проверьте данные и попробуйте снова."); // Показываем предупреждение
      }
    } catch (error) {
      // Обрабатываем возможные ошибки сети или сервера
      console.log(error); // Логируем ошибку
      alert("Произошла ошибка. Попробуйте снова позже."); // Показываем сообщение об ошибке
    }
  }
}
