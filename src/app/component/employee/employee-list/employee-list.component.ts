import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Employee } from 'src/app/structure/firebase-collections';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employeeList = [] as Array<Employee> ;
  IsLoadLoader = true;
  IsLoadOrganization = false;

  constructor(
    private router : Router,
    private dataService: DataService ,
    private cdr : ChangeDetectorRef,
    private fb : AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.fatchUsersList()
  }

  addEmployeeDetails(){
    let details = JSON.stringify('')
    this.router.navigate(['dashboard/employee' , details ])
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
    this.IsLoadLoader = false;
    this.IsLoadOrganization = true;
  }

  editEmployee(data : Employee ){
    let details = JSON.stringify(data);
    this.router.navigate(['/dashboard/employee' , details] )
  }

  deleteEmployee( data : Employee){
    let index = this.employeeList.indexOf(data);
    this.fb.collection('employee').doc(data.id).delete();
    this.employeeList.splice(index , 1)
    this.cdr.detectChanges()
  }

}
