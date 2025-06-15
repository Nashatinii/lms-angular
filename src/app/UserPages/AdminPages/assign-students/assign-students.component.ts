import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/User/user.service';
import { CourseService } from '../../../services/Course/course.service';
import { AppUser } from '../../../model/user.model';
import { Course, assignToStudents } from '../../../model/course.model';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-assign-students',
  templateUrl: './assign-students.component.html',
  styleUrls: ['./assign-students.component.css']
})
export class AssignStudentsComponent implements OnInit {
  // Variables
  students: AppUser[] = []; // all students
  selectedCourseName: string = ''; 
  done : boolean = false;
  enrolled: boolean = false;
  // assignAll: boolean = false;
  moveToEnroll:boolean = false;
  moveToUnEnroll:boolean = false;
  toggleDisabled: boolean = true;
  showErrorMessage : boolean = false;
  selectedCourse: Course = {
    name: '',
    instructor: '',
    id: '',
    description: '',
    archived: false,
  };


  // courses: Course[] = []; // for selection
  notEnrolledStudents: string[] = []; // left box
  enrolledStudents: string[] = []; // right box

  // assignedCourses: assignToStudents[] = [];
  selectedStudents: string[] = []; // final right box

  courseSelection : FormGroup;
  assignAllStudents = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.courseSelection = this.fb.group({
      courseChosed: ['', Validators.required],
    });
      
  }
  courses = new BehaviorSubject<Course[]>([]);
  assignedCourses = new BehaviorSubject<assignToStudents[]>([]);
  async ngOnInit(): Promise<void> {
    // this.courses = this.courseService.getCoursesList(); //observable
    // this.courseService.getCoursesListObservable().subscribe
    
    
    // Wait for the asynchronous user list
    try {
      this.courseService.getCoursesListObservable().subscribe(courses => {
        this.courses.next(courses);
      });
      this.courseService.getAssignedListObservable().subscribe(assignments => {
        this.assignedCourses.next(assignments);
      });
      this.students = await this.userService.getUsersList();
      this.students = this.students.filter(user => user.role === 'student');
      console.log(this.students.length);
      for (let i = 0; i < this.students.length;i++){
        console.log(this.students[i].role);
      }
      // this.updateStudentLists();
      // console.log(this.students);
      // this.assignedCourses = this.courseService.getAssignedList(); //observable
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  handleToggleAttempt(event: Event) {
    console.log('handle');
    if (this.toggleDisabled) {
      event.preventDefault(); // Prevent the toggle's default behavior
      this.showErrorMessage = true;

      // Optional: Hide the error message after a delay
      setTimeout(() => {
        this.showErrorMessage = false;
      }, 3000);
    }
  }

  updateStudentLists(): void {
    // console.log('updateStudentLists');
    const enrolled = this.assignedCourses.value
      .filter(assignment => assignment.courseName.includes(this.selectedCourse.name))
      .map(assignment => assignment.studentName);

    this.notEnrolledStudents = this.students.
    filter(student => student.role === 'student'  && !enrolled.includes(student.name))
      .map(student => student.name);
    
    this.enrolledStudents = this.students
      .filter(student => student.role === 'student' && enrolled.includes(student.name))
      .map(student => student.name);
  }

  onCourseSelect(): void {
    this.toggleDisabled = false;
    const { courseChosed } = this.courseSelection.value;
    this.selectedCourse = courseChosed;
    // console.log("Selected Course:", this.selectedCourse);
    this.selectedCourseName = this.selectedCourse?.name || '';
    this.updateStudentLists();
  }

  toggleAssignAll(): void {
    console.log("Toggle");
    // this.assignAll = true;
    if (this.assignAllStudents) {
      this.enrolledStudents = [...this.enrolledStudents, ...this.notEnrolledStudents];
      this.notEnrolledStudents = [];
    } 
    // else {
    //   this.moveToEnrolled();
    // }
  }

  moveToEnrolled(): void {
    this.moveToEnroll = true;
    if (!this.selectedCourse) return;

    // this.selectedStudents.forEach(student => this.assignStudent(student));

    this.enrolledStudents = [...this.enrolledStudents, ...this.selectedStudents];
    this.notEnrolledStudents = this.notEnrolledStudents.filter(student => !this.selectedStudents.includes(student));
    this.selectedStudents = [];

    if (this.notEnrolledStudents.length === 0) {
      this.assignAllStudents = true;
    }
  }

  moveToNotEnrolled(): void {
    this.moveToUnEnroll = true;
    if (!this.selectedCourse) return;

    this.selectedStudents.forEach(student => {
      // Call assignStudent with unEnroll = true
      this.assignStudent(student, true);
    });

    this.notEnrolledStudents = [...this.notEnrolledStudents, ...this.selectedStudents];
    this.enrolledStudents = this.enrolledStudents.filter(student => !this.selectedStudents.includes(student));
    this.selectedStudents = [];

    if (this.enrolledStudents.length === 0) {
      this.assignAllStudents = false;
    }
  }

  async finalizeAssignments(): Promise<void> {
    this.done = true;
    
    // Assign each student
    this.enrolledStudents.forEach(student => this.assignStudent(student));
  
    console.log('Final list to update:', this.assignedCourses.value);
  
    // Update Firestore and check the response
    const success = await this.courseService.updateAssignList(this.assignedCourses.value);
  
    // if (success) {
    //   this.enrolled = true;
    //   console.log("Enrollment completed successfully!");
    //   // this.enrolled = 
    //   // alert("Enrollment completed successfully! 🎉");
    // } else {
    //   this.enrolled = false;
    //   console.error("Enrollment failed. Please try again.");
    //   // alert("Enrollment failed. Please try again. ⚠️");
    // }
  }
  

  // assignStudent(studentName: string): void {
  //   let studentAssignment = this.assignedCourses.value.find(assign => assign.studentName === studentName);
  
  //   if (studentAssignment) {
  //     if (!studentAssignment.courseName.includes(this.selectedCourse.name)) {
  //       studentAssignment.courseName.push(this.selectedCourse.name);
  //     } else {
  //       console.log("Student already enrolled");
  //     }
  //   } else {
  //     this.assignedCourses.value.push({
  //       studentName,
  //       courseName: [this.selectedCourse.name] // Ensure courseName is an array
  //     });
  //   }
  // }
  assignStudent(studentName: string, unEnroll: boolean = false): void {
    // Find the student assignment in the list
    let studentAssignment = this.assignedCourses.value.find(assign => assign.studentName === studentName);
  
    if (unEnroll) {
      // Un-enroll logic: Remove the course from the student's assignment
      if (studentAssignment) {
        studentAssignment.courseName = studentAssignment.courseName.filter(course => course !== this.selectedCourse.name);
        console.log(`Removed course ${this.selectedCourse.name} for ${studentName}`);
  
        // Remove the entire assignment if no courses are left
        if (studentAssignment.courseName.length === 0) {
          const updatedAssignments = this.assignedCourses.value.filter(assign => assign.studentName !== studentName);
          this.assignedCourses.next(updatedAssignments);
          }
      }
    } else {
      // Enroll logic: Add the course for the student
      if (studentAssignment) {
        if (!studentAssignment.courseName.includes(this.selectedCourse.name)) {
          studentAssignment.courseName.push(this.selectedCourse.name);
          console.log(`Enrolled ${studentName} in course ${this.selectedCourse.name}`);
        } else {
          console.log("Student already enrolled");
        }
      } else {
        this.assignedCourses.value.push({
          studentName,
          courseName: [this.selectedCourse.name] // Ensure courseName is an array
        });
        console.log(`Enrolled ${studentName} in course ${this.selectedCourse.name}`);
      }
    }
  }
  
}
