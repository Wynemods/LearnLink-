import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Instructor } from '../instructors.component';

@Component({
  selector: 'app-instructor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructor-detail.html',
  styleUrls: ['./instructor-detail.css']
})
export class InstructorDetail implements OnInit {
  instructor: Instructor | null = null;

  // Sample instructor data - in a real app, this would come from a service
  private instructors: Instructor[] = [
    {
      id: 'ethan-carter',
      name: 'Ethan Carter',
      specialty: 'Web Development',
      experience: '5 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwLR_2PwCxnbC2xMuhX99Kj7oR7QhdFHlM8HQqWiaq5RP44V69i9iazXdHRTxXGILieDPXB5qhjWtGIIkQ4ifrQU8bIEIyXFt6vJpKnNRQbxyKkfnqlR7bRNJvuSOnoBX4YZVvq3Te1ea4aJJXdPHpMU5izP_dEPR4_sTIO_9QqFRxTZRJ4ycg_JwCcPoZv-u-GvL1l_UarIp7OOeKajoZa8Hga0xBL0BotZjnuWQb69hvngxrQ_z1xM-cJOhlCj5Cc6ygEE205w',
      title: 'Senior Web Developer',
      expertise: 'React, Node.js, TypeScript',
      rating: 4.9,
      students: 5000,
      courses: 8,
      about: 'Ethan is a passionate web developer with 5 years of experience in building modern web applications. He specializes in React, Node.js, and TypeScript, and has mentored thousands of students in their journey to become skilled developers.',
      coursesList: [
        {
          id: 'react-fundamentals',
          title: 'React Fundamentals',
          description: 'Learn the basics of React development and build your first applications',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        },
        {
          id: 'advanced-react',
          title: 'Advanced React Patterns',
          description: 'Master advanced React development techniques and patterns',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTR8tpDM6XXd7e_HbBR7AVy-CQM1FB9ddwzHgB17LMzRNguNL5hDiYf_qXbEbJ-GpeNnd7KU3QT4o-Al65Z27co5MvFyqIPRSznoi3eQWG6Q-JfLpSlT-Y9EoXMr5WLJwFej8LNujJeO56VCgUOpWFAm5VCYj23eAeqDMdKJZHmM0ZY-hcv4i4Co_j2ef2s086KpzlZc3Cz2OB0Yob0Q_DFWSesSs9QvxAjRGxaCxGLk2-QgME02YOWwJFov8lVzsF-nqLxBXwfg'
        },
        {
          id: 'typescript-essentials',
          title: 'TypeScript Essentials',
          description: 'Learn TypeScript fundamentals and advanced features',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwnST76Dj8yMlst569b3iuFf2gb5FJ12LqOIXR-AY5WwL7XnNlBL2m54tCCvn9fp625E-J95h-yiO_fyDYT_Xd45qqJ0Hox1H_RDTM7twKIBbiIY8frblOhMIYAaqPpyxuOF8sBORtcNnp9TCo_En_t4czEcYsX4snhE0hzvQOdwcEWA45OYZPYOrN4JzvEWDpclaKJrj-fqI69-tOuIzTQcEQGHKGliJiU1oxmEBo0cvKtn9NTrfBPPJCh-NsHvGsHZokMRSYTQ'
        }
      ]
    },
    // Add more instructors as needed...
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const instructorId = this.route.snapshot.paramMap.get('id');
    if (instructorId) {
      this.instructor = this.instructors.find(i => i.id === instructorId) || null;
    }
  }

  viewCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
  }

  goBack() {
    this.router.navigate(['/instructors']);
  }
}
