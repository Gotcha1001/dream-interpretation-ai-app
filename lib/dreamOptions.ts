export const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export const MARITAL_STATUSES = [
  { value: "single", label: "Single" },
  { value: "in_relationship", label: "In a relationship" },
  { value: "married", label: "Married" },
  { value: "separated", label: "Separated" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export const WHEN_AGO = [
  "This month",
  "Last 3 months",
  "Last 6 months",
  "Last year",
  "More than a year ago",
];

export const SLEEP_QUALITY = ["Very poor", "Poor", "Okay", "Good", "Great"];

export const FAMILY_RELATIONS = [
  "Partner",
  "Mother",
  "Father",
  "Son",
  "Daughter",
  "Brother",
  "Sister",
  "Grandparent",
  "Friend",
  "Other",
];

export const DREAM_EMOTIONS = [
  "Fear",
  "Anxiety",
  "Sadness",
  "Anger",
  "Guilt",
  "Shame",
  "Confusion",
  "Longing",
  "Joy",
  "Peace",
  "Love",
  "Freedom",
  "Awe",
  "Pride",
];

export const todayISO = () => new Date().toISOString().slice(0, 10);
