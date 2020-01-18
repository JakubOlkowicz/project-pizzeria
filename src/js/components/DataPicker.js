import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import {select, settings } from '../settings.js';

class DataPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate =  utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    
    const option = {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date) {
          return (date.getDay() === 1 || date.getDay() === 7);
        }
      ],
  
      'locale': {
        'firstDayOfWeek': 1 
      },
    };
      
    // eslint-disable-next-line no-undef
    flatpickr(thisWidget.dom.input, option);
  }
  parseValue(some){
    return some;
  }
  isValid(){
    return true;
  }
  renderValue(){

  }
}
export default DataPicker;