import React from 'react';
import { HealthData, FormField } from '../types';

interface InputFormProps {
  healthData: HealthData;
  setHealthData: React.Dispatch<React.SetStateAction<HealthData>>;
  onSubmit: () => void;
  isLoading: boolean;
  formFields: FormField[];
}

const InputForm: React.FC<InputFormProps> = ({ healthData, setHealthData, onSubmit, isLoading, formFields }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure value is not negative if the user types manually, though min="0" handles the spinner
    const numValue = parseFloat(value);
    setHealthData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : Math.max(0, numValue) }));
  };

  const criticalFields = ['Glucose', 'BMI', 'Age'];

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Your Health Metrics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
          Fields marked with <span className="text-amber-500">★</span> have higher impact on risk
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formFields.map((field) => {
          const isCritical = criticalFields.includes(field.id);
          return (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
                {field.label}
                {isCritical && (
                  <span className="text-amber-500" title="This factor significantly impacts the risk calculation">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </label>
              <input
                type="number"
                id={field.id}
                name={field.id}
                min="0"
                step="any"
                value={healthData[field.id]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900 dark:text-slate-100 transition-colors ${
                  isCritical 
                    ? 'border-amber-300 dark:border-amber-600/50' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              />
               <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.description}</p>
            </div>
          );
        })}
      </div>
       <div className="pt-4 sticky bottom-0 bg-white dark:bg-slate-800/50 py-3 backdrop-blur-sm">
         <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                </>
            ) : 'Predict Risk'}
        </button>
       </div>
    </form>
  );
};

export default InputForm;