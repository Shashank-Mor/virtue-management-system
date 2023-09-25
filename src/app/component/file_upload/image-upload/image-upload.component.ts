import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { tuiPure } from '@taiga-ui/cdk';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable, of, timer } from 'rxjs';
import {map, mapTo, share, startWith, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

  @Output() uploadedImageId: EventEmitter<string> = new EventEmitter();

  constructor(
  ) {   }

  ngOnInit(): void {
  }

  readonly control = new FormControl();

  @tuiPure
  get loading$(): Observable<ReadonlyArray<File>> {
    return this.requests$.pipe(
      map((file) => (
        file instanceof File ? [file] : []

        )
        ),
      startWith([])
      
    );

  }

  @tuiPure
  get rejected$(): Observable<ReadonlyArray<TuiFileLike>> {
    return this.requests$.pipe(
      map((file) =>
        file instanceof RejectedFile ? [convertRejected(file)] : []
      ),
      tap(({ length }) => {
        if (length) {
          this.control.setValue(null);
        }
      }),
      startWith([])
    );
  }

  @tuiPure
  private get requests$(): Observable<RejectedFile | File | null> {
    return this.control.valueChanges.pipe(
      switchMap((file) =>
        file ? this.serverRequest(file).pipe(startWith(file)) : of(null)
      ),
      share()
    );
  }

  private serverRequest(file: File): Observable<RejectedFile | File | null | undefined> {
    console.log("image file" ,file);
    const delay = Math.round(Math.random() * 5000 + 500);
    let result;// = delay % 2 ? null :

    // const formData= new FormData();
    // const payload = {
    //       bucketName: 'VIRTUE_USER_UPLOADS',
    //       dirPrefix: 'GENERAL_DOCS',
    //       purpose: 'file upload',
    //     };
    // formData.append('file', file);
    // formData.append('payload', JSON.stringify(payload));
    // this.httpser.upload<any>('fileStorage', formData).then((res)=>{
    //   console.log("File Upload Id",res);
    //   result = file;
    //   this.uploadedImageId.emit(res.id);
    // }, error => {
    //   console.log(error);
    //   result = new RejectedFile(file, 'Server responded for odd number of time');
    // });  

    return timer(delay).pipe(mapTo(result));
  }

}

class RejectedFile {
  constructor(readonly file: TuiFileLike, readonly reason: string) {}
}

function convertRejected({ file, reason }: RejectedFile): TuiFileLike {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    content: reason,
  };
}