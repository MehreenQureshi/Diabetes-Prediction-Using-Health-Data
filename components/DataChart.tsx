
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { HealthData } from '../types';
import { averageData, maxValues } from '../constants';

interface DataChartProps {
  userData: HealthData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl text-sm min-w-[180px] z-50">
        <p className="font-bold text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-100 dark:border-slate-700 pb-1">
          {label}
        </p>
        <div className="space-y-1.5">
           <div className="flex justify-between items-center gap-4">
             <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">You</span>
             <span className="font-bold text-sky-600 dark:text-sky-400">
                {data.actualUser} <span className="text-xs font-normal text-slate-400">{data.unit}</span>
             </span>
           </div>
           
           <div className="flex justify-between items-center gap-4">
             <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">High Risk Avg</span>
             <span className="font-bold text-rose-500 dark:text-rose-400">
                {data.actualHighRisk} <span className="text-xs font-normal text-slate-400">{data.unit}</span>
             </span>
           </div>
        </div>
        {data.description && (
           <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                  {data.description}
              </p>
           </div>
        )}
      </div>
    );
  }
  return null;
};

const DataChart: React.FC<DataChartProps> = ({ userData }) => {
  
  const normalize = (value: number, max: number) => {
    if (max === 0) return 0;
    return Math.min(Math.round((value / max) * 100), 100);
  };

  const chartData = [
    { 
        subject: 'Glucose', 
        user: normalize(userData.Glucose, maxValues.Glucose), 
        highRisk: normalize(averageData.highRisk.Glucose, maxValues.Glucose), 
        actualUser: userData.Glucose, 
        actualHighRisk: averageData.highRisk.Glucose,
        unit: 'mg/dL',
        description: 'Blood sugar level',
        fullMark: 100 
    },
    { 
        subject: 'BMI', 
        user: normalize(userData.BMI, maxValues.BMI), 
        highRisk: normalize(averageData.highRisk.BMI, maxValues.BMI), 
        actualUser: userData.BMI, 
        actualHighRisk: averageData.highRisk.BMI,
        unit: 'kg/m²',
        description: 'Body Mass Index',
        fullMark: 100 
    },
    { 
        subject: 'Age', 
        user: normalize(userData.Age, maxValues.Age), 
        highRisk: normalize(averageData.highRisk.Age, maxValues.Age), 
        actualUser: userData.Age, 
        actualHighRisk: averageData.highRisk.Age,
        unit: 'yrs',
        description: 'Age in years',
        fullMark: 100 
    },
    { 
        subject: 'Pregnancies', 
        user: normalize(userData.Pregnancies, maxValues.Pregnancies), 
        highRisk: normalize(averageData.highRisk.Pregnancies, maxValues.Pregnancies), 
        actualUser: userData.Pregnancies, 
        actualHighRisk: averageData.highRisk.Pregnancies,
        unit: '',
        description: 'Number of pregnancies',
        fullMark: 100 
    },
    { 
        subject: 'BP', 
        user: normalize(userData.BloodPressure, maxValues.BloodPressure), 
        highRisk: normalize(averageData.highRisk.BloodPressure, maxValues.BloodPressure), 
        actualUser: userData.BloodPressure, 
        actualHighRisk: averageData.highRisk.BloodPressure,
        unit: 'mm Hg',
        description: 'Blood Pressure',
        fullMark: 100 
    },
    { 
        subject: 'Pedigree', 
        user: normalize(userData.DiabetesPedigreeFunction, maxValues.DiabetesPedigreeFunction), 
        highRisk: normalize(averageData.highRisk.DiabetesPedigreeFunction, maxValues.DiabetesPedigreeFunction), 
        actualUser: userData.DiabetesPedigreeFunction, 
        actualHighRisk: averageData.highRisk.DiabetesPedigreeFunction,
        unit: '',
        description: 'Diabetes Pedigree Function',
        fullMark: 100 
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="rgba(100, 116, 139, 0.3)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{fontSize: "14px"}}/>
        <Radar name="Your Data" dataKey="user" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
        <Radar name="High Risk Avg" dataKey="highRisk" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
