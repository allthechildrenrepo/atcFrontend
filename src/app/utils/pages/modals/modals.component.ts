import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginModalComponent, RegisterModalComponent } from '../../';

@Component({
  selector: 'modals-page',
  templateUrl: './modals.component.html',
  styleUrls: ['./styles/modals.scss']
})
export class ModalsPageComponent {
  selectedOption: string;

  constructor(public dialog: MatDialog) {}

  registerModal(): void {
    const dialogRef = this.dialog.open(RegisterModalComponent);
  }

  loginModal(): void {
    const dialogRef = this.dialog.open(LoginModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }
}
