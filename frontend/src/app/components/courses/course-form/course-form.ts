import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../services/course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css']
})
export class CourseForm implements OnInit {
  courseForm: FormGroup;
  categories: any[] = [];
  loading = false;
  isEditMode = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.createCourseForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;
    
    if (this.isEditMode) {
      this.loadCourseData();
    }
  }

  createCourseForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, [Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      level: ['beginner', Validators.required],
      duration: ['', Validators.required],
      modules: [1, [Validators.required, Validators.min(1)]],
      thumbnail: [''],
      heroImage: [''],
      features: this.fb.array([
        this.fb.control('Lifetime access', Validators.required),
        this.fb.control('Certificate of completion', Validators.required)
      ]),
      learningOutcomes: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      requirements: this.fb.array([
        this.fb.control('', Validators.required)
      ]),
      isPublished: [false]
    });
  }

  get features() {
    return this.courseForm.get('features') as FormArray;
  }

  get learningOutcomes() {
    return this.courseForm.get('learningOutcomes') as FormArray;
  }

  get requirements() {
    return this.courseForm.get('requirements') as FormArray;
  }

  addFeature() {
    this.features.push(this.fb.control('', Validators.required));
  }

  removeFeature(index: number) {
    if (this.features.length > 1) {
      this.features.removeAt(index);
    }
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.control('', Validators.required));
  }

  removeLearningOutcome(index: number) {
    if (this.learningOutcomes.length > 1) {
      this.learningOutcomes.removeAt(index);
    }
  }

  addRequirement() {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number) {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  async loadCategories() {
    try {
      const response = await this.courseService.getCategories().toPromise();
      this.categories = response?.data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadCourseData() {
    if (!this.courseId) return;
    
    try {
      const response = await this.courseService.getCourse(this.courseId).toPromise();
      const course = response?.data;
      
      if (course) {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          categoryId: course.categoryId,
          price: course.price,
          originalPrice: course.originalPrice,
          discount: course.discount,
          level: course.level,
          duration: course.duration,
          modules: course.modules,
          thumbnail: course.thumbnail,
          heroImage: course.heroImage,
          isPublished: course.isPublished
        });

        // Set arrays
        this.setFormArray('features', course.features || []);
        this.setFormArray('learningOutcomes', course.learningOutcomes || []);
        this.setFormArray('requirements', course.requirements || []);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  }

  setFormArray(controlName: string, values: string[]) {
    const formArray = this.courseForm.get(controlName) as FormArray;
    formArray.clear();
    values.forEach(value => {
      formArray.push(this.fb.control(value, Validators.required));
    });
  }

  async onSubmit() {
    if (this.courseForm.valid) {
      this.loading = true;
      try {
        const courseData = { ...this.courseForm.value };
        
        // Clean up arrays - remove empty values
        courseData.features = courseData.features.filter((f: string) => f.trim() !== '');
        courseData.learningOutcomes = courseData.learningOutcomes.filter((l: string) => l.trim() !== '');
        courseData.requirements = courseData.requirements.filter((r: string) => r.trim() !== '');
        
        // Calculate discount if originalPrice is set
        if (courseData.originalPrice && courseData.originalPrice > courseData.price) {
          courseData.discount = Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100);
        }

        // Ensure numeric values are numbers
        courseData.price = Number(courseData.price);
        courseData.originalPrice = Number(courseData.originalPrice);
        courseData.discount = Number(courseData.discount);
        courseData.modules = Number(courseData.modules);

        console.log('Submitting course data:', courseData);

        if (this.isEditMode) {
          await this.courseService.updateCourse(this.courseId!, courseData).toPromise();
        } else {
          await this.courseService.createCourse(courseData).toPromise();
        }

        this.router.navigate(['/dashboard/instructor']);
      } catch (error) {
        console.error('Error saving course:', error);
        // Show error message to user
      } finally {
        this.loading = false;
      }
    } else {
      console.log('Form is invalid:', this.courseForm.errors);
      this.markFormGroupTouched(this.courseForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/dashboard/instructor']);
  }
}
