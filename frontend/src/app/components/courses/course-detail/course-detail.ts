import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { PaymentService } from '../../../services/payment.service';
import { AuthService } from '../../../services/auth.service';

interface CourseReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

interface CurriculumLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'text' | 'assignment';
  isPreview?: boolean;
}

interface CurriculumSection {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
  isExpanded?: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  totalReviews: number;
  modules: number;
  duration: string;
  instructor: string;
  instructorId: string;
  instructorBio: string;
  instructorExperience: string;
  instructorRating: number;
  instructorAvatar: string;
  reviews: CourseReview[];
  features: string[];
  heroImage: string;
  learningOutcomes: string[];
  whatYouLearn: string[];
  requirements: string[];
  courseRequirements: string[];
  targetAudience: string[];
  curriculum: CurriculumSection[];
  totalSections: number;
  totalLectures: number;
  totalDuration: string;
  level: string;
  category: any;
  enrollmentCount: number;
  lastUpdated: string;
  language: string;
  subtitles: string[];
  certificate: boolean;
  mobileAccess: boolean;
  fullLifetimeAccess: boolean;
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-detail.html',
  styleUrls: ['./course-detail.css']
})
export class CourseDetail implements OnInit {
  course: CourseData | null = null;
  activeTab = 'overview';
  expandAllSections = false;
  loading = false;
  purchaseLoading = false;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private courseService: CourseService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseDetails(courseId);
    }
  }

  async loadCourseDetails(courseId: string) {
    this.loading = true;
    try {
      const response = await this.courseService.getCourse(courseId).toPromise();
      if (response?.data) {
        this.course = this.mapCourseData(response.data);
      } else {
        // Use template data if no course found
        this.course = this.getTemplateData(courseId);
      }
    } catch (error) {
      console.error('Error loading course:', error);
      // Use template data on error
      this.course = this.getTemplateData(courseId);
    } finally {
      this.loading = false;
    }
  }

  private getTemplateData(courseId: string): CourseData {
    // Template data for demonstration
    return {
      id: courseId,
      title: 'Complete React Development Course',
      description: 'Master React from basics to advanced concepts including hooks, context, routing, and state management. Build real-world projects and become a React expert.',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      rating: 4.7,
      totalReviews: 1248,
      modules: 8,
      duration: '25 hours',
      instructor: 'John Smith',
      instructorId: 'instructor-1',
      instructorBio: 'Senior Software Engineer at Google with 10+ years of experience in web development. Passionate about teaching and helping others learn React and modern web technologies.',
      instructorExperience: '10+ years of experience',
      instructorRating: 4.9,
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      reviews: [
        {
          id: '1',
          userName: 'Sarah Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1de?w=150&h=150&fit=crop&crop=face',
          rating: 5,
          timeAgo: '2 weeks ago',
          comment: 'Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped me grasp React concepts.'
        },
        {
          id: '2',
          userName: 'Michael Chen',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          rating: 4,
          timeAgo: '1 month ago',
          comment: 'Great content and well-structured lessons. I went from knowing nothing about React to building my own projects. Highly recommend!'
        },
        {
          id: '3',
          userName: 'Emily Rodriguez',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          rating: 5,
          timeAgo: '3 weeks ago',
          comment: 'Best React course I have taken! The instructor is knowledgeable and the course material is up-to-date with the latest React features.'
        }
      ],
      features: [
        'Source code included',
        'Lifetime access',
        'Certificate of completion',
        'Community support',
        'Mobile and desktop access'
      ],
      learningOutcomes: [
        'Build modern React applications from scratch',
        'Understand React hooks and functional components',
        'Master state management with Context API and Redux',
        'Implement routing with React Router',
        'Work with APIs and external services',
        'Test React applications',
        'Deploy React apps to production'
      ],
      whatYouLearn: [
        'React fundamentals and core concepts',
        'Component architecture and composition',
        'State management techniques',
        'Modern React patterns and best practices',
        'Building responsive user interfaces',
        'Performance optimization',
        'Testing strategies',
        'Deployment and production considerations'
      ],
      requirements: [
        'Basic knowledge of HTML, CSS, and JavaScript',
        'Understanding of ES6+ features',
        'A computer with internet access',
        'Text editor (VS Code recommended)'
      ],
      courseRequirements: [
        'Basic JavaScript knowledge',
        'HTML & CSS fundamentals',
        'Git version control basics',
        'Node.js installed on your computer'
      ],
      targetAudience: [
        'Web developers wanting to learn React',
        'Frontend developers looking to upgrade their skills',
        'Students and professionals interested in modern web development',
        'Anyone wanting to build interactive user interfaces'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'Getting Started with React',
          isExpanded: true,
          lessons: [
            {
              id: 'lesson-1',
              title: 'Introduction to React',
              duration: '12 minutes',
              type: 'video',
              isPreview: true
            },
            {
              id: 'lesson-2',
              title: 'Setting up the Development Environment',
              duration: '18 minutes',
              type: 'video',
              isPreview: true
            },
            {
              id: 'lesson-3',
              title: 'Creating Your First React App',
              duration: '25 minutes',
              type: 'video'
            },
            {
              id: 'quiz-1',
              title: 'React Basics Quiz',
              duration: '5 minutes',
              type: 'quiz'
            }
          ]
        },
        {
          id: 'section-2',
          title: 'React Components and JSX',
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-4',
              title: 'Understanding JSX',
              duration: '22 minutes',
              type: 'video'
            },
            {
              id: 'lesson-5',
              title: 'Functional vs Class Components',
              duration: '28 minutes',
              type: 'video'
            },
            {
              id: 'lesson-6',
              title: 'Props and Component Communication',
              duration: '35 minutes',
              type: 'video'
            },
            {
              id: 'lesson-7',
              title: 'Component Styling',
              duration: '20 minutes',
              type: 'video'
            }
          ]
        },
        {
          id: 'section-3',
          title: 'State Management and Hooks',
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-8',
              title: 'useState Hook',
              duration: '30 minutes',
              type: 'video'
            },
            {
              id: 'lesson-9',
              title: 'useEffect Hook',
              duration: '40 minutes',
              type: 'video'
            },
            {
              id: 'lesson-10',
              title: 'Custom Hooks',
              duration: '25 minutes',
              type: 'video'
            },
            {
              id: 'quiz-2',
              title: 'Hooks Mastery Quiz',
              duration: '8 minutes',
              type: 'quiz'
            }
          ]
        },
        {
          id: 'section-4',
          title: 'Advanced React Concepts',
          isExpanded: false,
          lessons: [
            {
              id: 'lesson-11',
              title: 'Context API',
              duration: '35 minutes',
              type: 'video'
            },
            {
              id: 'lesson-12',
              title: 'React Router',
              duration: '45 minutes',
              type: 'video'
            },
            {
              id: 'lesson-13',
              title: 'Performance Optimization',
              duration: '38 minutes',
              type: 'video'
            },
            {
              id: 'assignment-1',
              title: 'Build a Complete React App',
              duration: '2 hours',
              type: 'assignment'
            }
          ]
        }
      ],
      totalSections: 4,
      totalLectures: 13,
      totalDuration: '25 hours',
      level: 'Intermediate',
      category: {
        id: 'development',
        name: 'Development',
        slug: 'development'
      },
      enrollmentCount: 3247,
      lastUpdated: 'November 2024',
      language: 'English',
      subtitles: ['English', 'Spanish', 'French'],
      certificate: true,
      mobileAccess: true,
      fullLifetimeAccess: true
    };
  }

  private mapCourseData(data: any): CourseData {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.thumbnail || data.image,
      price: data.price || 0,
      originalPrice: data.originalPrice || data.price,
      discount: data.discount || 0,
      rating: data.rating || 0,
      totalReviews: data.totalReviews || 0,
      modules: data.modules || 0,
      duration: data.duration || '0 hours',
      instructor: data.instructor?.firstName + ' ' + data.instructor?.lastName || 'Unknown',
      instructorId: data.instructor?.id || '',
      instructorBio: data.instructorBio || data.instructor?.bio || '',
      instructorExperience: data.instructorExperience || data.instructor?.experience || '',
      instructorRating: data.instructorRating || data.instructor?.rating || 0,
      instructorAvatar: data.instructor?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      reviews: data.reviews || [],
      features: data.features || [],
      heroImage: data.heroImage || data.thumbnail || data.image,
      learningOutcomes: data.learningOutcomes || [],
      whatYouLearn: data.whatYouLearn || data.learningOutcomes || [],
      requirements: data.requirements || [],
      courseRequirements: data.courseRequirements || data.requirements || [],
      targetAudience: data.targetAudience || [],
      curriculum: this.parseCurriculum(data.curriculum),
      totalSections: data.totalSections || 0,
      totalLectures: data.totalLectures || 0,
      totalDuration: data.totalDuration || data.duration || '0 hours',
      level: data.level || 'Beginner',
      category: data.category || null,
      enrollmentCount: data.enrollmentCount || 0,
      lastUpdated: data.lastUpdated || 'Recently',
      language: data.language || 'English',
      subtitles: data.subtitles || ['English'],
      certificate: data.certificate || true,
      mobileAccess: data.mobileAccess || true,
      fullLifetimeAccess: data.fullLifetimeAccess || true
    };
  }

  private parseCurriculum(curriculum: any): CurriculumSection[] {
    if (!curriculum) return [];
    
    try {
      if (typeof curriculum === 'string') {
        return JSON.parse(curriculum);
      }
      return curriculum;
    } catch (error) {
      console.error('Error parsing curriculum:', error);
      return [];
    }
  }

  async buyCourse() {
    if (!this.course) return;

    // Always redirect to checkout regardless of login status
    this.router.navigate(['/checkout'], {
      queryParams: {
        courseId: this.course.id,
        title: this.course.title,
        price: this.course.price,
        image: this.course.image
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSection(sectionId: string) {
    if (this.course && this.course.curriculum) {
      const section = this.course.curriculum.find(s => s.id === sectionId);
      if (section) {
        section.isExpanded = !section.isExpanded;
      }
    }
  }

  toggleExpandAll() {
    this.expandAllSections = !this.expandAllSections;
    if (this.course && this.course.curriculum) {
      this.course.curriculum.forEach(section => {
        section.isExpanded = this.expandAllSections;
      });
    }
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'video':
        return 'play_circle';
      case 'quiz':
        return 'quiz';
      case 'assignment':
        return 'assignment';
      case 'text':
        return 'article';
      default:
        return 'play_circle';
    }
  }

  navigateToCoursesPage() {
    this.router.navigate(['/courses']);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getRatingPercentage(stars: number): number {
    if (!this.course || this.course.totalReviews === 0) return 0;
    // Calculate percentage based on rating distribution
    const distribution = [5, 12, 8, 15, 60]; // Mock distribution
    return distribution[5 - stars] || 0;
  }

  getFeatureIcon(feature: string): string {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('access')) return 'all_inclusive';
    if (lowerFeature.includes('certificate')) return 'verified';
    if (lowerFeature.includes('support')) return 'support';
    if (lowerFeature.includes('mobile')) return 'phone_android';
    if (lowerFeature.includes('code')) return 'code';
    return 'check_circle';
  }

  getFeatureColor(feature: string): string {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('access')) return 'text-blue-500';
    if (lowerFeature.includes('certificate')) return 'text-green-500';
    if (lowerFeature.includes('support')) return 'text-purple-500';
    if (lowerFeature.includes('mobile')) return 'text-orange-500';
    if (lowerFeature.includes('code')) return 'text-red-500';
    return 'text-teal-500';
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this amazing course: ${this.course?.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareViaEmail() {
    const subject = encodeURIComponent(`Check out this course: ${this.course?.title}`);
    const body = encodeURIComponent(`I found this interesting course: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}
