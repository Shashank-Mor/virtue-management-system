import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { TestComponent } from './test/test.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiRootModule, TuiDialogModule, TuiNotificationsModule, TUI_SANITIZER, TuiButtonModule, TuiLoaderModule } from "@taiga-ui/core";
import { TuiAvatarModule, TuiDataListWrapperModule, TuiInputDateModule, TuiInputDateTimeModule, TuiInputFileModule, TuiInputModule, TuiInputPasswordModule, TuiSelectModule } from "@taiga-ui/kit";
import { DashboardComponent } from './component/layout/dashboard/dashboard.component';
import { SidePanalComponent } from './component/layout/side-panal/side-panal.component';
import { AddUserComponent } from './component/add-user/add-user.component';
import { EmployeeDetailsComponent } from './component/employee-details/employee-details.component';
import { EmployeeListComponent } from './component/employee/employee-list/employee-list.component';
import { HeaderComponent } from './component/layout/header/header.component';
import { FooterComponent } from './component/layout/footer/footer.component';
import { AttendanceComponent } from './component/attendance/attendance.component';
import { ImageUploadComponent } from './component/file_upload/image-upload/image-upload.component';
import { EmployeeAttendanceComponent } from './component/employee-attendance/employee-attendance.component';
import { ReportComponent } from './component/report/report.component';
import { DatePipe } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    DashboardComponent,
    SidePanalComponent,
    AddUserComponent,
    EmployeeDetailsComponent,
    EmployeeListComponent,
    HeaderComponent,
    FooterComponent,
    AttendanceComponent,
    ImageUploadComponent,
    EmployeeAttendanceComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase ),
    AngularFirestoreModule,
    AngularFireStorageModule,
      TuiRootModule,
      BrowserAnimationsModule,
      TuiDialogModule,
      TuiNotificationsModule,
      TuiInputModule,
      TuiInputPasswordModule,
      TuiButtonModule,
      TuiAvatarModule,
      TuiInputFileModule,
      TuiLoaderModule,
      TuiInputDateModule,
      TuiSelectModule,
      TuiDataListWrapperModule,
],
  providers: [DataService, {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer} , DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
