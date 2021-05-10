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
  whatsappTransaction: WhatsAppTransaction;
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
  payment_mode: FormControl;
  mode: string;

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
      this.whatsappTransaction = data.transactionDetails;
      this.mode = data.mode;
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
    if (this.whatsappTransaction) this.setWhatsAppEditInputs();
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
    this.payment_mode = new FormControl("", [Validators.required]);
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
      email: this.email,
      payment_mode: this.payment_mode
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

  fetchWhatsAppTransaction(receiptId) {
    let param = { 'receipt_id': receiptId };
    this.presentLoader();
    this.whatsAppTransactionService.get(param).subscribe((data) => {
      this.whatsappTransaction = new WhatsAppTransaction().deserializer(data.results[0])
      this.setWhatsAppEditInputs()
      this.dismissLoader();
    }, err => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

  setWhatsAppEditInputs() {
    if (this.whatsappTransaction) {
      let number = this.whatsappTransaction.whatsAppNumber.length > 10 ? this.whatsappTransaction.whatsAppNumber.substring(2) :
        this.whatsappTransaction.whatsAppNumber
      this.receiptForm.controls["reciptId"].setValue(this.whatsappTransaction.receiptId);
      this.receiptForm.controls["donatedDate"].setValue(this.whatsappTransaction.donatedDate);
      this.receiptForm.controls["name"].setValue(this.whatsappTransaction.name);
      this.receiptForm.controls["phone"].setValue(number);
      this.receiptForm.controls["phone2"].setValue(this.whatsappTransaction.phone2);
      this.receiptForm.controls["bank"].setValue(this.whatsappTransaction.bank);
      this.receiptForm.controls["branch"].setValue(this.whatsappTransaction.bankBranch);
      this.receiptForm.controls["transactionId"].setValue(this.whatsappTransaction.transaction);
      this.receiptForm.controls["amount"].setValue(this.whatsappTransaction.amount);
      this.receiptForm.controls["amountInWords"].setValue(this.whatsappTransaction.amountWords);
      this.receiptForm.controls["address1"].setValue(this.whatsappTransaction.address);
      this.receiptForm.controls["address2"].setValue(this.whatsappTransaction.address1);
      this.receiptForm.controls["email"].setValue(this.whatsappTransaction.email);
      this.receiptForm.controls["pincode"].setValue(this.whatsappTransaction.pincode);
      this.receiptForm.controls["payment_mode"].setValue(this.whatsappTransaction.payment_mode)
    }

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
    this.receiptForm.controls["payment_mode"].setValue(this.whatsappTransaction.payment_mode)

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
    reciptData['payment_mode'] = receiptValue.payment_mode;
    reciptData['mode'] = this.mode;
    if (this.whatsappTransaction) {
      reciptData['mode'] = "bulkUpdateMode" // edit mode also we call update api
      reciptData['id'] = this.whatsappTransaction.id;
    }
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
