import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/data.service';
import { Employee, EmployeeAttendance } from 'src/app/structure/firebase-collections';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [DatePipe],
})
export class AttendanceComponent implements OnInit {

  employeeList = [] as Array<Employee> ;
  employeeAttendance = {} as EmployeeAttendance;
  employeeAttendanceList = [] as Array<EmployeeAttendance>
  attendance = ['Present' , 'Work From Home (WFH)' , 'Half Day' , 'Absent' , 'Leave']
  status : string = '';
  staticDate : any;
  date : any;
  time : any;
  max : any ;
  min : any;


  constructor(
    private dataService: DataService ,
    private cdr : ChangeDetectorRef,
    private router : Router,
    private fb : AngularFirestore,
    private datePipe: DatePipe,
  ) { 
    this.maxDate()    
    this.minDate()
   }

  ngOnInit(): void {
    this.fatchUsersList();
  }

  fatchUsersList(){
    this.dataService.getEmployees().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          let data = {...doc.data() as Employee , id : doc.id}
          this.employeeList.push(data)
          this.cdr.detectChanges();
      });
      console.log(this.employeeList);
      this.cdr.detectChanges();
    })
    this.cdr.detectChanges();
  }

  getDateFromCalender(e : any){
    console.log(e.target.value)
    this.date = e.target.value;
    this.fatchAttendanceStatus(this.date)
  }

  fatchAttendanceStatus(e : any){
    this.employeeList.forEach(res=>{
      res.status = '';
      res.date = '';
      res.time = '';
    })
    // console.log(e.target.value)
    // this.date = e.target.value
    this.staticDate = e;
    // let empId : any = []
    // this.employeeList.forEach(res=>{
    //   this.convertDate()
    //   empId.push(this.date + ' + ' + res.employeeId )
    // })

    this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          // let data = {...doc.data() as EmployeeAttendance , id : doc.id}
          // empId.forEach((resp  : any)=>{
          //   if(resp == doc.id ){

          //     this.employeeAttendanceList.push(data)
          //   }
          // })
          this.employeeList.forEach(res=>{
            this.convertDate()
            let id = e + ' + ' + res.employeeId ;
            if(doc.id == id){
              let data = doc.data() as EmployeeAttendance;
              // console.log(data.status)
              res.status = data.status
              res.time = data.time
              res.date = data.date
            }            
          })
          this.cdr.detectChanges();
      });
      this.cdr.detectChanges();
    })
    // console.log(this.employeeAttendanceList);
    this.cdr.detectChanges();
  }

  editEmployeeAttendance(data : Employee){
    // let details = JSON.stringify(data);
    this.router.navigate(['/dashboard/employeeAttendance' ] )
  }

  maxDate(){
    let date = new Date(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    this.max = [date.getFullYear(), month, day].join("-");
    // console.log(this.max)
  }

  minDate(){
    let date = new Date()
    date.setDate(date.getDay() - 3)
    let month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    this.min = [date.getFullYear(), month, day].join("-");
    // console.log(this.min)
  }

  convertDate() {
    let date = new Date(),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
      this.date = [date.getFullYear(), month, day].join("-");
      this.time = this.datePipe.transform(date , 'hh:mm:ss')
  }

  statusOfEmployee(event : string , data : Employee  ){
    this.employeeAttendance.employeeId = data.employeeId;
    this.employeeAttendance.employeeName = data.firstName + ' ' + data.lastName;
    // this.convertDate();
    this.employeeAttendance.date = this.staticDate;
    this.employeeAttendance.time = this.time;
    if(data.status == event || data.status == null || data.status == '' ){
      this.employeeAttendance.status = event;
      console.log(data.employeeId + ' + ' + this.staticDate )
      console.log(this.employeeAttendance)
      this.fb.collection('attendance').doc(this.staticDate + ' + ' + data.employeeId ).set(this.employeeAttendance)  
      this.fatchAttendanceStatus(this.staticDate);
      // this.fb.collection('attendance').doc(this.employeeAttendance.id).update(this.employeeAttendance);
    }
    else{
      // console.log(data)
      let id = this.staticDate + ' + ' + this.employeeAttendance.employeeId ;
      // console.log(this.employeeAttendance)
      this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {        
              if(doc.id == id){
                let data = doc.data() as EmployeeAttendance;
                data.status = event;   
                data.time = this.time;  
                data.employeeName = this.employeeAttendance.employeeName ;
                console.log(data)
                this.fb.collection('attendance').doc(id).update(data);
                this.fatchAttendanceStatus(this.staticDate);                
              }
            this.cdr.detectChanges();
        });
        this.cdr.detectChanges();
      })
    }
  }

  report(){
    // let present = 0;
    // let Absent = 0;
    // let halfDay = 0;
    // let Leave = 0;
    this.employeeList.forEach(res=>{
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

    let firstDay = new Date(y, m, 1) ,
        fmonth = ("0" + (firstDay.getMonth() + 1)).slice(-2),
        fday = ("0" + firstDay.getDate()).slice(-2) ;
    let newfDate = [firstDay.getFullYear(), fmonth, fday].join("-"); 

    let lastDay = new Date(y, m + 1, 0) ,
    lmonth = ("0" + (lastDay.getMonth() + 1)).slice(-2),
    lday = ("0" + lastDay.getDate()).slice(-2);
    let newlDate = [lastDay.getFullYear(), lmonth, lday].join("-"); 

    let f = new Date(newfDate).getDate() ,
        l = new Date(newlDate).getDate() ;
    let localArr : any = [];
    for(let i = f ; i <= l ; i++){
      // localArr.push(newfDate);
      // let arr : any = [];        
      this.employeeList.forEach(res=>{
        let id = newfDate + ' + ' + res.employeeId;

        this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (id == doc.id) {
              let data = doc.data() as EmployeeAttendance
              if(res.employeeId == data.employeeId)
              {
                if (data.status == 'Present') {
                  if(!res.present){
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
                  if(!res.absent){
                    res.absent = 0
                  }
                  res.absent = res.absent + 1;
                }
                if (data.status == 'Half Day') {
                  if(!res.halfDay){
                    res.halfDay = 0
                  }
                  res.halfDay = res.halfDay + 1;
                }
                if (data.status == 'Leave') {
                  if(!res.leave){
                    res.leave = 0
                  }
                  res.leave = res.leave + 1;
                }
              }
                // console.log("Employee Name=",data?.employeeName,",Total Present=",present)
              }
            });
            // present = 0; Absent = 0; halfDay = 0; Leave = 0;
          })
          // localArr.push(id)
        }) 
      firstDay.setDate(firstDay.getDate() + 1) ;
      let newfirstDay = new Date(firstDay) ,
      newfmonth = ("0" + (firstDay.getMonth() + 1)).slice(-2),
      newfday = ("0" + firstDay.getDate()).slice(-2) ;
      let a = [newfirstDay.getFullYear(), newfmonth, newfday].join("-");
      newfDate = a;     
      // console.log(firstDay)
    }
    // console.log(localArr)

    // let arr : any = [];
    // this.employeeList.forEach(res=>{
    //   let id = a + ' + ' + res.employeeId;
    //   arr.push(id)
    // })
    // console.log(arr)

    // let present = 0;
    // let Absent = 0;
    // let halfDay = 0;
    // let Leave = 0;

    // this.employeeList.forEach(res=>{   
    //   this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       let data = doc.data() as EmployeeAttendance
    //       if (res.employeeId == data.employeeId) {
    //         if (data.status == 'Present') {
    //           present = present + 1;
    //         }
    //         if (data.status == 'Absent') {
    //           Absent = Absent + 1;
    //         }
    //         if (data.status == 'Half Day') {
    //             halfDay = halfDay + 1;
    //         }
    //         if (data.status == 'Leave') {
    //           Leave = Leave + 1;
    //         }
    //       }
    //     });
    //     console.log(res.employeeId, '  Present =>>>>', present  , '   Absent =>>>>', Absent , '    Half Day =>>>>', halfDay , '   Leave =>>>>', Leave )
    //     present = 0; Absent = 0; halfDay = 0; Leave = 0;
    //   })

    // })

    // this.dataService.getEmployeesAttendance().subscribe((querySnapshot) => {

    //   querySnapshot.forEach((doc) => {
    //     let data = doc.data() as EmployeeAttendance
    //     console.log(data)
    //       // this.employeeList.forEach(res=>{
    //       //   res.present = 0           
    //       // })
    //       this.employeeList.forEach(res=>{
    //         if(res.employeeId == data.employeeId){
    //           // console.log(data.status)
    //           if(data.status == 'Present'){
    //             count = count + 1 ;                
    //           }
    //           console.log( res.employeeId , '=>>>>', count)
    //         }           
    //       })
    //       this.cdr.detectChanges();
    //   });
    //   this.cdr.detectChanges();
    //   console.log(count)
    // })
    this.cdr.detectChanges(); 
  }

  viewReport(){
    this.employeeList.forEach(res=>{
      // console.log(res.employeeId , "present=>>" , res.present)
      console.log(res.employeeId, '  Present =>>>>', res.present  , '   Absent =>>>>', res.absent , '    Half Day =>>>>', res.halfDay , '   Leave =>>>>', res.leave )
    })
    console.log("End")
  }

}
