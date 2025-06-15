import { Component } from '@angular/core';
import { Course } from '../../../model/course.model';
import { UserService } from '../../../services/User/user.service';
import { CourseService } from '../../../services/Course/course.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-manage-courses',
  standalone: false,
  
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent {
  instructorCourses = new BehaviorSubject<Course[]>([]);
  currentUserName : string | null = null;
   constructor(private userService : UserService,private courseService: CourseService,private router: Router) {
  }
  async ngOnInit() {
    try{
      const storedUserName = localStorage.getItem('userName');
      // console.log('local storage',storedUserName);
      this.currentUserName = storedUserName;
      // this.currentUserName = await this.userService.getUserName();
    }
    catch(error){
      console.error(error);
    }
    // console.log(this.currentUserName);
    this.courseService.getCoursesListObservable().subscribe(courses => {
      const filteredCourses = courses.filter(course => course.instructor === this.currentUserName);   
      this.instructorCourses.next(filteredCourses);
    });
    }

  // onClickArchive(courseName : string,archiveStatus:boolean):void {
  //   this.courseService.archiveCourse(courseName,archiveStatus);
  // }

  navigate(course: Course) {
    // this.courseService.setCourse(course);
    this.router.navigate(['/editCourse']);
  }
  
}
