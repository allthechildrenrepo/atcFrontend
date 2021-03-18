import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
} from 'angular-calendar';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from 'src/app/shared/services/branch.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils';

const colors: any = {
  breakFast: {primary: '#f44336' },
  lunch: {primary: '#4CAF50' },
  dinner: {primary: '#03a9f4' },
  snacks: {primary: '#ffc107'}
};

@Component({
  selector: 'app-food-donation',
  templateUrl: './food-donation.component.html',
  styleUrls: ['./food-donation.component.scss']
})
export class FoodDonationComponent extends BasePage implements OnInit {

  objectKeys = Object.keys;

  userBranches: Branch[] = [];
  selectedBranch: number;
  allBranches: Branch[] = [];

  view: string = 'month';
  selectedDate: string = 'test';

  enterFoodDonation = false;

  // submitButton = false;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();

  editBookedFoodDonation = { 'breakFast': [false, ''], 'lunch': [false, ''], 'dinner': [false, ''], 'snacks': [false, ''] };
  foodVariety = ['Non-veg Meals', 'Veg Meals', 'Variety Rice', 'Snacks'];

  events: CalendarEvent[] = [];

  nonPastDay;

  foodDonationMonthWise = {};

  foodDonation = {};

  alerts = [];

  constructor(
    public branchService: BranchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.userBranches = [new Branch().deserialize({ id: 5, branch_name: "REDHILLS", phone: null, updated_at: "2020-02-24T06:05:05.740402Z", created_at: "2020-02-24T06:04:45Z" }), new Branch().deserialize({ id: 1, branch_name: "Teynampet", phone: null, updated_at: "2020-02-24T06:05:05.740402Z", created_at: "2020-02-24T06:04:45Z" })];
    // this.userBranches = [new Branch().deserialize({id: 1, branch_name: "Teynampet", phone: null, updated_at: "2020-02-24T06:05:05.740402Z", created_at: "2020-02-24T06:04:45Z"})];
    // this.userBranches = [new User().deSerialize(JSON.parse(localStorage.getItem('user'))).branch];
    if (this.userBranches.length === 1) {
      if (this.userBranches[0].branchName !== 'ADMIN OFFICE') {
        this.selectedBranch = this.userBranches[0].branchId;
      }
    }

    // this.presentLoader();

    this.branchService.get().subscribe(
      response => {
        this.dismissLoader();
        response.forEach(data => {
          this.allBranches.push(new Branch().deserialize(data));
        });
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  setBranch(branchId) {
    this.selectedBranch = branchId;
    /*Pass month and year parameter and get Food Donation detail of the month
    this.selectedBranch
    let month = this.viewDate.getMonth()+1;
    let year = this.viewDate.getFullYear()*/
    //Mock Response
    this.foodDonationMonthWise = {
      '5/1/2020': {
        'breakFast': { 'name': 'Naveen', 'phone': 9952267549, 'food': 'Non-veg Meals', 'reason': 'Birthday', 'Remarks': 'Chicken and fish meals' },
        'lunch': { 'name': 'Nataraj', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' },
        'dinner': { 'name': 'Saravanan', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' },
        'snacks': { 'name': 'Naveen', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' }
      },
      '4/26/2020': {
        'breakFast': { 'name': 'Naveen', 'phone': 9952267549, 'food': 'Non-veg Meals', 'reason': 'Birthday', 'Remarks': 'Chicken and fish meals' },
        'lunch': { 'name': 'Saravanan', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday' },
        'dinner': { 'name': 'Saravanan', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' }
      },
      '4/20/2020': {
        'breakFast': { 'name': 'Naveen', 'phone': 9952267549, 'food': 'Non-veg Meals', 'reason': 'Birthday', 'Remarks': 'Chicken and fish meals' },
        'lunch': { 'name': 'Saravanan', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday' },
        'dinner': { 'name': 'Saravanan', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' },
        'snacks': { 'name': 'Naveen', 'phone': 9952267549, 'food': 'Veg Meals', 'reason': 'Birthday', 'Remarks': 'Mutton and fish meals' }
      }
    }
    this.getFoodDonation(this.foodDonationMonthWise);
  }

  removeBranch() {
    this.selectedBranch = null;
    this.foodDonation = {};
    this.foodDonationMonthWise = {};
  }

  getFoodDonation(foodDonationResponse) {

    this.events = [];

    this.objectKeys(foodDonationResponse).forEach(
      date => {
        this.objectKeys(foodDonationResponse[date]).forEach(
          time => {
            this.events.push({
              start: new Date(date),
              title: foodDonationResponse[date][time]['reason'],
              color: colors[time]
            });
            this.refresh.next();
          }
        );
      }
    );
  }

  changeMonth() {
    /*Pass month and year parameter and get Food Donation detail of the month
    let month = this.viewDate.getMonth()+1;
    let year = this.viewDate.getFullYear()*/
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.enterFoodDonation = true;
    this.nonPastDay = date >= new Date();
    this.selectedDate = date.toLocaleDateString();

    if (this.foodDonationMonthWise[this.selectedDate]) {
      this.foodDonation = this.foodDonationMonthWise[this.selectedDate];
      this.objectKeys(this.foodDonation).forEach(
        time => {
          this.editBookedFoodDonation[time][1] = this.foodDonation[time]['food']
        }
      )
    }
  }

  backToCalendar() {
    this.enterFoodDonation = false;
    // this.submitButton = false;
    this.foodDonation = {};
  }

  selectFood(food, time) {
    this.editBookedFoodDonation[time][1] = food;

  }

  editBookedDonation(time) {
    this.editBookedFoodDonation[time][0] = true;
  }

  cancelEditdDonation(time, name) {
    name = '';
    this.editBookedFoodDonation[time][0] = false;
  }

  saveBookedDonation(time, name, phone, reason, remarks) {
    this.alerts = [];
    this.foodDonation[time] = {};
    this.foodDonation[time]['name'] = name;
    this.foodDonation[time]['phone'] = phone;
    this.foodDonation[time]['food'] = this.editBookedFoodDonation[time][1];
    this.foodDonation[time]['reason'] = reason;
    this.foodDonation[time]['remarks'] = remarks;

    this.editBookedFoodDonation[time][0] = false;

    this.foodDonationMonthWise[this.selectedDate] = this.foodDonation;
    this.getFoodDonation(this.foodDonationMonthWise);

    let message = this.selectedDate + " - " +  time.toUpperCase() + " Donation updated successfully";
    this.alerts.push({
      id: 1,
      type: "danger",
      message: message
    });
        
    setTimeout(() => {
      this.alerts = [];
    }, 3000);

  }
}
