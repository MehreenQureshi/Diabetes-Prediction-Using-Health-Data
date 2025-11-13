
import { HealthData, FormField } from './types';

export const initialHealthData: HealthData = {
  Pregnancies: 0,
  Glucose: 120,
  BloodPressure: 80,
  SkinThickness: 20,
  Insulin: 80,
  BMI: 25,
  DiabetesPedigreeFunction: 0.47,
  Age: 30,
};

export const formFields: FormField[] = [
  { id: 'Glucose', label: 'Glucose', placeholder: 'e.g., 120', description: 'Plasma glucose concentration (mg/dL)' },
  { id: 'BMI', label: 'BMI', placeholder: 'e.g., 25.0', description: 'Body Mass Index (weight in kg/(height in m)^2)' },
  { id: 'Age', label: 'Age', placeholder: 'e.g., 30', description: 'Age in years' },
  { id: 'Pregnancies', label: 'Pregnancies', placeholder: 'e.g., 1', description: 'Number of times pregnant' },
  { id: 'BloodPressure', label: 'Blood Pressure', placeholder: 'e.g., 80', description: 'Diastolic blood pressure (mm Hg)' },
  { id: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree', placeholder: 'e.g., 0.5', description: 'A function that scores likelihood of diabetes based on family history' },
  { id: 'SkinThickness', label: 'Skin Thickness', placeholder: 'e.g., 20', description: 'Triceps skin fold thickness (mm)' },
  { id: 'Insulin', label: 'Insulin', placeholder: 'e.g., 80', description: '2-Hour serum insulin (mu U/ml)' },
];

// Average data for comparison charts
export const averageData = {
  lowRisk: {
    Pregnancies: 2,
    Glucose: 100,
    BloodPressure: 68,
    BMI: 28,
    Age: 28,
    DiabetesPedigreeFunction: 0.35,
  },
  highRisk: {
    Pregnancies: 5,
    Glucose: 145,
    BloodPressure: 75,
    BMI: 34,
    Age: 45,
    DiabetesPedigreeFunction: 0.6,
  },
};

// Max values for chart normalization (based on Pima dataset)
export const maxValues = {
  Pregnancies: 17,
  Glucose: 200,
  BloodPressure: 122,
  BMI: 67,
  Age: 81,
  DiabetesPedigreeFunction: 2.4,
};
