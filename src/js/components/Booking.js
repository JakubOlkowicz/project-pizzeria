import { templates, select, settings, classNames } from '../settings.js';
import { AmountWidget } from './AmountWidget.js';
import { utils } from '../utils.js';
import DataPicker from './DataPicker.js';
import HoursPicker from './HoursPicker.js';
 
export class Booking {
  constructor(reservWidgetContainer) {
    const thisBooking = this;
 
    thisBooking.render(reservWidgetContainer);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.bookedTable();
    thisBooking.sendBooking();
  }
 
  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,      
        endDateParam,      
      ],
      eventCurrent:[
        settings.db.notRepeatParam,
        startDateParam,   
        endDateParam,
      ],
      eventsRepeat:[
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking:      settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([booking, eventCurrent, eventsRepeat]){
        // console.log(booking);
        // console.log(eventCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(booking, eventCurrent, eventsRepeat);
      });
  }

  parseData(booking, eventCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};
    for(let item of booking){
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }

    for(let item of eventCurrent){
      thisBooking.makeBooked(item.data, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }     
    }
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock <= startHour + duration; hourBlock += 0.5){

      if(typeof thisBooking.booked[date][hourBlock] === 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);	
    let allAvailable = false;	
    if(	
      typeof thisBooking.booked[thisBooking.date] === 'undefined'	
      ||	
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] === 'undefined'	
    ){	
      allAvailable = true;	
    }

    for(let table of thisBooking.dom.table){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if( 
        !allAvailable
        && 
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId))
      {
        table.classList.add(classNames.booking.tableBooked);
        // console.log('dodalem');
      } else {
        table.classList.remove(classNames.booking.tableBooked);
        // console.log('zabralem');
      }
    }
    thisBooking.multiColor();
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
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.table = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.bookButton = thisBooking.dom.wrapper.querySelector(
      select.booking.bookButton
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.booking.address
    );
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.booking.phone
    );
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.starters
    );
  }
  bookedTable(){
    //wybór jednego z dostępnych stolików
    // usunięcie wyboru stolika przy zmianie daty lub godziny,
    const thisBooking = this;

    for(let table of thisBooking.dom.table){
      table.addEventListener('click', function(){
        console.log('click');
        table.classList.add(classNames.booking.tableBooked, classNames.booking.bookedClick);
      });
    }
  }
  bookingInfo(){
    const thisBooking = this;
    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      duration: thisBooking.hoursAmount.value,
      peopleAmount: thisBooking.peopleAmount.value,
      bookingAddress: thisBooking.dom.address.value,
      bookingPhone: thisBooking.dom.phone.value,
      table: [],
      starters: [],
    };
    for(let starter of thisBooking.dom.starters){
      console.log(starter);
      if(starter.checked === true){
        payload.starters.push(starter.value);
      }
    }
    for(let table of thisBooking.dom.table){
      if(table.classList.contains(classNames.booking.loading)){
        let tableId = parseInt(table.getAttribute(settings.booking.tableIdAttribute));
        payload.table.push(tableId);
      }
    }
    
    return payload;
  }
  sendBooking(){
    // wysyłka rezerwacji do API,    
  
    // uniemożliwienie ponownej rezerwacji tego samego stolika w tym samym terminie.

    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    thisBooking.dom.bookButton.addEventListener('click', function(event){
      event.preventDefault();
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thisBooking.bookingInfo()),
      };
  
      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
          for(let table of parsedResponse.table){
            thisBooking.makeBooked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, table);
          }
        });
    });
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DataPicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HoursPicker(thisBooking.dom.hourPicker);
  
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    }); 
  }
  multiColor(){
    const thisBooking = this;
    /* Odczytać datę z datePicker */
    const bookedHours = thisBooking.booked[thisBooking.date];
    // console.log(thisBooking.booked[thisBooking.date]);
    const sliderColor = [];
    /* wyliczyć % dla paska ze wszytskich godzin */
    thisBooking.rangeSlider = document.querySelector('.rangeSlider');
    /* pętla dla wszytskich godzin z tej daty */
    for(let bookedHour in bookedHours) {
      const first = ((bookedHour - 12) * 100) / 12;
      const firstAndHalf = (((bookedHour - 12)+ .5) * 100) /12;
      /* warunki dla stolików kolory  */
      if (bookedHours[bookedHour].length <= 1) {
        sliderColor.push('/*' + bookedHour + '*/green ' + first + '%, green ' + firstAndHalf + '%');
      } else if (bookedHours[bookedHour].length === 2) {
        sliderColor.push('/*' + bookedHour + '*/orange ' + first + '%, orange ' + firstAndHalf + '% ');
      } else if (bookedHours[bookedHour].length === 3) {
        sliderColor.push('/*' + bookedHour + '*/red ' + first + '%, red ' + firstAndHalf + '%');
      }
    }
    sliderColor.sort();
    const colors = sliderColor.join();
    thisBooking.rangeSlider.style.background = 'linear-gradient(to right, ' + colors + ')';
  }
  

  
}
