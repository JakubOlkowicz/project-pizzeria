import {settings, select, classNames, } from './settings.js';
import Product from './componets/Product.js';
import Cart from './componets/Cart.js';
import Booking from './componets/Booking.js';

export const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/','');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListner('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        // get page id from href attribute
        const id = clickedElement.getAtrribut('href').replace('#', '');

        // run thisApp.activePage whit that id
        thisApp.activePage(id);

        // change URL hash

        window.location.hash = '#/' + id;
      });
    }
  },
  activePage: function(pageId){
    const thisApp = this;

    // add class 'active' to matching pages, remove from non-matching
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    // add class 'active' to matching links, remove from non-matching
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAtrribut('href') == '#' + pageId
      );
    }
  },
  initBooking: function(){
    const thisApp = this;

    const widgetContainer = thisApp.querySelector(select.containerOf.booking);
    thisApp.widgetBooking = new Booking(widgetContainer);

  },
  initMenu: function(){
    const thisApp = this;

    //console.log('thisApp.data:', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);      }
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListner('add-to-cart', function(event){
      app.cart.add(event.detile.product);
    });
  },
  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);

        // save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;
        //execute initMenu method
        thisApp.initMenu();
      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));  
  },
  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
  },   
};
app.init();



