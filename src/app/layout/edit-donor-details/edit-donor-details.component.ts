import { Component, OnInit, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatSnackBar,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { AtcUser, User } from '../../shared/model';
import { EditDonorDetailsService } from 'src/app/shared/services/edit-donor-details.service';
import { BasePage } from 'src/app/utils';


@Component({
  selector: 'app-edit-donor-details',
  templateUrl: './edit-donor-details.component.html',
  styleUrls: ['./edit-donor-details.component.scss']
})
export class EditDonorDetailsComponent extends BasePage implements OnInit {

  donorForm: FormGroup;
  firstName: FormControl;
  lastName: FormControl;
  phone: FormControl;
  phone1: FormControl;
  phone2: FormControl;
  email: FormControl;
  flat: FormControl;
  address: FormControl;
  user: User;
  donorDetails: AtcUser;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public editDonorDetailsService: EditDonorDetailsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditDonorDetailsComponent>
  ) {
    super(dialog, snackBar)
    this.donorDetails = data;
  }

  ngOnInit() {
    this.validateInputs();
    this.createFormGroup();
    this.setDonorDetails(this.donorDetails);
    this.user = new User().deSerialize(
      JSON.parse(localStorage.getItem("user"))
    );
  }

  validateInputs() {
    this.firstName = new FormControl("", [Validators.required]);
    this.lastName = new FormControl("", [Validators.required]);
    this.phone = new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.phone1 = new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.phone2 = new FormControl("", [
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.email = new FormControl("", [Validators.email]);
    this.address = new FormControl("", Validators.required);
    this.flat = new FormControl("", Validators.required);

  }

  createFormGroup() {
    this.donorForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      phone1: this.phone1,
      phone2: this.phone2,
      email: this.email,
      pan: new FormControl(),
      gender: new FormControl(),
      flat: this.flat,
      address: this.address
    });
  }

  setDonorDetails(formValues) {
    this.donorForm.controls["phone"].setValue(formValues.username);
    this.donorForm.controls["firstName"].setValue(formValues.firstName);
    this.donorForm.controls["lastName"].setValue(formValues.lastName);
    this.donorForm.controls["email"].setValue(formValues.email);
    this.donorForm.controls["gender"].setValue(formValues.userProfile.gender);
    this.donorForm.controls["pan"].setValue(formValues.userProfile.panCard);
    this.donorForm.controls["phone1"].setValue(formValues.userProfile.phone1);
    this.donorForm.controls["phone2"].setValue(formValues.userProfile.phone2);
    this.donorForm.controls["flat"].setValue(formValues.userProfile.addressLine1);
    this.donorForm.controls["address"].setValue(formValues.userProfile.addressLine2);
  }

  closeEditForm(status?) {
    this.dialogRef.close(status);
  }

  onSave(formValues) {
    this.presentLoader();

    // genearate FormData with respect to Backend
    let formData = {
      "user":{
        "first_name": formValues["firstName"],
        "last_name": formValues["lastName"],
        "email": formValues["email"]
      },
      "user_profile": {
        "phone1": formValues["phone1"],
        "phone2": formValues["phone2"],
        "gender": formValues["gender"],
        "pan_card": formValues["pan"],
        "address_line_1": formValues["flat"],
        "address_line_2": formValues["address"],
      }};


    this.editDonorDetailsService.donorId = this.donorDetails.id;
    this.editDonorDetailsService.put(formData).subscribe(
      data => {
        this.dismissLoader();
        this.closeEditForm(true);
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();

      }
    )

  }

}
