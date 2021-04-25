import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseApprovalComponent } from './base-approval';
import { BaseUploadComponent } from './base-upload';
import { BaseComponent } from './base/base.component';
import { CreateTelecallerComponent } from './create-telecaller/create-telecaller.component';
import { DonarSearchPageComponent } from './donar-search-page/donar-search-page.component';
import { DonationEntryComponent } from './donation-entry/donation-entry.component';
import { DonationVerificationComponent } from './donation-verification/donation-verification.component';
import { FoodDonationComponent } from './food-donation/food-donation.component';
import { GenerateBatchComponent } from './generate-batch/generate-batch.component';
import { LayoutComponent } from './layout.component';
import { NotVerifiedListComponent } from './not-verified-list/not-verified-list.component';
import { PickUpComponent } from './pick-up';
import { ReciptFormComponent } from './recipt-form/recipt-form.component';
import { TelecallerListComponent } from './telecaller-list/telecaller-list.component';
import { TrustTransactionComponent } from './trust-transaction/trust-transaction.component';
import { TrustVisitDonarComponent } from './trust-visit-donar/trust-visit-donar.component';
import { UserDashboardComponent } from './user-dashbord/user-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { VerifiedDonationListComponent } from './verified-donation-list/verified-donation-list.component';
import { WhatsAPPComponent } from './whats-app';
import { WhatsAPPTransactionComponent } from './whats-app/whats-app-transaction';
import { BranchReportComponent } from './branch-report/branch-report.component';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { PickUpTransactionComponent } from './pickup-transaction';
import { BaseRemarksComponent } from './base-remarks/base-remarks.component';
import { TelecallersReportComponent } from './telecallers-report/telecallers-report.component';
import { OverallReportComponent } from './overall-report/overall-report.component';
import { EditVerifiedDonationsComponent } from './edit-verified-donations/edit-verified-donations.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { ReciptUploadComponent } from './recipt-upload-bulk/recipt-upload-bulk';


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'user-dashboard', pathMatch: 'prefix' }, 
            { path: 'base', component: BaseComponent},
            { path: 'donor-remarks', component: BaseRemarksComponent},
            { path: 'food-donation', component: FoodDonationComponent},
            { path: 'promotion-list', component: PromotionListComponent},
            { path: 'download-recipt', component: ReciptFormComponent},
            { path: 'whats-app-admin', component: WhatsAPPComponent},
            { path: 'pick-up-admin', component: PickUpComponent},
            { path: 'pick-up-trans', component: PickUpTransactionComponent},
            { path: 'overall-report', component: OverallReportComponent},
            { path: 'branch-report', component: BranchReportComponent},
            { path: 'trust-visit', component: TrustVisitDonarComponent},
            { path: 'trust-transaction', component: TrustTransactionComponent},
            { path: 'donation-entry', component: DonationEntryComponent},
            { path: 'donor-list', component: DonarSearchPageComponent},
            { path: 'generate-batch', component: GenerateBatchComponent},
            { path: 'batch-details', component: BatchDetailsComponent},
            { path: 'create-telecaller', component: CreateTelecallerComponent},
            { path: 'tc-list', component: TelecallerListComponent},
            { path: 'telecallers-report', component: TelecallersReportComponent},
            { path: 'donation-verification', component: DonationVerificationComponent},
            { path: 'not-Verified', component: NotVerifiedListComponent},
            { path: 'user-profile', component: UserDashboardComponent},
            { path: 'user-dashboard', component: UserDashboardComponent},
            { path: 'verified-list', component: VerifiedDonationListComponent},
            { path: 'edit-verified-donations', component: EditVerifiedDonationsComponent},
            { path: 'base-approval', component: BaseApprovalComponent},
            { path: 'base-upload', component: BaseUploadComponent},
            { path: 'recipt-bulk', component: ReciptUploadComponent},
            { path: 'whats-app-trans', component: WhatsAPPTransactionComponent},
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
