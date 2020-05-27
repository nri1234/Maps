/////// MUSTACHE
(function(){ 
var carouselItem = document.getElementById('carousel-item').innerHTML;

Mustache.parse(carouselItem);

////

var listItems = '';

for(var i = 0; i < mySlides.length; i++){
  listItems += Mustache.render(carouselItem, mySlides[i]);
};

results.insertAdjacentHTML('beforeend', listItems);

})(); 