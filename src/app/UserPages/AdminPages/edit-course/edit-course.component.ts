import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Course } from '../../../model/course.model';
import { CourseService } from '../../../services/Course/course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-course',
  standalone: false,
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})

export class EditCourseComponent implements OnInit {

  course!: Course;
  courseForm: FormGroup<any> = new FormGroup({});  submit: boolean = false;
  existStatus: string = '';
  succeeded: string = '';
  courseName: string = '';

  spareCourse: Course = {
    name: '',
    instructor: '',
    id: '',
    description: '',
    archived: false,
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    // Get the course name from the route parameter
    this.courseName = this.route.snapshot.paramMap.get('courseName') || '';

    console.log('EditCourseComponent loaded with courseName:', this.courseName);

      this.course =  this.courseService.getCourseByName(this.courseName);
    

    // Initialize the form with the course data
    this.courseForm = this.fb.group({
      insName: [this.course.instructor, Validators.required],
      courseName: [this.course.name, [Validators.required]],
      courseId: [this.course.id, [Validators.required]],
      courseDescription: [this.course.description, Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    const { insName, courseName, courseId, courseDescription } = this.courseForm.value;
    this.submit = true;
    this.existStatus = '';
    this.succeeded = '';
    let oldName = this.course.name;

    if (this.courseForm.valid) {
      if (
        this.course.name === courseName &&
        this.course.description === courseDescription &&
        this.course.instructor === insName &&
        this.course.id === courseId
      ) {
        this.existStatus = 'Nothing Changed';
      } else {
        this.spareCourse.instructor = insName;
        this.spareCourse.id = courseId;
        this.spareCourse.description = courseDescription;
        this.spareCourse.name = courseName;

        const dataValidation =  await this.courseService.editCourseData(this.spareCourse, oldName);

        if (dataValidation === 0) {
          this.existStatus = '';
          this.courseForm.reset();
          this.succeeded = 'Course Edited Successfully';
          this.submit = false;
        } else if (dataValidation === 1) {
          this.existStatus = 'Course Name already Exists';
        } else if (dataValidation === 2) {
          this.existStatus = 'Course ID already Exists';
        } else if (dataValidation === 3) {
          this.existStatus = 'Course Name & ID already Exist';
        } else {
          this.existStatus = 'Please fill all the required fields and select files';
          this.succeeded = '';
        }
      }
    }
  }
}
