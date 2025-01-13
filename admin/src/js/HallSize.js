export default class HallSize {
    constructor() {
      this.init();
      this.handlerChangeSize = null;
    }
  
    init() {
      this.bindToDom();
    }
  
    bindToDom() {
      this.countRowsEl = document.querySelector(".count-rows");
      console.log(this.countRowsEl);
      this.onChangeSize = this.onChangeSize.bind(this);
      this.countRowsEl.addEventListener("input", this.onChangeSize);
      this.countPlacesEl = document.querySelector(".count-places");
      this.countPlacesEl.addEventListener("input", this.onChangeSize);
    }
  
    renderHallSize({rows, places}) {
      this.countRowsEl.value = rows;
      this.countPlacesEl.value = places;
    }

    onChangeSize() {  
      const rows = this.countRowsEl.value.trim();  
      const places = this.countPlacesEl.value.trim();  
  
      if (rows === "" || places === "") {  
          console.warn("Количество рядов и мест не может быть пустым.");  
          return;  
      }  
  
      this.handlerChangeSize({rows: Number(rows), places: Number(places)});  
  }
}