import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 100% DATABASE RESET - Delete all data in correct order
  console.log('🗑️  Resetting database...');

  // Delete in reverse dependency order
  await prisma.submission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database reset completed');

  // Create categories
  const categories = [
    {
      name: 'Development',
      slug: 'development',
      description: 'Programming and software development courses',
      icon: 'code',
      color: 'blue'
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'UI/UX design and creative courses',
      icon: 'brush',
      color: 'teal'
    },
    {
      name: 'Business',
      slug: 'business',
      description: 'Business and entrepreneurship courses',
      icon: 'business_center',
      color: 'green'
    },
    {
      name: 'Data Science',
      slug: 'data-science',
      description: 'Data analysis and machine learning courses',
      icon: 'analytics',
      color: 'purple'
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      description: 'Digital marketing and growth courses',
      icon: 'campaign',
      color: 'orange'
    }
  ];

  console.log('Creating categories...');
  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category
    });
    createdCategories.push(createdCategory);
    console.log(`Created category: ${createdCategory.name}`);
  }

  // Create users with dummy data
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('Password123', 12);

  // Create test users with real emails first
  const testUsers = [
    {
      firstName: 'Jimmy',
      lastName: 'Kimunyi',
      email: 'jkkimunyi@gmail.com',
      username: 'jimmy_kimunyi_admin',
      role: Role.ADMIN, // Make this user an admin
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'System Administrator and Full-stack Developer with expertise in web development and system management.',
      title: 'System Administrator',
      specialty: 'System Administration',
      experience: '10+ years',
      expertise: 'JavaScript, React, Node.js, TypeScript, Python, System Administration',
      rating: 5.0,
      totalStudents: 0 // Admin doesn't teach
    },
    {
      firstName: 'Jimmy',
      lastName: 'K',
      email: 'jimmykimunyi@gmail.com',
      username: 'jimmy_k',
      role: Role.INSTRUCTOR,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Data scientist and machine learning engineer with expertise in Python and AI. Love making complex topics simple.',
      title: 'Senior Data Scientist',
      specialty: 'Data Science',
      experience: '6+ years',
      expertise: 'Python, Machine Learning, TensorFlow, Data Analysis',
      rating: 4.9,
      totalStudents: 890
    },
    {
      firstName: 'Kimunyi',
      lastName: 'Jimmy',
      email: 'kimunyi.jimmy@gmail.com',
      username: 'kimunyi_jimmy',
      role: Role.STUDENT,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Passionate learner exploring web development and data science.'
    }
  ];

  // Create test users
  const instructors = [];
  const students = [];
  const admins = [];

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    if (user.role === Role.ADMIN) {
      admins.push(user);
      console.log(`Created admin: ${user.email}`);
    } else if (user.role === Role.INSTRUCTOR) {
      instructors.push(user);
      console.log(`Created instructor: ${user.email}`);
    } else {
      students.push(user);
      console.log(`Created student: ${user.email}`);
    }
  }

  // Create additional instructors with faker
  for (let i = 0; i < 6; i++) {
    const instructor = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
        role: Role.INSTRUCTOR,
        isActive: faker.datatype.boolean({ probability: 0.9 }),
        isVerified: faker.datatype.boolean({ probability: 0.8 }),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
        title: faker.helpers.arrayElement(['Senior Developer', 'Lead Engineer', 'Technical Architect', 'Principal Developer', 'Engineering Manager']),
        specialty: faker.helpers.arrayElement(['Web Development', 'Mobile Development', 'DevOps', 'Data Science', 'AI/ML', 'Cybersecurity']),
        experience: faker.helpers.arrayElement(['2+ years', '3+ years', '5+ years', '7+ years', '10+ years']),
        expertise: faker.helpers.arrayElements(['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'AWS', 'Docker', 'Kubernetes'], 3).join(', '),
        rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
        totalStudents: faker.number.int({ min: 50, max: 2000 })
      }
    });
    instructors.push(instructor);
  }

  // Create additional students with faker
  for (let i = 0; i < 50; i++) {
    const student = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedPassword,
        role: Role.STUDENT,
        isActive: faker.datatype.boolean({ probability: 0.95 }),
        isVerified: faker.datatype.boolean({ probability: 0.9 }),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentence()
      }
    });
    students.push(student);
  }

  console.log(`Created ${admins.length} admins, ${instructors.length} instructors and ${students.length} students`);

  // Course templates with dummy data
  const courseTemplates = [
    {
      title: 'Complete React Development Course',
      description: 'Master React from basics to advanced concepts including hooks, context, routing, and state management. Build real-world projects and become a React expert.',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      duration: '25 hours',
      level: 'intermediate',
      modules: 8,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      features: [
        'Source code included',
        'Downloadable resources',
        'Full lifetime access',
        'Access on mobile and TV',
        'Certificate of completion'
      ],
      learningOutcomes: [
        'Build modern React applications',
        'Understand React hooks and context',
        'Implement routing with React Router',
        'State management with Redux',
        'Test React applications',
        'Deploy to production',
        'Optimize performance',
        'Integrate with APIs and external services'
      ],
      requirements: [
        'Basic understanding of JavaScript',
        'HTML and CSS fundamentals',
        'Code editor (VS Code recommended)',
        'Node.js installed',
        'Git version control basics'
      ],
      categoryName: 'Development'
    },
    {
      title: 'Advanced Node.js and Express Development',
      description: 'Master backend development with Node.js and Express. Learn to build scalable APIs, handle authentication, and deploy to production.',
      price: 249.99,
      originalPrice: 349.99,
      discount: 28,
      duration: '30 hours',
      level: 'advanced',
      modules: 10,
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
      features: [
        'RESTful API development',
        'Authentication and authorization',
        'Database integration',
        'Testing strategies',
        'Performance optimization',
        'Deployment strategies'
      ],
      learningOutcomes: [
        'Build scalable Node.js applications',
        'Create secure authentication systems',
        'Design and implement REST APIs',
        'Work with databases (MongoDB, PostgreSQL)',
        'Implement real-time features',
        'Deploy to cloud platforms',
        'Optimize application performance',
        'Write comprehensive tests'
      ],
      requirements: [
        'Solid JavaScript knowledge',
        'Understanding of HTTP protocols',
        'Basic database concepts',
        'Git version control',
        'Command line familiarity'
      ],
      categoryName: 'Development'
    },
    {
      title: 'UI/UX Design Masterclass',
      description: 'Create stunning user interfaces and experiences. Learn design principles, user research, prototyping, and modern design tools.',
      price: 179.99,
      originalPrice: 249.99,
      discount: 28,
      duration: '20 hours',
      level: 'beginner',
      modules: 6,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      features: [
        'Design thinking methodology',
        'Figma and Adobe XD tutorials',
        'User research techniques',
        'Prototyping and wireframing',
        'Design system creation',
        'Portfolio development'
      ],
      learningOutcomes: [
        'Master design principles',
        'Conduct user research',
        'Create wireframes and prototypes',
        'Design responsive interfaces',
        'Build design systems',
        'Use professional design tools',
        'Present design solutions',
        'Collaborate with developers'
      ],
      requirements: [
        'Creative mindset',
        'Basic computer skills',
        'Figma account (free)',
        'No prior design experience needed'
      ],
      categoryName: 'Design'
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python programming for data analysis, visualization, and machine learning. Work with real datasets and build predictive models.',
      price: 159.99,
      originalPrice: 229.99,
      discount: 30,
      duration: '18 hours',
      level: 'intermediate',
      modules: 7,
      thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=600&fit=crop',
      features: [
        'Pandas and NumPy mastery',
        'Data visualization with Matplotlib',
        'Machine learning basics',
        'Real-world projects',
        'Jupyter notebooks included',
        'Career guidance'
      ],
      learningOutcomes: [
        'Master Python for data analysis',
        'Work with Pandas and NumPy',
        'Create data visualizations',
        'Build machine learning models',
        'Clean and preprocess data',
        'Statistical analysis',
        'Work with APIs and databases',
        'Present findings effectively'
      ],
      requirements: [
        'Basic Python knowledge',
        'Statistics fundamentals',
        'Jupyter Notebook setup',
        'Mathematical thinking'
      ],
      categoryName: 'Data Science'
    },
    {
      title: 'Digital Marketing Strategy',
      description: 'Master digital marketing from strategy to execution. Learn SEO, social media, content marketing, and analytics.',
      price: 129.99,
      originalPrice: 189.99,
      discount: 32,
      duration: '15 hours',
      level: 'beginner',
      modules: 5,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      features: [
        'SEO optimization',
        'Social media marketing',
        'Content strategy',
        'Email marketing',
        'Analytics and reporting',
        'Campaign management'
      ],
      learningOutcomes: [
        'Develop marketing strategies',
        'Optimize for search engines',
        'Create engaging content',
        'Run social media campaigns',
        'Analyze marketing metrics',
        'Build email campaigns',
        'Manage advertising budgets',
        'Measure ROI effectively'
      ],
      requirements: [
        'Basic computer skills',
        'Social media familiarity',
        'Business awareness',
        'Google Analytics account'
      ],
      categoryName: 'Marketing'
    },
    {
      title: 'Entrepreneurship and Business Development',
      description: 'Learn how to start and grow a successful business. From idea validation to scaling, master the entrepreneurial journey.',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      duration: '22 hours',
      level: 'intermediate',
      modules: 8,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      features: [
        'Business plan development',
        'Market research methods',
        'Funding strategies',
        'Legal considerations',
        'Marketing and sales',
        'Financial management'
      ],
      learningOutcomes: [
        'Validate business ideas',
        'Create comprehensive business plans',
        'Understand market dynamics',
        'Secure funding and investment',
        'Build and manage teams',
        'Develop go-to-market strategies',
        'Navigate legal requirements',
        'Scale business operations'
      ],
      requirements: [
        'Business idea or interest',
        'Basic financial literacy',
        'Willingness to research',
        'Entrepreneurial mindset'
      ],
      categoryName: 'Business'
    }
  ];

  // Create courses
  console.log('Creating courses...');
  const createdCourses = [];

  for (const courseTemplate of courseTemplates) {
    const category = createdCategories.find(cat => cat.name === courseTemplate.categoryName);
    const instructor = instructors[Math.floor(Math.random() * instructors.length)];
    
    const course = await prisma.course.create({
      data: {
        title: courseTemplate.title,
        description: courseTemplate.description,
        price: courseTemplate.price,
        originalPrice: courseTemplate.originalPrice,
        discount: courseTemplate.discount,
        duration: courseTemplate.duration,
        level: courseTemplate.level,
        modules: courseTemplate.modules,
        thumbnail: courseTemplate.thumbnail,
        heroImage: courseTemplate.heroImage,
        features: courseTemplate.features,
        learningOutcomes: courseTemplate.learningOutcomes,
        requirements: courseTemplate.requirements,
        whatYouLearn: courseTemplate.learningOutcomes,
        courseContent: courseTemplate.features,
        courseRequirements: courseTemplate.requirements,
        targetAudience: [
          'Aspiring developers',
          'Career changers',
          'Students',
          'Working professionals'
        ],
        isPublished: true,
        categoryId: category?.id,
        instructorId: instructor.id,
        rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
        totalReviews: faker.number.int({ min: 10, max: 500 }),
        totalSections: faker.number.int({ min: 5, max: 12 }),
        totalLectures: faker.number.int({ min: 20, max: 100 }),
        totalQuizzes: faker.number.int({ min: 3, max: 15 }),
        totalDuration: courseTemplate.duration,
        curriculum: {
          sections: [], // Will be populated later
          totalSections: 0,
          totalLessons: 0,
          totalQuizzes: 0
        }
      }
    });
    
    createdCourses.push(course);
    console.log(`Created course: ${course.title} by ${instructor.firstName} ${instructor.lastName}`);
  }

  // Create lessons for each course
  console.log('Creating lessons...');
  for (const course of createdCourses) {
    for (let i = 0; i < 5; i++) {
      await prisma.lesson.create({
        data: {
          title: `Lesson ${i + 1}: ${faker.lorem.words(3)}`,
          content: faker.lorem.paragraphs(2),
          videoUrl: `https://example.com/video-${i + 1}.mp4`,
          duration: `${faker.number.int({ min: 5, max: 20 })} minutes`,
          order: i + 1,
          type: faker.helpers.arrayElement(['video', 'text', 'quiz']),
          isPreview: i === 0, // First lesson is preview
          isPublished: true,
          courseId: course.id
        }
      });
    }
  }

  // Create quizzes for each course
  console.log('Creating quizzes...');
  const quizzes = [];

  for (const course of createdCourses) {
    const courseQuizzes = [];

    // Create 2 quizzes per course
    for (let i = 0; i < 2; i++) {
      const quiz = await prisma.quiz.create({
        data: {
          title: `Quiz ${i + 1}: ${course.title}`,
          description: `Test your knowledge of ${course.title}`,
          duration: 15 + (i * 5), // 15, 20 minutes
          order: (i + 1) * 10,
          isPublished: true,
          courseId: course.id,
          questions: {
            questions: [
              {
                id: '1',
                question: "What is the main topic of this course?",
                type: "multiple_choice",
                options: [
                  { id: 'a', text: "Frontend Development", correct: true },
                  { id: 'b', text: "Backend Development", correct: false },
                  { id: 'c', text: "Database Design", correct: false },
                  { id: 'd', text: "DevOps", correct: false }
                ],
                points: 10,
                explanation: "This course focuses on frontend development technologies."
              },
              {
                id: '2',
                question: "Which skill will you learn in this course?",
                type: "multiple_choice",
                options: [
                  { id: 'a', text: "React Development", correct: true },
                  { id: 'b', text: "Java Programming", correct: false },
                  { id: 'c', text: "Database Administration", correct: false },
                  { id: 'd', text: "Network Security", correct: false }
                ],
                points: 10,
                explanation: "React is one of the main technologies covered in this course."
              },
              {
                id: '3',
                question: "True or False: This course includes practical projects.",
                type: "true_false",
                options: [
                  { id: 'true', text: "True", correct: true },
                  { id: 'false', text: "False", correct: false }
                ],
                points: 5,
                explanation: "Yes, this course includes hands-on practical projects."
              }
            ],
            totalPoints: 25,
            passingScore: 70
          }
        }
      });
      courseQuizzes.push(quiz);
    }

    quizzes.push(...courseQuizzes);
  }

  console.log(`Created ${quizzes.length} quizzes`);

  // Update course curriculum to include quizzes
  console.log('Updating course curriculum with quizzes...');
  for (const course of createdCourses) {
    const courseLessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    const courseQuizzes = await prisma.quiz.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' }
    });

    // Update curriculum structure
    const curriculum = {
      sections: [
        {
          id: '1',
          title: 'Getting Started',
          lessons: courseLessons.slice(0, 2).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: lesson.type,
            isPreview: lesson.isPreview
          })),
          quizzes: courseQuizzes.slice(0, 1).map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            duration: quiz.duration,
            order: quiz.order
          })),
          totalDuration: courseLessons.slice(0, 2).length * 15
        },
        {
          id: '2',
          title: 'Advanced Topics',
          lessons: courseLessons.slice(2).map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: lesson.type,
            isPreview: lesson.isPreview
          })),
          quizzes: courseQuizzes.slice(1).map(quiz => ({
            id: quiz.id,
            title: quiz.title,
            duration: quiz.duration,
            order: quiz.order
          })),
          totalDuration: courseLessons.slice(2).length * 15
        }
      ],
      totalSections: 2,
      totalLessons: courseLessons.length,
      totalQuizzes: courseQuizzes.length
    };

    await prisma.course.update({
      where: { id: course.id },
      data: {
        curriculum: curriculum,
        totalSections: curriculum.totalSections,
        totalLectures: curriculum.totalLessons,
        totalQuizzes: curriculum.totalQuizzes
      }
    });
  }

  // Create enrollments
  console.log('Creating enrollments...');
  for (const student of students.slice(0, 20)) {
    const randomCourses = faker.helpers.arrayElements(createdCourses, faker.number.int({ min: 1, max: 3 }));
    
    for (const course of randomCourses) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: faker.number.int({ min: 0, max: 100 }),
          currentLesson: faker.number.int({ min: 1, max: 5 }),
          completedLessons: faker.helpers.arrayElements(['1', '2', '3', '4', '5'], faker.number.int({ min: 0, max: 3 }))
        }
      });
    }
  }

  // Create reviews
  console.log('Creating reviews...');
  for (const course of createdCourses) {
    const reviewCount = faker.number.int({ min: 5, max: 20 });
    const reviewers = faker.helpers.arrayElements(students, reviewCount);
    
    for (const reviewer of reviewers) {
      await prisma.review.create({
        data: {
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.paragraph(),
          courseId: course.id,
          userId: reviewer.id
        }
      });
    }
  }

  // Create some payments
  console.log('Creating payments...');
  for (const student of students.slice(0, 10)) {
    const randomCourse = faker.helpers.arrayElement(createdCourses);
    
    await prisma.payment.create({
      data: {
        amount: randomCourse.price,
        phoneNumber: '+254700000000',
        status: faker.helpers.arrayElement(['COMPLETED', 'PENDING', 'FAILED']),
        resultDescription: 'Payment successful',
        courseId: randomCourse.id,
        userId: student.id
      }
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${admins.length} admins created`);
  console.log(`   - ${instructors.length} instructors created`);
  console.log(`   - ${students.length} students created`);
  console.log(`   - ${createdCategories.length} categories created`);
  console.log(`   - ${createdCourses.length} courses created`);
  console.log(`   - ${quizzes.length} quizzes created`);
  console.log(`   - Enrollments, reviews, and payments created`);
  console.log(`🔑 Admin Account: jkkimunyi@gmail.com / Password123`);
  console.log(`🎓 Instructor Account: jimmykimunyi@gmail.com / Password123`);
  console.log(`👨‍🎓 Student Account: kimunyi.jimmy@gmail.com / Password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });