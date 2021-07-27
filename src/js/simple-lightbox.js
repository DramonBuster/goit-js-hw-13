import SimpleLightbox from "simplelightbox";



let gallery = new SimpleLightbox('.image');
gallery.on('show.simplelightbox', function () {
    console.log("библиотека");
});
gallery.open();
