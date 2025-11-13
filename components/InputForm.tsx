
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
    setHealthData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <h2 className="text-xl font-semibold text-center text-slate-700 dark:text-slate-200">Your Health Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formFields.map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              {field.label}
            </label>
            <input
              type="number"
              id={field.id}
              name={field.id}
              value={healthData[field.id]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              step="any"
            />
             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{field.description}</p>
          </div>
        ))}
      </div>
       <div className="pt-4 sticky bottom-0 bg-white dark:bg-slate-800/50 py-3">
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
