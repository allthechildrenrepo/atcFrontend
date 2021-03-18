import {
  AutoCompleterPageComponent,
  BasePage,
  FileUploaderDirective,
  FileUploaderPageComponent,
  LoginModalComponent,
  ModalComponent,
  ModalsPageComponent,
  NotificationComponent,
  NotificationsPageComponent,
  RegisterModalComponent,
  SomethingWentWrongComponent,
  SpinnerComponent
} from './';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

// export const utilsRoutes = [
//   { path: '', redirectTo: 'image-uploader' },
//   { path: 'file-uploader', component: FileUploaderPageComponent },
//   { path: 'auto-completer', component: AutoCompleterPageComponent },
//   { path: 'modals', component: ModalsPageComponent },
//   { path: 'notifications', component: NotificationsPageComponent },
//   { path: 'alerts', component: AlertsPageComponent }
// ];

@NgModule({
  declarations: [
    ModalsPageComponent,
    NotificationsPageComponent,
    NotificationComponent,
    RegisterModalComponent,
    ModalComponent,
    SpinnerComponent,
    SomethingWentWrongComponent,
    BasePage,
    LoginModalComponent,
    AutoCompleterPageComponent,
    FileUploaderDirective,
    FileUploaderPageComponent
  ],

  providers: [
  ],

  entryComponents: [
    ModalComponent,
    RegisterModalComponent,
    NotificationComponent,
    SpinnerComponent,
    SomethingWentWrongComponent,
  ],

  schemas:[CUSTOM_ELEMENTS_SCHEMA],

  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
    
    // RouterModule.forChild(utilsRoutes),
  ],
  exports: [
    NotificationComponent,
    SpinnerComponent,
    AutoCompleterPageComponent,
    LoginModalComponent,
    FileUploaderDirective,
    FileUploaderPageComponent
  ]
})
export class UtilsModule { }
