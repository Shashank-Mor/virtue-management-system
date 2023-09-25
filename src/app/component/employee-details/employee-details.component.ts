import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/structure/firebase-collections';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employee = {} as Employee;
  details : any;
  imageName = "/images" + this.employee.firstName + this.employee.lastName;;
  imagePath !: String ;
  selectedImage : any;
  isSameAsAboveAddress : boolean = false;

  constructor(
    private fs : AngularFireStorage,
    private fb : AngularFirestore,
    private router : Router,
    private route : ActivatedRoute,
  ) { 
    let details = this.route.snapshot.paramMap.get("details");
    this.details = details;
    this.employee = JSON.parse(this.details)
    console.log(this.employee)
    if(!this.employee){
      this.employee = {} as Employee;
    }
    if(!this.employee.imagePath){
      this.employee.imagePath = "./assets/images/no-data.png"
    }
    if(!this.employee.addressStreetNo){
      this.employee.addressStreetNo = ''
    }
    if(!this.employee.addressCity){
      this.employee.addressCity = ''
    }
    if(!this.employee.addressState){
      this.employee.addressState = ''
    }
    if(!this.employee.addressPinCode){
      this.employee.addressPinCode = ''
    }
    if(!this.employee.addressCountry){
      this.employee.addressCountry = ''
    }
    if(!this.employee.permanentAddressStreetNo){
      this.employee.permanentAddressStreetNo = ''
    }
    if(!this.employee.permanentAddressCity){
      this.employee.permanentAddressCity = ''
    }
    if(!this.employee.permanentAddressState){
      this.employee.permanentAddressState = ''
    }
    if(!this.employee.permanentAddressPinCode){
      this.employee.permanentAddressPinCode = ''
    }
    if(!this.employee.permanentAddressCountry){
      this.employee.permanentAddressCountry = ''
    }
  }

  ngOnInit(): void {
  }

  chooseFile(e : any){
    this.imagePath = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.selectedImage = reader.result;
       this.employee.imagePath = this.selectedImage;
    }, false);
    // console.log(this.employee.imagePath)
 
    if (e.target.files[0]) {
       this.selectedImage = reader.readAsDataURL(e.target.files[0]);
       this.employee.imagePath = this.selectedImage;
    }
  }

  upload(){
    if(this.imagePath)
    this.fs.upload( this.imageName , this.imagePath)
    // console.log(this.imagePath)
  }

  getImage(){
    let storageRef =  this.fs.storage.ref()
    storageRef.listAll().then(result=> {
      result.items.forEach(imageRef =>{
        imageRef.getDownloadURL().then(url=> {
          // console.log(url);
          this.selectedImage = url;
          this.employee.imagePath = this.selectedImage;
        })
      }); 
    })
  }

  sameAddress(){
    this.isSameAsAboveAddress = !this.isSameAsAboveAddress ;
    if(this.isSameAsAboveAddress == true)
    {
      console.log(true)
      this.employee.permanentAddressStreetNo = this.employee.addressStreetNo ;
      this.employee.permanentAddressCity = this.employee.addressCity ;
      this.employee.permanentAddressState = this.employee.addressState ;
      this.employee.permanentAddressPinCode = this.employee.addressPinCode ;
      this.employee.permanentAddressCountry = this.employee.addressCountry ;
    }
    else{
      console.log(false)
      this.employee.permanentAddressStreetNo = ''
      this.employee.permanentAddressCity = ''
      this.employee.permanentAddressState = ''
      this.employee.permanentAddressPinCode = ''
      this.employee.permanentAddressCountry = ''
    }
  }

  handleClick(){
    document.getElementById('upload')?.click();
  }

  update(){
    this.upload();
    this.getImage();
    console.log(this.employee)
    this.fb.collection('employee').doc(this.employee.id).update(this.employee);
    this.router.navigate(['dashboard/employee-list'])
  }

  submit(){
    this.upload();
    this.getImage();
    this.fb.collection('employee').doc().set(this.employee)  
    this.router.navigate(['dashboard/employee-list'])
  }

}
