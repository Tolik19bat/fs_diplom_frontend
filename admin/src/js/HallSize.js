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
      this.onChangeSize = this.onChangeSize.bind(this);
      this.countRowsEl.addEventListener("input", this.onChangeSize);
      this.countPlacesEl = document.querySelector(".count-places");
      this.countPlacesEl.addEventListener("input", this.onChangeSize);
      console.log(".count-places");
    }
  
    renderHallSize({rows, places}) {
      this.countRowsEl.value = rows;
      this.countPlacesEl.value = places;
    }
  
    onChangeSize() {
      this.handlerChangeSize({rows: this.countRowsEl.value, places: this.countPlacesEl.value});
    }
  
    
  }