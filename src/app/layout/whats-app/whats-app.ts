import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { User } from '../../shared/model';
import { whatsAppGetQR, whatsAppGetStatus, whatsAppLogout } from '../../shared/services/whatsapp.service';

@Component({
    selector: "whats-app",
    templateUrl: "./whats-app.html",
    styleUrls: ["./whats-app.scss"]
})
export class WhatsAPPComponent extends BasePage implements OnInit {

    localValue: User;
    public alerts: Array<any> = [];
    whatsappConnected: boolean = false;
    checkingStatus: boolean = true;
    whatsappQRCodeImage: string;
    logoutRequested: boolean = false;
    paymentFailed: boolean = false;
    constructor(
        public whatsAppStatus: whatsAppGetStatus,
        public whatsappQRCode: whatsAppGetQR,
        public whatsappLogOut: whatsAppLogout,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        super(dialog, snackBar);
    }

    ngOnInit() {
        this.localValue = new User().deSerialize(
            JSON.parse(localStorage.getItem("user"))
        );
        this.checkWhatsappStatus();
    }

    checkWhatsappStatus() {
        this.checkingStatus = true;
        this.whatsappConnected = false;
        this.paymentFailed = false;
        this.alerts  = [];
        this.whatsAppStatus.get().subscribe((response) => {
            this.logoutRequested = false;
            if (response.accountStatus == "authenticated") {
                this.checkingStatus = false;
                this.whatsappConnected = true;
                return;
            }
            this.whatsappConnected = false;
            this.whatsappQRCodeImage = response.qrCode;
            this.checkingStatus = false;
        }, (err) => {
            this.whatsappConnected = false;
            this.checkingStatus = false;
            this.paymentFailed = true;
            this.alerts.push({
                    id: 1,
                    type: "danger",
                    message: err.error.error
                })
        });
    }

    logoutWhatsApp() {
        this.alerts = [];
        this.whatsappLogOut.post({}).subscribe((response) => {
            this.logoutRequested = true;
            this.alerts.push({
                id: 1,
                type: "danger",
                message: `Logout request sent to whatsApp, it will take 2 to 4 mins to logout in all devices`
            });
        })
    }


    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}