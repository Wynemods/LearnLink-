import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface Course {
  id: string;
  title: string;
  description: string;
  lastLessonId: string;
  firstQuizId: string;
  image?: string;
  instructor?: string;
  duration?: string;
  price?: number;
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css']
})
export class CourseList {
  courses: Course[] = [
    {
      id: 'adobe-xd-course',
      title: 'Adobe XD Fundamentals',
      description: 'Learn the basics of Adobe XD for UI/UX design',
      lastLessonId: '1',
      firstQuizId: 'quiz1',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      instructor: 'John Doe',
      duration: '8 hours',
      price: 49.99
    },
    {
      id: 'react-course',
      title: 'React Development',
      description: 'Master React from basics to advanced concepts',
      lastLessonId: '1',
      firstQuizId: 'quiz1',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      instructor: 'Jane Smith',
      duration: '12 hours',
      price: 79.99
    },
    {
      id: 'javascript-course',
      title: 'Modern JavaScript',
      description: 'Learn modern JavaScript fundamentals and ES6+',
      lastLessonId: '1',
      firstQuizId: 'quiz1',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      instructor: 'Mike Johnson',
      duration: '10 hours',
      price: 59.99
    }
  ];

  constructor(private router: Router) {}

  continueLearning(courseId: string, lastLessonId: string = '1') {
    this.router.navigate(['/learn/course', courseId, 'lesson', lastLessonId]);
  }

  startQuiz(courseId: string, quizId: string) {
    this.router.navigate(['/learn/course', courseId, 'quiz', quizId]);
  }
}
