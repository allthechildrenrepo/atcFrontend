import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialModule } from '../material.module';
import { PageHeaderModule } from '../shared';
import { SpinnerComponent, UtilsModule } from '../utils';
import { BaseApprovalComponent } from './base-approval';
import { BasePendingRequestComponent } from './base-pending-request';
import { BaseUploadComponent } from './base-upload';
import { BaseComponent } from './base/base.component';
import { DateFilterComponent } from './components/date-filter-component/date-filter';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CreateTelecallerComponent } from './create-telecaller/create-telecaller.component';
import { DonarSearchPageComponent } from './donar-search-page/donar-search-page.component';
import { DonarTransactionDetailsComponent, RemarksDialog } from './donar-transaction-details/donar-transaction-details.component';
import { DonationEntryComponent } from './donation-entry/donation-entry.component';
import { DonationVerificationComponent } from './donation-verification/donation-verification.component';
import { DonorsListComponent } from './donors-list/donors-list.component';
import { EditDonorTransactonComponent } from './edit-donor-transacton/edit-donor-transacton.component';
import { FoodDonationComponent } from './food-donation/food-donation.component';
import { BatchSelectionAlert, GenerateBatchComponent } from './generate-batch';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { MultiBranchSelector } from './multi-branch-selector';
import { NotVerifiedListComponent } from './not-verified-list/not-verified-list.component';
import { PickUpComponent, PickUpRemarksDialog } from './pick-up';
import { ReciptDownloadComponent } from './recipt-download/recipt-download.component';
import { ReciptFormComponent } from './recipt-form/recipt-form.component';
import { TableExpandableComponent } from './table-expandable/table-expandable.component';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TelecallerListComponent } from './telecaller-list/telecaller-list.component';
import { TrustTransactionComponent } from './trust-transaction/trust-transaction.component';
import { TrustVisitDonarComponent } from './trust-visit-donar/trust-visit-donar.component';
import { UserDashboardComponent } from './user-dashbord/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { VerifiedDonationListComponent } from './verified-donation-list/verified-donation-list.component';
import { WhatsAPPComponent, WhatsappTransactionBulkDownloadDialog } from './whats-app';
import { WhatsAPPTransactionComponent } from './whats-app/whats-app-transaction';
import { ReceiptViewDownloadComponent } from './receipt-view-download/receipt-view-download.component';
import { AssignTelecallerListComponent } from './assign-telecaller-list/assign-telecaller-list.component';
import { EditDonorDetailsComponent } from './edit-donor-details/edit-donor-details.component';
import { SwitchBranchAlertComponent } from './switch-branch-alert/switch-branch-alert.component';
import { BranchReportComponent } from './branch-report/branch-report.component';
import { DatePipe } from '@angular/common';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ReceiptDetailsComponent } from './receipt-details/receipt-details.component';
import { TransactionReceiptDetailsComponent } from './transaction-receipt-details/transaction-receipt-details.component';
import { PickUpTransactionComponent } from './pickup-transaction';
import { BaseRemarksComponent } from './base-remarks/base-remarks.component';
import { PreviousTransactionComponent } from './previous-transaction/previous-transaction.component';
import { TelecallersReportComponent } from './telecallers-report/telecallers-report.component';
import {NgxImageCompressService} from 'ngx-image-compress';
import { OverallReportComponent } from './overall-report/overall-report.component';
import { EditVerifiedDonationsComponent } from './edit-verified-donations/edit-verified-donations.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { CreatePromotionComponent } from './create-promotion/create-promotion.component';
import { PromotionImageComponent } from './promotion-image/promotion-image.component';

import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { WassangerDeviceStatusComponent } from './wassanger-device-status';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { ReciptUploadComponent } from './recipt-upload-bulk/recipt-upload-bulk';
import { ReciptDownloadNewComponent } from './recipt-download-new/recipt-download.component';
// import { NgxMaterialTimepickerContainerComponent } from 'ngx-material-timepicker/src/app/material-timepicker/components/ngx-material-timepicker-container/ngx-material-timepicker-container.component';



@NgModule({
  imports: [
    MatFormFieldModule,
    CommonModule,
    LayoutRoutingModule,
    TranslateModule,
    MaterialModule,
    PageHeaderModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UtilsModule,
    DlDateTimeDateModule,
    DlDateTimePickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    TimePickerModule,
    NgxMaterialTimepickerModule
  ],
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    DateFilterComponent,
    DonationEntryComponent,
    CreateTelecallerComponent,
    TelecallerListComponent,
    DonationVerificationComponent,
    DonorsListComponent,
    TablePaginationComponent,
    ReciptDownloadComponent,
    ReciptDownloadNewComponent,
    TrustVisitDonarComponent,
    TablePaginationComponent,
    TableExpandableComponent,
    ImageDialogComponent,
    DonarSearchPageComponent,
    DonarTransactionDetailsComponent,
    GenerateBatchComponent,
    NotVerifiedListComponent,
    EditDonorTransactonComponent,
    UserProfileComponent,
    VerifiedDonationListComponent,
    RemarksDialog,
    FoodDonationComponent,
    ReciptFormComponent,
    UserDashboardComponent,
    WhatsAPPComponent,
    PickUpComponent,
    MultiBranchSelector,
    BasePendingRequestComponent,
    BaseUploadComponent,
    ReciptUploadComponent,
    BaseApprovalComponent,
    TrustTransactionComponent,
    WhatsAPPTransactionComponent,
    BaseComponent,
    ReceiptViewDownloadComponent,
    PickUpRemarksDialog,
    WhatsappTransactionBulkDownloadDialog,
    AssignTelecallerListComponent,
    EditDonorDetailsComponent,
    SwitchBranchAlertComponent,
    BranchReportComponent,
    BatchDetailsComponent,
    ReceiptDetailsComponent,
    TransactionReceiptDetailsComponent,
    PickUpTransactionComponent,
    BaseRemarksComponent,
    PreviousTransactionComponent,
    TelecallersReportComponent,
    OverallReportComponent,
    BatchSelectionAlert,
    EditVerifiedDonationsComponent,
    PromotionListComponent,
    CreatePromotionComponent,
    PromotionImageComponent,
    WassangerDeviceStatusComponent,
  ],
  providers: [DatePipe, NgxImageCompressService],
  entryComponents: [PickUpRemarksDialog,WhatsappTransactionBulkDownloadDialog, RemarksDialog, ImageDialogComponent, ReciptDownloadComponent,ReciptDownloadNewComponent, ReceiptViewDownloadComponent, EditDonorTransactonComponent, SpinnerComponent, AssignTelecallerListComponent, EditDonorDetailsComponent, SwitchBranchAlertComponent, TransactionReceiptDetailsComponent, PreviousTransactionComponent, BatchSelectionAlert, CreatePromotionComponent, PromotionImageComponent]
})
export class LayoutModule { }
