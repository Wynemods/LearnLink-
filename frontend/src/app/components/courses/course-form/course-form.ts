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
      level: ['beginner', Validators.required],
      duration: ['', Validators.required],
      thumbnail: [''],
      heroImage: [''],
      features: this.fb.array([
        this.fb.control('Lifetime access'),
        this.fb.control('Certificate of completion')
      ]),
      learningOutcomes: this.fb.array([
        this.fb.control('')
      ]),
      requirements: this.fb.array([
        this.fb.control('')
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
    this.features.push(this.fb.control(''));
  }

  removeFeature(index: number) {
    this.features.removeAt(index);
  }

  addLearningOutcome() {
    this.learningOutcomes.push(this.fb.control(''));
  }

  removeLearningOutcome(index: number) {
    this.learningOutcomes.removeAt(index);
  }

  addRequirement() {
    this.requirements.push(this.fb.control(''));
  }

  removeRequirement(index: number) {
    this.requirements.removeAt(index);
  }

  async loadCategories() {
    try {
      this.categories = await this.courseService.getCategories().toPromise() || [];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadCourseData() {
    if (!this.courseId) return;
    
    try {
      const course = await this.courseService.getCourse(this.courseId).toPromise();
      if (course) {
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          categoryId: course.categoryId,
          price: course.price,
          originalPrice: course.originalPrice,
          level: course.level,
          duration: course.duration,
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
      formArray.push(this.fb.control(value));
    });
  }

  async onSubmit() {
    if (this.courseForm.valid) {
      this.loading = true;
      try {
        const courseData = this.courseForm.value;
        
        // Calculate discount if originalPrice is set
        if (courseData.originalPrice && courseData.originalPrice > courseData.price) {
          courseData.discount = Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100);
        }

        if (this.isEditMode) {
          await this.courseService.updateCourse(this.courseId!, courseData).toPromise();
        } else {
          await this.courseService.createCourse(courseData).toPromise();
        }

        this.router.navigate(['/dashboard/instructor']);
      } catch (error) {
        console.error('Error saving course:', error);
      } finally {
        this.loading = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/instructor']);
  }
}
