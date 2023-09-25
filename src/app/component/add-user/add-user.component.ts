import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/structure/firebase-collections';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  list = [] as Array<User>;
  userName !: string;
  passWord !: string;
  id !: string;

  constructor(
    private fb : AngularFirestore,
    private dataService: DataService ,
    private cdr : ChangeDetectorRef,
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
    name : new FormControl(null , Validators.required),
    password : new FormControl(null , Validators.required)
  });

  addUser(){
    if(this.myForm.valid)
    this.fb.collection('user').doc().set({
          email : this.myForm.value.name,
          password : this.myForm.value.password
   }) 
   this.myForm.reset();
   this.list = [];
   this.fatchUsersList();
  }

  getUserData(data : User){
    this.userName = data.email;
    this.passWord = data.password;   
    this.id = data.id; 
  }

  update(){
    this.fb.collection('user').doc(this.id).update({email : this.userName , password : this.passWord})
    this.myForm.reset();
    this.list = []
    this.fatchUsersList();
  }

  deleteUser(data : User){
    this.fb.collection('user').doc(data.id).delete();
    this.list = []
    this.fatchUsersList();
  }

}
