import { templates, select } from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { utils } from '../utils.js';
import DataPicker from './DataPicker.js';
import HoursPicker from './HoursPicker.js';
 
export class Booking {
  constructor(reservWidgetContainer) {
    const thisBooking = this;
 
    thisBooking.render(reservWidgetContainer);
    thisBooking.initWidgets();
  }
 
  render(bookingContainer) {
    const thisBooking = this;
 
    const generatedHTML = templates.bookingWidget();
 
    thisBooking.dom = {};
 
    thisBooking.dom.wrapper = bookingContainer;
 
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
 
    bookingContainer.appendChild(thisBooking.dom.wrapper);
 
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    console.log(thisBooking.dom.peopleAmount);
 
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    console.log(thisBooking.dom.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    console.log(thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    console.log(thisBooking.dom.hourPicker);
  }
 
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DataPicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HoursPicker(thisBooking.dom.hourPicker);
  }
}