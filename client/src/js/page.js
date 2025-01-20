import Calendar from "./Calendar.js";
import MoviesList from "./MoviesList.js";

export default class Page {
  constructor() {
    this.halls = [];
    this.init();
  }

  init() {
    this.bindToDom();
    this.calendar = new Calendar();
    this.moviesList = new MoviesList();
    this.calendar.onChangeDate = this.moviesList.getMoviesList;
    this.calendar.init();
  }

  bindToDom() {
    this.btnLogInEl = this.setupButton(".page-header__log-in-btn", this.onClickBtnLogIn.bind(this), "Кнопка входа не найдена.");
    this.btnSignUpEl = this.setupButton(".page-header__sign-up-btn", this.onClickBtnSignUp.bind(this), "Кнопка регистрации не найдена.");
  }

  setupButton(selector, clickHandler, warningMessage) {
    const buttonEl = document.querySelector(selector);
    if (buttonEl) {
      buttonEl.addEventListener("click", clickHandler);
    } else {
      console.warn(warningMessage);
    }
    return buttonEl; // Возвращаем элемент, если нужно  
  }

  onClickBtnLogIn() {
    if (confirm("Хотите стать администратором ?")) {
      window.location.href = "/admin/src/html/login.html";
    }
  }

  onClickBtnSignUp() {
    if (confirm("Хотите зарегестрироваться как администратор ?")) {
      window.location.href = "/admin/src/html/signup.html";
    }
  }
}
