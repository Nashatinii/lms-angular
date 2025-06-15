import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/User/user.service';
import { Course } from '../../../model/course.model';
import { CourseService } from '../../../services/Course/course.service';

@Component({
  selector: 'app-my-learning',
  standalone: false,
  
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.css'
})
export class MyLearningComponent {

//   studentCourses: string[] = []; // Array of course names
//   courses: Course[] = [];        // Array of Course objects
//   currentUserName: string | null = null;

//   constructor(
//     private courseService: CourseService,
//   ) {}

//   async ngOnInit() {
//     try {
//       this.currentUserName = localStorage.getItem('userName');
//     } catch (error) {
//       console.error(error);
//       return;
//     }

//     this.courseService.getAssignedListObservable().subscribe(assignments => {
//       // Step 1: Extract array of course names for the current user
//       this.studentCourses = assignments
//         .filter(assignment => assignment.studentName === this.currentUserName)
//         .flatMap(assignment => assignment.courseName);

//       // Step 2: Create the courses array using getCourseByName
//       this.courses = this.studentCourses.map(courseName => this.courseService.getCourseByName(courseName));
//     });
//   }
}
