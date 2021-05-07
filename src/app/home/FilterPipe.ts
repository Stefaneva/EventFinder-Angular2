import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, FormGroupName } from '@angular/forms';
import * as moment from 'moment';


@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  check(attributeMin: number, attributeMax: number, attribute: number): boolean {
    if (!attributeMin && !attributeMax) {
      return true;
    } else if (!attributeMax && attribute >= attributeMin) {
        return true;
    } else if (!attributeMin && attribute <= attributeMax) {
      return true;
    } else if (attribute >= attributeMin && attribute <= attributeMax) {
      return true;
    }
    return false;
  }

  checkSingleProp(propertyValue: any, item: any) {
    if (!propertyValue) {
      return true;
    } else if (propertyValue === item) {
      return true;
    }
    return false;
  }

  checkPropertyBoolean(propertyOne: boolean, propertyTwo: boolean, item: any, propertyValueOne: string, propertyValueTwo: string) {
    if ((!propertyOne && !propertyTwo) || (propertyOne && propertyTwo)) {
      return true;
    } else if (!propertyOne && propertyTwo && item === propertyValueTwo) {
       return true;
    } else if (!propertyTwo && propertyOne && item === propertyValueOne) {
      return true;
    }
    return false;
  }

  searchLocation(searchLat: number, searchLng: number, item: any) {
    if (searchLng && searchLat) {
      const locationLatLng = new google.maps.LatLng(searchLat, searchLng);
      const adLocation = new google.maps.LatLng(item['lat'], item['lng']);
      const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(locationLatLng, adLocation) / 1000;
      if (distanceInKm <= 5.0) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  checkStartDate(startDate: any, eventDate: any) {
    var startCompareDate;

    if (startDate === undefined || startDate === null) {
      return true;
    }
    startDate = startDate._i;
    startCompareDate = startDate;

    if (startDate.year === undefined) {
      startCompareDate = startDate.replaceAll("/", "-");
    }

    return moment(startCompareDate).isBefore(eventDate) || moment(startCompareDate).isSame(eventDate);
  }

  checkEndDate(endDate: any, eventDate: any) {
    var endCompareDate;

    if (endDate === undefined || endDate === null) {
      return true;
    }

    endDate = endDate._i;
    endCompareDate = endDate;

    if (endDate === undefined) {
      endCompareDate = endDate.replaceAll("/", "-");
    }

    console.log(moment(eventDate).isBefore(eventDate));

    return moment(eventDate).isBefore(endCompareDate) || moment(eventDate).isSame(endCompareDate);
  }

  transform(value: any, term:any, propName: string, freeEvent: boolean, paidEvent: boolean, feeTypeProp: string,
            eventType: any, eventTypeProp: string, priceMin: number, priceMax: number, priceProp: string,
            availableSeats: number, availableSeatsProp: string,
            category: string, categoryProp: string, 
            range: FormGroup, eventDateProperty: string, startDate: FormControl, endDate: FormControl,
            lat: number, lng: number) {

    if ((term === undefined || term === '' || term === 0) &&
        (eventType === undefined || eventType === ' ' || eventType === 'All') &&
        !freeEvent && !paidEvent &&
        !priceMin && !priceMax && !availableSeats && !range.value.start && !range.value.end &&
        !category && !lat && !lng) {
      return value;
    }

    const filteredItems = [];
    for (const item of value) {
      // console.log(startDate);

      // var startDateString;

      // if (range.value.start) {
      //   startDateString = range.value.start._i;
      // }

      // console.log(startDateString);

      if (!paidEvent && eventType !== 'All') {
        console.log("Check function return value: " + this.checkStartDate(endDate, item[eventDateProperty].slice(0, -5)));
        if  (this.checkSingleProp(availableSeats, item[availableSeatsProp]) &&
          this.checkSingleProp(category, item[categoryProp]) &&
          this.searchLocation(lat, lng, item) &&
          this.checkSingleProp(eventType, item[eventTypeProp]) &&
          // this.checkStartDate(range.value.start, item[eventDateProperty].slice(0, -5)) &&
          // this.checkEndDate(range.value.end, item[eventDateProperty].slice(0, -5))) { 
          this.checkStartDate(startDate, item[eventDateProperty].slice(0, -5)) &&
          this.checkEndDate(endDate, item[eventDateProperty].slice(0, -5))) {   
            if (term && item[propName].toLowerCase().includes(term.toLowerCase())) {
              filteredItems.push(item);
          } else if (!term) {
            filteredItems.push(item);
          }
        }
      }

      if (paidEvent && eventType !== 'All') {
        if (this.check(priceMin, priceMax, item[priceProp]) &&
            this.checkSingleProp(availableSeats, item[availableSeatsProp]) &&
            this.checkSingleProp(category, item[categoryProp]) &&
            this.searchLocation(lat, lng, item) &&
            this.checkSingleProp(eventType, item[eventTypeProp]) &&
            this.checkStartDate(range.value.start, item[eventDateProperty].slice(0, -5)) &&
            this.checkEndDate(range.value.end, item[eventDateProperty].slice(0, -5))) {
              filteredItems.push(item);
          } else if (!term) {
            filteredItems.push(item);
          }
        }
    }
    return filteredItems;
  }
}
