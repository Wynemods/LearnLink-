src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── course.service.ts
│   │   ├── quiz.service.ts
│   │   └── api.service.ts
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── course.model.ts
│   │   └── quiz.model.ts
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── student-dashboard/
│   │   │   ├── instructor-dashboard/
│   │   │   └── admin-dashboard/
│   │   │
│   │   ├── courses/
│   │   │   ├── course-list/
│   │   │   ├── course-detail/
│   │   │   ├── course-form/
│   │   │   └── lesson-viewer/
│   │   │
│   │   ├── quizzes/
│   │   │   ├── quiz-list/
│   │   │   ├── quiz-form/
│   │   │   ├── quiz-take/
│   │   │   └── quiz-results/
│   │   │
│   │   ├── shared/
│   │   │   ├── navbar/
│   │   │   ├── sidebar/
│   │   │   ├── loading/
│   │   │   └── modal/
│   │   │
│   │   └── profile/
│   │       ├── profile-view/
│   │       └── profile-edit/
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routes.ts
│   └── main.ts
│
├── assets/
│   ├── images/
│   └── uploads/
│
├── styles/
│   └── styles.css (Global Tailwind + Custom)
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── index.html
├── angular.json
├── tailwind.config.js
├── tsconfig.json
└── package.json