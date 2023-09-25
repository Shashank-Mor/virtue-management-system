import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './component/add-user/add-user.component';
import { AttendanceComponent } from './component/attendance/attendance.component';
import { EmployeeAttendanceComponent } from './component/employee-attendance/employee-attendance.component';
import { EmployeeDetailsComponent } from './component/employee-details/employee-details.component';
import { EmployeeListComponent } from './component/employee/employee-list/employee-list.component';
import { DashboardComponent } from './component/layout/dashboard/dashboard.component';
import { ReportComponent } from './component/report/report.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '' , redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: TestComponent },
  { path: 'dashboard', component: DashboardComponent , 
     children : [
       { path: 'addUser', component: AddUserComponent },
       { path: 'employee-list', component: EmployeeListComponent },
       { path: 'employee/:details', component: EmployeeDetailsComponent },
       { path: 'attendance', component: AttendanceComponent },
       { path: 'employeeAttendance', component: EmployeeAttendanceComponent },
       { path: 'report', component: ReportComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }