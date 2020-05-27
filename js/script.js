let elem = document.querySelector('.main-carousel');
let flkty = new Flickity( elem, {

  cellAlign: 'left',
  contain: true,
  hash: true,
});

let progressBar = document.querySelector('.progress-bar');
let btnStart = document.querySelector('.btn');


flkty.on( 'scroll', function( progress ) {
  progress = Math.max( 0, Math.min( 1, progress ) );
  progressBar.style.width = progress * 100 + '%';
});

btnStart.addEventListener( 'click', function( event ) {
  // filter for button clicks
  if ( !matchesSelector( event.target, '.btn' ) ) {
    return;
  }
  let selector = event.target.getAttribute('data-selector');
  flkty.selectCell( selector );
});