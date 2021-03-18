import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'ngx-modal',
  templateUrl: 'modal.component.html',
  styleUrls: ['./styles/modals.scss']
})
export class ModalComponent {
  icon: undefined;
  iconColor: undefined;
  title: '';
  text: undefined;
  options: false;
  input: false;
  button: undefined;
  inputData: '';

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.icon = data.icon;
    this.iconColor = data.iconColor;
    this.title = data.title;
    this.text = data.text;
    this.options = data.options;
    this.input = data.input;
    this.button = data.button;

    if (data.time) {
      setTimeout(() => {
        this.dialogRef.close();
      }, data.time);
    }
  }
}
