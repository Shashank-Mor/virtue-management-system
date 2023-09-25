

export enum FirebaseCollections{
    USER = 'user'
}

export interface User{
    id : string ;
    email : string ;
    password : string ;
}

export interface Employee{
    id ?: string ;
    employeeId ?: string;
    firstName ?: string;
    lastName ?: string;
    officialEmail ?: string;
    personnelEmail ?: string;
    contactNo ?: string;
    emergencyContactNo ?: string;
    addressStreetNo ?: string | null;
    addressCity ?: string | null;
    addressState ?: string | null;
    addressPinCode ?: string | null;
    addressCountry ?: string | null;
    permanentAddressStreetNo ?: string | null;
    permanentAddressCity ?: string | null;
    permanentAddressState ?: string | null;
    permanentAddressPinCode ?: string | null;
    permanentAddressCountry ?: string | null;
    imagePath ?: string | null;
    status ?: string | null;
    date ?: string | null;
    time ?: string | null;
    present ?:number | null;
    wfh ?: number | null;
    absent ?:number | null;
    halfDay ?:number | null;
    leave ?:number | null;
}

export interface EmployeeAttendance{
    id ?: string ;
    employeeId ?: string | null;
    employeeName ?: string | null;
    status ?: string | null ;
    date ?: string | null;
    time ?: string | null;
}

