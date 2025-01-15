import { _URL } from "./app.js";  
import Poster from "./Poster.js";  

export default class PosterList {  
    constructor(movies) {  
        this.posters = []; // Инициализация массива постеров  
        this.getPosters(movies); // Получаем постеры на основе переданных фильмов  
        this.init(); // Инициализация класса  
    }  

    // Метод для инициализации логики класса  
    init() {  
        this.bindToDom(); // Связываем DOM-элементы с методами  
        this.renderPosters(); // Отображаем постеры  
    }  

    // Метод для связывания DOM-элементов  
    bindToDom() {  
        this.mainEl = document.querySelector(".main"); // Находим основной элемент  
        // Добавляем слушатель события обновления списка постеров  
        this.mainEl.addEventListener("updatePosterList", this.onUpdatePosterList.bind(this));  // Регестриуем событие
        this.moviesContainerEl = document.querySelector(".movies-container"); // Находим контейнер для фильмов  
    }  

    // Асинхронный обработчик обновления списка постеров  
    async onUpdatePosterList() {  
        const token = localStorage.getItem('token'); // Получаем токен из локального хранилища  
        try {  
            // Выполняем запрос для получения обновленного списка фильмов  
            const jsonResponse = await fetch(`${_URL}movie`, {  
                method: "GET",  
                headers: { Authorization: `Bearer ${token}` }, // Добавляем токен в заголовки запроса  
            });  
            const response = await jsonResponse.json(); // Преобразуем ответ в JSON  
            this.getPosters(response); // Получаем постеры из ответившего списка фильмов  
            this.renderPosters(); // Отображаем обновленные постеры  
        } catch (error) {  
            console.error(error); // Обрабатываем ошибки  
        }  
    }  

    // Метод для получения постеров на основе списка фильмов  
    getPosters(movies) {  
        this.posters = []; // Очищаем текущий массив постеров  
        movies.forEach(movie => {  
            const poster = new Poster(movie); // Создаем новый экземпляр Poster для каждого фильма  
            this.posters.push(poster); // Добавляем постер в массив  
        });  
    }  

    // Метод для отображения постеров в контейнере  
    renderPosters() {  
        this.moviesContainerEl.innerHTML = ""; // Очищаем контейнер постеров  
        this.posters.forEach((poster) => {  
            this.moviesContainerEl.append(poster.getElement()); // Добавляем каждый постер в контейнер  
        });  
    }  
}
