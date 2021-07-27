import cardTpl from '../templates/gallery.hbs';
import refs from "./refs.js";
const { form, list, card, more } = refs;
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";


//var lightbox = $('.image').simpleLightbox(options);
// var gallery = $('.image').simpleLightbox();

// gallery.open();
// let gallery = new SimpleLightbox('.image');
// gallery.on('show.simplelightbox', function () {
// 	// do something…
// });

    

let total = 0;
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    //зачищаем список отрисовки
    list.innerHTML = "";
    //сбрасываем параметр страницы
    fetchObject.resetPage();
   // console.log(evt.target.elements.searchQuery.value);
    let query = evt.target.elements.searchQuery.value.trim();
    //обнуляем значение total
    fetchObject.resetTotal();
    //записываем полученное значение из инпута в свойство объекта с запросом
    fetchObject.setQuery(query);
    //делаем запрос по значению из инпута и отрисовываем первый ответ
    fetchObject.getFetch();
    //выводим сообщение о том, сколько нашли изображений
    setTimeout(() => {
        fetchObject.message();
  }, 300);

    
    //открываем кнопку загрузки
    more.classList.remove("is-hidden");
    //зачищаем инпут
    form.reset();
})

function generateGallery(photo, totalHits) {
    const gallery = cardTpl(photo);
    
    total+= photo.length;
    console.log("total2",total);
    console.log(totalHits);
    console.log(photo.length);
    
    if (photo.length === 0) {
        more.classList.add("is-hidden");
        return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else if (totalHits === total) {
        list.insertAdjacentHTML("beforeend", gallery);
        more.classList.add("is-hidden");
        return setTimeout(() => {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }, 300);
    }
    //const message = Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    
    list.insertAdjacentHTML("beforeend", gallery);
    console.log(total);
    return  total;
}

const fetchObject = {
    apiKey: "22657812-5b6312e522363c98c02137a18", /
    baseUrl: "https://pixabay.com/api/",
    page: 1,
    per_page: 40,
    query: "",
    hit:0,
    resetTotal() {
        return total=0;
    },
    setQuery(value) {
        console.log("setQuery");
        return this.query = value;
    },
    setPage() {
        console.log("setPage");
        return this.page += 1;
    },
    resetPage() {
        console.log("resetPage");
        return this.page = 1;
    },


     async getFetch() {
        
        let queryParams = `?key=${this.apiKey}&q=${this.query}&image_type=photo&per_page=${this.per_page}&page=${this.page}&orientation=horizontal&safesearch=true`;
        let url = this.baseUrl + queryParams;
        
         const response = await fetch(url);
         const hits = await response.json();
         const image = hits.hits;
         const totalHits = hits.totalHits;
         generateGallery(image, totalHits);
         return this.hit = totalHits;
    },
    message() {
        if (this.hit === 0) {
            return;
        }
        console.log("message");
        return Notiflix.Notify.info(`Hooray! We found ${this.hit} images.`);
    },
    loadMore(button) {
        button.addEventListener("click", () => {
            console.log('загрузить больше');
            this.setPage();
            console.log(this.page);
            this.getFetch();
        });
    },
};

fetchObject.loadMore(more);