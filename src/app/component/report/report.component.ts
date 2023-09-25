import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/data.service';
import { Employee, EmployeeAttendance } from 'src/app/structure/firebase-collections';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  employeeList = [] as Array<Employee>;
  employeeAttendance = {} as EmployeeAttendance;
  employeeAttendanceList = [] as Array<EmployeeAttendance>
  attendance = ['Present', 'Absent', 'Half Day', 'Leave']
  status: string = '';
  staticDate: any;
  date: any;
  time: any;
  totalPresent = 0;
  attendanceArray : any = [];
  workingDays: number = 0
  startingDateOfMonth = ''
  EndingDateOfMonth = ''
  totalNoOfDaysInMonth !: number


  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: AngularFirestore,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.fatchUsersList();
  }

  fatchUsersList() {
    this.dataService.getEmployees().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let data = { ...doc.data() as Employee, id: doc.id }
        this.employeeList.push(data)
        this.cdr.detectChanges();
      });
      console.log(this.employeeList);
      this.cdr.detectChanges();
    })
    this.cdr.detectChanges();
  }

  getDateFromCalender(e: any) {
    console.log(e.target.value)
    this.date = e.target.value;
    this.fatchAttendanceStatus(this.date)

  }

  fatchAttendanceStatus(e: any) {
    this.employeeList.forEach(res => {
      res.status = '';
      res.date = '';
      res.time = '';
    })
    this.staticDate = e;

    this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.employeeList.forEach(res => {
          this.convertDate()
          let id = e + ' + ' + res.employeeId;
          if (doc.id == id) {
            let data = doc.data() as EmployeeAttendance;
            res.status = data.status
            res.time = data.time
            res.date = data.date
          }
        })
        this.cdr.detectChanges();
      });
      this.cdr.detectChanges();
    })
    this.cdr.detectChanges();
  }

  editEmployeeAttendance(data: Employee) {
    this.router.navigate(['/dashboard/employeeAttendance'])
  }

  convertDate() {
    let date = new Date(),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    this.date = [date.getFullYear(), month, day].join("-");
    this.time = this.datePipe.transform(date, 'hh:mm:ss')
  }

  // statusOfEmployee(event: string, data: Employee) {
  //   this.employeeAttendance.employeeId = data.employeeId;
  //   this.employeeAttendance.employeeName = data.firstName + ' ' + data.lastName;
  //   this.employeeAttendance.date = this.staticDate;
  //   this.employeeAttendance.time = this.time;
  //   if (data.status == event || data.status == null || data.status == '') {
  //     this.employeeAttendance.status = event;
  //     console.log(data.employeeId + ' + ' + this.staticDate)
  //     console.log(this.employeeAttendance)
  //     this.fb.collection('attendance').doc(this.staticDate + ' + ' + data.employeeId).set(this.employeeAttendance)
  //     this.fatchAttendanceStatus(this.staticDate);
  //   }
  //   else {
  //     let id = this.staticDate + ' + ' + this.employeeAttendance.employeeId;
  //     this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         if (doc.id == id) {
  //           let data = doc.data() as EmployeeAttendance;
  //           data.status = event;
  //           data.time = this.time;
  //           data.employeeName = this.employeeAttendance.employeeName;
  //           console.log(data)
  //           this.fb.collection('attendance').doc(id).update(data);
  //           this.fatchAttendanceStatus(this.staticDate);
  //         }
  //         this.cdr.detectChanges();
  //       });
  //       this.cdr.detectChanges();
  //     })
  //   }
  // }

  report() {
    this.attendanceArray = []
    this.employeeList.forEach(res => {
      res.present = 0
      res.absent = 0;
      res.halfDay = 0;
      res.leave = 0;
      res.wfh = 0;
    })


    let date = new Date(this.staticDate);
    const no = moment(this.staticDate, "YYYY-MM-DD").daysInMonth()
    console.log(no)

    let y = date.getFullYear(), m = date.getMonth();

    let firstDay = new Date(y, m, 1),
      fmonth = ("0" + (firstDay.getMonth() + 1)).slice(-2),
      fday = ("0" + firstDay.getDate()).slice(-2);
    let newfDate = [firstDay.getFullYear(), fmonth, fday].join("-");

    let lastDay = new Date(y, m + 1, 0),
      lmonth = ("0" + (lastDay.getMonth() + 1)).slice(-2),
      lday = ("0" + lastDay.getDate()).slice(-2);
    let newlDate = [lastDay.getFullYear(), lmonth, lday].join("-");

    
    let f = new Date(newfDate).getDate(),
    l = new Date(newlDate).getDate();

    this.startingDateOfMonth = newfDate;
    this.EndingDateOfMonth = newlDate
    this.totalNoOfDaysInMonth = l ;

    let localArr: any = [];
    for (let i = f; i <= l; i++) {
      this.employeeList.forEach(res => {
        let id = newfDate + ' + ' + res.employeeId;

        this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (id == doc.id) {
              let data = doc.data() as EmployeeAttendance
              if (res.employeeId == data.employeeId) {
                let dataWithId = { Id : doc.id , ...doc.data() as EmployeeAttendance}
                this.attendanceArray.push(dataWithId)
                // console.log(this.attendanceArray)

                if (data.status == 'Present') {
                  if (!res.present) {
                    res.present = 0
                  }
                  res.present = res.present + 1;
                }
                if (data.status == 'Work From Home (WFH)') {
                  if(!res.wfh){
                    res.wfh = 0
                  }
                  res.wfh = res.wfh + 1;
                }
                if (data.status == 'Absent') {
                  if (!res.absent) {
                    res.absent = 0
                  }
                  res.absent = res.absent + 1;
                }
                if (data.status == 'Half Day') {
                  if (!res.halfDay) {
                    res.halfDay = 0
                  }
                  res.halfDay = res.halfDay + 1;
                }
                if (data.status == 'Leave') {
                  if (!res.leave) {
                    res.leave = 0
                  }
                  res.leave = res.leave + 1;
                }
              }
            }
          });
        })
      })
      firstDay.setDate(firstDay.getDate() + 1);
      let newfirstDay = new Date(firstDay),
        newfmonth = ("0" + (firstDay.getMonth() + 1)).slice(-2),
        newfday = ("0" + firstDay.getDate()).slice(-2);
      let a = [newfirstDay.getFullYear(), newfmonth, newfday].join("-");
      newfDate = a;
    }
    this.cdr.detectChanges();
  }

  downloadFile() {
    this.attendanceArray=[]
    this.employeeList.forEach((res: any)=>{
      // console.log(res)
      let csvData = {
         Employee_Id : res.employeeId ,
         Employee_Name : res.firstName + ' ' + res.lastName ,
         Total_Days : this.totalNoOfDaysInMonth,
         Working_Days : (res.present + res.wfh + (res.halfDay/2)) ,
         Present : res.present ,
         Work_From_Home : res.wfh ,
         Absent : res.absent ,
         HalfDay : res.halfDay ,
         Leave : res.leave 
        }
      this.attendanceArray.push(csvData)
    })
    // console.log(this.attendanceArray)
    const replacer = (key : any, value : any) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(this.attendanceArray[0]);
    const csv = this.attendanceArray.map((row : any) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');
  
    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
  
    a.href = url;
    a.download = this.startingDateOfMonth + ' to ' + this.EndingDateOfMonth + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
