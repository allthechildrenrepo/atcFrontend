import { BasePage } from 'src/app/utils/pages/base/base.component';
import { Branch } from 'src/app/shared/model/branch';
import { BranchService } from '../../shared/services/branch.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DateFormaterService } from 'src/app/shared/services/date.service';
import { DonationTransaction } from '../../shared/model/donation-transaction';
import { FetchDonationTransactionService } from '../../shared/services/fetch-donation-transaction.service';
import { isThisSecond } from 'date-fns/esm';
import { MatDialog, MatSnackBar } from '@angular/material';
import { User } from '../../shared/model';
import { whatsAppGetQR, whatsAppGetStatus, whatsAppLogout } from '../../shared/services/whatsapp.service';


@Component({
    selector: "multi-branch-selector",
    templateUrl: "./multi-branch-selector.html",
    styleUrls: ["./multi-branch-selector.scss"]
})
export class MultiBranchSelector extends BasePage implements OnInit {

    @Output() branchSelected = new EventEmitter<Branch>();
    userBranches: Branch[];
    allBranches: Branch[];
    selectedBranch: Branch;

    constructor(
        public branchService: BranchService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        super(dialog, snackBar);
    }

    ngOnInit() {
        let user = new User().deSerialize(JSON.parse(localStorage.getItem('user')));
        this.userBranches = user.branch;
        this.allBranches = [];
        // check for admin branch and fetch all the branches.
        if (this.userBranches.find(group => group.branchId == 17)) {
            this.presentLoader();
            this.branchService.get().subscribe(
                response => {
                    this.dismissLoader();
                    response.results.forEach(data => {
                        this.allBranches.push(new Branch().deserialize(data));
                    });
                },
                err => {
                    this.dismissLoader();
                    this.somethingWentWrong();
                }
            );
        } else if (this.userBranches.length > 1) {
            this.allBranches = this.userBranches;
        } else {
            this.selectedBranch = this.userBranches[0];
            this.allBranches = this.userBranches;
            this.branchSelected.emit(this.selectedBranch);
        }
    }

    setBranch(branch: Branch) {
        this.branchSelected.emit(branch);
    }
}