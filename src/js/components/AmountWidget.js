/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

export class AmountWidget extends BaseWidget {

  constructor(wrapper){
    super(wrapper, settings.amountWidget.defaultValue );

    const thisWidget = this;
    
    thisWidget.getElements();
    thisWidget.initActions();

    // console.log('AmountWidget:', thisWidget);
    // console.log('constructor arguments:', element);
  }

  getElements(){
    const thisWidget = this;
  
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
    && value <= settings.amountWidget.defaultMax
    && value >= settings.amountWidget.defaultMin;
  }

  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function() {
      thisWidget.dom.input.value = thisWidget.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  renderValue(){
    const thisWidget = this;
  
    thisWidget.dom.input.value = thisWidget.value;
  }

  
}
