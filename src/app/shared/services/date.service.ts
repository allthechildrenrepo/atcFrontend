import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class DateFormaterService {
    converDateToYmd(date) {
        let givenDate = new Date(date);
        let year = givenDate.getFullYear();
        let month = givenDate.getMonth()+1;
        let d =  givenDate.getDate();
        return year +"-"+month+"-"+d;
    }
}