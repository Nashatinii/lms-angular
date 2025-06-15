import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './Authentication/signup/signup.component';
import { LoginComponent } from './Authentication/login/login.component';
import { ManageUsersComponent } from './UserPages/AdminPages/manage-users/manage-users.component';
import { UserService} from './services/User/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ManageCoursesComponent } from './UserPages/AdminPages/manage-courses/manage-courses.component';
import { NavbarComponent } from './UserPages/AdminPages/navbar/navbar.component';
import { RequestsComponent } from './UserPages/AdminPages/requests/requests.component';
import { HomepageComponent } from './UserPages/InstructorPages/homepage/homepage.component';
import { NavbarInsComponent } from './UserPages/InstructorPages/navbar-ins/navbar-ins.component';
import { FooterComponent } from './UserPages/footer/footer.component';
import { CreateCourseComponent } from './UserPages/AdminPages/create-course/create-course.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LowercasePipe } from './lowercase.pipe';
import { UppercasePipe } from './uppercase.pipe';
import { AssignStudentsComponent } from './UserPages/AdminPages/assign-students/assign-students.component';
import { EditCourseComponent } from './UserPages/AdminPages/edit-course/edit-course.component';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateCourseComponentIns } from './UserPages/InstructorPages/create-cours-ins/create-cours-ins.component';
import { MyCoursesComponent } from './UserPages/InstructorPages/my-courses/my-courses.component';
import { MaterialComponent } from './UserPages/InstructorPages/material/material.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AuthService} from './auth.service';
import { MyCoursesStudentComponent } from './UserPages/StudentPages/my-courses-student/my-courses-student.component';
import { NavBarStudentComponent } from './UserPages/StudentPages/nav-bar-student/nav-bar-student.component';
import { ReceivedSubmissionsComponent } from './UserPages/InstructorPages/received-submissions/received-submissions.component';
import { ViewMaterialComponent } from './UserPages/InstructorPages/view-material/view-material.component';
import { CoursePageComponent } from './UserPages/StudentPages/course-page/course-page.component';
import { VideoCourseComponent } from './UserPages/StudentPages/video-course/video-course.component';
// import { MyLearningComponent } from './UserPages/StudentPages/my-learning/my-learning.component';
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    ManageUsersComponent,
    ManageCoursesComponent,
    NavbarComponent,
    RequestsComponent,
    HomepageComponent,
    NavbarInsComponent,
    FooterComponent,
    CreateCourseComponent,
    LowercasePipe,
    UppercasePipe,
    AssignStudentsComponent,
    EditCourseComponent,
    CreateCourseComponentIns,
    MyCoursesComponent,
    MaterialComponent,
    MyCoursesStudentComponent,
    NavBarStudentComponent,
    ReceivedSubmissionsComponent,
    ViewMaterialComponent,
    CoursePageComponent,
    VideoCourseComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [UserService, AuthService,
    provideAnimationsAsync(), 
    provideFirebaseApp(() => initializeApp({"projectId":"elearn-3855c","appId":"1:739368118256:web:9a9afbbc1c817c4c571f35","storageBucket":"elearn-3855c.firebasestorage.app","apiKey":"AIzaSyCoSbJYtPaeSNPKe3lmp3nZyqq2MVLsvs4","authDomain":"elearn-3855c.firebaseapp.com","messagingSenderId":"739368118256","measurementId":"G-WT8V6KMBR6"})), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore())],
  bootstrap: [AppComponent]
})
export class AppModule { }
