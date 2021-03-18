import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from "../../shared/services/branch.service";
import { DateFormaterService } from "src/app/shared/services/date.service";
import { DonationTransaction } from "../../shared/model/donation-transaction";
import { FetchDonationTransactionService } from "../../shared/services/fetch-donation-transaction.service";
import { User } from "../../shared/model";
import { whatsAppGetQR, whatsAppGetStatus, whatsAppLogout } from '../../shared/services/whatsapp.service';
import { isThisSecond } from 'date-fns/esm';
import { DonationApproveService } from '../../shared/services/donation-approve.service';

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
    selector: "pickup-transaction",
    templateUrl: "./pickup-transaction.html",
    styleUrls: ["./pickup-transaction.scss"]
})
export class PickUpTransactionComponent extends BasePage implements OnInit {
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
        this.transactionDetails = [];
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

    getDonationList() {
        this.presentLoader();
        var params = {
            branch: this.selectedBranch,
            start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
            end_date: this.dateFormaterService.converDateToYmd(this.tomorrow),
        };
        this.fetchDonationTransactionService
            .get(params)
            .subscribe(response => {
                this.dismissLoader();
                this.transactionDetails = [];
                response.forEach((data) => {
                    // not ot show pick up while generating batch
                    if ([14, 15, 16, 17, 18].indexOf(+data.mode_of_transaction_id) != -1) {
                        this.transactionDetails.push(
                            new DonationTransaction().deserialize(data)
                        );
                    }
                });

            if(this.transactionDetails.length == 0) {
                this.showAlert("No pickup request under given date","success")
            }
            });
    }


    get columnsToDisplay() {
        return [
            "name",
            "number",
            "mode",
            "transactionId",
            "pickupAddress",
            "timeLeft",
            "pickupTime",
            "amount",
            "status",
            "telecallerId",
            "voiceCallingName",
            "telecallerName",
            "pickupDate",
            "screenShot",
            "details"
        ];
    }

    get columnToDownload() {
        return [
            "name",
            "number",
            "phone1",
            "mode",
            "transactionId",
            "amount",
            "pickupAddress",
            "pickupDate",
            "pickupTime",
            "agent",
            "remarks",
            "telecallerId",
            "voiceCallingName",
            "donatedDate",
            "donorType"
        ];
    }
}