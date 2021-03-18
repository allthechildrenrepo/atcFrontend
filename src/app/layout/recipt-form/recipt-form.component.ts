import { Component, ElementRef, Inject, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { MatDialog, MatDialogRef, MatFormFieldControl, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ReciptDownloadComponent } from '../recipt-download/recipt-download.component';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/model/user';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { WhatsAppTransaction } from 'src/app/shared/model';
import { WhatsAppTransactionService } from 'src/app/shared/services/whatsapp-transaction.service';
// import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-recipt-form',
  templateUrl: './recipt-form.component.html',
  styleUrls: ['./recipt-form.component.scss'],
})
export class ReciptFormComponent extends BasePage implements OnInit {

  @ViewChild('download', { static: false }) down: ElementRef<HTMLElement>;
  @ViewChild('reset', { static: false }) reset: ElementRef<HTMLElement>;
  selectedBranch: number;
  selectedBranchName;
  user: User;
  reciptDetails: boolean = false;
  transactionDetails;
  //this test display in html
  test: boolean = true
  // this showForm not display need to explore
  showForm: boolean = false;
  foreignNumber: boolean = false;
  transaction: WhatsAppTransaction[] = [];
  dataSource;

  is80G = false;
  receiptForm: FormGroup;
  reciptId: FormControl;
  donatedDate: FormControl;
  name: FormControl;
  phone: FormControl;
  phone2: FormControl;
  bank: FormControl;
  branch: FormControl;
  transactionId: FormControl;
  amount: FormControl;
  amountInWords: FormControl;
  address1: FormControl;
  address2: FormControl;
  pincode: FormControl;
  email: FormControl;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialogRef: MatDialogRef<ReciptFormComponent>,
    public whatsAppTransactionService: WhatsAppTransactionService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(dialog, snackBar);
    console.log("DATA", data);
    if (data) {
      this.reciptDetails = data.reciptDetails;
      this.transactionDetails = data.transactionDetails;
      this.showForm = data.showReciptForm;
    }
  }

  ngOnInit() {
    // this.showForm = true;
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    if (this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }
    this.validateInputs();
    this.createFormGroup();
    if (this.transactionDetails) {
      this.setEditableInputs();
      this.fetchWhatsAppTransaction();
    }
  }

  validateInputs() {
    this.reciptId = new FormControl("", [Validators.required]);
    this.donatedDate = new FormControl("", [Validators.required])
    this.name = new FormControl("", [Validators.required]);
    this.phone = new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.phone2 = new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.bank = new FormControl("");
    this.branch = new FormControl("");
    this.transactionId = new FormControl("");
    this.amount = new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]*$")]);
    this.amountInWords = new FormControl("");
    this.address1 = new FormControl("");
    this.address2 = new FormControl("");
    this.pincode = new FormControl("");
    this.email = new FormControl("");
  }

  createFormGroup() {
    this.receiptForm = new FormGroup({
      reciptId: this.reciptId,
      donatedDate: this.donatedDate,
      name: this.name,
      phone: this.phone,
      phone2: this.phone2,
      bank: this.bank,
      branch: this.branch,
      transactionId: this.transactionId,
      amount: this.amount,
      amountInWords: this.amountInWords,
      address1: this.address1,
      address2: this.address2,
      pincode: this.pincode,
      email: this.email
    });
  }

  setBranch(branch) {
    this.selectedBranch = branch.branchId;
    this.selectedBranchName = branch.branchName;
  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedBranchName = null;
    this.receiptForm.reset();
    this.is80G = false;
  }

  checkForeignNumber(event) {
    this.foreignNumber = event.checked;
    if (!this.foreignNumber) {
      this.phone = new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
      this.phone2 = new FormControl("", [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    }
    else {
      this.phone = new FormControl("", [
        Validators.required
      ]);
      this.phone2 = new FormControl("", [
      ]);
    }
    this.createFormGroup();
  }

  is80GChecked(event) {
    if (event.checked) {
      this.is80G = true;
    }
    else {
      this.is80G = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateRecipt() {
    this.showForm = false;
  }

  resetForm() {
    this.receiptForm.reset();
    this.is80G = false;
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.router.onSameUrlNavigation = 'reload';
    // this.router.navigate(['/download-recipt']);
  }

  fetchWhatsAppTransaction() {
    console.log("working", this.transactionDetails);
    //Mock params need to change
    let param = {};
    // param['donation'] = this.transactionDetails.id;
    // param['branch_id'] = this.selectedBranch;
    param['start_date'] = '2020-10-10';
    param['end_date'] = '2020-10-11';
    this.presentLoader();

    //If the user is not an Admin, Restrict another branch WhatsApp transaction details.
    // if(this.selectedBranch != 17) {
    //     param['branch_id'] = this.selectedBranch;
    // }

    this.transaction = [];
    this.whatsAppTransactionService.get(param).subscribe((data) => {
      data.forEach(element => {
        this.transaction.push(new WhatsAppTransaction().deserializer(element));
      });
      this.dataSource = this.transaction;
      this.dismissLoader();
    }, err => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

  setEditableInputs() {
    this.receiptForm.controls["donatedDate"].setValue(this.transactionDetails.donated_date);
    this.receiptForm.controls["name"].setValue(this.transactionDetails.donar.fullName);
    this.receiptForm.controls["phone"].setValue(this.transactionDetails.donar.username);
    this.receiptForm.controls["phone2"].setValue(this.transactionDetails.donar.userProfile.phone1);
    this.receiptForm.controls["amount"].setValue(this.transactionDetails.amount);
    // this.receiptForm.controls["amountInWords"].setValue(this.transactionDetails.);
    this.receiptForm.controls["transactionId"].setValue(this.transactionDetails.transaction_id);
    this.is80G = this.transactionDetails.is_80g;
    this.receiptForm.controls["address1"].setValue(this.transactionDetails.donar.userProfile.addressLine1);
    this.receiptForm.controls["address2"].setValue(this.transactionDetails.donar.userProfile.addressLine2);
    this.receiptForm.controls["email"].setValue(this.transactionDetails.donar.email);
    // this.receiptForm.controls["pincode"].setValue(this.transactionDetails.);

  }

  onSubmit(receiptValue) {
    let reciptData = {};
    reciptData['reciptId'] = receiptValue.reciptId;
    reciptData['donatedDate'] = receiptValue.donatedDate;
    reciptData['name'] = receiptValue.name;
    reciptData['mobile'] = receiptValue.phone;
    reciptData['phone2'] = receiptValue.phone2;
    reciptData['amount'] = receiptValue.amount;
    reciptData['amountWords'] = receiptValue.amountInWords;
    reciptData['transaction'] = receiptValue.transactionId;
    reciptData['is80G'] = this.is80G;
    reciptData['bank'] = receiptValue.bank;
    reciptData['branch'] = receiptValue.branch;
    reciptData['address'] = receiptValue.address1;
    reciptData['address1'] = receiptValue.address2;
    reciptData['pincode'] = receiptValue.pincode;
    reciptData['email'] = receiptValue.email;
    reciptData['donatedBranch'] = this.selectedBranch;
    reciptData['foreignNumber'] = this.foreignNumber;

    const dialogRef = this.dialog.open(ReciptDownloadComponent, {
      autoFocus: false,
      maxHeight: "90vh",
      data: reciptData
    });

    dialogRef.afterClosed().subscribe(res => {
      this.closeDialog();
    });

  }

  get columnsToDisplay() {
    return [
      'created_date',
      'donation_id',
      'medium',
      'receipt_id',
      'whatsapp_number',
      'sendUser',
      'branch',
      'receipt'
    ];
  }

}