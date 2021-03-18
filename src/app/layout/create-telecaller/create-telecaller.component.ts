import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TelecallerService } from "../../shared/services/telecaller.service";
import { Branch } from "../../shared/model/branch";
import { BranchService } from "src/app/shared/services/branch.service";
import { debug } from 'util';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { User } from 'src/app/shared/model';

const moment = _rollupMoment || _moment;


// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: "app-create-telecaller",
  templateUrl: "./create-telecaller.component.html",
  styleUrls: ["./create-telecaller.component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreateTelecallerComponent extends BasePage implements OnInit {
  @ViewChild("profilePhotoRef", { static: false }) profilePhoto: any;

  profilePic: File;
  previewUrl: any = null;
  preview: boolean = true;
  fileSize: number = 0;
  alerts = [];
  years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  telecallerForm: FormGroup;
  firstName: FormControl;
  address: FormControl;
  flat: FormControl;
  phone: FormControl;
  email: FormControl;
  voiceCallingPhone: FormControl;
  voiceCallingPhone2: FormControl;
  voiceCallingPhone3: FormControl;
  teleCallingName: FormControl;
  branches: Branch[] = [];
  selectedBranch: Branch;
  dateOfJoining: string;
  date = new FormControl(moment());
  user: User;

  constructor(
    public telecallerService: TelecallerService,
    public branchService: BranchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar)
  }

  setBranch(branch: Branch) {
    this.selectedBranch = branch;
  }

  removeBranch() {
    this.selectedBranch = null;
  }

  ngOnInit() {
    this.presentLoader();
    this.validateInputs();
    this.createFormGroup();
    this.user = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );

    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));

    if(this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }

    this.branches = [];
    this.branchService.get().subscribe(
      res => {
        this.dismissLoader();
        res.forEach(data => {
          this.branches.push(new Branch().deserialize(data));
        });
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
    this.dateOfJoining = new Date().toLocaleDateString();
  }

  validateInputs() {
    this.firstName = new FormControl("", Validators.required);
    this.address = new FormControl("");
    this.flat = new FormControl("", Validators.required);
    this.phone = new FormControl("", [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern("^[0-9]*$")
    ]);
    this.voiceCallingPhone = new FormControl("", [
      Validators.minLength(8),
      Validators.pattern("^[0-9]*$")
    ]);
    this.email = new FormControl("", [Validators.email]);
    this.voiceCallingPhone2 = new FormControl();
    this.voiceCallingPhone3 = new FormControl();
    this.teleCallingName = new FormControl();
  }

  createFormGroup() {
    this.telecallerForm = new FormGroup({
      firstName: this.firstName,
      address: this.address,
      flat: this.flat,
      phone: this.phone,
      email: this.email,
      voiceCallingPhone: this.voiceCallingPhone,
      voiceCallingPhone2: this.voiceCallingPhone2,
      voiceCallingPhone3: this.voiceCallingPhone3,
      teleCallingName: this.teleCallingName,
      lastName: new FormControl(),
      gender: new FormControl(),
      status: new FormControl(),
      branch: new FormControl()
    });
  }

  setDateOfJoining(event) {
    this.dateOfJoining = new Date(event.value).toLocaleDateString();
  }

  uploadPhoto(event) {
    this.fileSize = Math.round(event.target.files[0].size / 1024);

    if (event.target.files.length > 0 && this.fileSize <= 500) {
      this.profilePic = event.target.files[0];
    }
    this.profilePhoto.nativeElement.value = "";
  }

  previewProfilePic() {
    var reader = new FileReader();

    reader.onload = (event: any) => {
      this.previewUrl = event.target.result;
    };

    reader.readAsDataURL(this.profilePic);
    this.preview = false;
  }

  removeProfilePic() {
    this.profilePic = null;
    this.previewUrl = null;
    this.preview = true;
  }

  onSubmit(formValues) {
    this.presentLoader();
    var payload = {
      first_name: formValues["firstName"],
      name: formValues["firstName"],
      phone: formValues["phone"],
      voice_calling_number: formValues["voiceCallingPhone"],
      email: formValues["email"],
      lastName: formValues["lastName"],
      address_line_1: formValues["flat"],
      address_line_2: formValues["address"],
      gender: formValues["gender"],
      status: formValues["status"],
      branch_ids: [this.selectedBranch.branchId.toString()],
      date_of_joining: this.dateOfJoining,
      group_name: "Telecaller",
      voice_calling_number2: formValues['voiceCallingPhone2'],
      voice_calling_number3: formValues['voiceCallingPhone3'],
      telecalling_name: formValues['teleCallingName']
    };
    this.telecallerService.post(payload).subscribe(
      res => {
        this.dismissLoader();
        if (res.status) {
          this.alerts = []
          const msg = res.message + "ATC ID - " + res.results.atc_id;
          this.alerts.push({
            id: 1,
            type: "success",
            message: msg
          });
          this.telecallerForm.reset();
          window.scrollTo(0, 0);
        } else {
          this.alerts = []
          this.alerts.push({
            id: 1,
            type: "danger",
            message: res.message
          });
          
          setTimeout(() => {
            this.alerts = [];
          }, 3000);

          window.scrollTo(0, 0);

        }
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }
}
