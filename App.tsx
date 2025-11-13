
import React, { useState, useCallback } from 'react';
import { HealthData, RiskLevel } from './types';
import { getPredictionExplanation } from './services/geminiService';
import { formFields, initialHealthData } from './constants';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [prediction, setPrediction] = useState<{ risk: RiskLevel; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRisk = (data: HealthData): RiskLevel => {
    let score = 0;
    if (data.Glucose > 140) score += 3;
    else if (data.Glucose > 125) score += 2;

    if (data.BMI > 30) score += 2;
    else if (data.BMI > 25) score += 1;
    
    if (data.Age > 50) score += 2;
    else if (data.Age > 40) score += 1;

    if (data.BloodPressure > 90) score += 1;
    if (data.Pregnancies > 3) score += 1;
    if (data.DiabetesPedigreeFunction > 0.5) score += 1;

    if (score >= 5) return RiskLevel.High;
    if (score >= 3) return RiskLevel.Medium;
    return RiskLevel.Low;
  };

  const handlePredict = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const risk = calculateRisk(healthData);
      const explanation = await getPredictionExplanation(healthData, risk);
      setPrediction({ risk, explanation });
    } catch (err) {
      setError('Failed to get prediction explanation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [healthData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Enter your health metrics below to predict your diabetes risk. This tool is for informational purposes only and is not a substitute for professional medical advice.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg">
               <InputForm
                healthData={healthData}
                setHealthData={setHealthData}
                onSubmit={handlePredict}
                isLoading={isLoading}
                formFields={formFields}
              />
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center min-h-[400px]">
              <ResultDisplay 
                prediction={prediction}
                isLoading={isLoading}
                error={error}
                userData={healthData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
