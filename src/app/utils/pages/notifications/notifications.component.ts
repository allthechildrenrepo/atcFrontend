import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'notifications-page',
  templateUrl: './notifications.component.html',
  styleUrls: ['./styles/notifications.scss']
})

export class NotificationsPageComponent {
  mySnackBarRef: any;

  constructor(public snackBar: MatSnackBar) {}

  showNotification(vpos, hpos, type, icon, message = ''): void {
    // for more info about Angular Material snackBar check: https://material.angular.io/components/snack-bar/overview
    this.mySnackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
       data: {
         message: message,
         icon,
         type,
         dismissible: true
         // you can add everything you want here
       },
       duration: 3000,
       horizontalPosition: hpos, // 'start' | 'center' | 'end' | 'left' | 'right'
       verticalPosition: vpos, // 'top' | 'bottom'
       panelClass: ['notification-wrapper']
    });
    // this is to be able to close it from the NotificationComponent
    this.mySnackBarRef.instance.snackBarRef = this.mySnackBarRef;
  }

}
