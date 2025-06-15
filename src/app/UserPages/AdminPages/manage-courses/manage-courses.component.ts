import { Component } from '@angular/core';
import { Course } from '../../../model/course.model';
import { CourseService } from '../../../services/Course/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-manage-courses',
  standalone: false,
  
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent {
  currentCourses = new BehaviorSubject<Course[]>([]);

  constructor(private courseService: CourseService,private router: Router,private route: ActivatedRoute) {
    this.courseService.getCoursesListObservable().subscribe(courses => {
      this.currentCourses.next(courses);
    });
    console.log(this.currentCourses.value.length);
  }
  
  onClickArchive(courseName : string,archiveStatus:boolean):void {
    this.courseService.archiveCourse(courseName,archiveStatus);
  }
}
