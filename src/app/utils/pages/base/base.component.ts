import { Component } from "@angular/core";
import { MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import { ModalComponent } from "./modals/modal.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { NotificationComponent } from "../notifications/notification/notification.component";
import { SomethingWentWrongComponent } from "./something-went-wrong/something-went-wrong.component";


@Component({
  selector: "alerts-page",
  templateUrl: "./base.component.html",
  styleUrls: ["./styles/base.scss"]
})
export class BasePage {
  mySnackBarRef: any;
  loader: MatDialogRef<SpinnerComponent>;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
  }

  basicAlert(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Thanks for sharing!",
        button: "DOWNLOAD"
      }
    });
  }

  textAlert(title, text) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: title,
        text: text,
        button: "Done!"
      }
    });
    return dialogRef;
  }

  iconAlert(
    title,
    text,
    callback,
    icon = "check-circle",
    color = "success"
  ): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        icon: icon,
        iconColor: color,
        title: title,
        text: text,
        button: "OK"
      }
    });

    if (callback) {
      dialogRef.afterClosed().subscribe(callback);
    }
  }

  optionsAlert(title, text, callback): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        icon: "exclamation-circle",
        iconColor: "alert",
        title: title,
        text: text,
        options: true
      }
    });

    if (callback) {
      dialogRef.afterClosed().subscribe(callback);
    }
  }

  cancelledAlert(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        icon: "exclamation-circle",
        iconColor: "failure",
        title: "Do you want to delete your file?",
        text: "You will not be able to recover it",
        options: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(ModalComponent, {
          data: {
            icon: "check-circle",
            iconColor: "success",
            title: "Deleted",
            text: "Your file has been deleted.",
            button: "OK"
          }
        });
      } else {
        this.dialog.open(ModalComponent, {
          data: {
            icon: "times-circle",
            iconColor: "failure",
            title: "Canceled",
            text: "Your file is safe. You can find it on your inbox.",
            button: "OK"
          }
        });
      }
    });
  }

  inputAlert(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Please enter your name",
        input: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialog.open(ModalComponent, {
        data: {
          title: "Your name is",
          text: result,
          button: "OK"
        }
      });
    });
  }

  timedAlert(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Auto close alert!",
        text: "I will close in 2 seconds. Bye bye!",
        time: 2000
      }
    });
  }

  presentLoader() {
    this.loader = this.dialog.open(SpinnerComponent, {
      panelClass: "circle-spinner",
      disableClose: true
    });
  }

  dismissLoader() {
    if (this.loader) {
      this.loader.close();
    }
  }

  showNotification(
    vpos,
    hpos,
    type,
    icon = "",
    message = "",
    duration = 3000
  ): void {
    // for more info about Angular Material snackBar check: https://material.angular.io/components/snack-bar/overview
    this.mySnackBarRef = this.snackBar.openFromComponent(
      NotificationComponent,
      {
        data: {
          message: message,
          icon,
          type,
          dismissible: true
          // you can add everything you want here
        },
        duration: duration,
        horizontalPosition: hpos, // 'start' | 'center' | 'end' | 'left' | 'right'
        verticalPosition: vpos, // 'top' | 'bottom'
        panelClass: ["notification-wrapper"]
      }
    );
    // this is to be able to close it from the NotificationComponent
    this.mySnackBarRef.instance.snackBarRef = this.mySnackBarRef;
  }

  somethingWentWrong(): void {
    this.dismissLoader();
    const dialogRef = this.dialog.open(SomethingWentWrongComponent, {
      panelClass: "something-went-wrong"
    });
  }
}
