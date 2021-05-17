import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { BasePage } from 'src/app/utils/pages/base/base.component';
import { WhatsAppTransaction } from '../../../shared/model/whats-app-transaction';
import { WhatsAppTransactionService } from '../../../shared/services/whatsapp-transaction.service';
import { ReceiptViewDownloadComponent } from '../../receipt-view-download/receipt-view-download.component';
import { DateFormaterService } from '../../../shared/services/date.service';
import { User } from '../../../shared/model';
import { Branch } from '../../../shared/model/branch';
import { WhatsappTransactionBulkDownloadDialog } from '..';
// import * as base64 from "base64";


@Component({
    selector: "whats-app-transaction",
    templateUrl: "./whats-app-transaction.html",
    styleUrls: ["./whats-app-transaction.scss"]
})
export class WhatsAPPTransactionComponent extends BasePage implements OnInit {
    displayedColumns = ['created_date', 'donation_id', 'medium', 'receipt_id', 'whatsapp_number', 'sendUser', 'branch', 'receipt'];
    dataSource;
    fromDate: any;
    toDate: any;
    receiptId: any;
    phone: number;email: string;
    selectedBranch: number;
    branchName: string;
    user: User;

    currentPage:number = 0;
    previouspageUrl: string;
    nextPageUrl: string;

    src: string;
    @ViewChild('imgRef', { static: false }) img: ElementRef;

    transaction: WhatsAppTransaction[] = [];
    constructor(
        public whatsAppTransactionService: WhatsAppTransactionService,
        public dateFormaterService: DateFormaterService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        super(dialog, snackBar);
    }

    ngOnInit() {
        this.user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
        let adminBranch;
        if (this.user.branch.length > 0) {
            adminBranch = this.user.branch.filter(branch => branch.branch_id == 17)[0]
            if (adminBranch) {
                this.setBranch(adminBranch)
            }
        }
        if (this.user.branch.length === 1) {
            this.setBranch(this.user.branch[0]);
        }
    }

    setBranch(branch: Branch) {
        // this.getPickDonationList();
        this.transaction = [];
        this.selectedBranch = branch.branchId;
        this.branchName = branch.branchName;
    }

    removeBranch() {
        this.selectedBranch = null;
        this.branchName = null;
    }


  showPreviousPage(){
    this.fetchWhatsAppTransaction({},this.previouspageUrl);
    this.currentPage = this.currentPage - 1; 
  }

  showNextPage() {
    this.fetchWhatsAppTransaction({},this.nextPageUrl);
    this.currentPage = this.currentPage + 1;
  }

    setFromDate(dateEvent) {
        this.resetDateFilter();
        this.fromDate = new Date(dateEvent.targetElement.value);
        this.toDate = new Date(this.fromDate);
        this.toDate.setDate(this.toDate.getDate() + 1);
    }

    resetDateFilter() {
        this.fromDate = undefined;
        this.toDate = undefined;
        this.receiptId = undefined;
        this.phone = undefined;
        this.email = undefined;
    }

    resetReceiptIdFilter() {
        this.receiptId = undefined;
    }

    filterByPhone() {
        var param = {
            whatsapp_number: '91'+this.phone
        }
        this.fetchWhatsAppTransaction(param);
        this.fromDate = undefined;
        this.toDate = undefined;
        this.receiptId = undefined;
        this.email = undefined;
    }

    // since email and phone store in whatsapp number field in
    // server we pass the params , only difference is we add 91 to phone number
    filterByEmail() {
        var param = {
            whatsapp_number: this.email
        }
        this.fetchWhatsAppTransaction(param);
        this.fromDate = undefined;
        this.toDate = undefined;
        this.receiptId = undefined;
        this.phone = undefined;
    }


    filterByReceiptId() {
        var param = {
            receipt_id: this.receiptId
        }
        this.fetchWhatsAppTransaction(param);
        this.fromDate = undefined;
        this.toDate = undefined;
        this.phone = undefined;
        this.email = undefined;
    }

    filterByDate() {
        var param = {
            start_date: this.dateFormaterService.converDateToYmd(this.fromDate),
            end_date: this.dateFormaterService.converDateToYmd(this.toDate),
        };
        // if(this.selectedBranch != 17) {
        //     param['branch_id'] = this.selectedBranch;
        // }
        this.fetchWhatsAppTransaction(param);
        this.resetReceiptIdFilter();
    }

    fetchWhatsAppTransaction(param, url?) {
        this.presentLoader();

        //If the user is not an Admin, Restrict another branch WhatsApp transaction details.
        if(this.selectedBranch != 17) {
            param['branch_id'] = this.selectedBranch;
        }
        let serivceMethod;
        if(!url){
            serivceMethod = this.whatsAppTransactionService.get(param)
        } else {
            serivceMethod = this.whatsAppTransactionService.getwithURL(url)
        }

        this.transaction = [];
        serivceMethod.subscribe((data) => {
            this.previouspageUrl = data.previous;
            this.nextPageUrl = data.next;
            data.results.forEach(element => {
                this.transaction.push(new WhatsAppTransaction().deserializer(element));
            });
            this.dataSource = this.transaction;
            this.dismissLoader();
        }, err => {
            this.somethingWentWrong();
            this.dismissLoader();
        })
    }

    dateFormat(fullDate) {
        var createDate = new Date(fullDate);
        return createDate.getDate() + '-' + createDate.getMonth() + '-' + createDate.getFullYear();
    }

    viewReceipt(transaction: WhatsAppTransaction) {
        window.open(transaction.reciptUrl, '_blank')
    }

    get columnsToDisplay() {
        return [
            'created_date',
            'donation_id',
            'donar_name',
            'medium',
            'receipt_id',
            'transaction',
            'whatsapp_number',
            'sendUser',
            'is80G',
            'payment_mode',
            'branch',
            'receipt'
        ];
    }

    PostForDownload(){
        let dialogRef = this.dialog.open(WhatsappTransactionBulkDownloadDialog, {
            width: "100vw",
            autoFocus: false,
            maxHeight: "90vh",
        });
    }
}