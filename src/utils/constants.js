// These MUST match the enums on the server exactly, or Mongoose rejects the save.
export const EXPENSE_CATEGORIES = [
  'Transport',
  'Feeding',
  'Junk and snacks',
  'Data and airtime',
  'Others',
];

export const INCOME_SOURCES = [
  'Salary',
  'Business',
  'Freelance',
  'Allowance',
  'Gift',
  'Investment',
  'Other',
];

export const BUDGET_SCOPES = ['Overall', ...EXPENSE_CATEGORIES];

export const THRESHOLDS = [50, 80, 100];
