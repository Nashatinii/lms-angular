import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/Course/course.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  materialForm: FormGroup; // FormGroup for the form
  courseName: string = '';  // Store course name here
  submit: boolean = false; // Flag for form submission

  constructor(
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Initialize the form group with FormBuilder
    this.materialForm = this.fb.group({
      type: ['', Validators.required],    // Material type is required
      title: ['', Validators.required],   // Material title is required
      url: ['', [Validators.required , Validators.pattern('https?://.+')]],   // URL is required
      description: ['']                   // Description is optional
    });
  }

  ngOnInit() {
    // Get the course name from the route
    this.courseName = this.route.snapshot.paramMap.get('course') || '';
  }

  // Handle form submission
  async onSubmit() {
    this.submit = true;
    console.log('Submit');

    if (this.materialForm.valid) {
      console.log('valid');
      // Construct material object from form values
      const material = this.materialForm.value;

      // Call service to upload material
      await this.courseService.addMaterial(this.courseName, material);
      //alert('Material uploaded successfully!');
      this.materialForm.reset();
      this.materialForm.get('type')?.setValue('');
      this.submit = false;
    }
  }
}
