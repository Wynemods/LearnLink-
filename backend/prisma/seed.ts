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
    const created = await prisma.category.create({
      data: category,
    });
    createdCategories.push(created);
    console.log(`Created category: ${created.name}`);
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
      username: 'jimmy_kimunyi',
      role: Role.INSTRUCTOR,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Experienced full-stack developer with 8+ years in web development. Passionate about teaching modern web technologies.',
      title: 'Senior Full Stack Developer',
      specialty: 'Web Development',
      experience: '8+ years',
      expertise: 'JavaScript, React, Node.js, TypeScript, Python',
      rating: 4.8,
      totalStudents: 1250
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

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    if (userData.role === Role.INSTRUCTOR) {
      instructors.push(user);
      console.log(`Created test instructor: ${user.firstName} ${user.lastName} (${user.email})`);
    } else {
      students.push(user);
      console.log(`Created test student: ${user.firstName} ${user.lastName} (${user.email})`);
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
        isActive: true,
        isVerified: true,
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentences(3),
        title: faker.helpers.arrayElement([
          'Senior Developer',
          'Full Stack Engineer',
          'Data Scientist',
          'UX Designer',
          'Marketing Specialist',
          'Business Analyst'
        ]),
        specialty: faker.helpers.arrayElement([
          'Web Development',
          'Mobile Development',
          'Data Science',
          'UI/UX Design',
          'Digital Marketing',
          'Business Strategy'
        ]),
        experience: faker.helpers.arrayElement(['2+ years', '3+ years', '5+ years', '7+ years', '10+ years']),
        expertise: faker.helpers.arrayElements([
          'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java'
        ], { min: 3, max: 5 }).join(', '),
        rating: parseFloat(faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }).toFixed(1)),
        totalStudents: faker.number.int({ min: 100, max: 5000 })
      }
    });
    instructors.push(instructor);
    console.log(`Created instructor: ${instructor.firstName} ${instructor.lastName}`);
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
        isActive: true,
        isVerified: faker.datatype.boolean(),
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.sentence()
      }
    });
    students.push(student);
  }

  console.log(`Created ${instructors.length} instructors and ${students.length} students`);

  // Course templates with dummy data
  const courseTemplates = [
    {
      title: 'Complete Web Development Bootcamp',
      description: 'Master modern web development with HTML, CSS, JavaScript, React, Node.js, and more.',
      price: 89.99,
      originalPrice: 199.99,
      discount: 55,
      duration: '40 hours',
      level: 'beginner',
      modules: 12,
      features: ['Lifetime access', 'Certificate of completion', 'Mobile access'],
      learningOutcomes: ['Build responsive websites', 'Create React applications', 'Deploy to cloud'],
      requirements: ['Basic computer skills', 'Internet connection'],
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=600&fit=crop',
      curriculum: {
        sections: [
          {
            id: '1',
            title: 'HTML & CSS Fundamentals',
            lessons: [
              { id: '1', title: 'Introduction to HTML', duration: '15 min', type: 'video' },
              { id: '2', title: 'CSS Styling', duration: '20 min', type: 'video' }
            ]
          }
        ]
      }
    },
    {
      title: 'Data Science with Python',
      description: 'Learn data analysis and machine learning with Python.',
      price: 79.99,
      originalPrice: 159.99,
      discount: 50,
      duration: '35 hours',
      level: 'intermediate',
      modules: 10,
      features: ['Hands-on projects', 'Real datasets', 'Jupyter notebooks'],
      learningOutcomes: ['Analyze data with pandas', 'Build ML models', 'Create visualizations'],
      requirements: ['Basic Python knowledge', 'High school math'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      curriculum: {
        sections: [
          {
            id: '1',
            title: 'Python for Data Science',
            lessons: [
              { id: '1', title: 'NumPy Basics', duration: '20 min', type: 'video' },
              { id: '2', title: 'Pandas DataFrames', duration: '25 min', type: 'video' }
            ]
          }
        ]
      }
    },
    {
      title: 'UI/UX Design Masterclass',
      description: 'Master user interface and user experience design principles.',
      price: 69.99,
      originalPrice: 129.99,
      discount: 46,
      duration: '25 hours',
      level: 'beginner',
      modules: 8,
      features: ['Design projects', 'Figma templates', 'Portfolio building'],
      learningOutcomes: ['Create user-centered designs', 'Build prototypes', 'Master Figma'],
      requirements: ['No prior experience', 'Creative mindset'],
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
      curriculum: {
        sections: [
          {
            id: '1',
            title: 'Design Fundamentals',
            lessons: [
              { id: '1', title: 'Design Principles', duration: '15 min', type: 'video' },
              { id: '2', title: 'Color Theory', duration: '20 min', type: 'video' }
            ]
          }
        ]
      }
    },
    {
      title: 'Digital Marketing Strategy',
      description: 'Learn comprehensive digital marketing strategies and tactics.',
      price: 59.99,
      originalPrice: 119.99,
      discount: 50,
      duration: '20 hours',
      level: 'beginner',
      modules: 6,
      features: ['Marketing templates', 'Case studies', 'Analytics tools'],
      learningOutcomes: ['Develop marketing strategies', 'Master SEO', 'Create campaigns'],
      requirements: ['Basic computer skills', 'Interest in marketing'],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      curriculum: {
        sections: [
          {
            id: '1',
            title: 'Marketing Fundamentals',
            lessons: [
              { id: '1', title: 'Digital Marketing Overview', duration: '15 min', type: 'video' },
              { id: '2', title: 'Target Audience Research', duration: '20 min', type: 'video' }
            ]
          }
        ]
      }
    },
    {
      title: 'Business Analytics & Intelligence',
      description: 'Master business intelligence tools and make data-driven decisions.',
      price: 74.99,
      originalPrice: 149.99,
      discount: 50,
      duration: '30 hours',
      level: 'intermediate',
      modules: 9,
      features: ['BI tools access', 'Real business cases', 'Dashboard templates'],
      learningOutcomes: ['Create dashboards', 'Analyze metrics', 'Make decisions'],
      requirements: ['Basic Excel knowledge', 'Business understanding'],
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      curriculum: {
        sections: [
          {
            id: '1',
            title: 'Business Intelligence Basics',
            lessons: [
              { id: '1', title: 'Introduction to BI', duration: '15 min', type: 'video' },
              { id: '2', title: 'Data Collection', duration: '20 min', type: 'video' }
            ]
          }
        ]
      }
    }
  ];

  // Create courses
  console.log('Creating courses...');
  const createdCourses = [];

  for (const courseTemplate of courseTemplates) {
    const instructor = faker.helpers.arrayElement(instructors);
    const category = faker.helpers.arrayElement(createdCategories);

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
        rating: parseFloat(faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }).toFixed(1)),
        totalReviews: faker.number.int({ min: 10, max: 500 }),
        features: courseTemplate.features,
        learningOutcomes: courseTemplate.learningOutcomes,
        requirements: courseTemplate.requirements,
        whatYouLearn: courseTemplate.learningOutcomes,
        courseContent: courseTemplate.learningOutcomes,
        courseRequirements: courseTemplate.requirements,
        targetAudience: ['Beginners', 'Students', 'Professionals'],
        curriculum: courseTemplate.curriculum,
        totalSections: 1,
        totalLectures: 2,
        totalDuration: courseTemplate.duration,
        thumbnail: courseTemplate.thumbnail,
        heroImage: courseTemplate.heroImage,
        instructorBio: instructor.bio,
        instructorExperience: instructor.experience,
        instructorRating: instructor.rating,
        isPublished: true,
        instructorId: instructor.id,
        categoryId: category.id,
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
          title: faker.lorem.words(3),
          content: faker.lorem.paragraph(),
          videoUrl: faker.internet.url(),
          duration: `${faker.number.int({ min: 10, max: 45 })} min`,
          order: i + 1,
          isPublished: true,
          type: faker.helpers.arrayElement(['video', 'text', 'quiz']),
          isPreview: i === 0,
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

    const courseQuizzes = quizzes.filter(q => q.courseId === course.id);

    // Build curriculum structure
    const curriculum = {
      sections: [
        {
          id: '1',
          title: 'Introduction',
          lessons: courseLessons.slice(0, 2),
          quizzes: courseQuizzes.slice(0, 1),
          totalDuration: 45
        },
        {
          id: '2',
          title: 'Advanced Topics',
          lessons: courseLessons.slice(2),
          quizzes: courseQuizzes.slice(1),
          totalDuration: 60
        }
      ],
      totalSections: 2,
      totalLessons: courseLessons.length,
      totalQuizzes: courseQuizzes.length
    };

    await prisma.course.update({
      where: { id: course.id },
      data: {
        curriculum,
        totalSections: 2,
        totalLectures: courseLessons.length,
        totalQuizzes: courseQuizzes.length
      }
    });
  }

  // Create enrollments (avoid duplicates)
  console.log('Creating enrollments...');
  const enrollments = [];
  const enrollmentPairs = new Set();

  for (let i = 0; i < 80; i++) {
    const student = faker.helpers.arrayElement(students);
    const course = faker.helpers.arrayElement(createdCourses);
    const pairKey = `${student.id}-${course.id}`;

    if (!enrollmentPairs.has(pairKey)) {
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: faker.number.int({ min: 0, max: 100 }),
          currentLesson: faker.number.int({ min: 1, max: 5 }),
          completedLessons: faker.helpers.arrayElements(['1', '2', '3', '4', '5'], { min: 0, max: 3 })
        }
      });
      enrollments.push(enrollment);
      enrollmentPairs.add(pairKey);
    }
  }

  console.log(`Created ${enrollments.length} enrollments`);

  // Create reviews (ensure unique student-course combinations)
  console.log('Creating reviews...');
  const reviews = [];
  const reviewPairs = new Set();

  for (let i = 0; i < 50; i++) {
    const student = faker.helpers.arrayElement(students);
    const course = faker.helpers.arrayElement(createdCourses);
    const pairKey = `${student.id}-${course.id}`;

    if (!reviewPairs.has(pairKey)) {
      const review = await prisma.review.create({
        data: {
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentences(2),
          userId: student.id,
          courseId: course.id
        }
      });

      reviews.push(review);
      reviewPairs.add(pairKey);
    }
  }

  console.log(`Created ${reviews.length} reviews`);

  // Create assignments
  console.log('Creating assignments...');
  const assignments = [];

  for (let i = 0; i < 15; i++) {
    const course = faker.helpers.arrayElement(createdCourses);
    const instructor = instructors.find(inst => inst.id === course.instructorId);

    const assignment = await prisma.assignment.create({
      data: {
        title: faker.lorem.words(4),
        description: faker.lorem.paragraph(),
        dueDate: faker.date.future(),
        maxScore: faker.number.int({ min: 50, max: 100 }),
        courseId: course.id,
        createdBy: instructor.id
      }
    });
    assignments.push(assignment);
  }

  console.log(`Created ${assignments.length} assignments`);

  // Create submissions
  console.log('Creating submissions...');
  const submissions = [];

  for (let i = 0; i < 30; i++) {
    const assignment = faker.helpers.arrayElement(assignments);
    const student = faker.helpers.arrayElement(students);

    const submission = await prisma.submission.create({
      data: {
        content: faker.lorem.paragraphs(2),
        score: faker.number.int({ min: 60, max: 100 }),
        feedback: faker.lorem.sentence(),
        submittedAt: faker.date.recent(),
        gradedAt: faker.date.recent(),
        assignmentId: assignment.id,
        studentId: student.id
      }
    });
    submissions.push(submission);
  }

  console.log(`Created ${submissions.length} submissions`);

  // Create payments
  console.log('Creating payments...');
  const payments = [];

  for (let i = 0; i < 40; i++) {
    const student = faker.helpers.arrayElement(students);
    const course = faker.helpers.arrayElement(createdCourses);

    const payment = await prisma.payment.create({
      data: {
        userId: String(student.id), // ensure string
        courseId: String(course.id), // ensure string
        amount: course.price,
        status: faker.helpers.arrayElement(['COMPLETED', 'PENDING', 'FAILED']),
        phoneNumber: faker.phone.number(),
      }
    });
    payments.push(payment);
  }

  console.log(`Created ${payments.length} payments`);

  // Update course ratings based on reviews
  console.log('Updating course ratings...');
  for (const course of createdCourses) {
    const courseReviews = reviews.filter(r => r.courseId === course.id);
    if (courseReviews.length > 0) {
      const avgRating = courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length;
      await prisma.course.update({
        where: { id: course.id },
        data: {
          rating: parseFloat(avgRating.toFixed(1)),
          totalReviews: courseReviews.length
        }
      });
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Summary:
  - Categories: ${createdCategories.length}
  - Instructors: ${instructors.length}
  - Students: ${students.length}
  - Courses: ${createdCourses.length}
  - Lessons: ${createdCourses.length * 5}
  - Enrollments: ${enrollments.length}
  - Reviews: ${reviews.length}
  - Assignments: ${assignments.length}
  - Submissions: ${submissions.length}
  - Payments: ${payments.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });