import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Branch } from "src/app/shared/model/branch";
import { BasePage } from "src/app/utils";
import { BaseRequestModel } from "../../shared/model";
import { BranchService } from "../../shared/services/branch.service";
import {
  LeadFetchService,
  LeadRequestService,
} from "../../shared/services/leads";

@Component({
  selector: "base-pending-request",
  templateUrl: "./base-pending-request.html",
  styleUrls: ["./base-pending-request.scss"],
})
export class BasePendingRequestComponent extends BasePage implements OnInit {
  @Input()
  branchId: number;

  @Input()
  status: number = null;

  @Input()
  readOnly: boolean = true;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  allBranches: { [id: number]: Branch } = null;
  dataSource: MatTableDataSource<BaseRequestModel>;

  leadRequest: BaseRequestModel[] = [];
  displayedColumns = ["created_at", "request_no", "branch", "status"];
  previouspageUrl: string;
  nextPageUrl: string;
  currentPage: number = 0;

  constructor(
    public leadfetchService: LeadFetchService,
    public leadRequestService: LeadRequestService,
    public branchService: BranchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    super(dialog, snackBar);
  }

  ngOnInit() {
    if (!this.readOnly) {
      this.displayedColumns.push("action");
    }
    this.leadRequestService.leadId = null;

    this.fetchLeadRequest();
  }

  showPreviousPage() {
    this.fetchLeadRequest(this.previouspageUrl);
    this.currentPage = this.currentPage - 1;
  }

  showNextPage() {
    this.fetchLeadRequest(this.nextPageUrl);
    this.currentPage = this.currentPage + 1;
  }

  fetchLeadRequest(url = null) {
    this.presentLoader();
    this.leadRequest = [];
    let params = this.leadRequestService.getPendingRequest(this.branchId);
    this.leadRequestService.get(params).subscribe(
      (response) => {
        this.previouspageUrl = response.previous;
        this.nextPageUrl = response.next;
        response.results.forEach((data) => {
          this.leadRequest.push(new BaseRequestModel().deserialize(data));
        });
        this.dataSource = new MatTableDataSource(this.leadRequest);
        this.dataSource.sort = this.sort;

        this.dismissLoader();
        this.fetchAllBranch();
      },
      (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  fetchAllBranch() {
    this.presentLoader();
    this.branchService.get().subscribe(
      (response) => {
        this.dismissLoader();
        this.allBranches = {};
        response.results.forEach((data) => {
          this.allBranches[data.id] = new Branch().deserialize(data);
        });
      },
      (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  // status 2 for approved in server
  // pk means status in server
  approveRequest(element) {
    this.presentLoader();
    this.leadRequestService.leadId = element.id;
    let params = { status: "2" };
    this.leadRequestService.put(params).subscribe(
      (data) => {
        if (data.status) {
          let index = this.leadRequest.indexOf(element);
          this.leadRequest[index].status = 2;
          this.leadRequestService.leadId = null;
          this.dismissLoader();
        } else {
          this.somethingWentWrong();
          this.dismissLoader();
        }
      },
      (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  // status 1 for rejected in server
  // pk means status in server
  rejectRequest(element) {
    this.presentLoader();
    this.leadRequestService.leadId = element.id;
    let params = { status: "1" };
    this.leadRequestService.put(params).subscribe(
      (data) => {
        if (data.status) {
          let index = this.leadRequest.indexOf(element);
          this.leadRequest[index].status = 1;
          this.leadRequestService.leadId = null;
          this.dismissLoader();
        } else {
          this.somethingWentWrong();
          this.dismissLoader();
        }
      },
      (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }
}
