import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc, query, where, arrayUnion } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Course, Material, assignToStudents, submittedAssignments, progress } from '../../model/course.model';
import { getDoc } from '@angular/fire/firestore'; // Ensure this is imported
import { from, tap } from 'rxjs'; // Import RxJS functions
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private CoursesListSubject = new BehaviorSubject<Course[]>([]);
  private assigned_courses_to_studentSubject = new BehaviorSubject<assignToStudents[]>([]);
  private num: number = 0;

  constructor(private router: Router, private firestore: Firestore) {
    console.log('constructor');
    this.getCoursesList();
    this.getAssignedList();
  }

  // Fetch the list of courses from Firestore and update the BehaviorSubject
  async getCoursesList(): Promise<void> {
    try {
      const coursesRef = collection(this.firestore, 'Courses');
      const snapshot = await getDocs(coursesRef);
      const courses = snapshot.docs.map(doc => ({
        ...(doc.data() as Course),
        courseName: doc.id,
      }));
      this.CoursesListSubject.next(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Return an observable of the courses list
  getCoursesListObservable(): Observable<Course[]> {
    return this.CoursesListSubject.asObservable();
  }

  // Fetch the list of assigned courses to students from Firestore and update the BehaviorSubject
  async getAssignedList(): Promise<void> {
    try {
      const enrollmentRef = collection(this.firestore, 'enrollment_students');
      const snapshot = await getDocs(enrollmentRef);
      const assignments = snapshot.docs.map(doc => ({
        ...(doc.data() as assignToStudents),
        studentName: doc.id,
      }));
      this.assigned_courses_to_studentSubject.next(assignments);
    } catch (error) {
      throw error;
    }
  }

  // Return an observable of the assigned courses list
  getAssignedListObservable(): Observable<assignToStudents[]> {
    return this.assigned_courses_to_studentSubject.asObservable();
  }

  // Add a new course to Firestore and update the BehaviorSubject
  async addCourse(newCourse: Course): Promise<void> {
    const coursesRef = collection(this.firestore, 'Courses');
    await setDoc(doc(coursesRef, newCourse.name), newCourse);
    const updatedCourses = [...this.CoursesListSubject.value, newCourse];
    this.CoursesListSubject.next(updatedCourses);
  }

  // Edit a course, handling name and ID uniqueness
  async editCourseData(newCourse: Course, name: string): Promise<number> {
    this.num = 0;
    const old_course = this.CoursesListSubject.value.find(course => course.name.toLowerCase() === name.toLowerCase());
    const CoursesList = this.CoursesListSubject.value.filter(course => course.name !== name);

    const nameExist = this.CoursesListSubject.value.some(course => course.name.toLowerCase() === newCourse.name.toLowerCase());
    const idExist = this.CoursesListSubject.value.some(course => course.id.toLowerCase() === newCourse.id.toLowerCase());

    if (nameExist) this.num = 1;
    if (idExist) this.num = 2;
    if (nameExist && idExist) this.num = 3;

    if (this.num !== 0) {
      if (old_course) {
        this.addCourse(old_course);
      }
      return this.num;
    }
    this.addCourse(newCourse);
    const oc = old_course as Course;
    this.deleteCourse(oc.name);

    return this.num;
  }

  // Delete a course from Firestore and update the BehaviorSubject
  async deleteCourse(name: string): Promise<void> {
    const coursesRef = collection(this.firestore, 'Courses');
    const docRef = doc(coursesRef, name);
    await deleteDoc(docRef);
    const updatedCourses = this.CoursesListSubject.value.filter(course => course.name !== name);
    this.CoursesListSubject.next(updatedCourses);
  }

  // Archive or unarchive a course
  async archiveCourse(name: string, archiveStatus: boolean): Promise<void> {
    const course = this.CoursesListSubject.value.find(course => course.name === name);
    if (course) {
      course.archived = archiveStatus;
      await updateDoc(doc(this.firestore, 'Courses', name), { archived: archiveStatus });
      this.CoursesListSubject.next([...this.CoursesListSubject.value]);
    }
  }

  // Get a course by name
  getCourseByName(name: string): Course {
    return this.CoursesListSubject.value.find(course => course.name === name) as Course;
  }

  // Validate course data
  validateCourseData(newCourse: Course): number {
    this.num = 0;

    const newCourseName = newCourse.name.trim().toLowerCase();
    const newCourseId = newCourse.id.trim().toLowerCase();

    const nameExist = this.CoursesListSubject.value.find(course =>
      course.name.trim().toLowerCase() === newCourseName
    );
    const idExist = this.CoursesListSubject.value.find(course =>
      course.id.trim().toLowerCase() === newCourseId
    );

    if (nameExist) this.num = 1;
    if (idExist) this.num = 2;
    if (nameExist && idExist) this.num = 3;

    if (this.num !== 0) return this.num;

    this.addCourse(newCourse);

    return this.num;
  }

  // Update the list of assigned courses
  async updateAssignList(newList: assignToStudents[]): Promise<void> {
    const assignedCoursesRef = collection(this.firestore, 'enrollment_students');

    const snapshot = await getDocs(assignedCoursesRef);
    for (const document of snapshot.docs) {
      await deleteDoc(doc(assignedCoursesRef, document.id));
    }

    for (const item of newList) {
      if (item.studentName) {
        const studentDocRef = doc(assignedCoursesRef, item.studentName);
        await setDoc(studentDocRef, {
          studentName: item.studentName,
          courseName: item.courseName || [],
        });
      }
    }

    this.assigned_courses_to_studentSubject.next(newList);
    alert('Enrollment completed successfully! 🎉');
  }

  // Add a material to a course
  // async addMaterial(courseName: string, material: Material): Promise<void> {
  //   const course = this.CoursesListSubject.value.find(course => course.name === courseName);
  //   if (course) {
  //     course.materials = course.materials || [];
  //     course.materials.push(material);
  //     await updateDoc(doc(this.firestore, 'Courses', courseName), { materials: course.materials });
  //     this.CoursesListSubject.next([...this.CoursesListSubject.value]);
  //   }
  // }

  async checkIfAssignmentTitleExistsAcrossCourses(title: string): Promise<boolean> {
    const coursesRef = collection(this.firestore, "Courses");
    const snapshot = await getDocs(coursesRef);
    const courses = snapshot.docs.map(doc => doc.data() as Course);
  
    // Loop through each course and check if the title exists in any of the course materials
    for (const course of courses) {
      if (course.materials) {
        const materialExists = course.materials.some(material => material.title.toLowerCase() === title.toLowerCase());
        if (materialExists) {
          return true;  // If the title exists in any course, return true
        }
      }
    }
    return false;  // Return false if no duplicate title is found
  }

  async addMaterial(courseName: string, material: Material): Promise<void> {
    // Check if the assignment title exists across all courses
    const titleExists = await this.checkIfAssignmentTitleExistsAcrossCourses(material.title);
  
    if (titleExists) {
      alert('An assignment with this title already exists in another course!');
      return;
    }
  
    // Proceed to add the material to the specific course
    const course = this.CoursesListSubject.value.find(course => course.name === courseName);
    if (course) {
      course.materials = course.materials || [];
      course.materials.push(material); // Add the material (assignment)
      await updateDoc(doc(this.firestore, 'Courses', courseName), { materials: course.materials });
      this.CoursesListSubject.next([...this.CoursesListSubject.value]);
    }
    alert('Material uploaded successfully!');
  }
  

  async fetchCourseMaterialsFromFirestore(courseName: string): Promise<Material[]> {
    try {
      const courseDocRef = doc(this.firestore, 'Courses', courseName); // Use doc for single reference
      const courseDoc = await getDoc(courseDocRef); // Fetch single document
  
      if (courseDoc.exists()) {
        const courseData = courseDoc.data() as Course;
        return courseData.materials || [];
      } else {
        console.warn('Course not found in Firestore');
        return [];
      }
    } catch (error) {
      console.error('Error fetching materials from Firestore:', error);
      return [];
    }
  }
  
  getCourseMaterials(courseName: string): Observable<Material[]> {
    const course = this.CoursesListSubject.value.find(c => c.name === courseName);
  
    if (course && course.materials) {
      return of(course.materials); // Use cached materials
    } else {
      return from(this.fetchCourseMaterialsFromFirestore(courseName)).pipe(
        tap((materials: Material[]) => {
          const updatedCourse = this.CoursesListSubject.value.find(c => c.name === courseName);
          if (updatedCourse) {
            updatedCourse.materials = materials;
            this.CoursesListSubject.next([...this.CoursesListSubject.value]);
          }
        })
      );
    }
  }
  
  

  // Delete a material from a course
  async deleteMaterial(courseName: string, materialTitle: string): Promise<void> {
    const course = this.CoursesListSubject.value.find(course => course.name === courseName);
    if (course) {
      course.materials = course.materials?.filter(material => material.title !== materialTitle) || [];
      await updateDoc(doc(this.firestore, 'Courses', courseName), { materials: course.materials });
      this.CoursesListSubject.next([...this.CoursesListSubject.value]);
    }
  }

  async submitAssignment(assignment: submittedAssignments): Promise<void> {
    const assignmentsRef = collection(this.firestore, "Assignments");
    const assignmentDocId = assignment.assignmentTitle;

    // Check if the document already exists
    const assignmentDocRef = doc(assignmentsRef, assignmentDocId);
    const assignmentDoc = await getDoc(assignmentDocRef);

    if (assignmentDoc.exists()) {
        // If the document exists, update it by appending the new student's data
        await updateDoc(assignmentDocRef, {
            students: arrayUnion(...assignment.students)
        });
        alert("Assignment updated successfully with new student(s)!");
    } else {
        // If the document does not exist, create a new one
        await setDoc(assignmentDocRef, assignment);
        alert("Assignment submitted successfully!");
    }
  }


  
  async updateAssignmentGrade(
    courseName: string,
    assignmentTitle: string,
    studentName: string | null,
    grade: number
  ): Promise<void> {
    const assignmentsRef = collection(this.firestore, "Assignments");
    const assignmentDocRef = doc(assignmentsRef, assignmentTitle);
  
    const assignmentDoc = await getDoc(assignmentDocRef);
    if (assignmentDoc.exists()) {
      const data = assignmentDoc.data() as submittedAssignments;
      const studentIndex = data.students.findIndex(student => student.studentName === studentName);
      if (studentIndex !== -1) {
        data.students[studentIndex].grade = grade;
        await updateDoc(assignmentDocRef, { students: data.students });
        console.log("Grade updated successfully!");
      } else {
        console.warn("Student not found in the assignment.");
      }
    } else {
      console.warn("Assignment not found in Firestore.");
    }
  }
  
  async fetchSubmittedAssignments(
    courseName: string,
    assignmentTitle: string,
    studentName: string
  ): Promise<submittedAssignments | null> {
    const assignmentsRef = collection(this.firestore, "Assignments");
    const assignmentDocRef = doc(assignmentsRef, assignmentTitle);
  
    const assignmentDoc = await getDoc(assignmentDocRef);
    if (assignmentDoc.exists()) {
      const data = assignmentDoc.data() as submittedAssignments;
      const student = data.students.find(student => student.studentName === studentName);
      if (student) {
        return { ...data, students: [student] };
      } else {
        console.warn("No assignment found for the given student.");
        return null;
      }
    } else {
      console.warn("No assignment found for the given title.");
      return null;
    }
  }
  
  async fetchAssignmentsByCourse(courseName: string): Promise<submittedAssignments[] | null> {
    const assignmentsRef = collection(this.firestore, "Assignments");
    const q = query(assignmentsRef, where("courseName", "==", courseName));
  
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const assignments: submittedAssignments[] = [];
      querySnapshot.forEach((doc) => {
        assignments.push(doc.data() as submittedAssignments);
      });
      return assignments;
    } else {
      console.warn("No assignments found for the given course.");
      return null;
    }
  }
  
  async getAssignments(): Promise<submittedAssignments[]> {
    const assignmentsRef = collection(this.firestore, "Assignments");
    const querySnapshot = await getDocs(assignmentsRef);
    const assignments: submittedAssignments[] = [];
    querySnapshot.forEach((doc) => {
      assignments.push(doc.data() as submittedAssignments);
    });
    return assignments;
  }



  // async updateStudentProgress(studentName: string, courseName: string, progressChange: number) {
  //   const studentsRef = collection(this.firestore, "Student_Progress"); // Reference to the Student_Progress collection
  //   const studentDocRef = doc(studentsRef, studentName); // Use studentName as the document ID
  
  //   // Get the student document
  //   const studentDoc = await getDoc(studentDocRef);
  
  //   if (studentDoc.exists()) {
  //     const studentData = studentDoc.data() as { coursesGrades?: Array<{ courseName: string, progress: number }> };
  
  //     // Check if coursesGrades exists
  //     if (studentData.coursesGrades) {
  //       const courseIndex = studentData.coursesGrades.findIndex(course => course.courseName === courseName);
  
  //       if (courseIndex !== -1) {
  //         // If the course exists, update the progress
  //         const newProgress = studentData.coursesGrades[courseIndex].progress + progressChange;
  //         await updateDoc(studentDocRef, {
  //           [`coursesGrades.${courseIndex}.progress`]: newProgress
  //         });
  //         console.log(`Updated progress for course ${courseName} of student ${studentName}`);
  //       } else {
  //         // If the course doesn't exist, add it to the coursesGrades
  //         await updateDoc(studentDocRef, {
  //           coursesGrades: arrayUnion({
  //             courseName: courseName,
  //             progress: progressChange
  //           })
  //         });
  //         console.log(`Added new course ${courseName} for student ${studentName}`);
  //       }
  //     } else {
  //       // If coursesGrades doesn't exist, create a new one
  //       await updateDoc(studentDocRef, {
  //         coursesGrades: arrayUnion({
  //           courseName: courseName,
  //           progress: progressChange
  //         })
  //       });
  //       console.log(`Created coursesGrades and added ${courseName} for student ${studentName}`);
  //     }
  //   } else {
  //     // If the student document doesn't exist, create it
  //     await setDoc(studentDocRef, {
  //       studentName: studentName,
  //       coursesGrades: [
  //         { courseName: courseName, progress: progressChange }
  //       ]
  //     });
  //     console.log(`Created new student ${studentName} and added course ${courseName}`);
  //   }
  // }


async updateStudentProgress(studentName: string, courseName: string, progressChange: number) {
  try {
    const studentsRef = collection(this.firestore, "Student_Progress"); // Reference to the Student_Progress collection
    const studentDocRef = doc(studentsRef, studentName); // Use studentName as the document ID
  
    // Get the student document
    const studentDoc = await getDoc(studentDocRef);
  
    if (studentDoc.exists()) {
      const studentData = studentDoc.data() as { coursesGrades?: Array<{ courseName: string, progress: number }> };
  
      // Check if coursesGrades exists
      if (studentData.coursesGrades) {
        const courseIndex = studentData.coursesGrades.findIndex(course => course.courseName === courseName);
  
        if (courseIndex !== -1) {
          // If the course exists, update the progress
          const newProgress = studentData.coursesGrades[courseIndex].progress + progressChange;
          await updateDoc(studentDocRef, {
            [`coursesGrades.${courseIndex}.progress`]: newProgress
          });
          console.log(`Updated progress for course ${courseName} of student ${studentName}`);
        } else {
          // If the course doesn't exist, add it to the coursesGrades array
          await updateDoc(studentDocRef, {
            coursesGrades: arrayUnion({
              courseName: courseName,
              progress: progressChange
            })
          });
          console.log(`Added new course ${courseName} for student ${studentName}`);
        }
      } else {
        // If coursesGrades doesn't exist, create a new one
        await updateDoc(studentDocRef, {
          coursesGrades: arrayUnion({
            courseName: courseName,
            progress: progressChange
          })
        });
        console.log(`Created coursesGrades and added ${courseName} for student ${studentName}`);
      }
    } else {
      // If the student document doesn't exist, create it
      await setDoc(studentDocRef, {
        studentName: studentName,
        coursesGrades: [
          { courseName: courseName, progress: progressChange }
        ]
      });
      console.log(`Created new student ${studentName} and added course ${courseName}`);
    }
  } catch (error) {
    console.error("Error updating student progress:", error);
  }
}

  
}  