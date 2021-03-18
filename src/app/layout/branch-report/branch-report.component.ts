import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user';
import { DonationTransaction } from 'src/app/shared/model/donation-transaction';
import { FetchDonationTransactionService } from 'src/app/shared/services/fetch-donation-transaction.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils';
import { TransactionModeService } from 'src/app/shared/services/transaction-mode.service';

@Component({
  selector: 'app-branch-report',
  templateUrl: './branch-report.component.html',
  styleUrls: ['./branch-report.component.scss']
})
export class BranchReportComponent extends BasePage implements OnInit {

  selectedBranch: number;
  selectedBranchName;
  user: User;
  fromDate: any;
  toDate: any;
  tomorrow: any;
  years = [];
  selectedYear = new Date().getFullYear();
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  selectedMonth;
  alerts = [];
  modeOfTransaction = [];
  verifiedTransactionCount = 0;
  verifiedTransactionTotal = 0;
  progressTransactionCount = 0;
  progressTransactionTotal = 0;
  objectKeys = Object.keys;
  modeWiseTransactions = {};
  verifiedTransactionDetails: DonationTransaction[] = [];
  progressTransactionDetails: DonationTransaction[] = [];


  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public transactionModeService: TransactionModeService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    if (this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }

    for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 11; i--) {
      this.years.push(i);
    }
    this.fetchModeOfTransaction();

  }

  fetchModeOfTransaction() {
    this.presentLoader();
    this.transactionModeService.get().subscribe(
      data => {
        this.dismissLoader();
        this.modeOfTransaction = data;
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    this.dismissLoader();
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.selectedBranchName = branch.branchName;
  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedBranchName = null;
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = null;
    this.verifiedTransactionDetails = [];
    this.progressTransactionDetails = [];

  }

  setDateFilter(date) {
    this.fromDate = date.fromDate;
    this.toDate = date.toDate;
    this.tomorrow = date.tomorrow;
  }

  resetDates() {
    this.fromDate = null;
    this.toDate = null;
  }

  showAlert(message, type) {
    this.alerts = [];
    this.alerts.push({
      id: 1,
      type: type,
      message: message
    });

    setTimeout(() => {
      this.alerts = [];
    }, 3000);
  }

  onYearSelection() {
    console.log("Selected year", this.selectedYear);
    this.selectedMonth = null;
  }

  updateMonth(month) {
    let numMonth = (this.months.indexOf(month) + 1);
    var params = {
      status: 3,
      branch: this.selectedBranch,
      start_date: this.selectedYear + '-' + numMonth + '-' + 1,
      end_date: this.selectedYear + '-' + numMonth + '-' + new Date(this.selectedYear, numMonth, 0).getDate(),
    };
    this.getDonationList(params);
  }

  getDonationList(params) {
    //Fetch Verified Transaction
    this.presentLoader();
    this.verifiedTransactionDetails = [];
    this.fetchDonationTransactionService.get(params).subscribe(
      response => {
        this.dismissLoader();
        this.verifiedTransactionDetails = [];
        if (response.length) {
          response.forEach(data => {
            this.verifiedTransactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          });
          this.generateVerifiedTransactionReport();
        }
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
        this.showAlert(
          "Server Down, Please refresh the page and try again",
          "danger"
        );
      }
    );

    //Fetch InProgress Transaction
    params.status = 2;
    this.fetchDonationTransactionService.get(params).subscribe(
      response => {
        this.progressTransactionDetails = [];
        if (response.length) {
          response.forEach(data => {
            this.progressTransactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          });
          this.generateProgressTransactionReport();
        }
      }
    );
  }

  generateProgressTransactionReport() {
    this.progressTransactionCount = 0;
    this.progressTransactionTotal = 0;
    if (this.progressTransactionDetails.length) {
      this.progressTransactionDetails.forEach(transaction => {
        this.progressTransactionCount++;
        this.progressTransactionTotal += transaction.amount;
      });
    }
  }

  generateVerifiedTransactionReport() {
    if (this.verifiedTransactionDetails.length) {
      this.modeOfTransaction.forEach(mode => {
        this.modeWiseTransactions[mode.id] = {};
        this.modeWiseTransactions[mode.id]['name'] = mode.name;
        this.modeWiseTransactions[mode.id]['count'] = 0;
        this.modeWiseTransactions[mode.id]['total'] = 0;
      });
      this.verifiedTransactionCount = 0;
      this.verifiedTransactionTotal = 0;
      this.verifiedTransactionDetails.forEach(transaction => {
        this.verifiedTransactionCount++;
        this.verifiedTransactionTotal += transaction.amount;
        console.log("Testing", this.modeOfTransaction);
        this.objectKeys(this.modeWiseTransactions).forEach(
          mode => {
            if (mode === transaction.mode_of_transaction) {
              this.modeWiseTransactions[mode]['count']++;
              this.modeWiseTransactions[mode]['total'] += transaction.amount;
            }
          }
        );
      });
      this.orderModeWiseTransaction()
    }
  }

  //Sorted the mode of transaction but not used in HTML
  orderModeWiseTransaction() {
    var sortedTransacions = {}
    for (var mode in this.modeWiseTransactions) {
      sortedTransacions[this.modeWiseTransactions[mode].name] = {}
      sortedTransacions[this.modeWiseTransactions[mode].name]['count'] = this.modeWiseTransactions[mode].count
      sortedTransacions[this.modeWiseTransactions[mode].name]['total'] = this.modeWiseTransactions[mode].total
    }
    console.log("Obj value", sortedTransacions);
    var sortable = [];
    for (var mode in sortedTransacions) {
      console.log("mode id", mode);
      sortable.push([mode, sortedTransacions[mode]]);
    }
    sortable.sort((a, b) => {
      return b[1].total - a[1].total;
    });

    var objSorted = {}
    sortable.forEach((item) => {
      objSorted[item[0]] = item[1]
    });
  }

}
