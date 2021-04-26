import { AtcUser, User } from '../../shared/model';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  Form
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatSnackBar,
} from '@angular/material';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { BasePage } from 'src/app/utils/pages/base/base.component';
import { DonationEntryService } from '../../shared/services/donation-entry.service';
import { DonorService } from '../../shared/services/donor.service';
import { EditDonorTransactonComponent } from '../edit-donor-transacton/edit-donor-transacton.component';
import { ReciptDownloadComponent } from '../recipt-download/recipt-download.component';
import { TelecallerFetchService } from '../../shared/services/telecaller.service';
import { TransactionModeService } from '../../shared/services/transaction-mode.service';
import { DonationApproveService } from '../../shared/services/donation-approve.service';
import { Router } from '@angular/router';
import { SwitchBranchAlertComponent } from '../switch-branch-alert/switch-branch-alert.component';
import { DatePipe } from '@angular/common';
import { DateFormaterService } from 'src/app/shared/services/date.service';
import { NgxImageCompressService } from 'ngx-image-compress';

// const PhoneNumberValidator: ValidatorFn = (fg: FormGroup) => {
//   const phone = fg.get('phone1').value;
//   const phone1 = fg.get('phone2').value;
//   const phone2 = fg.get('phone2').value;
//   console.log("checking", this.phone1, this.phone2, this.phone);
//   return phone1 !== null && phone1 !== null && phone1 !== phone2
//     ? null
//     : { phone: true };
// };

@Component({
  selector: "app-donation-entry",
  templateUrl: "./donation-entry.component.html",
  styleUrls: ["./donation-entry.component.scss"]
})
export class DonationEntryComponent extends BasePage implements OnInit {
  @Input() trustVisit: boolean = false;
  @Input() editTransactionForm;
  @Input() editDonorDetails: boolean = true;
  // @ViewChild("yourForm")
  //  yourForm: NgForm;
  @ViewChild("screenshotRef", { static: false }) screenshot: any;

  @Output() onSubmitEditForm = new EventEmitter();
  public alerts: Array<any> = [];
  donar: any = [];
  donationForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  phone: FormControl;
  phone1: FormControl;
  phone2: FormControl;
  email: FormControl;
  flat: FormControl;
  address: FormControl;
  amount: FormControl;
  transactionId: FormControl;
  transactionMode: FormControl;
  receiptName: FormControl;
  donatedDate: FormControl;
  pickupAddress: FormControl;
  pickupTime: FormControl;
  searchField = true;
  existingDonor = false;
  is80G: boolean = false;
  alreadyPaymentModeSelected = false;
  isSwitchable: boolean = false;
  filteredOptions: Observable<AtcUser[]>;
  telecaller = new FormControl();
  selectedTelecaller: any;
  selectedTelecallerName;
  selectedDonorType: string;
  selectedDonatedBank: string;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;


  // screenshotPic: File = null;
  screenshotPic: any = null;
  screenshotPicName: string = null;
  previewUrl: any = null;
  preview: boolean = true;
  fileSize: number = 0;

  selectedBranch: number;
  branchName: string;

  modeOfTransaction = [];
  telecallers = [];
  user: User;

  selectedMode: number;

  constructor(
    public transactionModeService: TransactionModeService,
    public donationEntryService: DonationEntryService,
    public telecallerService: TelecallerFetchService,
    public dateFormaterService: DateFormaterService,
    public donorService: DonorService,
    public dialog: MatDialog,
    public router: Router,
    public dialogRef: MatDialogRef<EditDonorTransactonComponent>,
    public donationApproveService: DonationApproveService,
    public snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private imageCompress: NgxImageCompressService) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    this.presentLoader();
    this.dismissLoader();
    this.validateInputs();
    this.createFormGroup();
    this.user = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );
    this.transactionModeService.get().subscribe(
      data => {
        this.dismissLoader();
        if (data.results) {
          this.modeOfTransaction = data.results;
        }
        //15,16,17,18 - pickup other types should not be displayed in donation entry
        this.modeOfTransaction = this.modeOfTransaction.filter(mode => [15, 16, 17, 18].indexOf(mode.id) == -1)
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    if (this.editTransactionForm) {
      this.searchField = false;
      this.setBranch(this.editTransactionForm.branch.branch_id, this.editTransactionForm.branch.branch_name);
      this.setEditableInputs(this.editTransactionForm);
    }

    else if (this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0].branchId, this.user.branch[0].branchName);
    }

    // if (!this.editDonorDetails) {
    //   this.setBranch(this.editTransactionForm.branch.branch_id, this.editTransactionForm.branch.branch_name);
    // }

    // Filter Telecaller with respect to Input search
    this.filteredOptions = this.telecaller.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): AtcUser[] {
    // if (value) {
      console.log("Value", value);
      const filterValue = value.toLowerCase();
      return this.telecallers.filter((option: AtcUser) => {
        if (
          option.fullName.toLowerCase().indexOf(filterValue) != -1 ||
          (option.atcProfile.voiceCallingName ? option.atcProfile.voiceCallingName.toLowerCase().indexOf(filterValue) != -1 : false) ||
          option.atcId.toLowerCase().indexOf(filterValue) != -1
        ) {
          return option;
        }
      });
    // }
  }

  fetchTeleCallers() {
    this.presentLoader();
    // let params = this.telecallerService.getParams(this.user.branch[0].branchId);
    let params = { 'atc_profile__branch__id': this.selectedBranch };
    this.telecallerService.get(params).subscribe(
      res => {
        this.dismissLoader();
        this.telecallers = [];
        res.results.forEach(data => {
          this.telecallers.push(new AtcUser().deserialize(data));
        });

        // Should show all telecallers in option for empty telecaller in Edit Transaction
        if (!this.telecaller.value) {
          this.filteredOptions = this.telecaller.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        }
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  validateInputs() {
    this.firstName = new FormControl("", [Validators.required]);
    this.lastName = new FormControl("");
    this.phone = new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),
      // PhoneNumberValidator
    ]);
    this.phone1 = new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),
      // PhoneNumberValidator(this.phone, this.phone2)
    ]);
    this.phone2 = new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),
      // PhoneNumberValidator(this.phone, this.phone1)
    ]);
    this.email = new FormControl("", [Validators.email]);
    this.address = new FormControl("", Validators.required);
    this.flat = new FormControl("", Validators.required);
    this.transactionMode = new FormControl("", Validators.required);
    this.amount = new FormControl("", [
      Validators.pattern("^[0-9]*$")]);
    this.transactionId = new FormControl();
    this.donatedDate = new FormControl("", Validators.required);
    this.pickupAddress = new FormControl();
    this.pickupTime = new FormControl();
  }

  createFormGroup() {
    this.donationForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      phone1: this.phone1,
      phone2: this.phone2,
      email: this.email,
      pan: new FormControl(),
      gender: new FormControl(),
      transactionMode: this.transactionMode,
      item: new FormControl(),
      amount: this.amount,
      reciptId: new FormControl(),
      transactionId: this.transactionId,
      remarks: new FormControl(),
      telecaller: new FormControl(),
      flat: this.flat,
      address: this.address,
      donatedDate: this.donatedDate,
      pickupAddress: this.pickupAddress,
      pickupTime: this.pickupTime,
      receiptName: new FormControl(),
      donorType: new FormControl(),
      donatedBank: new FormControl()
    });
  }

  get disableCheckAmount() {
    // 14 and 10 are mode id of provision and pick up
    if ([14, 10].indexOf(this.selectedMode) != -1) {
      this.donationForm.controls["amount"].setValue(0);
      return true
    }
    return false;
  }

  get setTransactionIdRequired() {
    if ([1, 2, 3, 4, 5].indexOf(this.selectedMode) != -1) {
      return true;
    }
    return false;
  }

  get isPickupMode() {
    if ([14].indexOf(this.selectedMode) != -1) {
      return true;
    }
    return false;
  }

  telecallerSelected(event: AtcUser) {
    console.log("Telecaller selected", event);
    this.selectedTelecaller = event.id;
    this.selectedTelecallerName = event.fullName;
  }

  setEditableInputs(formValues) {
    this.donationForm.controls["phone"].setValue(formValues.donar.username);
    this.donationForm.controls["firstName"].setValue(formValues.donar.firstName);
    this.donationForm.controls["lastName"].setValue(formValues.donar.lastName);
    if(formValues.donar.email) {
      this.donationForm.controls["email"].setValue(formValues.donar.email);
    }
    this.donationForm.controls["gender"].setValue(formValues.donar.userProfile.gender);
    this.donationForm.controls["pan"].setValue(formValues.donar.userProfile.panCard);
    if (formValues.donar.userProfile.phone1) {
      this.donationForm.controls["phone1"].setValue(formValues.donar.userProfile.phone1);
    }
    if (formValues.donar.userProfile.phone2) {
      this.donationForm.controls["phone2"].setValue(formValues.donar.userProfile.phone2);
    }
    this.donationForm.controls["flat"].setValue(formValues.donar.userProfile.addressLine1);
    this.donationForm.controls["address"].setValue(formValues.donar.userProfile.addressLine2);
    this.selectedMode = +formValues.modeOfTransaction;
    if (formValues.telecaller) {
      this.selectedTelecaller = +formValues.telecaller.id;
      this.telecaller.setValue(formValues.telecaller.atcId + ' ' + formValues.telecaller.atcProfile.voiceCallingName + '-' + formValues.telecaller.fullName);
    }
    this.donationForm.controls["donatedDate"].setValue(formValues.donated_date);
    this.donationForm.controls["receiptName"].setValue(formValues.receipt_name);
    this.donationForm.controls["amount"].setValue(formValues.amountValue);
    this.donationForm.controls["remarks"].setValue(formValues.remarks);
    this.donationForm.controls["transactionId"].setValue(formValues.transactionId);
    this.donationForm.controls["pickupAddress"].setValue(formValues.pickup_address);
    this.donationForm.controls["pickupTime"].setValue(formValues.pickup_time);
    // this.donationForm.controls["donorType"].setValue(formValues.donor_type);
    if (formValues.donor_type) {
      this.selectedDonorType = formValues.donor_type;
    }
    if (formValues.donated_bank) {
      this.selectedDonatedBank = formValues.donated_bank;
    }
    // this.donationForm.controls["telecaller"].setValue(formValues.telecaller.atcProfile.atcId);

    this.is80G = formValues.is80GForm;

    if (formValues.screenshotUrl) {

    }

  }

  setFormInputs(donorDetails: AtcUser) {
    this.donationForm.controls["phone"].setValue(donorDetails.username);
    this.donationForm.controls["firstName"].setValue(donorDetails.firstName);
    this.donationForm.controls["lastName"].setValue(donorDetails.lastName);
    this.donationForm.controls["email"].setValue(donorDetails.email);
    this.donationForm.controls["gender"].setValue(
      donorDetails.userProfile.gender
    );
    this.donationForm.controls["pan"].setValue(
      donorDetails.userProfile.panCard
    );
    if (donorDetails.userProfile.phone1) {
      this.donationForm.controls["phone1"].setValue(
        donorDetails.userProfile.phone1
      );
    }
    if (donorDetails.userProfile.phone2) {
      this.donationForm.controls["phone2"].setValue(
        donorDetails.userProfile.phone2
      );
    }
    this.donationForm.controls["flat"].setValue(
      donorDetails.userProfile.addressLine1
    );
    this.donationForm.controls["address"].setValue(
      donorDetails.userProfile.addressLine2
    );
    this.telecaller.setValue("");
    // this.selectedMode = 0;
  }

  setDonorPhone(phoneNumber) {
    this.donationForm.controls["phone"].setValue(phoneNumber);
  }

  checkDonor(phoneNumber) {
    this.donationForm.reset();
    let params = this.donorService.getParams(phoneNumber);
    this.donorService.get(params).subscribe(data => {
      if (data.results.length > 0) {
        this.donar = new AtcUser().deserialize(data.results[0]);
        if (this.donar.username === "6666666666" || true) {
          this.setFormInputs(this.donar);
          this.editDonorDetails = false;
          this.searchField = false;
        }
        else {
          if (this.donar.userProfile.branch.branchId === this.selectedBranch) {
            this.setFormInputs(this.donar);
            this.isSwitchable = true;
            this.editDonorDetails = false;
            this.searchField = false;
          }
          else {
            this.user.branch.forEach(branch => {
              if (this.donar.userProfile.branch.branchId === branch.branchId) {
                this.isSwitchable = true;
                const dialogRef = this.dialog.open(SwitchBranchAlertComponent, {
                  width: "50vw",
                  autoFocus: false,
                  maxHeight: "90vh",
                  data: [branch.branchName, this.branchName]
                });

                dialogRef.afterClosed().subscribe((switchBranch: boolean) => {
                  if (switchBranch) {
                    this.setBranch(branch.branchId, branch.branchName);
                    this.setFormInputs(this.donar);
                    this.editDonorDetails = false;
                    this.searchField = false;
                  }
                });
              }
            })
          }
          if (!this.isSwitchable) {
            var message =
              this.showAlert("danger", "Donor belongs to " + this.donar.userProfile.branch.branchName + " branch, Please contact admin office for more queries")
          }
        }
      }
      else {
        this.setDonorPhone(phoneNumber);
        this.editDonorDetails = true;
        this.searchField = false;
      }
    });
  }

  validatePhone(phoneNumber) {
    var phoneno = /^\d{10}$/;
    if (phoneNumber.match(phoneno)) {
      this.checkDonor(phoneNumber);
    } else {
      this.showAlert("danger", `Phone number is invalid.`);
    }
  }

  setPickAddress(event) {
    if (event.checked) {
      this.donationForm.controls["pickupAddress"].setValue(this.donationForm.value.flat + "," + this.donationForm.value.address);
    }
    else {
      this.donationForm.controls["pickupAddress"].setValue("");
    }
  }

  is80GChecked(event) {
    if (event.checked) {
      this.is80G = true;
    }
    else {
      this.is80G = false;
    }
  }

  compressFile(event) {
    let imageName = event.target.files[0].name;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgResultBeforeCompress = event.target.result;
        this.compressImage(this.imgResultBeforeCompress, imageName)
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressImage(image, imageName) {
    console.warn('Size in kb was:', this.imageCompress.byteCount(image) / 1024);
    if (this.imageCompress.byteCount(image) <= 500000) {
      const file = this.DataURIToBlob(image);
      this.imgResultAfterCompress = image;
      this.screenshotPic = file;
      this.screenshotPicName = imageName;
      // this.screenshotPic = new File([this.imgResultBeforeCompress], imageName, { type: 'image/jpeg' });
      console.log('Size in kb is now:', this.imageCompress.byteCount(this.imgResultAfterCompress) / 1024);
    }
    else {
      // let reduceQuality = 100/(this.imageCompress.byteCount(this.imgResultBeforeCompress)/500000);
      // console.log("reduceQuality", reduceQuality, this.imageCompress.byteCount(this.imgResultBeforeCompress));
      let orientation = -1;
      this.imageCompress.compressFile(image, orientation, 75, 75).then(
        result => {
          this.imgResultAfterCompress = result;
          console.warn('Size in kb is now:', this.imageCompress.byteCount(this.imgResultAfterCompress) / 1024);
          if (this.imageCompress.byteCount(this.imgResultAfterCompress) >= 500000) {
            this.compressImage(this.imgResultAfterCompress, imageName);
          }
          const file = this.DataURIToBlob(image);
          this.screenshotPic = file;
          this.screenshotPicName = imageName;
          // this.screenshotPic = new File([result], imageName, { type: 'image/jpeg' });
        });
    }
    this.screenshot.nativeElement.value = "";
  }

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  previewScreenshot() {
    this.preview = false;
  }

  // uploadScreenshot(event) {
  //   this.screenshotPic = event.target.files[0];
  //   this.fileSize = Math.round(event.target.files[0].size / 1024);

  //   if (event.target.files.length > 0 && this.fileSize <= 500) {
  //     this.screenshotPic = event.target.files[0];
  //   }
  //   this.screenshot.nativeElement.value = "";
  // }


  // previewScreenshot() {
  //   var reader = new FileReader();

  //   reader.onload = (event: any) => {
  //     this.previewUrl = event.target.result;
  //   };

  //   reader.readAsDataURL(this.screenshotPic);
  //   this.preview = false;

  //   console.log("Data Image", this.screenshotPic);
  // }



  removeScreenshot() {
    this.imgResultAfterCompress = null;
    this.screenshotPic = null;
    this.screenshotPicName = null;
    // this.previewUrl = null;
    this.preview = true;
  }

  setDonatedDate(donatedDate) {
    this.donatedDate = donatedDate;
  }

  removeBranch() {
    this.searchField = true;
    this.selectedBranch = null;
    this.branchName = null;
    this.telecallers = [];
  }

  closeDonorForm() {
    this.dialogRef.close();
  }

  resetDonationForm() {
    this.donationForm.reset();
    this.setFormInputs(this.donar);
  }

  onSubmit(formValues) {
    const formData = new FormData();
    let teleCaller = "admin";
    if (this.telecallers[formValues["telecaller"]]) {
      teleCaller = this.telecallers[formValues["telecaller"]].label;
    }
    formData.append("first_name", formValues["firstName"]);
    formData.append("phone", formValues["phone"]);
    formData.append("phone1", formValues["phone1"]);
    formData.append("phone2", formValues["phone2"]);
    formData.append("email", formValues["email"]);
    formData.append("last_name", formValues["lastName"]);
    formData.append("pan_card", formValues["pan"]);
    formData.append("gender", formValues["gender"]);
    formData.append("branch", this.selectedBranch.toString());
    formData.append(
      "mode_of_transaction_id",
      this.selectedMode.toString()
    );
    formData.append("is_80g", this.is80G ? "true" : "false");
    let amount = formValues["amount"] ? formValues["amount"] : 0;
    formData.append("amount", amount);
    formData.append("receipt", formValues["reciptId"]);
    formData.append("donar_req_recipient_name", formValues["receiptName"]);
    if (formValues["donatedDate"]) {
      formData.append("donar_req_date", this.dateFormaterService.converDateToYmd(formValues["donatedDate"]));
      // formData.append("donar_req_date", this.datePipe.transform(formValues["donatedDate"], "yyyy-MM-dd"));
    }
    formData.append("transaction_id", formValues["transactionId"]);
    formData.append("pickup_address", formValues["pickupAddress"]);
    formData.append("pickup_time", formValues["pickupTime"]);
    if (this.telecaller.value) {
      formData.append("telecaller_id", this.selectedTelecaller);
    }
    if (this.screenshotPic) {
      formData.append(
        "transaction_image",
        this.screenshotPic,
        this.screenshotPicName
      );
    }
    formData.append("cheque_number", formValues["cheque_number"]);
    formData.append("remarks", formValues["remarks"]);
    formData.append("donar_type", formValues["donorType"]);
    formData.append("donated_bank", formValues["donatedBank"]);
    formData.append("branch", JSON.stringify(this.selectedBranch));
    formData.append("address_line_1", formValues["flat"]);
    formData.append("address_line_2", formValues["address"]);

    if (!this.editTransactionForm) {
      this.presentLoader();
      this.donationEntryService.postFormData(formData).subscribe(
        res => {
          this.dismissLoader();
          this.showAlert("success", `Donation transaction successfully created.`);
          this.donationForm.reset();
          this.is80G = false;
          this.goBackToSearch();
          this.screenshotPic = null;
          window.scrollTo({ top: 0 });
        },
        err => {
          this.dismissLoader();
          this.somethingWentWrong();
        }
      );
    }
    else {
      if (this.router.url.indexOf("not-Verified") != -1) {
        formData.append("status", "0");
      }
      this.donationApproveService.donationId = this.editTransactionForm.id;
      this.donationApproveService.put(formData).subscribe(
        res => {
          this.dialogRef.close(true);
          this.showAlert("success", `Donation transaction successfully Edited.`);
        },
        err => {
          this.dialogRef.close();
        }
      );

    }
  }

  triggerPutRequest(formData) {
    this.onSubmitEditForm.emit(formData);
    return;
  }

  setBranch(branch, branchName) {
    this.selectedBranch = branch;
    this.branchName = branchName;
    this.isSwitchable = false;
    if (!this.trustVisit) {
      this.fetchTeleCallers();
    }
  }


  goBackToSearch() {
    this.searchField = true;
    this.editDonorDetails = true;
    this.screenshotPic = null;
    this.donationForm.reset();
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  showAlert(type, message) {
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

  get pageTitle() {
    if (this.editTransactionForm) {
      return "Edit Donation form"
    }
    return this.trustVisit
      ? "Trust Donation Entry Form"
      : "Online Donation Entry Form";
  }

  get showAmount(): boolean {
    if (this.modeOfTransaction[this.selectedMode]) {
      return this.modeOfTransaction[this.selectedMode].label !== "Provision"
    }
    return false;
  }

  showReceipt(donorTransactionDetails) {
    const dialogRef = this.dialog.open(ReciptDownloadComponent, {
      width: "90vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: donorTransactionDetails
    });
  }

  isReadOnlyPhone1() {
    if (!this.donar.phone1) {
      return "false";
    } else {
      return "true";
    }
  }
  isReadOnlyPhone2() {
    if (!this.donar.phone2) {
      return "false";
    } else {
      return "true";
    }
  }

  get showTelecaller(): boolean {
    if (this.trustVisit) {
      return false;
    }
    if (this.editTransactionForm) {
      if (this.editTransactionForm.telecaller) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
