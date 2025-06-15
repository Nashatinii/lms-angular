import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/Course/course.service';

@Component({
  selector: 'app-view-material',
  templateUrl: './view-material.component.html',
  styleUrls: ['./view-material.component.css']
})
export class ViewMaterialComponent implements OnInit {
  courseName: string = ''; // Course name retrieved from the route
  materials: any[] = []; // Array to store materials for the course
  isLoading: boolean = true; // Show loader while fetching data
  errorMessage: string = ''; // Store error messages, if any

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
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
        }
      });
    } else {
      this.errorMessage = 'Course name not found in the route.';
      this.isLoading = false;
    }
  }
  delete( materialTitle:string) {
    this.courseService.deleteMaterial(this.courseName, materialTitle);
    this.materials = this.materials.filter(material => material.title!== materialTitle);
  }
  
}
