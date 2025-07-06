import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

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

  // Create categories
  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    });
  }

  // Create real users from auth.http credentials
  console.log('Creating real users from auth.http...');
  const hashedPassword = await bcrypt.hash('Password123', 12);
  
  const realUsers = [
    {
      firstName: 'Jimmy',
      lastName: 'Kimunyi',
      email: 'jkkimunyi@gmail.com',
      username: 'jkkimunyi',
      password: hashedPassword,
      role: Role.STUDENT,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      firstName: 'Jimmy',
      lastName: 'Kimunyi',
      email: 'kimunyijimmy@gmail.com',
      username: 'kimunyijimmy',
      password: hashedPassword,
      role: Role.INSTRUCTOR,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Experienced instructor with expertise in web development and modern technologies.',
      title: 'Senior Full Stack Developer',
      specialty: 'Web Development',
      experience: '5+ years',
      expertise: 'JavaScript, React, Node.js, TypeScript, Python',
      rating: 4.8,
      totalStudents: 1250
    },
    {
      firstName: 'Jimmy',
      lastName: 'Kimunyi',
      email: 'jimmykimunyi@gmail.com',
      username: 'jimmykimunyi',
      password: hashedPassword,
      role: Role.STUDENT,
      isActive: true,
      isVerified: true,
      profilePicture: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face'
    }
  ];

  // Create real users
  const createdUsers = [];
  for (const userData of realUsers) {
    const user = await prisma.user.create({
      data: userData
    });
    createdUsers.push(user);
  }

  // Create additional instructors with faker data
  console.log('Creating additional instructors...');
  const instructors = [...createdUsers.filter(u => u.role === Role.INSTRUCTOR)];
  
  for (let i = 0; i < 7; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const username = faker.internet.userName({ firstName, lastName }).toLowerCase();
    
    const instructor = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: Role.INSTRUCTOR,
        isActive: true,
        isVerified: true,
        profilePicture: faker.image.avatar(),
        bio: faker.lorem.paragraphs(2),
        title: faker.person.jobTitle(),
        specialty: faker.helpers.arrayElement(['Web Development', 'Data Science', 'UI/UX Design', 'Mobile Development', 'Cloud Computing']),
        experience: faker.helpers.arrayElement(['2+ years', '5+ years', '10+ years', '15+ years']),
        expertise: faker.helpers.arrayElements(['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'MongoDB'], { min: 2, max: 4 }).join(', '),
        rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
        totalStudents: faker.number.int({ min: 100, max: 5000 })
      }
    });
    instructors.push(instructor);
  }

  // Create additional students with faker data
  console.log('Creating additional students...');
  const students = [...createdUsers.filter(u => u.role === Role.STUDENT)];
  
  for (let i = 0; i < 47; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const username = faker.internet.userName({ firstName, lastName }).toLowerCase();
    
    const student = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        role: Role.STUDENT,
        isActive: true,
        isVerified: true,
        profilePicture: faker.image.avatar()
      }
    });
    students.push(student);
  }

  // Get categories for course creation
  const createdCategories = await prisma.category.findMany();

  // Course templates
  const courseTemplates = [
    {
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp',
      price: 199.99,
      originalPrice: 299.99,
      discount: 33,
      duration: '40 hours',
      level: 'beginner',
      modules: 12,
      features: ['Lifetime access', 'Certificate of completion', '24/7 support', 'Mobile access'],
      learningOutcomes: ['Build responsive websites', 'Master modern JavaScript', 'Create full-stack applications', 'Deploy to production'],
      requirements: ['Basic computer skills', 'Internet connection', 'No prior experience needed']
    },
    {
      title: 'Advanced React Development',
      description: 'Master React with hooks, context API, testing, and performance optimization',
      price: 149.99,
      originalPrice: 199.99,
      discount: 25,
      duration: '25 hours',
      level: 'intermediate',
      modules: 8,
      features: ['Lifetime access', 'Source code included', 'Project-based learning'],
      learningOutcomes: ['Master React hooks', 'Build complex UIs', 'Optimize performance', 'Test React applications'],
      requirements: ['Basic React knowledge', 'JavaScript fundamentals', 'HTML/CSS basics']
    },
    {
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning with Python',
      price: 179.99,
      originalPrice: 249.99,
      discount: 28,
      duration: '35 hours',
      level: 'intermediate',
      modules: 10,
      features: ['Jupyter notebooks', 'Real datasets', 'Career guidance'],
      learningOutcomes: ['Analyze data with Pandas', 'Create visualizations', 'Build ML models', 'Work with APIs'],
      requirements: ['Basic Python knowledge', 'High school math', 'Statistical concepts']
    },
    {
      title: 'UI/UX Design Fundamentals',
      description: 'Learn design principles, user research, and prototyping',
      price: 129.99,
      originalPrice: 179.99,
      discount: 28,
      duration: '20 hours',
      level: 'beginner',
      modules: 6,
      features: ['Design templates', 'Figma access', 'Portfolio projects'],
      learningOutcomes: ['Design user interfaces', 'Conduct user research', 'Create prototypes', 'Build design systems'],
      requirements: ['No design experience needed', 'Computer with internet', 'Creative mindset']
    },
    {
      title: 'Digital Marketing Mastery',
      description: 'Master SEO, social media marketing, and paid advertising',
      price: 159.99,
      originalPrice: 219.99,
      discount: 27,
      duration: '30 hours',
      level: 'beginner',
      modules: 9,
      features: ['Marketing templates', 'Case studies', 'Tools access'],
      learningOutcomes: ['Run ad campaigns', 'Optimize for SEO', 'Grow social media', 'Analyze metrics'],
      requirements: ['Basic computer skills', 'Interest in marketing', 'Business mindset']
    }
  ];

  // Create courses
  console.log('Creating courses...');
  for (let i = 0; i < 30; i++) {
    const template = faker.helpers.arrayElement(courseTemplates);
    const instructor = faker.helpers.arrayElement(instructors);
    const category = faker.helpers.arrayElement(createdCategories);
    
    const course = await prisma.course.create({
      data: {
        title: `${template.title} - ${faker.lorem.words(2)}`,
        description: template.description,
        thumbnail: faker.image.url({ width: 400, height: 300 }),
        heroImage: faker.image.url({ width: 800, height: 600 }),
        price: template.price,
        originalPrice: template.originalPrice,
        discount: template.discount,
        duration: template.duration,
        level: template.level,
        modules: template.modules,
        rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
        totalReviews: faker.number.int({ min: 10, max: 500 }),
        features: template.features,
        learningOutcomes: template.learningOutcomes,
        requirements: template.requirements,
        isPublished: true,
        categoryId: category.id,
        instructorId: instructor.id
      }
    });

    // Create lessons for each course
    for (let j = 0; j < template.modules; j++) {
      await prisma.lesson.create({
        data: {
          title: `${faker.lorem.words(3)} - Lesson ${j + 1}`,
          content: faker.lorem.paragraphs(3),
          videoUrl: faker.internet.url(),
          duration: `${faker.number.int({ min: 5, max: 30 })} minutes`,
          order: j + 1,
          courseId: course.id
        }
      });
    }

    // Create enrollments
    const enrolledStudents = faker.helpers.arrayElements(students, { min: 5, max: 20 });
    for (const student of enrolledStudents) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          progress: faker.number.int({ min: 0, max: 100 }),
          currentLesson: faker.number.int({ min: 1, max: template.modules }),
          completedLessons: faker.helpers.arrayElements(
            Array.from({ length: template.modules }, (_, i) => `lesson-${i + 1}`),
            { min: 0, max: Math.floor(template.modules / 2) }
          )
        }
      });
    }

    // Create reviews
    const reviewers = faker.helpers.arrayElements(enrolledStudents, { min: 2, max: 8 });
    for (const reviewer of reviewers) {
      await prisma.review.create({
        data: {
          rating: faker.number.int({ min: 3, max: 5 }),
          comment: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          userId: reviewer.id,
          courseId: course.id
        }
      });
    }
  }

  console.log('Database seeding completed successfully!');
  console.log('Real users created:');
  console.log('- jkkimunyi@gmail.com (Student)');
  console.log('- kimunyijimmy@gmail.com (Instructor)');
  console.log('- jimmykimunyi@gmail.com (Student)');
  console.log('Password for all users: Password123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });