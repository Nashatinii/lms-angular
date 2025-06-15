import { Component } from '@angular/core';
import { Course } from '../../../model/course.model';
import { UserService } from '../../../services/User/user.service';
import { CourseService } from '../../../services/Course/course.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-my-courses-student',
  templateUrl: './my-courses-student.component.html',
  styleUrls: ['./my-courses-student.component.css']
})
export class MyCoursesStudentComponent {

  studentCourses: string[] = []; // Array of course names
  courses: Course[] = [];        // Array of Course objects
  currentUserName: string | null = null;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('ngOnInit my');
    try {
      this.currentUserName = localStorage.getItem('userName');
    } catch (error) {
      console.error(error);
      return;
    }

    this.courseService.getAssignedListObservable().subscribe(assignments => {
      // Step 1: Extract array of course names for the current user
      this.studentCourses = assignments
        .filter(assignment => assignment.studentName === this.currentUserName)
        .flatMap(assignment => assignment.courseName);

      // Step 2: Create the courses array using getCourseByName
      this.courses = this.studentCourses.map(courseName => this.courseService.getCourseByName(courseName));
    });
  }

  
}
