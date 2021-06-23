import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import {
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar
} from "@angular/material";
import { CreatePromotionComponent } from '../create-promotion/create-promotion.component';
import { FetchWassanggerDevice } from '../../shared/services/wassangger-device.service';
import { WassanggerDevice, Promotion, User } from '../../shared/model';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { PromotionImageComponent } from '../promotion-image/promotion-image.component';
import { RemarksDialog } from '../donar-transaction-details/donar-transaction-details.component';
import { Branch } from '../../shared/model/branch';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent extends BasePage implements OnInit {
  public wassangerDevicess: WassanggerDevice[];
  public selectedDevice: WassanggerDevice;
  promotionList;
  promotionListDataSource;
  imageId = '5f8d1d8e42c8c0987a692c7d';
  columnsToDisplay = ['created_date', 'promotion_name', 'message', 'cron_time','created_by' , 'status', 'action'];
  alerts = [];
  user: User;
  activePromotion: boolean = false;
  selectedBranch: Branch;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public fetchWassanggerDevice: FetchWassanggerDevice,
    public promotionService: PromotionService
  ) {
    super(dialog, snackBar);
  }


  ngOnInit() {
    this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
    if(this.user.branch.length === 1) {
      this.setBranch(this.user.branch[0]);
    }
  }

  setBranch(branch: Branch) {
    this.selectedBranch = branch;
    this.fetchDevices();

  }

  removeBranch() {
    this.selectedBranch = null;
    this.selectedDevice = null;
  }


  deviceSelected(event) {
    this.selectedDevice = this.wassangerDevicess.find((device) => device.id == event.value);
    this.getPromotionList();
  }

  fetchDevices() {
    this.fetchWassanggerDevice.get({branch_id: this.selectedBranch.branch_id}).subscribe((data) => {
      this.wassangerDevicess = [];
      data.results.forEach(device => {
        this.wassangerDevicess.push(new WassanggerDevice().deserializer(device))
      });
    })
  }

  getPromotionList() {
    this.presentLoader();
    this.activePromotion = false;
    this.promotionListDataSource = [];
    this.promotionList = [];
    ;
    this.promotionService.get({device_id: this.selectedDevice.id}).subscribe((data) => {
      data.results.forEach((promo) => {
        if(promo.device_id == this.selectedDevice.id)
           this.promotionList.push(new Promotion().deserializer(promo))
      });
      this.sortDataSource();
      this.promotionListDataSource = new MatTableDataSource(this.promotionList);
      this.dismissLoader();
    }, err => {
      this.somethingWentWrong();
      this.dismissLoader();
    })
  }

  createPromotion() {
    const dialogRef = this.dialog.open(CreatePromotionComponent, {
      width: "60vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { selectedDevice : this.selectedDevice, branch : this.selectedBranch },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((refresh: boolean) => {
      if (refresh) {
        this.getPromotionList();
      }
    });
  }

  promotionStatus(status) {
    switch (status) {
      case 0:
        return "Scheduled";
      case 1:
        return "Processing";
      case 2:
        return "Completed";
      case 3:
        return "Stopped";
      case 4:
        return "Paused";
    }
  }

  sortDataSource() {
    this.promotionListDataSource.sort((a: any, b: any) => {
      if (new Date(a.created_at) < new Date(b.created_at)) {
        return -1;
      } else if (new Date(a.created_at) > new Date(b.created_at)) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  openImages() {
    const dialogRef = this.dialog.open(PromotionImageComponent, {
      width: "60vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: this.imageId
    });
    dialogRef.afterClosed().subscribe((refresh: boolean) => {
      if (refresh) {
        this.getPromotionList();
      }
    });
  }

  pausePromion(promotion) {
    let dialogRef = this.dialog.open(RemarksDialog, { width: "500px", data: "Reason for Pause" });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result", result, promotion);
        this.changePromotionStatus(promotion, '4', result);
        this.showAlert("success", 'Promotion paused successfully');
      }
    });
  }

  startPromotion(promotion) {
    this.changePromotionStatus(promotion, '1');
    this.showAlert("success", 'Promotion started successfully');
  }

  terminatePromotion(promotion) {
    let dialogRef = this.dialog.open(RemarksDialog, { width: "500px", data: "Reason for terminate" });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result", result, promotion);
        this.changePromotionStatus(promotion, '3', result);
        this.showAlert("success", 'Promotion terminated successfully');
      }
    });
  }

  changePromotionStatus(promotion, status, result?) {
    const formData = new FormData();
    this.promotionService.promotionId = promotion.id;
    formData.append("status", status);
    if (result)
      formData.append("remarks", result);
    this.promotionService.put(formData).subscribe(
      response => {
        this.promotionService.promotionId = 0;
        this.getPromotionList();
      },
      err => {
        // this.batchService.batchId = undefined;
      }
    );
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
}


