import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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

// Renamed interface to avoid conflict
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
  
  // Sample course data - in a real app, this would come from a service
  private coursesData: { [key: string]: CourseData } = {
    'adobe-xd-fundamentals': {
      id: 'adobe-xd-fundamentals',
      title: 'Adobe XD Fundamentals',
      description: 'Master the fundamentals of Adobe XD and learn to create stunning user interfaces and prototypes. This comprehensive course covers everything from basic tools to advanced prototyping techniques.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDeDk19xkBKXje5X3JNoWrM-0v3ODnbZqBtZwodxGTagbE2i3XVGLKYOCpjs78FqAjvzUoy9TA2QQu8AjxXs3PNfLKlstH51hsOi1HflMZEuoNaPEh6kdGc65qhYT8VCUKyZow4yrVdVegxqhBPoEaxM6GJyMIq5MmNFIid9VlQ7ztI10b1W4Bd-Zfl4wlrwB5GZVkjFF7s6SRPaDToMAMjmy7NZXmN81TWL2avzRxjeip6jKhvlvNZEbbVQjMdMxwTCteMTUFtA',
      price: 99,
      originalPrice: 199,
      discount: 50,
      rating: 4.8,
      totalReviews: 245,
      modules: 8,
      duration: '8 hours',
      instructor: 'John Doe',
      learningOutcomes: [
        'Master Adobe XD interface and tools',
        'Create responsive designs and prototypes',
        'Build interactive user interfaces',
        'Collaborate effectively with team members',
        'Export assets for development',
        'Apply design systems and components'
      ],
      requirements: [
        'Basic understanding of design principles',
        'Access to Adobe XD (free or paid version)',
        'No prior experience with XD required'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '8 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'Getting Started with Adobe XD',
          lessons: [
            { id: 'lesson-1', title: 'Introduction to Adobe XD', duration: '15 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'Interface Overview', duration: '20 min', type: 'video' },
            { id: 'lesson-3', title: 'Your First Project', duration: '25 min', type: 'video' }
          ]
        },
        {
          id: 'section-2',
          title: 'Basic Tools and Features',
          lessons: [
            { id: 'lesson-4', title: 'Shape Tools', duration: '30 min', type: 'video' },
            { id: 'lesson-5', title: 'Text and Typography', duration: '25 min', type: 'video' },
            { id: 'quiz-1', title: 'Tools Quiz', duration: '10 min', type: 'quiz' }
          ]
        }
      ],
      totalSections: 6,
      totalLectures: 45,
      totalDuration: '8 hours 30 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'Sarah Johnson',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 5,
          timeAgo: '2 weeks ago',
          comment: 'Excellent course! The instructor explains everything clearly and the hands-on exercises are very helpful.'
        }
      ]
    },
    'ui-ux-design-mastery': {
      id: 'ui-ux-design-mastery',
      title: 'UI/UX Design Mastery',
      description: 'Complete guide to user interface and user experience design. Learn industry best practices and create stunning digital experiences.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTR8tpDM6XXd7e_HbBR7AVy-CQM1FB9ddwzHgB17LMzRNguNL5hDiYf_qXbEbJ-GpeNnd7KU3QT4o-Al65Z27co5MvFyqIPRSznoi3eQWG6Q-JfLpSlT-Y9EoXMr5WLJwFej8LNujJeO56VCgUOpWFAm5VCYj23eAeqDMdKJZHmM0ZY-hcv4i4Co_j2ef2s086KpzlZc3Cz2OB0Yob0Q_DFWSesSs9QvxAjRGxaCxGLk2-QgME02YOWwJFov8lVzsF-nqLxBXwfg',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTR8tpDM6XXd7e_HbBR7AVy-CQM1FB9ddwzHgB17LMzRNguNL5hDiYf_qXbEbJ-GpeNnd7KU3QT4o-Al65Z27co5MvFyqIPRSznoi3eQWG6Q-JfLpSlT-Y9EoXMr5WLJwFej8LNujJeO56VCgUOpWFAm5VCYj23eAeqDMdKJZHmM0ZY-hcv4i4Co_j2ef2s086KpzlZc3Cz2OB0Yob0Q_DFWSesSs9QvxAjRGxaCxGLk2-QgME02YOWwJFov8lVzsF-nqLxBXwfg',
      price: 149,
      originalPrice: 299,
      discount: 50,
      rating: 4.9,
      totalReviews: 189,
      modules: 12,
      duration: '12 hours',
      instructor: 'Sarah Wilson',
      learningOutcomes: [
        'Master UI/UX design principles',
        'Create user-centered designs',
        'Conduct user research and testing',
        'Build comprehensive design systems',
        'Prototype and iterate designs',
        'Present designs to stakeholders'
      ],
      requirements: [
        'Basic computer skills',
        'Design software (Figma, Sketch, or Adobe XD)',
        'Creative mindset and attention to detail'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '12 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'Introduction to UI/UX Design',
          lessons: [
            { id: 'lesson-1', title: 'What is UI/UX Design?', duration: '20 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'Design Thinking Process', duration: '25 min', type: 'video' }
          ]
        }
      ],
      totalSections: 8,
      totalLectures: 58,
      totalDuration: '12 hours 45 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'Michael Chen',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 5,
          timeAgo: '1 week ago',
          comment: 'Amazing course! Sarah really knows her stuff and the practical projects are fantastic.'
        }
      ]
    },
    'web-development-bootcamp': {
      id: 'web-development-bootcamp',
      title: 'Web Development Bootcamp',
      description: 'Complete full-stack web development course from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwnST76Dj8yMlst569b3iuFf2gb5FJ12LqOIXR-AY5WwL7XnNlBL2m54tCCvn9fp625E-J95h-yiO_fyDYT_Xd45qqJ0Hox1H_RDTM7twKIBbiIY8frblOhMIYAaqPpyxuOF8sBORtcNnp9TCo_En_t4czEcYsX4snhE0hzvQOdwcEWA45OYZPYOrN4JzvEWDpclaKJrj-fqI69-tOuIzTQcEQGHKGliJiU1oxmEBo0cvKtn9NTrfBPPJCh-NsHvGsHZokMRSYTQ',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwnST76Dj8yMlst569b3iuFf2gb5FJ12LqOIXR-AY5WwL7XnNlBL2m54tCCvn9fp625E-J95h-yiO_fyDYT_Xd45qqJ0Hox1H_RDTM7twKIBbiIY8frblOhMIYAaqPpyxuOF8sBORtcNnp9TCo_En_t4czEcYsX4snhE0hzvQOdwcEWA45OYZPYOrN4JzvEWDpclaKJrj-fqI69-tOuIzTQcEQGHKGliJiU1oxmEBo0cvKtn9NTrfBPPJCh-NsHvGsHZokMRSYTQ',
      price: 199,
      originalPrice: 399,
      discount: 50,
      rating: 4.7,
      totalReviews: 324,
      modules: 15,
      duration: '20 hours',
      instructor: 'Mike Johnson',
      learningOutcomes: [
        'Build full-stack web applications',
        'Master modern JavaScript and React',
        'Create responsive designs with CSS',
        'Develop backend APIs with Node.js',
        'Work with databases and authentication',
        'Deploy applications to production'
      ],
      requirements: [
        'Basic computer skills',
        'No programming experience required',
        'Access to a computer with internet connection'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '15 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'HTML & CSS Fundamentals',
          lessons: [
            { id: 'lesson-1', title: 'Introduction to HTML', duration: '30 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'CSS Basics', duration: '35 min', type: 'video' }
          ]
        }
      ],
      totalSections: 12,
      totalLectures: 85,
      totalDuration: '20 hours 15 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'Alex Rodriguez',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 5,
          timeAgo: '3 days ago',
          comment: 'Comprehensive course that covers everything you need to become a web developer. Highly recommended!'
        }
      ]
    },
    'python-data-science': {
      id: 'python-data-science',
      title: 'Python for Data Science',
      description: 'Master Python programming for data analysis and machine learning. Learn pandas, numpy, matplotlib, and scikit-learn.',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
      price: 175,
      originalPrice: 349,
      discount: 50,
      rating: 4.8,
      totalReviews: 156,
      modules: 10,
      duration: '16 hours',
      instructor: 'Dr. Lisa Chen',
      learningOutcomes: [
        'Master Python programming fundamentals',
        'Analyze data with pandas and numpy',
        'Create visualizations with matplotlib',
        'Build machine learning models',
        'Work with real-world datasets',
        'Apply statistical analysis techniques'
      ],
      requirements: [
        'Basic mathematics knowledge',
        'No programming experience required',
        'Computer with Python installed'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '10 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'Python Fundamentals',
          lessons: [
            { id: 'lesson-1', title: 'Introduction to Python', duration: '25 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'Variables and Data Types', duration: '30 min', type: 'video' }
          ]
        }
      ],
      totalSections: 8,
      totalLectures: 68,
      totalDuration: '16 hours 30 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'Jennifer Lee',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 5,
          timeAgo: '5 days ago',
          comment: 'Perfect for beginners! Dr. Chen explains complex concepts in a very understandable way.'
        }
      ]
    },
    'digital-marketing-course': {
      id: 'digital-marketing-course',
      title: 'Digital Marketing Mastery',
      description: 'Learn social media marketing, SEO, and digital advertising. Master the art of online marketing and grow your business.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      price: 125,
      originalPrice: 249,
      discount: 50,
      rating: 4.6,
      totalReviews: 278,
      modules: 9,
      duration: '14 hours',
      instructor: 'Alex Rodriguez',
      learningOutcomes: [
        'Master social media marketing strategies',
        'Optimize websites for search engines',
        'Create effective digital advertising campaigns',
        'Analyze marketing performance metrics',
        'Build brand awareness online',
        'Convert leads into customers'
      ],
      requirements: [
        'Basic computer and internet skills',
        'No prior marketing experience required',
        'Access to social media platforms'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '9 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'Digital Marketing Fundamentals',
          lessons: [
            { id: 'lesson-1', title: 'Introduction to Digital Marketing', duration: '20 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'Understanding Your Audience', duration: '25 min', type: 'video' }
          ]
        }
      ],
      totalSections: 7,
      totalLectures: 52,
      totalDuration: '14 hours 20 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'David Kim',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 4,
          timeAgo: '1 week ago',
          comment: 'Great course with practical tips. Already seeing improvements in my marketing campaigns!'
        }
      ]
    },
    'mobile-app-development': {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      description: 'Build iOS and Android apps using React Native. Learn to create cross-platform mobile applications from scratch.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      price: 189,
      originalPrice: 379,
      discount: 50,
      rating: 4.9,
      totalReviews: 201,
      modules: 14,
      duration: '18 hours',
      instructor: 'Emma Thompson',
      learningOutcomes: [
        'Build cross-platform mobile apps',
        'Master React Native development',
        'Integrate APIs and databases',
        'Publish apps to app stores',
        'Implement navigation and state management',
        'Create responsive mobile interfaces'
      ],
      requirements: [
        'Basic JavaScript knowledge',
        'Familiarity with React (helpful but not required)',
        'Mobile device for testing (iOS or Android)'
      ],
      features: [
        'Money Back Guarantee',
        'Access on all devices',
        'Certification of completion',
        '14 Modules'
      ],
      curriculum: [
        {
          id: 'section-1',
          title: 'React Native Setup',
          lessons: [
            { id: 'lesson-1', title: 'Introduction to React Native', duration: '25 min', type: 'video', isPreview: true },
            { id: 'lesson-2', title: 'Development Environment Setup', duration: '30 min', type: 'video' }
          ]
        }
      ],
      totalSections: 10,
      totalLectures: 74,
      totalDuration: '18 hours 45 minutes',
      reviews: [
        {
          id: 'review-1',
          userName: 'Carlos Martinez',
          userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByUecIshYfhTZD0pIBcNUzVEG97Ug3r_jWgaagQYC8yLawq-0NOO0cMm0-jwnA4NICCyX_7FXNbEklwShwZa4s1Hf8IKVYqCZiGgPSEDKhBz8UjPUCmI01vHFjwXAu3Zkzxa58cM7WC1aWwAOYrZ79mzHb6aEmhlZej3PSiCMuYR402EtBnWXNWayQk62SY1V6DZ5QqY2aZZyDfSN6WcpHFNl8ckIE5b490JdXwIGb0s0fc59vzahXMSIvvaJZ4rs0OF3AJ0BiJ5fM',
          rating: 5,
          timeAgo: '2 days ago',
          comment: 'Excellent course! Emma is a great instructor and the projects are very practical.'
        }
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      this.course = this.coursesData[courseId] || null;
      
      if (!this.course) {
        console.warn(`Course with ID ${courseId} not found`);
      }
    });
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
    if (this.course) {
      this.expandAllSections = !this.expandAllSections;
      this.course.curriculum.forEach(section => {
        section.isExpanded = this.expandAllSections;
      });
    }
  }

  getLessonIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'video': 'play_circle_outline',
      'quiz': 'quiz',
      'text': 'description',
      'assignment': 'assignment'
    };
    return iconMap[type] || 'play_circle_outline';
  }

  buyCourse() {
    if (this.course) {
      // Navigate to checkout/payment page
      this.router.navigate(['/checkout'], {
        queryParams: {
          courseId: this.course.id,
          courseTitle: this.course.title,
          price: this.course.price
        }
      });
    }
  }

  navigateToCoursesPage() {
    this.router.navigate(['/courses']);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getRatingPercentage(stars: number): number {
    const distribution = [95, 30, 45, 60, 85];
    return distribution[stars - 1] || 0;
  }

  getFeatureIcon(feature: string): string {
    const iconMap: { [key: string]: string } = {
      'Money Back Guarantee': 'monetization_on',
      'Access on all devices': 'devices',
      'Certification of completion': 'card_membership',
      '32 Moduls': 'view_list',
      '28 Moduls': 'view_list'
    };
    return iconMap[feature] || 'check_circle';
  }

  getFeatureColor(feature: string): string {
    const colorMap: { [key: string]: string } = {
      'Money Back Guarantee': 'text-green-500',
      'Access on all devices': 'text-green-500',
      'Certification of completion': 'text-green-500',
      '32 Moduls': 'text-blue-500',
      '28 Moduls': 'text-blue-500'
    };
    return colorMap[feature] || 'text-green-500';
  }

  shareOnFacebook() {
    console.log('Share on Facebook');
  }

  shareOnTwitter() {
    console.log('Share on Twitter');
  }

  shareViaEmail() {
    console.log('Share via email');
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    console.log('Link copied to clipboard');
  }
}
