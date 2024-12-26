import Calendar from "./Calendar.js";
import MoviesList from "./MoviesList.js";

export default class Page {
  constructor() {
    this.halls = [];
    this.init();
  }

  init() {
    this.bindToDom();
    // this.calendar = new Calendar();
    // this.moviesList = new MoviesList();
    // this.calendar.onChangeDate = this.moviesList.getMoviesList;
    // this.calendar.init();
  }

  bindToDom() {
    this.btnSettingEl = document.querySelector(".page-header__setting");
    this.btnSettingEl.addEventListener("click", this.onClickBtnSetting.bind(this));
  }

   onClickBtnSetting() {  
    if (confirm("Вы уверены, что хотите перейти на страницу входа?")) {  
        window.location.href = "/admin/src/html/login.html";  
    }  
}
  // onClickBtnSetting() {
  //   window.location.href = "/admin/src/html/login.html";
  // }

}
