import { Component, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar, MatTableDataSource } from "@angular/material";
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { AtcUser, User } from '../../shared/model';
import { Branch } from "../../shared/model/branch";
import { BranchService } from "../../shared/services/branch.service";
import { TelecallerFetchService } from "../../shared/services/telecaller.service";


@Component({
  selector: "app-telecaller-list",
  templateUrl: "./telecaller-list.component.html",
  styleUrls: ["./telecaller-list.component.scss"]
})
export class TelecallerListComponent extends BasePage implements OnInit {
  telecallerList: AtcUser[] = [];

  userBranches: Branch[] = [];
  selectedBranch: Branch;
  allBranches: Branch[] = [];
  user: User;

  teleCallerDataSource: MatTableDataSource<AtcUser>;

  columnsToDisplay: string[] = [
    "ATC-ID",
    "Name",
    "alias",
    "phone",
    "voice",
    "voice1",
    "voice2",
  ];

  constructor(
    public telecallerService: TelecallerFetchService,
    public branchService: BranchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
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
    this.getTeleCallerDetails();
  }

  removeBranch() {
    this.selectedBranch = null;
    this.telecallerList = [];
  }

  getTeleCallerDetails() {
    this.presentLoader();
    this.telecallerService.get({ atc_profile__branch__id: this.selectedBranch.branchId }).subscribe(
      res => {
        res.forEach(data => {
          this.telecallerList.push(new AtcUser().deserialize(data));
        });
        this.teleCallerDataSource = new MatTableDataSource(this.telecallerList);
        this.dismissLoader();
      },
      err => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }
}
