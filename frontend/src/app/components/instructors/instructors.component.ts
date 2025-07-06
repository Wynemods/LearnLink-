import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  title: string;
  expertise: string;
  rating: number;
  students: number;
  courses: number;
  about: string;
  coursesList: CourseItem[];
}

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-instructors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style='font-family: Lexend, "Noto Sans", sans-serif;'>
      <div class="layout-container flex h-full grow flex-col">
        <div class="px-40 flex flex-1 justify-center py-5">
          <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div class="flex flex-wrap justify-between gap-3 p-4">
              <div class="flex min-w-72 flex-col gap-3">
                <p class="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Instructors</p>
                <p class="text-[#637488] text-sm font-normal leading-normal">Browse courses taught by our top instructors</p>
              </div>
            </div>
            <h2 class="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Instructors</h2>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div 
                *ngFor="let instructor of instructors" 
                class="flex flex-col gap-3 pb-3 cursor-pointer hover:transform hover:scale-105 transition-transform duration-300"
                (click)="viewInstructorDetails(instructor.id)"
              >
                <div
                  class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  [style.background-image]="'url(' + instructor.image + ')'"
                ></div>
                <div>
                  <p class="text-[#111418] text-base font-medium leading-normal">{{ instructor.name }}</p>
                  <p class="text-[#637488] text-sm font-normal leading-normal">{{ instructor.specialty }}, {{ instructor.experience }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InstructorsComponent {
  instructors: Instructor[] = [
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
      about: 'Ethan is a passionate web developer with 5 years of experience in building modern web applications. He specializes in React, Node.js, and TypeScript.',
      coursesList: [
        {
          id: 'react-fundamentals',
          title: 'React Fundamentals',
          description: 'Learn the basics of React development',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        },
        {
          id: 'advanced-react',
          title: 'Advanced React Patterns',
          description: 'Master advanced React development techniques',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTR8tpDM6XXd7e_HbBR7AVy-CQM1FB9ddwzHgB17LMzRNguNL5hDiYf_qXbEbJ-GpeNnd7KU3QT4o-Al65Z27co5MvFyqIPRSznoi3eQWG6Q-JfLpSlT-Y9EoXMr5WLJwFej8LNujJeO56VCgUOpWFAm5VCYj23eAeqDMdKJZHmM0ZY-hcv4i4Co_j2ef2s086KpzlZc3Cz2OB0Yob0Q_DFWSesSs9QvxAjRGxaCxGLk2-QgME02YOWwJFov8lVzsF-nqLxBXwfg'
        }
      ]
    },
    {
      id: 'sophia-bennett',
      name: 'Sophia Bennett',
      specialty: 'Data Science',
      experience: '8 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhtlKYNdeIvE-cl0w_tHFy90BwayG9CUG5yeMhYeET9K-ujaPUK22L_lZ0sR_XumwbDWPuP3PIeeREN1-Oczs19YxAGzJEfJaQrW4MV2sUJh_F8VnRX5d_aC0H5AYW60a7bN0P46bvZbAAIMpovK2iSNu6Of-cCx13H5-L2FVfAdj4G7wjT1HWz_2rtJTMrO7CH0V4O3vjkYiPbIXZfNk_JwcNGxUP4vbtruuvKftHFtJqJhRqskJVPyCMTX-soDHa7iT-WU0fGw',
      title: 'Data Science Expert',
      expertise: 'Python, Machine Learning, Statistics',
      rating: 4.8,
      students: 12000,
      courses: 15,
      about: 'Sophia is a data science expert with 8 years of experience in machine learning and statistical analysis. She has helped thousands of students master data science concepts.',
      coursesList: [
        {
          id: 'python-data-science',
          title: 'Python for Data Science',
          description: 'Learn Python programming for data analysis',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        }
      ]
    },
    {
      id: 'liam-harper',
      name: 'Liam Harper',
      specialty: 'Mobile Development',
      experience: '10 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOLIry3F4TSS5SpBJkEAYeAlk0eHyCNnU-zy9eQ4PWmOqdEMOZrbwcTqds8nRiwVkLn4mVXmqVoinpka11_pKSKBEBk5Lt4J31v4C5enJFGqOV91V1ErazbKrEnJ4liZkntlabWJGTvY3juOFmXH47dLHIBNAjJfnYk4j1z-8OZLZPbaM1kWrdq_gL_qekv74ofMyidiQYp3xSTmlSs4bWQKWcqwkQfuSlPvJ_V3AtZd3k3m_m-c9y8Uare0kY1UtNFDguWqa-oQ',
      title: 'Senior Mobile Developer',
      expertise: 'React Native, iOS, Android',
      rating: 4.9,
      students: 8000,
      courses: 12,
      about: 'Liam is a senior mobile developer with 10 years of experience in creating cross-platform mobile applications using React Native and native technologies.',
      coursesList: [
        {
          id: 'react-native-basics',
          title: 'React Native Fundamentals',
          description: 'Build mobile apps with React Native',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        }
      ]
    },
    {
      id: 'olivia-hayes',
      name: 'Olivia Hayes',
      specialty: 'UI/UX Design',
      experience: '3 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhboJgxV_jY616U-Eqxpvoysa55eN_U3-RWvBizo5-s-9JT7SyfFN8E2blXl1V3VtUfAva6p986ORjSi6U2rN2jwDaCKoi0tyV8yB1yxd0-V8zP1kTgD29Gvw0swbCZVT12tdmyU02ILaIOnAFlO3r3SoQ2dQp-Ipm58mY2gPjDpxEgfvoh_EdYQ3gBi6nawg5qLzgQIw_UwfuiPRlATetXvqjvE7YCTNuCGhFRZb0N0l90KlkAj9lCgSZ7XMIwN4QOvSrGEXQCQ',
      title: 'UI/UX Designer',
      expertise: 'Figma, Adobe XD, User Research',
      rating: 4.7,
      students: 3000,
      courses: 6,
      about: 'Olivia is a talented UI/UX designer with 3 years of experience in creating beautiful and user-friendly interfaces. She specializes in user research and design systems.',
      coursesList: [
        {
          id: 'figma-design',
          title: 'Figma for Beginners',
          description: 'Learn design fundamentals with Figma',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        }
      ]
    },
    {
      id: 'noah-foster',
      name: 'Noah Foster',
      specialty: 'Cloud Computing',
      experience: '7 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgj6PSscPn-mosinp9OflsC22Szcx-RU2l1YIIq7yQ6Z27AW-oclnh4yZLFXZdMMJ3_djotaqvC8aqIKM6Gks7R5c2O0QevvlxUoRABp8Ro9IDpgMOo5P2vW6WIp32hrf3csbY9mk4CqoUYCc9L9l3I9EjtiaVL6CNoJvkZ3HaKhVTn2Yt2iQD8CVz4m2TI7Oz44k4sqKtlBGsdia6FuPFM38CuE_M2vl_BSMlJyVXoxGZp5o0S81gs8vS_xOKNaDIE0_JViOLLg',
      title: 'Cloud Architect',
      expertise: 'AWS, Azure, DevOps',
      rating: 4.8,
      students: 7000,
      courses: 10,
      about: 'Noah is a cloud architect with 7 years of experience in designing and implementing cloud solutions. He specializes in AWS, Azure, and DevOps practices.',
      coursesList: [
        {
          id: 'aws-fundamentals',
          title: 'AWS Cloud Fundamentals',
          description: 'Master AWS cloud services and architecture',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        }
      ]
    },
    {
      id: 'ava-morgan',
      name: 'Ava Morgan',
      specialty: 'Cybersecurity',
      experience: '6 years',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArEYAj4ezM97L3WQBE91Y8MlX0-3-KW7NsExPlEy6qVELWqHJQVllTcqLUI7KmSy3ACNgYFEcB9nww5iA1grbgrOqDg2gh50xwT4Cw2Dg9u38RJJrkTgJdaFHPNQ6J0Ssap5cK8WBik5ENM4djbZVOwwiBJyp9lKhdl_80H4n6tAlmR1UhEfKB9eHH7zkE1c19hKMzEjRipRhnq4sIDCq7kVhLzLfkLQhENIDg4ioN4IWPYs2pNoOlDbtGB-T0RzoEfYUoCxkubg',
      title: 'Cybersecurity Specialist',
      expertise: 'Penetration Testing, Security Auditing',
      rating: 4.9,
      students: 4500,
      courses: 8,
      about: 'Ava is a cybersecurity specialist with 6 years of experience in protecting digital assets. She specializes in penetration testing and security auditing.',
      coursesList: [
        {
          id: 'ethical-hacking',
          title: 'Ethical Hacking Fundamentals',
          description: 'Learn ethical hacking and penetration testing',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO4gf-IDklK25IZBou2lmAmxnnc6LXJyAh1l-YZfIm-JeEmGzyVigKRIGadruw3BhCkh8e4XlteJlYxlHzycCdQRCRdaY9ozrsvYfN4F5YIZFCrB2bDdIW93n424PQj3mp1pRxY1mSOU9ALPNj69mCBsiat6x-G-IdOYs5RghEKc0SdHSRys8QGLcXKr4Up5VwwTB09N1BX2qfkDKM0yl4FJ6TKR0iEll5cgXTD4dSNIjmXoqpxjUjLup9Kn3QcfiQ7116TBu-QA'
        }
      ]
    },
    // Add more instructors as needed...
  ];

  constructor(private router: Router) {}

  viewInstructorDetails(instructorId: string) {
    this.router.navigate(['/instructors', instructorId]);
  }
}