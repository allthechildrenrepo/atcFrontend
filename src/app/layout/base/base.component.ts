import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AtcUser, Leads } from "src/app/shared/model";
import { Branch } from "src/app/shared/model/branch";
import { BasePage } from "src/app/utils";
import {
  LeadFetchService,
  LeadRequestService,
  AssignBaseService,
} from "../../shared/services/leads";
import { TelecallerFetchService } from "../../shared/services/telecaller.service";
import { AssignTelecallerListComponent } from "../assign-telecaller-list/assign-telecaller-list.component";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"],
})
export class BaseComponent extends BasePage implements OnInit {
  objectKeys = Object.keys;
  public alerts: Array<any> = [];
  userBranches: Branch[] = [];
  selectedBranchId: number;
  selectedBranch: Branch;
  allBranches: Branch[] = [];
  selectedTelecaller;
  selectedTelecallerName;
  telecallers = [];
  donors = [];
  form: FormGroup = new FormGroup({});
  assignForm: FormGroup = new FormGroup({});
  showPendingRequests: boolean = true;
  leads: Leads[];
  unAssignedLeads: Leads[];
  teleCallerAssigned: Leads[];
  remarksGiven: Leads[];
  telecallerList: AtcUser[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<AtcUser[]>;
  noOfBase: number = 0;
  selectTelecaller: AtcUser;

  previouspageUrl: string;
  nextPageUrl: string;
  currentPage: number = 0;
  totalBase: number = 0;

  constructor(
    public leadfetchService: LeadFetchService,
    public leadRequestService: LeadRequestService,
    public assignBaseService: AssignBaseService,
    public telecallerFetchService: TelecallerFetchService,
    public telecallerService: TelecallerFetchService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    super(dialog, snackBar);
    this.form = fb.group({
      number: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
    this.assignForm = fb.group({
      number: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  get f() {
    return this.form.controls;
  }

  get assginFormControl() {
    return this.assignForm.controls;
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): AtcUser[] {
    const filterValue = value.toLowerCase();
    return this.telecallerList.filter((option: AtcUser) => {
      if (
        option.fullName.toLowerCase().indexOf(filterValue) != -1 ||
        (option.atcProfile.voiceCallingName
          ? option.atcProfile.voiceCallingName
              .toLowerCase()
              .indexOf(filterValue) != -1
          : false) ||
        option.atcId.toLowerCase().indexOf(filterValue) != -1
      ) {
        return option;
      }
    });
  }

  showPreviousPage() {
    this.fetchLeads(this.previouspageUrl);
    this.currentPage = this.currentPage - 1;
  }

  showNextPage() {
    this.fetchLeads(this.nextPageUrl);
    this.currentPage = this.currentPage + 1;
  }

  fetchLeads(url = null) {
    this.presentLoader();
    this.leads = [];
    this.teleCallerAssigned = [];
    this.unAssignedLeads = [];
    let params = { branch: this.selectedBranch.branchId };

    let serivceMethod;
    if (!url) {
      serivceMethod = this.leadfetchService.get(params);
    } else {
      serivceMethod = this.leadfetchService.getwithURL(url);
    }
    serivceMethod.subscribe((data) => {
      debugger;

      this.previouspageUrl = data.previous;
      this.nextPageUrl = data.next;
      data.results.forEach((element) => {
        this.leads.push(new Leads().deserializer(element));
      });
      this.totalBase = data.count;
      this.unAssignedLeads = this.leads.filter((lead) => lead.status == 1);
      this.teleCallerAssigned = this.leads.filter((lead) => lead.status == 2);
      this.remarksGiven = this.leads.filter((lead) => lead.status == 3);
      this.dismissLoader();
    });
  }

  telecallerSelected(event: AtcUser) {
    this.selectTelecaller = event;
    this.selectedTelecallerName = event.fullName;
  }

  setBranch(branch: Branch) {
    this.selectedBranch = branch;
    this.selectedBranchId = branch.branchId;
    this.fetchLeads();
    this.getTeleCallerDetails();
  }

  removeBranch() {
    this.selectedBranchId = null;
    this.selectedBranch = null;
  }

  getTeleCallerDetails() {
    this.telecallerList = [];
    this.telecallerService
      .get({ atc_profile__branch__id: this.selectedBranch.branchId })
      .subscribe(
        (res) => {
          debugger;
          res.results.forEach((data) => {
            this.telecallerList.push(new AtcUser().deserialize(data));
          });
          this.dismissLoader();
        },
        (err) => {
          this.dismissLoader();
          this.somethingWentWrong();
        }
      );
  }

  requestForBase() {
    this.presentLoader();
    this.showPendingRequests = false;
    let params = this.leadRequestService.getParams(
      this.form.value.number,
      this.selectedBranchId
    );
    this.leadRequestService.post(params).subscribe(
      (data) => {
        debugger;
        this.showPendingRequests = true;
        this.dismissLoader();
      },
      (err) => {
        this.somethingWentWrong();
        this.dismissLoader();
      }
    );
  }

  showAlert(type, message) {
    this.alerts = [];
    this.alerts.push({
      id: 1,
      type: type,
      message: message,
    });

    setTimeout(() => {
      this.alerts = [];
    }, 3000);
  }

  assignBase() {
    this.presentLoader();
    let leadList: Leads[] = this.unAssignedLeads.map((lead: Leads) => lead);
    leadList.splice(this.assignForm.value.number);
    let assignBaseParams = {
      ids: leadList.map((lead: Leads) => lead.leadId),
      telecaller_id: this.selectTelecaller.id,
    };
    this.assignBaseService.put(assignBaseParams).subscribe(
      (data) => {
        debugger;
        this.dismissLoader();
        this.showAlert(
          "success",
          "Base assigned Successfully for " + this.selectTelecaller.fullName
        );
        this.openBasePrintPage(leadList);
        this.fetchLeads();
        this.assignForm.reset();
      },
      (err) => {
        this.dismissLoader();
        this.somethingWentWrong();
      }
    );
  }

  openBasePrintPage(leadList: Leads[]) {
    const dialogRef = this.dialog.open(AssignTelecallerListComponent, {
      width: "90vw",
      autoFocus: false,
      maxHeight: "90vh",
      data: { telecaller: this.selectTelecaller, lead: leadList },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.dismissLoader();
    });
  }

  braseCount() {}
}
