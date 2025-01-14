import accordeon from "./accordeon.js";
import { getHalls } from "./functions.js";
import HallManagement from "./HallManagement.js";
import HallConfiguration from "./HallConfiguration.js";

export default class Page {
    constructor(container) {
        this.containerEl = container;
        this.halls = [];
        this.accordeon = accordeon();
    }

    init() {
        this.accordeon;
        this.hallManagement = new HallManagement();
        this.hallConfiguration = new HallConfiguration();
        this.loadHalls();
    }
    
    async loadHalls() {  
        try {  
            this.halls = await getHalls();  
            console.log('Полученные залы:', this.halls);  // Логируем полученные данные 
        } catch (error) {  
            console.error('Ошибка при загрузке залов:', error);  
        }  
    }

}

