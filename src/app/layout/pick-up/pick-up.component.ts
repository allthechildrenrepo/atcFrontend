import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from "../../shared/services/branch.service";
import { DateFormaterService } from "src/app/shared/services/date.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { User } from "../../shared/model";
import { whatsAppGetQR, whatsAppGetStatus, whatsAppLogout, WhatsAppCheckNumber, WhatsAppSendPickupSendMessage } from '../../shared/services/whatsapp.service';
import { isThisSecond } from 'date-fns/esm';
import { DonationApproveService } from '../../shared/services/donation-approve.service';
import { TransactionModeService } from 'src/app/shared/services/transaction-mode.service';

/**
 * How Pick up works?
 * 1) Pick up request will be generated from online donation form 
 *      by choosing the mode of transaction as Pick up - 14 , pickup request status - 0 
 * 2) Here we fetch those pickups and assign it to some person agent
 *    While assigning the pickup status will be set as 1,  pickup assigned status - 1
 * 3) once the pickup done fromt the donor, it will be moved to picked up status
 *      by choosing the picked up type, cod-15, provison-16, DD-17, Cheque -18
 *      will be set as  mode of transaction and change the status back to 0
 *  *************************************************************************************
 * |   Since mode of transaction switched from 14 to 15 / 16 / 17 / 18 and status is 0   |
 * |        it will be automatically displayed in generate batch                           |
 *  *************************************************************************************
 * 4) If pick up is canceled status will be set as 2 - not verified
 * 
 */
@Component({
    selector: "pick-up",
    templateUrl: "./pick-up.component.html",
    styleUrls: ["./pick-up.component.scss"]
})
export class PickUpComponent extends BasePage implements OnInit {
    selectedBranch: number;
    branchName: string;
    transactionDetails: DonationTransaction[] = [];
    fromDate;
    toDate;
    tomorrow;
    alerts = [];
    user: User;

    constructor(
        public fetchDonationTransactionService: FetchDonationTransactionService,
        public donationApproveService: DonationApproveService,
        public dateFormaterService: DateFormaterService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        super(dialog, snackBar);
    }

    ngOnInit() {
        this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
        if (this.user.branch.length === 1) {
            this.setBranch(this.user.branch[0]);
        }
    }

    setBranch(branch: Branch) {
        // this.getPickDonationList();
        this.selectedBranch = branch.branchId;
        this.branchName = branch.branchName;
    }

    removeBranch() {
        this.selectedBranch = null;
        this.branchName = null;
    }

    setDateFilter(date) {
        this.fromDate = date.fromDate;
        this.toDate = date.toDate;
        this.tomorrow = date.tomorrow;

        this.getDonationList();
    }

    showAlert(message, type) {
        this.alerts = [];
        this.alerts.push({
            id: 1,
            type: type,
            message: message
        });

        setTimeout(() => {
            this.alerts = [];
        }, 5000);
    }

    get columnsToDisplay() {
        return [
            "name",
            "number",
            "pickupAddress",
            "pickupDate",
            "pickupTime",
            "remarks",
            "status",
            "telecallerId",
            "voiceCallingName",
            "telecallerName",
            "agent",
            "pickupAction",
            "details"
        ];
    }

    refreshBatch() {
        console.log("Refresh batch")
    }

    getDonationList() {
        this.presentLoader();
        var params = {
            branch: this.selectedBranch,
            start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
            end_date: this.dateFormaterService.converDateToYmd(this.tomorrow),
            mode_of_transaction_id: 14
        };

        this.transactionDetails = [];
        this.fetchDonationTransactionService.get(params).subscribe(
            response => {
                this.dismissLoader();
                this.transactionDetails = [];
                if (response.results.length == 0) {
                    this.showAlert("No Pickup request under given dates", "success");
                } else {
                    response.results.forEach(data => {
                        this.transactionDetails.push(
                            new DonationTransaction().deserialize(data)
                        );
                    });
                }
            },
            err => {
                this.dismissLoader();
                this.somethingWentWrong();
                this.showAlert(
                    "Server Down, Please refresh the page and try again",
                    "danger"
                );
            }
        );
    }

    assignAgent(data) {
        let transactionDetail = data.tableData;
        let status = data.status;
        this.donationApproveService.donationId = transactionDetail.id;
        let dialogRef = this.dialog.open(PickUpRemarksDialog, {
            width: "100vw",
            autoFocus: false,
            maxHeight: "90vh",
            data: { getAgentName: true, transaction: transactionDetail }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.presentLoader();
                const formData = new FormData();
                formData.append('status', status);
                formData.append('pickup_agent', result.agentname);
                this.donationApproveService.put(formData).subscribe((response) => {
                    this.dismissLoader();
                    if (response.status) {
                        this.getDonationList();
                        this.showAlert(transactionDetail.id + " - Pick up updated usccessfully", "success");
                    }
                }, (err) => {
                    this.dismissLoader();
                    this.somethingWentWrong();
                })
            }
        });
    }

    confirmPopUp(data) {
        let transactionDetail = data.tableData;
        let status = data.status;
        this.donationApproveService.donationId = transactionDetail.id;
        let dialogRef = this.dialog.open(PickUpRemarksDialog, {
            width: "100vw",
            autoFocus: false,
            maxHeight: "90vh",
            data: { getAgentName: false }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.presentLoader();
                const formData = new FormData();
                formData.append('status', status);
                formData.append('mode_of_transaction_id', result.type);
                formData.append("approved_by", this.user.id + "");
                if (!result.isProvisionMode) {
                    formData.append('amount', result.amount)
                    formData.append('transaction_id', result.transaction);
                }
                if (result.screenshot) {
                    formData.append('transaction_image', result.screenshot, result.screenshot.name);
                }

                this.donationApproveService.put(formData).subscribe((response) => {
                    this.dismissLoader();
                    if (response.status) {
                        this.getDonationList();
                        this.showAlert(transactionDetail.id + " - Pick up updated successfully", "success");
                    }
                }, (err) => {
                    this.dismissLoader();
                    this.somethingWentWrong();
                })
            }
        })

    }

}



@Component({
    selector: "pick-up-remark-dialog",
    templateUrl: "remarks-popup.html",
    styleUrls: ["./pick-up.component.scss"]
})
export class PickUpRemarksDialog extends BasePage {
    @ViewChild("screenshotRef", { static: false }) screenshot: any;

    isProvisionMode: boolean;
    selectedMode: number = null;
    // agentName: string;
    // agentNumber: number;
    selectedAgent;

    previewUrl: any = null;
    preview: boolean = true;
    fileSize: number = 0;
    amount: number;
    screenshotPic: File = null;
    transactionId: string = null;

    currentTransaction;
    pastTransaction: DonationTransaction[] = [];
    modeOfTransaction: any[] = [];
    dataSource: MatTableDataSource<DonationTransaction>;
    //        {agentName: 'KANNAN', agentNumber: 9840438828},
    //          {agentName: 'RATHNAVEL', agentNumber: 9884863419},

    agents = [
        {agentName: 'BALA', agentNumber: 8056174579},
        {agentName: 'DIWAGAR', agentNumber: 9176768956},
        {agentName: 'HARIHARAN', agentNumber: 9514105527},
        {agentName: 'ILAYAKUMAR', agentNumber: 7418922012},
        {agentName: 'KAVIARASU', agentNumber: 9840278133},
        {agentName: 'KUMAR', agentNumber: 9600173172},
        {agentName: 'GOWRINATHAN' , agentNumber: 9500106914},
        {agentName: 'PRABHU', agentNumber: 9042223367},
        {agentName: 'RAJAN', agentNumber: 8056222843},
        {agentName: 'SUNDHARAM', agentNumber: 9566102944},
        {agentName: 'VAITHEESHWARAN', agentNumber: 8807270148},
        {agentName: 'SRINIVASAN', agentNumber:9176980446},
        {agentName: 'johnson', agentNumber: 9003974931}
]
    
    constructor(
        public dialogRef: MatDialogRef<PickUpRemarksDialog>,
        public checkWhatsAppNumber: WhatsAppCheckNumber,
        public WhatsAppSendPickupDetails: WhatsAppSendPickupSendMessage,
        public transactionModeService: TransactionModeService,
        private fetchDonationTransactionService: FetchDonationTransactionService,
        public dateFormaterService: DateFormaterService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        super(dialog, snackBar);
        if (data.transaction) {
            this.currentTransaction = data.transaction;
            this.loadTransactions();
        }
    }

    getAddressForPickUp(tableData: DonationTransaction) {
        if (tableData.pickup_address) {
          return tableData.pickup_address;
        } else {
          return tableData.donar.userProfile.addressLine1 + "," + tableData.donar.userProfile.addressLine2;
        }
      }

    reset() {
        this.previewUrl = null;
        this.preview = true;
        this.amount = null;
        this.screenshotPic = null;
        this.transactionId = null;
    }

    sendWhatsApp() {
        if (this.selectedAgent.agentNumber.toString().length != 10) {
            this.showNotification('bottom', 'center', 'failure', '', "Enterted number must be a valid 10 digit number")
            return;
        }
        this.presentLoader();
        let phone = "91" + this.selectedAgent.agentNumber;
        this.checkWhatsAppNumber.get({ 'phone': phone }).subscribe((resp) => {
            if (resp.result == 'not exists') {
                this.dismissLoader();
                this.showNotification('bottom', 'center', 'failure', '', "Enterted number is not whatsapp number")
                return;
            }
            this.dismissLoader();
            this.sendMessage(phone);
        })
    }


    sendMessage(phone) {
        this.presentLoader();
        let bodyOfTheMessage = "Name : " + this.data.transaction.donar.fullName + ", Number : "
            + this.data.transaction.donar.username + ", Pickup Address :" + this.data.transaction.pickup_address + ", Pickup time:"
            + this.data.transaction.pickup_time;
        if(this.data.transaction.telecaller.atcProfile) {
            bodyOfTheMessage = bodyOfTheMessage + ", Telecaller Name : " + this.data.transaction.telecaller.atcProfile.voiceCallingName;
        }
        if(this.data.transaction.branch) {
            bodyOfTheMessage = bodyOfTheMessage + ", Branch Name : " + this.data.transaction.branch.branchName;
        }
        let data = { phone: phone, body: bodyOfTheMessage }
        this.WhatsAppSendPickupDetails.post(data).subscribe((resp) => {
            if (resp.sent) {
                this.showNotification('bottom', 'center', "", "", resp.message);
                this.dismissLoader();
            }
            this.dismissLoader();
        })
    }

    loadTransactions() {
        this.presentLoader();
        var params = {
            start_date: this.dateFormaterService.converDateToYmd(new Date().setDate(new Date().getDate() - 30)),
            end_date: this.dateFormaterService.converDateToYmd(new Date().setDate(new Date().getDate() + 1)),
            donar__username: this.currentTransaction.donar.username,
            status: 3
        };
        this.fetchDonationTransactionService
            .get(params)
            .subscribe(transactionData => {
                this.dismissLoader();
                this.pastTransaction = [];
                transactionData.results.forEach(data => {
                    this.pastTransaction.push(new DonationTransaction().deserialize(data));
                });
                this.dataSource = new MatTableDataSource(this.pastTransaction);
                console.log("Past", this.pastTransaction);
            });
    }

    submit() {
        if (this.data.getAgentName) {
            let param = {
                // agentname: this.agentNumber ? this.agentName + " " + this.agentNumber : this.agentName
                agentname: this.selectedAgent.agentName + " " + this.selectedAgent.agentNumber
            };
            this.dialogRef.close(param);
            return;
        }
        let param = {
            type: this.selectedMode,
            isProvisionMode: this.isProvisionMode,
            transaction: this.transactionId,
            screenshot: this.screenshotPic,
            amount: this.amount
        }
        this.dialogRef.close(param);
    }

    pickupMode(modeId) {
        this.reset();
        this.selectedMode = modeId;
    }

    provisionMode() {
        this.reset();
        this.isProvisionMode = true;
        this.selectedMode = 16;
    }

    pickupProvisionMode(modeId) {
        this.reset();
        this.isProvisionMode = false;
        this.selectedMode = modeId;
    }


    uploadScreenshot(event) {
        this.fileSize = Math.round(event.target.files[0].size / 1024);

        if (event.target.files.length > 0 && this.fileSize <= 500) {
            this.screenshotPic = event.target.files[0];
        }
        this.screenshot.nativeElement.value = "";
    }


    previewScreenshot() {
        var reader = new FileReader();

        reader.onload = (event: any) => {
            this.previewUrl = event.target.result;
        };

        reader.readAsDataURL(this.screenshotPic);
        this.preview = false;
    }

    removeScreenshot() {
        this.screenshotPic = null;
        this.previewUrl = null;
        this.preview = true;
    }

    get columnsToDisplay() {
        return [
          "name",
          "number",
          "address",
          "pickupDate",
          "pickupTime",
          "remarks",
          "agentName",
          "telecallerId",
          "telecallerName"
        ];
      }
}