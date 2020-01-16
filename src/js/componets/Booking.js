import {select, templates} from '..settings';
import utils from '..utils.js';
import AmountWidget from 'AmountWidget.js';

export class Booking {
  constructor(){
    const thisBooking = this;
    
    thisBooking.render(widgetBooking);

    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.quertySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.quertySelector(select.booking.hoursAmount);
    
  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget (thisBooking.dom.hoursAmount);
  }
}
export default Booking;