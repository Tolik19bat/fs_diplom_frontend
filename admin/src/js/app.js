import Page from "./Page.js";  

export const _URL = "http://127.0.0.1:80/api/";  
export const _URL_ADMIN_INDEX = "/admin/src/html/index.html";  

document.addEventListener('DOMContentLoaded', () => {  
    if (location.pathname === "/admin/src/html/signup.html"  
        || location.pathname === "/admin/src/html/login.html"  
        || location.pathname === "/admin/src/html/index.html") {  

        const pageContainer = document.querySelector(".main");  

        if (pageContainer) { // Проверяем, что элемент найден  
            const page = new Page(pageContainer);  
            page.init();  
        } else {  
            console.error("Элемент .main не найден");  
        }  
    }  
});