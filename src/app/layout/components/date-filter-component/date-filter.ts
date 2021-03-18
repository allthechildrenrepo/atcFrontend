import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { User } from "src/app/shared/model";

/**
 * <date-filter [cacheKey]="'donationVerification'" (setDate)="setDateFilter($event)"></date-filter>
 */
@Component({
  selector: "date-filter",
  templateUrl: "./date-filter.html",
  styleUrls: ["./date-filter.scss"],
})
export class DateFilterComponent implements OnInit {
  @Output() setDate = new EventEmitter<any>();

  /**cachkey is used to store in local storgae and fetch for recent search
   */
  @Input() cacheKey: string = "lastSearched";

  fromDate: any;
  toDate: any;
  minDate: any;
  lastSearched: any;

  constructor() {}

  ngOnInit() {
    this.getLastSearched();
  }

  setFromDate(dateEvent) {
    this.minDate = new Date(dateEvent.targetElement.value);
    this.fromDate = new Date(dateEvent.targetElement.value);
  }

  setToDate(dateEvent) {
    this.toDate = new Date(dateEvent.targetElement.value);
  }

  resetDateFilter() {
    this.fromDate = undefined;
    this.toDate = undefined;
  }

  emitDate() {
    var tomorrow = new Date();
    tomorrow.setDate(new Date(this.toDate).getDate()+1);
    this.lastSearched = { fromDate: this.fromDate, toDate: this.toDate, tomorrow: tomorrow }
    localStorage.setItem(this.cacheKey, JSON.stringify(this.lastSearched))
    this.setDate.emit({ fromDate: this.fromDate, toDate: this.toDate, tomorrow: tomorrow });
  }

  getLastSearched() {
    let lastSearchedInterval = localStorage.getItem(this.cacheKey);
    if(lastSearchedInterval) {
        this.lastSearched = JSON.parse(lastSearchedInterval);
    }
  }

  filterToday() {
    let todayDate = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    this.setDate.emit({ fromDate: todayDate, toDate: tomorrow, tomorrow: tomorrow });
  }

  filterYesterDay() {

    let toDate = new Date();
    let fromDate =  new Date();
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);

    fromDate.setDate(new Date().getDate() - 1);
    this.setDate.emit({ fromDate: fromDate, toDate: toDate, tomorrow: tomorrow });
  }

  filterThisWeek() {
    let toDate = new Date();
    let fromDate =  new Date();
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    fromDate.setDate(new Date().getDate() - 7);
    this.setDate.emit({ fromDate: fromDate, toDate: toDate, tomorrow: tomorrow });
  }

  filterThisMonth() {
    let toDate = new Date();
    let fromDate =  new Date();
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate()+1);
    fromDate.setDate(new Date().getDate() - 30);
    this.setDate.emit({ fromDate: fromDate, toDate: toDate, tomorrow: tomorrow });
  }

  filterRecentSearch() {
      this.fromDate = this.lastSearched.fromDate;
      this.toDate = this.lastSearched.toDate;
      this.emitDate();
  }
}
