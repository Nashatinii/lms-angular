import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/Course/course.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { submittedAssignments } from '../../../model/course.model';

@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.css'
})

export class CoursePageComponent implements OnInit {
  courseName: string = '';
  materials: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  studentName: string = '';
  submit: boolean = false;
  submit2: boolean = false;
  assignmentSubmission: FormGroup;
  submittedAssignments: submittedAssignments[] | null = [];

  constructor(private route: ActivatedRoute,private courseService: CourseService,private fb: FormBuilder) {
    this.studentName = localStorage.getItem('userName') || '';
    console.log('student name:', this.studentName);

    this.assignmentSubmission = this.fb.group({
      submittedUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }
  submitAssignment(materialTitle: string): void {
    if (this.assignmentSubmission.valid) {
      const newAssignment: submittedAssignments = {
        courseName: this.courseName,
        assignmentTitle: materialTitle,
        students: [
          {
            studentName: this.studentName,
            url: this.assignmentSubmission.value.submittedUrl,
            grade: -1,  // Default grade, can be updated later
          }
        ]
      };

      this.courseService.submitAssignment(newAssignment).then(() => {
        this.assignmentSubmission.reset();
        this.submit2 = false;
      }).catch(err => {
        console.error('Error submitting assignment:', err);
      });
    } else {
      this.submit2 = true; // Show validation errors
    }
  }

  onSubmit(): void {
    this.submit = true;
  }

  ngOnInit(): void {
    console.log('ng on init');  
    // const storedUserName = localStorage.getItem('userName');
    // this.studentName = localStorage.getItem('userName');
    this.courseName = this.route.snapshot.paramMap.get('course') || '';

    if (this.courseName) {
      this.courseService.getCourseMaterials(this.courseName).subscribe({
        next: (materials) => {
          this.materials = materials;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to fetch materials. Please try again later.';
          this.isLoading = false;
          console.error('Error fetching materials:', err);
        },
      });

      // Fetch submitted assignments
      // this.courseService.fetchSubmittedAssignments(this.studentName, this.courseName);
    } else {
      this.errorMessage = 'Course name not found in the route.';
      this.isLoading = false;
    }
  }
}
