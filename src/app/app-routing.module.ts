import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Authentication/login/login.component';
import { SignupComponent } from './Authentication/signup/signup.component';
import { ManageUsersComponent } from './UserPages/AdminPages/manage-users/manage-users.component';
import { RequestsComponent } from './UserPages/AdminPages/requests/requests.component';
import { HomepageComponent } from './UserPages/InstructorPages/homepage/homepage.component';
import { ManageCoursesComponent } from './UserPages/AdminPages/manage-courses/manage-courses.component';
import { CreateCourseComponent } from './UserPages/AdminPages/create-course/create-course.component';
import { EditCourseComponent } from './UserPages/AdminPages/edit-course/edit-course.component';
import { AssignStudentsComponent } from './UserPages/AdminPages/assign-students/assign-students.component';
import { CreateCourseComponentIns } from './UserPages/InstructorPages/create-cours-ins/create-cours-ins.component';
import { MyCoursesComponent } from './UserPages/InstructorPages/my-courses/my-courses.component';
import { authGuard } from './auth.guard';
import { MyCoursesStudentComponent } from './UserPages/StudentPages/my-courses-student/my-courses-student.component';
import { MaterialComponent } from './UserPages/InstructorPages/material/material.component';
import { ReceivedSubmissionsComponent } from './UserPages/InstructorPages/received-submissions/received-submissions.component';
import { ViewMaterialComponent } from './UserPages/InstructorPages/view-material/view-material.component';
import { CoursePageComponent } from './UserPages/StudentPages/course-page/course-page.component';
import { VideoCourseComponent } from './UserPages/StudentPages/video-course/video-course.component';
import { MyLearningComponent } from './UserPages/StudentPages/my-learning/my-learning.component';

const routes: Routes = [
  // AUTHENTICATION PAGES
  { path: 'login', component: LoginComponent, data: { animation: 'login' } },
  { path: 'signup', component: SignupComponent, data: { animation: 'signup' } },

  // ADMIN PAGES - Only accessible by Admins
  { path: 'manageusers', component: ManageUsersComponent, data: { animation: 'manageusers', role: 'Admin' }, canActivate: [authGuard] },
  { path: 'requests', component: RequestsComponent, data: { animation: 'requests', role: 'Admin' }, canActivate: [authGuard] },
  { path: 'managecourses', component: ManageCoursesComponent, data: { animation: 'managecourses', role: 'Admin' }, canActivate: [authGuard] },
  { path: 'managecourses/createCourse', component: CreateCourseComponent, data: { animation: 'createCourse', role: 'Admin' }, canActivate: [authGuard] },
  { path: 'managecourses/editCourse/:courseName', component: EditCourseComponent, data: { animation: 'editCourse', role: 'Admin' }, canActivate: [authGuard] },
  { path: 'assignStudent', component: AssignStudentsComponent, data: { animation:'assignStudent', role: 'Admin' }, canActivate: [authGuard] },

  // INSTRUCTOR PAGES - Only accessible by Instructors
  { path: 'insHome', component: HomepageComponent, data: { animation: 'insHome', role: 'instructor' }, canActivate: [authGuard] },
  { path: 'insCreateCourse', component: CreateCourseComponentIns, data: { animation: 'insCreateCourse', role: 'instructor' }, canActivate: [authGuard] },
  { path: 'insMyCourse', component: MyCoursesComponent, data: { animation: 'insMyCourse', role: 'instructor' }, canActivate: [authGuard] },
  { path: 'editMaterial/:course', component: MaterialComponent, data: { animation: 'editMaterial', role: 'instructor' }, canActivate: [authGuard] },
  { path: 'viewMaterial/:course', component: ViewMaterialComponent, data: { animation: 'viewMaterial', role: 'instructor' }, canActivate: [authGuard] },
  { path: 'receivedSubmissions', component: ReceivedSubmissionsComponent, data: { animation: 'receivedSubmissions', role: 'instructor' }, canActivate: [authGuard] },
  
  // STUDENTIAL PAGES - Only accessible by Students
  { path: 'studentMyCourse', component: MyCoursesStudentComponent, data: { animation: 'studentMyCourse', role: 'student' }, canActivate: [authGuard] },
  { path: 'coursePage/:course', component: CoursePageComponent, data: { animation: 'coursePage', role: 'student' }, canActivate: [authGuard]},
// children: [
//   {
//     path: 'submissionPage/:coursename',
//     component: SubmissionComponent, // Replace with the actual component for submission
//     data: { animation: 'submissionPage' },
//     canActivate: [authGuard]  // You can add additional guards if needed
//   }
// ]
  { path: 'video/:video/:course/:materialTitle', component: VideoCourseComponent, data: { animation: 'video', role: 'student' }, canActivate: [authGuard] },
  { path: 'myLearning', component: MyLearningComponent, data: { animation: 'myLearning', role: 'student' }, canActivate: [authGuard] },


  // DEFAULT
  // { path: '/access-denied', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
