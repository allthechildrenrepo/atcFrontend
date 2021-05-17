import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/model/user';
import { DonationTransaction } from 'src/app/shared/model/donation-transaction';
import { FetchDonationTransactionService } from 'src/app/shared/services/fetch-donation-transaction.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils';
import { TransactionModeService } from 'src/app/shared/services/transaction-mode.service';

@Component({
  selector: 'app-overall-report',
  templateUrl: './overall-report.component.html',
  styleUrls: ['./overall-report.component.scss']
})
export class OverallReportComponent extends BasePage implements OnInit {

  // user: User;
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
  selectedFilterMode: any;

  constructor(
    public fetchDonationTransactionService: FetchDonationTransactionService,
    public transactionModeService: TransactionModeService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    // this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    // if (this.user.branch.length === 1) {
    //   this.setBranch(this.user.branch[0]);
    // }

    this.selectedMonth = this.months[new Date().getMonth()];

    for (let i = new Date().getFullYear(); i >= new Date().getFullYear() - 11; i--) {
      this.years.push(i);
    }
    this.fetchModeOfTransaction();
    this.updateMonth(this.selectedMonth);

  }

  fetchModeOfTransaction() {
    this.transactionModeService.get().subscribe(
      data => {
        this.modeOfTransaction = data.results;
      },
      err => {
        this.somethingWentWrong();
      }
    );
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

  emptyTransaction() {
    this.verifiedTransactionCount = 0;
    this.verifiedTransactionTotal = 0;
    this.progressTransactionCount = 0;
    this.progressTransactionTotal = 0;
    this.verifiedTransactionDetails = [];
    this.progressTransactionDetails = [];
  }

  onYearSelection() {
    this.selectedMonth = null;
    this.emptyTransaction();
  }


  filter(mode = undefined) {
    this.selectedFilterMode=mode;
    this.updateMonth(this.selectedMonth)
  }

  updateMonth(month) {
    this.emptyTransaction();
    let numMonth = (this.months.indexOf(month) + 1);

    var params = {
      status: 3,
      start_date: this.selectedYear + '-' + numMonth + '-' + 1,
      end_date: this.selectedYear + '-' + numMonth + '-' + new Date(this.selectedYear, numMonth, 0).getDate(),
    };
    if(this.selectedFilterMode) {
      params['mode_of_transaction_id'] = this.selectedFilterMode.id;
    }
    this.getDonationList(params);
  }

  getDonationList(params) {
    this.presentLoader();
    this.verifiedTransactionDetails = [];
    this.fetchDonationTransactionService.get(params).subscribe(
      response => {
        this.verifiedTransactionDetails = [];
        if (response.results.length) {
          response.results.forEach(data => {
            this.verifiedTransactionDetails.push(
              new DonationTransaction().deserialize(data)
            );
          });
          this.generateVerifiedTransactionReport();
          this.dismissLoader();return;
        }
        this.showNotification("bottom","center","success","",
        "There is not transaction under given filter"
      )
        this.dismissLoader();
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
    // params.status = 2;
    // this.fetchDonationTransactionService.get(params).subscribe(
    //   response => {
    //     this.progressTransactionDetails = [];
    //     if (response.length) {
    //       response.forEach(data => {
    //         this.progressTransactionDetails.push(
    //           new DonationTransaction().deserialize(data)
    //         );
    //       });
    //       this.generateProgressTransactionReport();
    //     }
    //   },
    //   err => {
    //     this.somethingWentWrong();
    //     this.showAlert(
    //       "Server Down, Please refresh the page and try again",
    //       "danger"
    //     );
    //   }
    // );
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
        this.objectKeys(this.modeWiseTransactions).forEach(
          mode => {
            if (mode === transaction.mode_of_transaction) {
              this.modeWiseTransactions[mode]['count']++;
              this.modeWiseTransactions[mode]['total'] += transaction.amount;
            }
          }
        );
        console.log("mode",this.modeOfTransaction)
      });
      this.orderModeWiseTransaction()
    }
  }

  get columnsToDisplay() {
    return [
      "donatedDate",
      "name",
      "number",
      "phone1",
      "amount",
      "transactionId",
      "mode",
      "telecallerId",
      "voiceCallingName",
      "branch",
      "donorType"
    ];
  }

  //Sorted the mode of transaction but not used in HTML
  orderModeWiseTransaction() {
    var sortedTransacions = {}
    for (var mode in this.modeWiseTransactions) {
      sortedTransacions[this.modeWiseTransactions[mode].name] = {}
      sortedTransacions[this.modeWiseTransactions[mode].name]['count'] = this.modeWiseTransactions[mode].count
      sortedTransacions[this.modeWiseTransactions[mode].name]['total'] = this.modeWiseTransactions[mode].total
    }
    var sortable = [];
    for (var mode in sortedTransacions) {
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
