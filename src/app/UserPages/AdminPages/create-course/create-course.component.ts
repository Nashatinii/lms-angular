import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUser } from '../../../model/user.model';
import { CourseService } from '../../../services/Course/course.service';
import { UserService } from '../../../services/User/user.service';

@Component({
  selector: 'app-create-course',
  standalone:false,
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  courseForm: FormGroup;
   submit: boolean = false;
   existStatus: string = '';
   succeeded: string = '';
   instructors: string[] = [];

   constructor(private userService : UserService,private fb: FormBuilder, private courseService: CourseService) {
     
     this.courseForm = this.fb.group({
       insName: ['', Validators.required],
       courseName: ['', [Validators.required]], 
       courseId: ['', [Validators.required, this.noSpecialCharsValidator]],
       courseDescription: ['', Validators.required],
     });
   }

   async ngOnInit(): Promise<void> {
    try {
      const users: AppUser[] = await this.userService.getUsersList();
      this.instructors = users
        .filter((user: AppUser) => user.role === 'instructor')
        .map((user: AppUser) => user.name);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

 
   noSpecialCharsValidator(control: AbstractControl) {
     const forbiddenChars = /[^a-zA-Z0-9]/;
     if (control.value && forbiddenChars.test(control.value)) {
       return { forbiddenChars: true };
     }
     return null;
   }
 
   onSubmit(): void {
     const {insName,courseName,courseId,courseDescription} = this.courseForm.value;
     this.submit = true;
     this.existStatus = '';
     this.succeeded = '';
     if (this.courseForm.valid) {
 
       const dataValidation = this.courseService.validateCourseData({name:courseName,id:courseId,description:courseDescription,instructor:insName,archived:false});
 
       if(dataValidation == 0){
         this.existStatus = '';
         this.courseForm.reset();
         this.succeeded='Course Added Successfully';
         this.submit = false;
       }
       else if (dataValidation == 1){
         this.existStatus = 'Course Name already Exist';
       }
       else if (dataValidation == 2){
         this.existStatus = 'Course ID already Exist';
       }
       else if(dataValidation == 3){
         this.existStatus = 'Course Name & ID already Exist';
       }
     } 
     else {
       this.existStatus = 'Please fill all the required fields';
       this.succeeded = '';
     }
   }
 }
 