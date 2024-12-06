import accordeon from "./accordeon.js";


export default class Page {
    constructor(container) {
        this.containerEl = container;
        this.halls = [];
        console.log();
    }

    init() {
        accordeon();
    }

    

}

