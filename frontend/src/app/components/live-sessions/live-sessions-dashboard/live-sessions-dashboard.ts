import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface LiveSessionCategory {
  id: string;
  title: string;
  image: string;
  status: 'live' | 'upcoming' | 'ended';
  startTime?: string;
}

interface RecommendedSession {
  id: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-live-sessions-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './live-sessions-dashboard.html',
  styleUrls: ['./live-sessions-dashboard.css']
})
export class LiveSessionsDashboard implements OnInit {
  
  recommendedSessions: RecommendedSession[] = [
    {
      id: '1',
      title: 'Advanced Marketing Strategies',
      description: 'Join now to learn from experts',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8PCxF50i_kcMDCy7s4ccSQAw6dS1iNGX9PQlXuOw0jmfpoXS67DFKMlxMxNc_4k11N_VPn-MLPC7gzHqcuODM_Q6RrGWKf4NSPC1h_9Q4CUORHq4I6zX7DrGTCuV54m3_p6kCSwoM5RvGRE5YDKjPDSLZcBtIusMp77sX-vT4bAofjlpHAMgV-0kTokAIJTVZhNM-zWAGL2p9_zTEnNrFoUdriepx9oAKfA_5HaIGbFKPRjomDf4W17IQigULx73fiCDdUBhSY7Uz'
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Unlock the power of data',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ7JB2N9lMT2y9qa2ipSsaCvsADco_6bnm9vyalOaaUm5I8u-HgpQ_6LxUlScsdoD5axLCiJLC32aVFsqXQi2_CSRM8mutZBN0ftUD-7j_31yMWHXCeYIDRGArbMbDvwasmOLf4tsINZWengqFqvMdEkvLTqQjbI6-S99FD11D8zbWOKE9Ml0xJ9sNA_AujUgrwIKPtT8W0_ScXS5xucZis45TDmniEovoDGt7XUZFFoKD3gsX8B-gmCZOyfYG2BPZBVr3ulLh1Udj'
    },
    {
      id: '3',
      title: 'Modern Graphic Design',
      description: 'Create stunning visuals',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzXQ_vvszYJ-EFpeHM6gb2z6NIcoJA5KeuddIeQzfgRfa4j4qeE-1sR94VsWNwoC3Ypu6wZ59GjDZVaKiubM8_i-NxwuxbaIZIgSa5dYYtmB4gfh5y2QOz3DBx0TbYOwqn6rUnfp9nlkPApEPbGp25Ohq8IZ54IEPC6prvUB3PrZuCJsJ8Xy8Nl8Hb-1LbV5mxxTgcTkUWk7_ZVXIH4nnZTS0aHMp9fQUeiCutnTUHBhuUTP_rFRY1ghwfL5PwMsTQLKZTYLF83kvG'
    }
  ];

  categories: LiveSessionCategory[] = [
    {
      id: '1',
      title: 'Programming',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb725eImcEXl0Ho6EL0xe5cPd1hlyzxAGimPkYKJig1B5CJv1EAu0X1SEtDY-4k-qTrRXiy3zk_l0HYGNHwaoEZS-BjAF7eolEyQXGZrk4K8aS3dTAsgpJUZnGkf_YEBOSPsbsDhODkzJgYMFi0b2nuRMuy4E1O2tM9Xhhg7E-Ffue19WwyE7tKuay-5_BY3QzwWrAf8NR5PkuIqWdqAu5dRL1UlRJFaUiKn0gY-8Us9Ur_rQJHS6fG7OMS_k0d-7AI6QPB33qNgyN',
      status: 'live'
    },
    {
      id: '2',
      title: 'Marketing',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcAvmYE0YG-jG60AgpWT30aeZEQxnObiSW8UXn4gil3cQn4tuGIY3j9YAMonHMC5zQTvJnwSucrViXk0oSEei2QDyTM5haH1SSqvsgDN5YcrLK97Im9jUnTRlVoRkFKKj0psnrBEAS9nNFWjPEfk6tGyDxbYIXf_AhMBhqZJ1qaCapsTUImfb_ADRhr44buTKRwtzeIjaG9rTiKhVs8RTQP9YyDclY_slqib7x5mS65i6bvFN6CH46I4DIc699giF-2aZExtSmhzgV',
      status: 'ended'
    },
    {
      id: '3',
      title: 'Content Creating',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Y6BxZw5Y_-EHUOH43T75jdP26qf4Hg02EoCV9BNpfjDxKl7YDjnDMxl3O85IEn9HBCbpStutDemjVPF5on8PhXf2JZ2uTvjCStE9Am_5n9eL02kt-lFFa_lwTungF0tMky8vFW9M-uO9DZ-0RO2DEFdnsQHriBdZlFl_Giqe86ABzkw454aj0KxxCfFg56VxH7Qw79sfTsW3n6iSzjMLlHCsmoZS2Y61aUAhDTXbAatTNepPtHFGJxbaKH-lJoOyv6q3salZ9XU5',
      status: 'upcoming',
      startTime: '10:00 AM'
    },
    {
      id: '4',
      title: 'Graphic Design',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDon7MzZHNW-WImyD6gU9jlF7dbqIc3Mqarx1HXzZxhNBMDywtwS4GlAOy8jJgrp_RID5soFczncokrIaeb9jKgC0GxABbwNpyH4_KtiIKs-t_C7yZ8ooJiiZspgDvBx-rwujimnEYyiFo1oFSOhmYOL_CqpSPzR3oKdrqt1rFP8RXWWmQ7ACWAXeZmUIp4DBswNEV-tUdKHftq-SSdLPOqHqYKvRgNnijFFztotAgVtR0teJGh8hVSkhJu_zjiiCCm3ajrglxlsc73',
      status: 'upcoming',
      startTime: '2:00 PM'
    },
    {
      id: '5',
      title: 'UI/UX Design',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuBf2DJGuQ5ZYyHt2U1Hh4eZnZl6FPP4xH4l5FtEd5yqVfHr7QDI0geahWFdP43P7dCG_FYa43_4znYcpQIoZmN9fKmiPB7tCdDssI54C1QilVKmqA4Df6fq484Krq6tIhZ9lHW34vCdRO0X8RThn_FZQNeKfUd6c3tbMZMDMPgcOvdpCtzYDseIFAmb0JnrcXaKM5nOIpf87GakCsNqEPFQVSfEKvVZA1qHKaHb4FlhewRo4tw4N_0CazZlRv4bvGgRLGEO5C35sP',
      status: 'live'
    },
    {
      id: '6',
      title: 'Video Editing',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQv6EVYx0LcpvZlgvzwbzaK2YqbotjbHZFjP2mQinLFZ8hAB1SO8MbMx4zidM26VGQg2dVm4ZWGvGaugI3r1JhL0__fLiJKyw6JRe196YbR26V5oxxZB4W-uiEXQxsAbjNH9HW2NZC4SiFS0IA3LYlKRRI5kqTlpeI2vU9ki3Ui60DRd9RSlccon4eH5ttfRjs-f4HHtqnBLj1BShAHbo1QTLlUDYMNBNC3izSTzA-zHQR1CS42oz8Lc2wo5pSWYPy4Ro3Bcsk9ax5',
      status: 'ended'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getStatusClass(status: string): string {
    switch (status) {
      case 'live':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'live':
        return 'Live';
      case 'upcoming':
        return 'Upcoming';
      case 'ended':
        return 'Ended';
      default:
        return 'Unknown';
    }
  }

  joinSession(sessionId: string): void {
    // Navigate to live session room
    console.log('Joining session:', sessionId);
  }
}
