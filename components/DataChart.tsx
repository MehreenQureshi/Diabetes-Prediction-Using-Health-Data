
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { HealthData } from '../types';
import { averageData, maxValues } from '../constants';

interface DataChartProps {
  userData: HealthData;
}

const DataChart: React.FC<DataChartProps> = ({ userData }) => {
  
  const normalize = (value: number, max: number) => {
    if (max === 0) return 0;
    return Math.min(Math.round((value / max) * 100), 100);
  };

  const chartData = [
    { subject: 'Glucose', user: normalize(userData.Glucose, maxValues.Glucose), highRisk: normalize(averageData.highRisk.Glucose, maxValues.Glucose), fullMark: 100 },
    { subject: 'BMI', user: normalize(userData.BMI, maxValues.BMI), highRisk: normalize(averageData.highRisk.BMI, maxValues.BMI), fullMark: 100 },
    { subject: 'Age', user: normalize(userData.Age, maxValues.Age), highRisk: normalize(averageData.highRisk.Age, maxValues.Age), fullMark: 100 },
    { subject: 'Pregnancies', user: normalize(userData.Pregnancies, maxValues.Pregnancies), highRisk: normalize(averageData.highRisk.Pregnancies, maxValues.Pregnancies), fullMark: 100 },
    { subject: 'BP', user: normalize(userData.BloodPressure, maxValues.BloodPressure), highRisk: normalize(averageData.highRisk.BloodPressure, maxValues.BloodPressure), fullMark: 100 },
    { subject: 'Pedigree', user: normalize(userData.DiabetesPedigreeFunction, maxValues.DiabetesPedigreeFunction), highRisk: normalize(averageData.highRisk.DiabetesPedigreeFunction, maxValues.DiabetesPedigreeFunction), fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="rgba(100, 116, 139, 0.5)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: 'rgb(51 65 85)',
                borderRadius: '0.5rem',
            }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}}/>
        <Radar name="Your Data" dataKey="user" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
        <Radar name="High Risk Avg" dataKey="highRisk" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
