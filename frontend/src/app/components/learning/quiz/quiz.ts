import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  isAnswered?: boolean;
} 

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export interface CourseInfo {
  id: string;
  title: string;
  duration: string;
  instructor: string;
  progress: number;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz.html',
  styleUrls: ['./quiz.css']
})
export class Quiz implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  currentQuestionIndex = 0;
  timeRemaining = 900; // 15 minutes in seconds
  timerInterval: any;
  quizStarted = false;
  quizCompleted = false;
  quizResult: QuizResult | null = null;
  courseId: string = '';
  quizId: string = '';
  
  // Course information
  courseInfo: CourseInfo = {
    id: 'adobe-xd-course',
    title: 'Adobe XD Fundamentals',
    duration: '8 hours',
    instructor: 'John Doe',
    progress: 75
  };
  
  questions: Question[] = [
    {
      id: '1',
      question: 'What is the primary function of Artboards in Adobe XD?',
      options: [
        'To create vector illustrations and icons.',
        'To represent the screens of an app or website.',
        'To manage color palettes and character styles.',
        'To export assets for development.'
      ],
      correctAnswer: 1,
      isAnswered: false
    },
    {
      id: '2',
      question: 'Which tool is used to create interactive prototypes in Adobe XD?',
      options: [
        'Rectangle Tool',
        'Pen Tool',
        'Prototype Mode',
        'Text Tool'
      ],
      correctAnswer: 2,
      isAnswered: false
    },
    {
      id: '3',
      question: 'What file format does Adobe XD primarily use for saving projects?',
      options: [
        '.psd',
        '.xd',
        '.ai',
        '.sketch'
      ],
      correctAnswer: 1,
      isAnswered: false
    },
    {
      id: '4',
      question: 'How do you create a component in Adobe XD?',
      options: [
        'Right-click and select "Make Component"',
        'Use Ctrl+K (Cmd+K on Mac)',
        'Both A and B',
        'Use the Components panel'
      ],
      correctAnswer: 2,
      isAnswered: false
    },
    {
      id: '5',
      question: 'What is the purpose of the Assets panel in Adobe XD?',
      options: [
        'To manage colors and character styles',
        'To store reusable design elements',
        'To organize symbols and components',
        'All of the above'
      ],
      correctAnswer: 3,
      isAnswered: false
    },
    {
      id: '6',
      question: 'Which feature allows you to create animated transitions between artboards?',
      options: [
        'Auto-Animate',
        'Transition Effects',
        'Motion Graphics',
        'Animation Panel'
      ],
      correctAnswer: 0,
      isAnswered: false
    },
    {
      id: '7',
      question: 'What is the keyboard shortcut to duplicate an object in Adobe XD?',
      options: [
        'Ctrl+C, Ctrl+V',
        'Ctrl+D',
        'Alt+Drag',
        'Both B and C'
      ],
      correctAnswer: 3,
      isAnswered: false
    },
    {
      id: '8',
      question: 'Which sharing option allows stakeholders to leave comments on your design?',
      options: [
        'Share for Review',
        'Share for Development',
        'Share for Presentation',
        'Export Assets'
      ],
      correctAnswer: 0,
      isAnswered: false
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'] || '';
      this.quizId = params['quizId'] || '';
      this.loadCourseInfo();
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private loadCourseInfo() {
    // Load course information based on courseId
    // This would typically come from a service
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

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  get timerColor(): string {
    if (this.timeRemaining > 600) return 'text-green-600 bg-green-100'; // 10+ minutes
    if (this.timeRemaining > 420) return 'text-orange-600 bg-orange-100'; // 7+ minutes
    if (this.timeRemaining > 180) return 'text-red-600 bg-red-100'; // 3+ minutes
    return 'text-red-700 bg-red-200'; // < 3 minutes
  }

  get canProceed(): boolean {
    return this.currentQuestion.selectedAnswer !== undefined;
  }

  get answeredQuestionsCount(): number {
    return this.questions.filter(q => q.isAnswered).length;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  startQuiz() {
    this.quizStarted = true;
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  selectAnswer(optionIndex: number) {
    this.questions[this.currentQuestionIndex].selectedAnswer = optionIndex;
    this.questions[this.currentQuestionIndex].isAnswered = true;
  }

  selectQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.isMobileMenuOpen = false;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion() {
    if (this.canProceed && this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  submitQuiz() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    // Calculate results
    let correctAnswers = 0;
    this.questions.forEach(question => {
      if (question.selectedAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / this.questions.length) * 100;
    this.quizResult = {
      score: correctAnswers,
      totalQuestions: this.questions.length,
      percentage: percentage,
      passed: percentage >= 70
    };

    this.quizCompleted = true;
  }

  retakeQuiz() {
    this.quizStarted = false;
    this.quizCompleted = false;
    this.currentQuestionIndex = 0;
    this.timeRemaining = 900;
    this.quizResult = null;
    
    // Reset all answers
    this.questions.forEach(question => {
      question.selectedAnswer = undefined;
      question.isAnswered = false;
    });
  }

  goBack() {
    this.router.navigate(['/learn/course', this.courseId, 'lesson', '1']);
  }

  exitQuiz() {
    this.router.navigate(['/courses']);
  }

  getQuestionStatus(index: number): string {
    const question = this.questions[index];
    if (index === this.currentQuestionIndex) return 'current';
    if (question.isAnswered) return 'answered';
    return 'unanswered';
  }

  getQuestionStatusColor(index: number): string {
    const status = this.getQuestionStatus(index);
    switch (status) {
      case 'current':
        return 'bg-teal-500 text-white';
      case 'answered':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-600 text-gray-300 hover:bg-gray-500';
    }
  }
}