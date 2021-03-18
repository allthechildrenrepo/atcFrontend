import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'somethign-went-wrong',
  templateUrl: './something-went-wrong.component.html',
  styleUrls: ['./something-went-wrong.component.scss']
})
export class SomethingWentWrongComponent {
  constructor(
    public dialogRef: MatDialogRef<SomethingWentWrongComponent>
  ) {
  }
}