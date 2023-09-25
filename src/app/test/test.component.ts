import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { User } from '../structure/firebase-collections';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {

  list = [] as Array<User>;

  constructor(
    private dataService: DataService ,
    private cdr : ChangeDetectorRef,
    private router : Router,
  ) {
    this.fatchUsersList();
  }

  ngOnInit(): void {  
  }

  fatchUsersList(){
    this.dataService.getData().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          let data = {...doc.data() as User , id : doc.id}
          this.list.push(data)
          this.cdr.detectChanges();    
      });
      console.log(this.list);
    })
  }

  myForm = new FormGroup({
    name : new FormControl(null),
    password : new FormControl(null)
  });

  onSubmit(){
    console.log(this.myForm.value)  
    this.list.forEach(res =>{
      if(this.myForm.value.name == res.email ){
        if (this.myForm.value.password == res.password){
          this.router.navigate(['dashboard']);
        } 
      }
    })
  }
}
