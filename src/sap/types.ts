export interface Student {
    name: string;
    school: string;
    program: string;
    rollno: string;
    semester: string;
    regno: string;
    img: string;
}

export interface Attendance {
    subject: string,
    facultyName: string,
    facultyCode: string,
    totalClasses: number,
    absents: number,
    excuses: number,
    presents: number,
    percentage: number,
    percentageWithExcuses: number
}

export interface StudentAttendance {
    student: Student,
    attendances: Attendance[]
}

export enum Session {
    Spring = "#WD77", Autumn = "#WD76"
}

export enum Year {
    Y20_21 = "#WD6C",
    Y21_22 = "#WD6D",
    Y22_23 = "#WD6E",
    Y23_24 = "#WD6F"
}