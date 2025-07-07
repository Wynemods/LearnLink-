import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { PaymentService } from '../../../services/payment.service';

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
  reviews: CourseReview[];
  features: string[];
  heroImage: string;
  learningOutcomes: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  totalSections: number;
  totalLectures: number;
  totalDuration: string;
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
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private courseService: CourseService,
    private paymentService: PaymentService
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
      const courseData = await this.courseService.getCourse(courseId).toPromise();
      this.course = courseData;
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      this.loading = false;
    }
  }

  async buyCourse() {
    if (!this.course) return;

    const paymentData = {
      phoneNumber: '+254700000000', // This should come from a form
      amount: this.course.price,
      accountNumber: this.course.id
    };

    try {
      const response = await this.paymentService.initiateMpesaPayment(paymentData).toPromise();
      if (response?.success) {
        alert('Payment initiated successfully! Please check your phone.');
      } else {
        alert('Payment initiation failed: ' + response?.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSection(sectionId: string) {
    if (this.course) {
      const section = this.course.curriculum.find(s => s.id === sectionId);
      if (section) {
        section.isExpanded = !section.isExpanded;
      }
    }
  }

  toggleExpandAll() {
    this.expandAllSections = !this.expandAllSections;
    if (this.course) {
      this.course.curriculum.forEach(section => {
        section.isExpanded = this.expandAllSections;
      });
    }
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'video': return 'play_circle';
      case 'quiz': return 'quiz';
      case 'text': return 'description';
      case 'assignment': return 'assignment';
      default: return 'article';
    }
  }

  navigateToCoursesPage() {
    this.router.navigate(['/courses']);
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getRatingPercentage(stars: number): number {
    return (stars / 5) * 100;
  }

  getFeatureIcon(feature: string): string {
    const iconMap: { [key: string]: string } = {
      'Lifetime access': 'all_inclusive',
      'Certificate': 'verified',
      'Mobile access': 'phone_android',
      'Assignments': 'assignment',
      'Resources': 'folder'
    };
    return iconMap[feature] || 'check_circle';
  }

  getFeatureColor(feature: string): string {
    const colorMap: { [key: string]: string } = {
      'Lifetime access': 'text-green-600',
      'Certificate': 'text-blue-600',
      'Mobile access': 'text-purple-600',
      'Assignments': 'text-orange-600',
      'Resources': 'text-teal-600'
    };
    return colorMap[feature] || 'text-gray-600';
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.course?.title || 'Check out this course');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
  }

  shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.course?.title || 'Check out this course');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
  }

  shareViaEmail() {
    const subject = encodeURIComponent(`Check out this course: ${this.course?.title}`);
    const body = encodeURIComponent(`I found this interesting course: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}
