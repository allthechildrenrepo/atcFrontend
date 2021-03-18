import { Component, OnInit } from '@angular/core';
import { DonorService } from '../../shared/services/donor.service';
import { AtcUser } from '../../shared/model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils/pages/base/base.component';

@Component({
  selector: 'app-donors-list',
  templateUrl: './donors-list.component.html',
  styleUrls: ['./donors-list.component.scss']
})
export class DonorsListComponent extends BasePage  {
  
  donorList: AtcUser[];

  constructor(
    public donorService: DonorService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
      super(dialog, snackBar);
     }
  
  searchDonorDetails(searchValue: string) {
    this.presentLoader();
    let params = this.donorService.getParams(searchValue);
    this.donorService.get(searchValue).subscribe(
      data => {
        this.dismissLoader();
        this.donorList = data;
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    )
  }
}
