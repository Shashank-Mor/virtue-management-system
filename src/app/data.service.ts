import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root',
})
export class DataService {
  data!: AngularFirestoreCollection;
//https://stackoverflow.com/questions/49067294/angular-firestore-get-document-data-and-assign-to-variable?rq=1
  constructor(public afs: AngularFirestore) {
    // this.items = this.afs.collection('items').valueChanges();
    // this.save();
    // this.items = this.afs.collection(FirebaseCollections.USER).snapshotChanges();
  }

  getData() {
    return this.afs.collection('user').get()
  }

  getEmployees() {
    return this.afs.collection('employee').get()
  }

  getEmployeesAttendance() {
    return this.afs.collection('attendance').get()
  }

  // save() {
  //   this.afs.collection(FirebaseCollections.USER).add({ firstname: 'hitesh' });
  // }
}
