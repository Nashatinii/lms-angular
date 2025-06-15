import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../services/Course/course.service';
import { submittedAssignments } from '../../../model/course.model';

@Component({
  selector: 'app-received-submissions',
  templateUrl: './received-submissions.component.html',
  styleUrls: ['./received-submissions.component.css'],
})
export class ReceivedSubmissionsComponent implements OnInit {
  showGradeInput: { [key: number]: boolean } = {};
  submissions: submittedAssignments[] = []; // Store filtered submissions
  instructorName: string = ''; // Instructor name from localStorage

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.instructorName = localStorage.getItem('userName') || ''; // Get instructor name from localStorage
    this.fetchSubmissions(); // Fetch submissions on component load
  }

  // Fetch assignments and filter by instructor
  async fetchSubmissions(): Promise<void> {
    try {
      const assignments = await this.courseService.getAssignments(); // Fetch all assignments
      const filteredSubmissionsPromises = assignments.map(async (assignment) => {
        // Fetch the course details by name
        const course = await this.courseService.getCourseByName(assignment.courseName);

        // Check if the course's instructor matches the logged-in instructor
        if (course && course.instructor === this.instructorName) {
          return assignment; // Return assignment if instructor matches
        } else {
          return null; // Return null if instructor does not match
        }
      });

      // Wait for all promises to resolve and filter out null values
      const filteredSubmissions = await Promise.all(filteredSubmissionsPromises);
      this.submissions = filteredSubmissions.filter((submission) => submission !== null) as submittedAssignments[]; // Only keep valid assignments
    } catch (error) {
      console.error('Error filtering submissions:', error);
    }
  }

  // Toggle visibility of grade input for a specific student in an assignment
  toggleGradeInput(index: number) {
    this.showGradeInput[index] = !this.showGradeInput[index];
  }

  // Validate and submit grade for a specific student
  submitGrade(index: number, studentName: string, grade: string): void {
    if (/^\d+$/.test(grade)) { // Only allows numeric input for grade
      const submission = this.submissions[index];
      const student = submission.students.find(student => student.studentName === studentName);

      if (student) {
        // Update grade in Firebase for the specific student
        this.courseService
          .updateAssignmentGrade(submission.courseName, submission.assignmentTitle, studentName, Number(grade))
          .then(() => {
            alert(`Grade for ${studentName} updated: ${grade}`);
            // this.showGradeInput[index][studentName] = false; // Hide grade input after submitting the grade

            // Now, update the progress in Student_Progress collection
            this.updateStudentProgress(studentName, submission.courseName, Number(grade));
          })
          .catch((error) => console.error('Error updating grade:', error));
      } else {
        alert('Student not found in the submission');
      }
    } else {
      alert('Please enter a valid number for the grade.'); // Alert for invalid grade input
    }
  }

  // Method to update student progress based on the grade
  async updateStudentProgress(studentName: string, courseName: string, grade: number): Promise<void> {
    try {
      // Assuming you have a method in courseService to update progress for a student
      await this.courseService.updateStudentProgress(studentName, courseName, grade); // Update progress based on the grade
      console.log(`Progress for ${studentName} in ${courseName} updated to ${grade}`);
    } catch (error) {
      console.error('Error updating student progress:', error);
    }
  }
}
