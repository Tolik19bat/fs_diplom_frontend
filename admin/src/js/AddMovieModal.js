// import { _URL } from "./app.js";
import Fetch from "./Fetch.js";

export default class AddMovieModal {
  // Объявление и инициализация статических свойств класса для работы с элементами формы редактирования фильма
  static editMode = false; // Логическое значение, указывающее, активирован ли режим редактирования (true) или нет (false)
  static movieId; // Идентификатор текущего редактируемого фильма
  static mainEl; // Ссылка на главный элемент, содержащий форму редактирования
  static containerEl; // Ссылка на контейнер с формой редактирования
  static closeBtnEl; // Ссылка на кнопку для закрытия формы редактирования
  static formEl; // Ссылка на элемент формы редактирования
  static titleInputEl; // Ссылка на поле ввода для названия фильма
  static durationInputEl; // Ссылка на поле ввода для продолжительности фильма
  static countryInputEl; // Ссылка на поле ввода для страны производства
  static descriptionInputEl; // Ссылка на поле ввода для описания фильма
  static startDateInputEl; // Ссылка на поле ввода для даты начала показа фильма
  static endDateInputEl; // Ссылка на поле ввода для даты окончания показа фильма

  static init() {
    AddMovieModal.bindToDom(); // Инициализация: привязка элементов DOM к свойствам класса
  }

  static bindToDom() {
    // Привязываем элементы DOM
    AddMovieModal.containerEl = document.querySelector(".modal-add-movie");
    AddMovieModal.closeBtnEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__btn-close"
    );
    AddMovieModal.closeBtnEl.addEventListener(
      "click",
      AddMovieModal.onClickCloseBtn
    );

    AddMovieModal.formEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__form"
    );
    AddMovieModal.formEl.addEventListener("submit", AddMovieModal.onSubmitForm);

    AddMovieModal.titleInputEl =
      AddMovieModal.containerEl.querySelector("#movie-title");
    AddMovieModal.durationInputEl =
      AddMovieModal.containerEl.querySelector("#movie-duration");
    AddMovieModal.countryInputEl =
      AddMovieModal.containerEl.querySelector("#movie-country");
    AddMovieModal.descriptionInputEl =
      AddMovieModal.containerEl.querySelector("#movie-description");
    AddMovieModal.startDateInputEl =
      AddMovieModal.containerEl.querySelector("#movie-start_date");
    AddMovieModal.endDateInputEl =
      AddMovieModal.containerEl.querySelector("#movie-end_date");

    AddMovieModal.btnAddImgEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__btn-add-img"
    );
    AddMovieModal.btnAddImgEl.addEventListener(
      "click",
      AddMovieModal.onClickBtnAddImg
    );

    AddMovieModal.inputFileEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__input_file"
    );
    AddMovieModal.inputFileEl.addEventListener(
      "change",
      AddMovieModal.onChangeInputFile
    );

    AddMovieModal.btnSubmitEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__btn-submit"
    );
  }

  static showModal() {
    AddMovieModal.containerEl.classList.remove("hidden"); // Показываем модальное окно
    AddMovieModal.btnAddImgEl.textContent = "Добавить постер";

    if (AddMovieModal.editMode && AddMovieModal.posterURL) {
      AddMovieModal.showImage(AddMovieModal.posterURL); // Отображаем постер, если он есть
      AddMovieModal.btnAddImgEl.textContent = "Изменить постер";
    }
  }

  static showImage(url) {
    const posterImgEl = document.createElement("img");
    posterImgEl.classList.add("modal-add-movie__img");
    posterImgEl.setAttribute("src", url); // Устанавливаем источник изображения
    posterImgEl.setAttribute("alt", "постер");
    AddMovieModal.closeBtnEl.after(posterImgEl); // Добавляем изображение после кнопки закрытия
  }

  static hideImage() {
    const imgEl = AddMovieModal.containerEl.querySelector(
      ".modal-add-movie__img"
    );
    if (imgEl) {
      imgEl.remove(); // Удаляем изображение, если оно есть
    }
  }

  static hideModal() {
    AddMovieModal.formEl.reset(); // Сброс формы
    AddMovieModal.containerEl.classList.add("hidden"); // Скрываем модальное окно
    AddMovieModal.hideImage(); // Скрываем изображение постера
    AddMovieModal.editMode = false; // Возвращаем режим редактирования в false
    AddMovieModal.movieId = undefined; // Сбрасываем ID фильма
  }

  static onClickCloseBtn(e) {
    e.preventDefault();
    AddMovieModal.hideModal(); // Закрываем модальное окно
  }

  static onSubmitForm(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение формы (чтобы страница не перезагружалась)

    // Проверяем, является ли введенное значение числом и больше ли оно нуля
    if (
      !isFinite(+AddMovieModal.durationInputEl.value) || // Проверяем, является ли числом
      +AddMovieModal.durationInputEl.value <= 0 // Проверяем, больше ли нуля
    ) {
      return; // Если не число или меньше/равно нулю, выходим из функции
    }

    let method; // Объявляем переменную для метода, который будем вызывать

    // Определяем, в каком режиме работает модальное окно (редактирование или добавление)
    if (AddMovieModal.editMode) {
      method = AddMovieModal.editMovie; // Если режим редактирования, используем метод редактирования
    } else {
      method = AddMovieModal.addMovie; // Если добавление, используем метод добавления
    }

    // Вызываем выбранный метод (добавление или редактирование) и после выполнения:
    method().then(() => {
      AddMovieModal.hideModal(); // Закрываем модальное окно
      AddMovieModal.updatePosterList(); // Обновляем список постеров на странице
    });
  }

  static updatePosterList() {
    const event = new CustomEvent("updatePosterList"); // Создаем кастомное событие
    document.querySelector(".main").dispatchEvent(event); // Генерируем событие обновления
  }

  /**
   * Функция для создания нового фильма,
   * данные formData
   *
   * @static
   * @async
   * @returns {*}
   */
  static async addMovie() {
    const formData = new FormData(AddMovieModal.formEl); // Создаем объект FormData
    await Fetch.send("POST", "movie", { formData });

    // const token = localStorage.getItem("token"); // Получаем токен из localStorage
    // try {
    // const formData = new FormData(AddMovieModal.formEl); // Создаем объект FormData
    //   await fetch(`${_URL}movie`, {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` }, // Устанавливаем заголовки
    //     body: formData, // Отправляем данные формы
    //   });
    // } catch (error) {
    //   console.error(error); // Логируем ошибку
    // }

    // Отправляем HTTP-запрос методом POST на эндпоинт "movie", передавая данные формы (formData)
    // await Fetch.send("POST", "movie", { formData });
  }

  /**
   * Функция для редактирования фильма,
   * данные formData,
   * заменяются по параметру AddMovieModal.movieId
   *
   */
  static async editMovie() {
    if (!AddMovieModal.movieId) {
      return; // Если ID фильма отсутствует, выходим
    }
    const formData = new FormData(AddMovieModal.formEl); // Создаем объект FormData
    await Fetch.send("POST", `movie/${AddMovieModal.movieId}`, {
      formData,
      addPut: true,
    });

    // const token = localStorage.getItem("token"); // Получаем токен из localStorage
    // try {
    // const formData = new FormData(AddMovieModal.formEl); // Создаем объект FormData
    //   formData.append("_method", "PUT"); // Указываем, что будем обновлять
    //   await fetch(`${_URL}movie/${AddMovieModal.movieId}`, {
    //     method: "POST",
    //     headers: { Authorization: `Bearer ${token}` }, // Устанавливаем заголовки
    //     body: formData, // Отправляем данные формы
    //   });
    // } catch (error) {
    //   console.error(error); // Логируем ошибку
    // }

    // Отправляем HTTP-запрос методом POST на эндпоинт "movie/{movieId}", передавая данные формы (formData)
    // Дополнительно передаём параметр addPut: true (чтобы обработать запрос особым образом)
    // await Fetch.send("POST", `movie/${AddMovieModal.movieId}`, {
    //   formData,
    //   addPut: true,
    // });
  }

  static edit(movie) {
    // Заполняем поля формы данными фильма для редактирования
    AddMovieModal.titleInputEl.value = movie.title;
    AddMovieModal.durationInputEl.value = movie.duration;
    AddMovieModal.countryInputEl.value = movie.country;
    AddMovieModal.descriptionInputEl.value = movie.description;
    AddMovieModal.startDateInputEl.value = movie.start_date;
    AddMovieModal.endDateInputEl.value = movie.end_date;
    AddMovieModal.movieId = movie.id; // Сохраняем ID фильма
    AddMovieModal.posterURL = movie.poster_url; // Сохраняем URL постера
    AddMovieModal.editMode = true; // Включаем режим редактирования
    AddMovieModal.showModal(); // Показываем модальное окно
  }

  static onClickBtnAddImg(e) {
    e.preventDefault();
    AddMovieModal.inputFileEl.dispatchEvent(new MouseEvent("click")); // Открываем выбор файла
  }

  static onChangeInputFile(e) {
    e.preventDefault();
    const file =
      AddMovieModal.inputFileEl.files && AddMovieModal.inputFileEl.files[0]; // Получаем выбранный файл
    if (!file) {
      return; // Если файл отсутствует, выходим
    }
    const url = URL.createObjectURL(file); // Создаем URL для файла
    AddMovieModal.hideImage(); // Скрываем предыдущий постер
    AddMovieModal.showImage(url); // Показываем новый постер
  }
}
