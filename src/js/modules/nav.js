
const $ = require("jquery");
class Nav{
  constructor(){
    this.menu = $('#js-navigation-menu');
    this.menuToggle = $('#js-mobile-menu').unbind();
  }

  start(){
    console.log('start')
  this.menu.removeClass("show");

  this.menuToggle.on('click', (e) => {
    e.preventDefault();
    this.menu.slideToggle(() => {
      if(this.menu.is(':hidden')) {
        this.menu.removeAttr('style');
      }
    });
  });

  }

}



export { Nav }

