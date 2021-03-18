import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-switch-branch-alert',
  templateUrl: './switch-branch-alert.component.html',
  styleUrls: ['./switch-branch-alert.component.scss']
})
export class SwitchBranchAlertComponent implements OnInit {
  donorBranch;
  userBranch;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SwitchBranchAlertComponent>
  ) {
    this.donorBranch = data[0];
    this.userBranch = data[1];
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  switch() {
    this.dialogRef.close(true);
  }

}
