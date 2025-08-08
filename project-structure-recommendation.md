# Recommended Playwright Project Structure

```
playwright-project/
├── .env.example                    # Environment variables template
├── .env                           # Local environment variables (gitignored)
├── playwright.config.ts           # Main Playwright configuration
├── package.json
├── tsconfig.json
│
├── tests/
│   ├── api/                       # API Tests
│   │   ├── specs/
│   │   │   ├── auth.spec.ts
│   │   │   ├── user-master.spec.ts
│   │   │   └── business-unit.spec.ts
│   │   ├── fixtures/
│   │   │   └── api-fixtures.ts
│   │   └── helpers/
│   │       └── api-client.ts
│   │
│   ├── ui/                        # UI Tests
│   │   ├── specs/
│   │   │   ├── login.spec.ts
│   │   │   ├── user-master.spec.ts
│   │   │   └── business-unit.spec.ts
│   │   ├── fixtures/
│   │   │   └── ui-fixtures.ts
│   │   └── helpers/
│   │       └── form-helper.ts
│   │
│   ├── e2e/                       # End-to-End Tests
│   │   └── specs/
│   │       └── complete-workflow.spec.ts
│   │
│   └── shared/                    # Shared Resources
│       ├── utils/
│       │   ├── test-data-loader.ts
│       │   ├── logger.ts
│       │   └── retry-helper.ts
│       ├── types/
│       │   ├── api-types.ts
│       │   └── ui-types.ts
│       └── constants/
│           └── test-constants.ts
│
├── test-data/                     # Test Data
│   ├── api/
│   │   ├── user-master.json
│   │   └── business-unit.json
│   ├── ui/
│   │   ├── login.json
│   │   └── forms.json
│   └── schemas/                   # JSON Schemas for validation
│       ├── user-master.schema.json
│       └── business-unit.schema.json
│
├── pages/                         # Page Object Models
│   ├── base/
│   │   └── base-page.ts
│   ├── auth/
│   │   └── login-page.ts
│   └── masters/
│       ├── user-master-page.ts
│       └── business-unit-page.ts
│
├── utils/                         # Utility Functions
│   ├── api/
│   │   ├── api-client.ts
│   │   └── auth-client.ts
│   ├── ui/
│   │   ├── form-helper.ts
│   │   └── navigation-helper.ts
│   └── common/
│       ├── data-provider.ts
│       └── test-utils.ts
│
├── config/                        # Configuration Files
│   ├── environments/
│   │   ├── dev.config.ts
│   │   ├── staging.config.ts
│   │   └── prod.config.ts
│   └── test-config.ts
│
├── reports/                       # Test Reports
│   ├── html/
│   ├── allure/
│   └── screenshots/
│
└── scripts/                       # Build and Test Scripts
    ├── setup-test-env.sh
    └── cleanup-test-data.sh
```

## Key Improvements:

1. **Clear Separation**: API, UI, and E2E tests are clearly separated
2. **Shared Resources**: Common utilities and types are shared
3. **Type Safety**: Dedicated types folder for TypeScript interfaces
4. **Environment Management**: Proper environment configuration
5. **Test Data Organization**: Structured test data with schemas
6. **Page Objects**: Organized by feature/module
7. **Configuration**: Environment-specific configs
