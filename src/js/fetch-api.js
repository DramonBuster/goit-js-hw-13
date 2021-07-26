import imgCardTpl from '../templates/image-gallery.hbs';
import refs from "./refs.js";
const { form, list, card, more } = refs;
import Notiflix from "notiflix";
// import SimpleLightbox from "simplelightbox";

var lightbox = $('.gallery a').simpleLightbox(options);


let total = 0;
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    list.innerHTML = "";

    fetchObject.resetPage();
    let query = evt.target.elements.searchQuery.value.trim();

    fetchObject.resetTotal();
    fetchObject.setQuery(query);
    fetchObject.getFetch();

    setTimeout(() => {
        fetchObject.message();
    }, 300);

    more.classList.remove("is-hidden");
    form.reset();
})

function generateGallery(photo, totalHits) {
    const gallery = imgCardTpl(photo);

    total += photo.length;
    console.log("total2", total);
    console.log(totalHits);
    console.log(photo.length);

    if (photo.length === 0) {
        more.classList.add("is-hidden");
        return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
    } else if (totalHits === total) {
        list.insertAdjacentHTML("beforeend", gallery);
        more.classList.add("is-hidden");
        return setTimeout(() => {
            Notiflix.Notify.info("Sorry, but there are no more results.");
        }, 300);
    }

    list.insertAdjacentHTML("beforeend", gallery);
    console.log(total);
    return total;
}

const fetchObject = {
    apiKey: "22657812-5b6312e522363c98c02137a18",
    baseUrl: "https://pixabay.com/api/",

    page: 1,
    per_page: 4,
    query: "",
    hit: 0,
    resetTotal() {
        return total = 0;
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

    //асинхронный код
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

