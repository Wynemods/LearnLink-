import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level: string;
  isPublished: boolean;
  totalLessons: number;
  totalQuizzes: number;
  enrollments: number;
  totalStudents?: number;
  rating: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  type: string;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  duration: number;
  order: number;
  isPublished: boolean;
  questions: QuizQuestion[];
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instructor-dashboard.html',
  styleUrls: ['./instructor-dashboard.css']
})
export class InstructorDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Make String available in template
  String = String;
  
  // UI State
  isMobileMenuOpen = false;
  currentView: 'overview' | 'courses' | 'lessons' | 'quizzes' | 'students' | 'messages' = 'overview';
  
  // Data
  myCourses: Course[] = [];
  myStudents: any[] = [];
  analytics: any = {};
  categories: any[] = [];
  
  // Overview stats
  overviewStats = {
    totalCourses: 0,
    totalStudents: 0,
    completedCourses: 0,
    averageRating: 0
  };
  
  // Course progress and top students for overview
  courseProgress: any[] = [];
  topStudents: any[] = [];
  
  // Messages (for messages view)
  activeConversation: any = null;
  filteredConversations: any[] = [];
  searchTerm = '';
  newMessage = '';
  
  // Course selection for lessons/quizzes
  selectedCourseId = '';
  selectedCourse: Course | null = null;
  courseLessons: Lesson[] = [];
  courseQuizzes: Quiz[] = [];
  
  // Forms
  showCourseForm = false;
  showLessonForm = false;
  showQuizForm = false;
  
  // Course form
  courseForm = {
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    duration: '',
    level: 'beginner',
    categoryId: '',
    thumbnail: '',
    heroImage: '',
    features: [] as string[],
    learningOutcomes: [] as string[],
    requirements: [] as string[],
    targetAudience: [] as string[],
    isPublished: false
  };
  
  // Lesson form
  lessonForm = {
    title: '',
    content: '',
    videoUrl: '',
    duration: '',
    order: 1,
    courseId: '',
    type: 'video',
    isPreview: false,
    isPublished: true
  };
  
  // Quiz form
  quizForm = {
    title: '',
    description: '',
    duration: 30,
    order: 1,
    courseId: '',
    questions: [] as QuizQuestion[]
  };
  
  currentQuestion: QuizQuestion = {
    id: '',
    question: '',
    type: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  };
  
  // Form helpers
  newFeature = '';
  newOutcome = '';
  newRequirement = '';
  newLearningOutcome = '';
  newTargetAudience = '';
  
  // Lesson form properties
  lessonTitle = '';
  lessonContent = '';
  lessonVideoUrl = '';
  lessonDuration = '';
  lessonOrder = 1;
  lessonType = 'video';
  lessonIsPreview = false;
  
  // Quiz form properties
  quizTitle = '';
  quizDescription = '';
  quizDuration = 30;
  quizQuestions: QuizQuestion[] = [];
  
  // Loading states
  loading = false;
  coursesLoading = false;
  lessonsLoading = false;
  quizzesLoading = false;
  
  constructor(
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    this.loadInstructorData();
    this.loadCategories();
    this.generateSampleData(); // Remove in production
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Generate sample data for development
  generateSampleData() {
    this.overviewStats = {
      totalCourses: 12,
      totalStudents: 348,
      completedCourses: 8,
      averageRating: 4.7
    };
    
    this.courseProgress = [
      {
        id: '1',
        title: 'React Development Course',
        enrollments: 45,
        rating: 4.8,
        progress: 85
      },
      {
        id: '2',
        title: 'JavaScript Fundamentals',
        enrollments: 32,
        rating: 4.6,
        progress: 92
      }
    ];
    
    this.topStudents = [
      {
        id: '1',
        name: 'Alice Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6c0a1df?w=150&h=150&fit=crop&crop=face',
        progress: 95,
        course: 'React Development'
      },
      {
        id: '2',
        name: 'Bob Smith',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        progress: 88,
        course: 'JavaScript Fundamentals'
      }
    ];
  }
  
  async loadInstructorData() {
    this.loading = true;
    try {
      // Load instructor courses
      const coursesResponse = await this.courseService.getInstructorCourses().toPromise();
      this.myCourses = coursesResponse?.data || [];
      
      // Load students
      const studentsResponse = await this.courseService.getInstructorStudents().toPromise();
      this.myStudents = studentsResponse?.data || [];
      
      // Load analytics
      const analyticsResponse = await this.courseService.getInstructorAnalytics().toPromise();
      this.analytics = analyticsResponse?.data || {};
      
    } catch (error) {
      console.error('Error loading instructor data:', error);
    } finally {
      this.loading = false;
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
  
  // Course Management
  createNewCourse() {
    this.openCourseForm();
  }
  
  openCourseForm() {
    this.showCourseForm = true;
    this.resetCourseForm();
  }
  
  closeCourseForm() {
    this.showCourseForm = false;
  }
  
  resetCourseForm() {
    this.courseForm = {
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      duration: '',
      level: 'beginner',
      categoryId: '',
      thumbnail: '',
      heroImage: '',
      features: [],
      learningOutcomes: [],
      requirements: [],
      targetAudience: [],
      isPublished: false
    };
  }
  
  async submitCourse() {
    try {
      const response = await this.courseService.createCourse(this.courseForm).toPromise();
      if (response?.success) {
        alert('Course created successfully!');
        this.closeCourseForm();
        await this.loadInstructorData();
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course. Please try again.');
    }
  }
  
  editCourse(courseId: string) {
    const course = this.myCourses.find(c => c.id === courseId);
    if (course) {
      console.log('Editing course:', course);
      // Implement edit logic
    }
  }
  
  viewCourseDetails(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }
  
  async deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await this.courseService.deleteCourse(courseId).toPromise();
        await this.loadInstructorData();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  }
  
  // Lesson Management
  openLessonForm() {
    if (!this.selectedCourseId) {
      alert('Please select a course first');
      return;
    }
    this.showLessonForm = true;
    this.resetLessonForm();
  }
  
  closeLessonForm() {
    this.showLessonForm = false;
  }
  
  resetLessonForm() {
    this.lessonForm = {
      title: '',
      content: '',
      videoUrl: '',
      duration: '',
      order: 1,
      courseId: this.selectedCourseId,
      type: 'video',
      isPreview: false,
      isPublished: true
    };
    
    // Reset individual form properties
    this.lessonTitle = '';
    this.lessonContent = '';
    this.lessonVideoUrl = '';
    this.lessonDuration = '';
    this.lessonOrder = 1;
    this.lessonType = 'video';
    this.lessonIsPreview = false;
  }
  
  async createLesson() {
    try {
      const lessonData = {
        title: this.lessonTitle,
        content: this.lessonContent,
        videoUrl: this.lessonVideoUrl,
        duration: this.lessonDuration,
        order: this.lessonOrder,
        courseId: this.selectedCourseId,
        type: this.lessonType,
        isPreview: this.lessonIsPreview,
        isPublished: true
      };
      
      const response = await this.courseService.createLesson(lessonData).toPromise();
      if (response?.success) {
        alert('Lesson created successfully!');
        this.closeLessonForm();
        await this.loadCourseLessons();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson. Please try again.');
    }
  }
  
  async submitLesson() {
    try {
      const response = await this.courseService.createLesson(this.lessonForm).toPromise();
      if (response?.success) {
        alert('Lesson created successfully!');
        this.closeLessonForm();
        await this.loadCourseLessons();
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson. Please try again.');
    }
  }
  
  async loadCourseLessons() {
    if (!this.selectedCourseId) return;
    
    this.lessonsLoading = true;
    try {
      const response = await this.courseService.getCourseLessons(this.selectedCourseId).toPromise();
      this.courseLessons = response?.data || [];
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      this.lessonsLoading = false;
    }
  }
  
  async deleteLesson(lessonId: string) {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        await this.courseService.deleteLesson(lessonId).toPromise();
        await this.loadCourseLessons();
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  }
  
  editLesson(lesson: Lesson) {
    // Set form values for editing
    this.lessonTitle = lesson.title;
    this.lessonContent = lesson.content;
    this.lessonVideoUrl = lesson.videoUrl || '';
    this.lessonDuration = lesson.duration || '';
    this.lessonOrder = lesson.order;
    this.lessonType = lesson.type;
    this.lessonIsPreview = lesson.isPreview;
    this.showLessonForm = true;
  }
  
  // Quiz Management
  openQuizForm() {
    if (!this.selectedCourseId) {
      alert('Please select a course first');
      return;
    }
    this.showQuizForm = true;
    this.resetQuizForm();
  }
  
  closeQuizForm() {
    this.showQuizForm = false;
  }
  
  resetQuizForm() {
    this.quizForm = {
      title: '',
      description: '',
      duration: 30,
      order: 1,
      courseId: this.selectedCourseId,
      questions: []
    };
    
    // Reset individual form properties
    this.quizTitle = '';
    this.quizDescription = '';
    this.quizDuration = 30;
    this.quizQuestions = [];
  }
  
  resetCurrentQuestion() {
    this.currentQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
  }
  
  addQuestion() {
    if (!this.currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    this.quizForm.questions.push({ ...this.currentQuestion });
    this.resetCurrentQuestion();
  }
  
  addQuestionToQuiz() {
    this.addQuestion();
  }
  
  removeQuestion(index: number) {
    this.quizForm.questions.splice(index, 1);
  }
  
  async createQuiz() {
    if (!this.quizForm.title || this.quizForm.questions.length === 0) {
      alert('Please fill in quiz title and add at least one question');
      return;
    }
    
    try {
      const response = await this.courseService.createQuiz(this.quizForm).toPromise();
      if (response?.success) {
        alert('Quiz created successfully!');
        this.closeQuizForm();
        await this.loadCourseQuizzes();
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz. Please try again.');
    }
  }
  
  async submitQuiz() {
    await this.createQuiz();
  }
  
  async loadCourseQuizzes() {
    if (!this.selectedCourseId) return;
    
    this.quizzesLoading = true;
    try {
      const response = await this.courseService.getCourseQuizzes(this.selectedCourseId).toPromise();
      this.courseQuizzes = response?.data || [];
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      this.quizzesLoading = false;
    }
  }
  
  async deleteQuiz(quizId: string) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await this.courseService.deleteQuiz(quizId).toPromise();
        await this.loadCourseQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  }
  
  // Course Selection
  async onCourseSelect() {
    this.selectedCourse = this.myCourses.find(course => course.id === this.selectedCourseId) || null;
    
    if (this.selectedCourse) {
      await Promise.all([
        this.loadCourseLessons(),
        this.loadCourseQuizzes()
      ]);
    }
  }
  
  // Form helpers
  addFeature() {
    if (this.newFeature.trim()) {
      this.courseForm.features.push(this.newFeature.trim());
      this.newFeature = '';
    }
  }
  
  removeFeature(index: number) {
    this.courseForm.features.splice(index, 1);
  }
  
  addOutcome() {
    if (this.newOutcome.trim()) {
      this.courseForm.learningOutcomes.push(this.newOutcome.trim());
      this.newOutcome = '';
    }
  }
  
  addLearningOutcome() {
    if (this.newLearningOutcome.trim()) {
      this.courseForm.learningOutcomes.push(this.newLearningOutcome.trim());
      this.newLearningOutcome = '';
    }
  }
  
  removeOutcome(index: number) {
    this.courseForm.learningOutcomes.splice(index, 1);
  }
  
  removeLearningOutcome(index: number) {
    this.courseForm.learningOutcomes.splice(index, 1);
  }
  
  addRequirement() {
    if (this.newRequirement.trim()) {
      this.courseForm.requirements.push(this.newRequirement.trim());
      this.newRequirement = '';
    }
  }
  
  removeRequirement(index: number) {
    this.courseForm.requirements.splice(index, 1);
  }
  
  addTargetAudience() {
    if (this.newTargetAudience.trim()) {
      this.courseForm.targetAudience.push(this.newTargetAudience.trim());
      this.newTargetAudience = '';
    }
  }
  
  removeTargetAudience(index: number) {
    this.courseForm.targetAudience.splice(index, 1);
  }
  
  // Messages functionality
  selectConversation(conversation: any) {
    this.activeConversation = conversation;
  }
  
  sendMessage() {
    if (this.newMessage.trim() && this.activeConversation) {
      // Implement message sending logic
      console.log('Sending message:', this.newMessage);
      this.newMessage = '';
    }
  }
  
  // Navigation
  setCurrentView(view: 'overview' | 'courses' | 'lessons' | 'quizzes' | 'students' | 'messages') {
    this.currentView = view;
    this.isMobileMenuOpen = false;
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
  
  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  async publishCourse(courseId: string) {
    try {
      const response = await this.courseService.publishCourse(courseId).toPromise();
      if (response?.success) {
        alert('Course published successfully!');
        await this.loadInstructorData();
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      alert('Error publishing course. Please try again.');
    }
  }
  
  async unpublishCourse(courseId: string) {
    try {
      const response = await this.courseService.unpublishCourse(courseId).toPromise();
      if (response?.success) {
        alert('Course unpublished successfully!');
        await this.loadInstructorData();
      }
    } catch (error) {
      console.error('Error unpublishing course:', error);
      alert('Error unpublishing course. Please try again.');
    }
  }
}
