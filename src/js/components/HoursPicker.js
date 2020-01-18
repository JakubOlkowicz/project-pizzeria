import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import {select, settings } from '../settings.js';

class HoursPicker extends BaseWidget {
  constructor(wrapper){
    super(wrapper, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input;
  }
  
  initPlugin(){
    const thisWidget = this;
    // eslint-disable-next-line no-undef
    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input;
    });
  }
  parseValue(value){
    return utils.numberToHour(value);
  }
  isValid(){
    return true;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
export default HoursPicker;
