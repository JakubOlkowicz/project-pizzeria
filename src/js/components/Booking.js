/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
import {templates, select} from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import DataPicker from './DataPicker.js';
import HoursPicker from './HoursPicker.js';

export class Booking {
  constructor(reservWidgetContainer){
    const thisBooking = this;


    thisBooking.render(reservWidgetContainer);
    thisBooking.initWidgets();

  }

  render(bookingContainer){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingContainer;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    
    thisBooking.dom.hoursPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }
  
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.hoursPicker);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DataPicker(thisBooking.dom.datePicker);
    thisBooking.hoursPicker = new HoursPicker(select.widgets.hourPicker.wrapper);
    
  }
}
