import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  resources: Resource[];
  type: 'lesson' | 'quiz';
  completed: boolean;
}
 
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'zip' | 'link';
  url: string;
  icon: string;
}

export interface CourseInfo {
  id: string;
  title: string;
  duration: string;
  instructor: string;
  progress: number;
}

@Component({
  selector: 'app-lesson-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lesson-dashboard.html',
  styleUrls: ['./lesson-dashboard.css']
})
export class LessonDashboard implements OnInit {
  isMobileMenuOpen = false;
  currentLessonIndex = 0;
  courseId: string = '';
  
  // Course information
  courseInfo: CourseInfo = {
    id: 'adobe-xd-course',
    title: 'Adobe XD Fundamentals',
    duration: '8 hours',
    instructor: 'John Doe',
    progress: 75
  };
  
  lessons: Lesson[] = [
    {
      id: '1',
      title: 'Introduction about XD',
      duration: '30 mins',
      videoUrl: 'https://www.youtube.com/embed/68w2V4z4vss',
      description: 'In this introductory lesson, we will cover the fundamental concepts of Adobe XD. You will learn about the user interface, how to create and manage artboards, and the basic tools for designing and prototyping. This lesson is designed for beginners and will provide a solid foundation for your journey into UI/UX design with Adobe XD. By the end of this lesson, you will be able to navigate the software with confidence and create a simple mobile app screen.',
      type: 'lesson',
      completed: true,
      resources: [
        {
          id: '1',
          title: 'Lesson Slides (PDF)',
          description: 'Download the presentation slides.',
          type: 'pdf',
          url: '#',
          icon: 'picture_as_pdf'
        },
        {
          id: '2',
          title: 'Exercise Files (ZIP)',
          description: 'Get the project files to follow along.',
          type: 'zip',
          url: '#',
          icon: 'folder_zip'
        },
        {
          id: '3',
          title: 'Useful Links',
          description: 'External resources and articles.',
          type: 'link',
          url: '#',
          icon: 'link'
        }
      ]
    },
    {
      id: '2',
      title: 'Basic Tools in XD',
      duration: '45 mins',
      videoUrl: 'https://www.youtube.com/embed/68w2V4z4vss',
      description: 'Learn about the essential tools in Adobe XD for creating stunning designs.',
      type: 'lesson',
      completed: false,
      resources: []
    },
    {
      id: '3',
      title: 'Prototyping',
      duration: '60 mins',
      videoUrl: 'https://www.youtube.com/embed/68w2V4z4vss',
      description: 'Master the art of prototyping with Adobe XD.',
      type: 'lesson',
      completed: false,
      resources: []
    }
  ];

  quizzes: Lesson[] = [
    {
      id: 'quiz1',
      title: 'XD Basics',
      duration: '15 mins',
      videoUrl: '',
      description: 'Test your knowledge of the fundamental concepts.',
      type: 'quiz',
      completed: false,
      resources: []
    },
    {
      id: 'quiz2',
      title: 'Tools Mastery',
      duration: '20 mins',
      videoUrl: '',
      description: 'Test your understanding of XD tools.',
      type: 'quiz',
      completed: false,
      resources: []
    },
    {
      id: 'quiz3',
      title: 'Prototyping Challenge',
      duration: '25 mins',
      videoUrl: '',
      description: 'Challenge yourself with advanced prototyping concepts.',
      type: 'quiz',
      completed: false,
      resources: []
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'] || 'adobe-xd-course';
      const lessonId = params['lessonId'];
      if (lessonId) {
        this.setCurrentLesson(lessonId);
      }
      this.loadCourseInfo();
    });
  }

  private loadCourseInfo() {
    const courseMap: { [key: string]: CourseInfo } = {
      'adobe-xd-course': {
        id: 'adobe-xd-course',
        title: 'Adobe XD Fundamentals',
        duration: '8 hours',
        instructor: 'John Doe',
        progress: 75
      },
      'react-course': {
        id: 'react-course',
        title: 'React Development',
        duration: '12 hours',
        instructor: 'Jane Smith',
        progress: 60
      },
      'javascript-course': {
        id: 'javascript-course',
        title: 'Modern JavaScript',
        duration: '10 hours',
        instructor: 'Mike Johnson',
        progress: 40
      }
    };

    this.courseInfo = courseMap[this.courseId] || this.courseInfo;
  }

  get currentLesson(): Lesson {
    return this.lessons[this.currentLessonIndex];
  }

  get allItems(): Lesson[] {
    return [...this.lessons, ...this.quizzes];
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  selectLesson(lesson: Lesson) {
    if (lesson.type === 'lesson') {
      const index = this.lessons.findIndex(l => l.id === lesson.id);
      if (index !== -1) {
        this.currentLessonIndex = index;
        // Update URL without navigation
        this.router.navigate(['/learn/course', this.courseId, 'lesson', lesson.id], { replaceUrl: true });
      }
    } else {
      // Navigate to quiz
      this.router.navigate(['/learn/course', this.courseId, 'quiz', lesson.id]);
    }
    this.isMobileMenuOpen = false;
  }

  private setCurrentLesson(lessonId: string) {
    const index = this.lessons.findIndex(l => l.id === lessonId);
    if (index !== -1) {
      this.currentLessonIndex = index;
    }
  }

  previousLesson() {
    if (this.currentLessonIndex > 0) {
      this.currentLessonIndex--;
      const lesson = this.lessons[this.currentLessonIndex];
      this.router.navigate(['/learn/course', this.courseId, 'lesson', lesson.id]);
    }
  }

  nextLesson() {
    if (this.currentLessonIndex < this.lessons.length - 1) {
      this.currentLessonIndex++;
      const lesson = this.lessons[this.currentLessonIndex];
      this.router.navigate(['/learn/course', this.courseId, 'lesson', lesson.id]);
    }
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  getResourceIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return '/assets/svg/picture-as-pdf.svg';
      case 'zip':
        return '/assets/svg/folder-zip.svg';
      case 'link':
        return '/assets/svg/link.svg';
      default:
        return '/assets/svg/link.svg';
    }
  }
}