const swiper = new Swiper(".mySwiper", {
  autoplay: {
    delay: 5000,
  },
  });

  const mobileMenu = document.querySelector('.mobile-menu'),
  btnOpenMobileMEnu = document.querySelector('.header__mobile-menu'),
  btnCloseMenuMobile = document.querySelector('.mobile-menu__close');


  btnOpenMobileMEnu.addEventListener('click', () =>{
    mobileMenu.classList.add('active');

    console.log('asdadasdsa');
  });

  btnCloseMenuMobile.addEventListener('click', () =>{
    mobileMenu.classList.remove('active');

  })