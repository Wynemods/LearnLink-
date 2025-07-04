src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── reset-password.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   └── roles.guard.ts
│
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
│
├── courses/
│   ├── dto/
│   │   ├── create-course.dto.ts
│   │   ├── update-course.dto.ts
│   │   └── enroll-course.dto.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── courses.module.ts
│
├── quizzes/
│   ├── dto/
│   │   ├── create-quiz.dto.ts
│   │   ├── create-question.dto.ts
│   │   └── submit-quiz.dto.ts
│   ├── quizzes.controller.ts
│   ├── quizzes.service.ts
│   └── quizzes.module.ts
│
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   └── analytics.module.ts
│
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
│
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── roles.guard.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   └── enums/
│       └── user-role.enum.ts
│
├── config/
│   └── jwt.config.ts
│
├── uploads/
│   └── (file storage)
│
├── app.controller.ts
├── app.service.ts
├── app.module.ts
├── main.ts
└── package.json

prisma/
├── schema.prisma
├── migrations/
└── seed.ts