import React, { Suspense } from 'react';
import { HealthData, RiskLevel } from '../types';
import RiskIndicator from './RiskIndicator';

// Lazy load the chart component to prevent main bundle crashes if Recharts fails
const DataChart = React.lazy(() => import('./DataChart'));

// Local Error Boundary for the Chart to isolate failures
class ChartErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Chart rendering failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-400 italic">Chart visualization unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface ResultDisplayProps {
  prediction: { risk: RiskLevel; explanation: string } | null;
  isLoading: boolean;
  error: string | null;
  userData: HealthData;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <svg className="animate-spin h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-500 dark:text-slate-400">Generating AI-powered analysis...</p>
    </div>
);

const ResultDisplay: React.FC<ResultDisplayProps> = ({ prediction, isLoading, error, userData }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }
  
  if (!prediction) {
    return (
        <div className="text-center flex flex-col justify-center h-full">
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Your Results Will Appear Here</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Fill in your health data and click "Predict Risk" to see your personalized analysis.</p>
        </div>
    );
  }

  const handleDownloadReport = () => {
    if (!prediction) return;

    const markdownToLatex = (markdown: string) => {
        let text = markdown;

        // 1. Structural elements - handle multiple heading levels
        text = text.replace(/^#{1,3}\s+(.*$)/gim, '\\section*{$1}');

        const lines = text.split('\n');
        let inList = false;
        const processedLines = lines.map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
                const itemText = trimmedLine.substring(2);
                if (!inList) {
                    inList = true;
                    return '\\begin{itemize}\n\\item ' + itemText;
                }
                return '\\item ' + itemText;
            } else {
                if (inList) {
                    inList = false;
                    if (line.trim() === '') return '\\end{itemize}';
                    return '\\end{itemize}\n\n' + line;
                }
                return line;
            }
        });
        if (inList) {
            processedLines.push('\\end{itemize}');
        }
        text = processedLines.join('\n');

        // 2. Inline formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '\\textbf{$1}');
        text = text.replace(/\*(.*?)\*/g, '\\textit{$1}');

        // 3. Character escapes
        text = text
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
            
        // 4. Paragraphs
        text = text.replace(/\n\n/g, '\n\n\\par\n\n');

        return text;
    };


    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const explanationForLatex = markdownToLatex(prediction.explanation);

    const latexContent = `
\\documentclass[12pt, a4paper]{report}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{hyperref}
\\usepackage{amsmath}
\\usepackage{times}
\\usepackage{setspace}
\\onehalfspacing
\\usepackage{array}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,      
    urlcolor=cyan,
    pdftitle={Diabetes Risk Assessment Report},
    pdfpagemode=FullScreen,
}

\\title{
    \\vspace*{\\fill}
    {\\Huge\\bfseries Diabetes Risk Assessment Report}
    \\vspace{0.5cm}
    \\hrule
    \\vspace{0.5cm}
    {\\Large Generated by the Diabetes Risk Predictor Application}
    \\vspace*{\\fill}
}
\\author{}
\\date{Report generated on: ${date}}

\\begin{document}

\\begin{titlepage}
    \\maketitle
    \\thispagestyle{empty}
\\end{titlepage}

\\tableofcontents
\\newpage

\\chapter*{Abstract}
\\addcontentsline{toc}{chapter}{Abstract}
A concise summary of the assessment. Based on the provided health metrics, the calculated diabetes risk is \\textbf{${prediction.risk}}. This report provides an analysis of the key contributing factors, offers general wellness recommendations, and outlines the methodology used for this preliminary assessment. It is crucial to note that this report is for informational purposes and does not constitute medical advice. A consultation with a qualified healthcare professional is strongly recommended for a comprehensive evaluation.

\\chapter{Assessment Details}

\\section{Provided Health Metrics}
The following data was used for this assessment:
\\begin{center}
\\begin{tabular}{l >{\\bfseries}l}
    \\hline
    \\multicolumn{2}{c}{\\textbf{Patient Health Data}} \\\\
    \\hline
    Metric & Value \\\\
    \\hline
    Pregnancies & ${userData.Pregnancies} \\\\
    Glucose & ${userData.Glucose} mg/dL \\\\
    Blood Pressure & ${userData.BloodPressure} mm Hg \\\\
    Skin Thickness & ${userData.SkinThickness} mm \\\\
    Insulin & ${userData.Insulin} mu U/ml \\\\
    BMI (Body Mass Index) & ${userData.BMI} \\\\
    Diabetes Pedigree Function & ${userData.DiabetesPedigreeFunction} \\\\
    Age & ${userData.Age} years \\\\
    \\hline
\\end{tabular}
\\end{center}

\\section{Methodology}
The risk assessment is determined using a rule-based scoring system derived from common diabetes risk factors. Key metrics such as Glucose level, Body Mass Index (BMI), and Age are assigned scores based on established thresholds. The cumulative score corresponds to a risk category of Low, Medium, or High.

For a detailed analysis and personalized recommendations, the assessment is augmented by an AI model (Google's Gemini). The AI generates a qualitative explanation of the results based on the provided data, which is included in the subsequent chapter.

\\section{Risk Classification}
Based on the methodology described above, the estimated risk level is:
\\begin{center}
    {\\Huge\\bfseries ${prediction.risk}}
\\end{center}

\\chapter{AI-Powered Report}
${explanationForLatex}

\\chapter*{Disclaimer}
\\addcontentsline{toc}{chapter}{Disclaimer}
This report is generated by an automated system and is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. The risk assessment is based on a simplified model and the provided data. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Do not disregard professional medical advice or delay in seeking it because of something you have read in this report.

\\end{document}
    `.trim();

    const blob = new Blob([latexContent], { type: 'text/x-latex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diabetes_risk_report.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formattedExplanationHtml = (markdown: string) => {
    let html = markdown;
    
    // More robust heading parsing (h2-h4)
    html = html.replace(/^### (.*$)/gim, '<h5 class="text-md font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100">$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4 class="text-lg font-semibold mt-6 mb-2 text-slate-800 dark:text-slate-100">$1</h4>');
    html = html.replace(/^# (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-50">$1</h3>');
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const itemText = trimmedLine.substring(2);
        if (!inList) {
          inList = true;
          return '<ul class="list-disc ml-5 mb-4 space-y-1">\n<li>' + itemText + '</li>';
        }
        return '<li>' + itemText + '</li>';
      } else {
        if (inList) {
          inList = false;
          return '</ul>\n' + line;
        }
        return line;
      }
    });
    if (inList) {
      processedLines.push('</ul>');
    }
    html = processedLines.join('\n');
    
    // Basic paragraph handling for non-html lines
    html = html.replace(/\n/g, '<br />');
    
    // Clean up excessive breaks around block elements
    html = html.replace(/<br \/>\s*<ul/g, '<ul');
    html = html.replace(/<\/ul>\s*<br \/>/g, '</ul>');
    html = html.replace(/<br \/>\s*<h/g, '<h');
    
    return html;
  };


  return (
    <div className="w-full space-y-6 animate-fade-in">
        <div>
            <h3 className="text-lg font-semibold text-center mb-2 text-slate-700 dark:text-slate-200">Your Estimated Risk Level</h3>
            <RiskIndicator risk={prediction.risk} />
        </div>
        <div className="w-full h-72">
             <ChartErrorBoundary>
               <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700/30 rounded-lg animate-pulse">
                    <span className="text-slate-400">Loading Chart...</span>
                  </div>
               }>
                  <DataChart userData={userData} />
               </Suspense>
             </ChartErrorBoundary>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
             <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: formattedExplanationHtml(prediction.explanation) }} />
        </div>

        <div className="pt-4 text-center">
            <button
                onClick={handleDownloadReport}
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
                <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download LaTeX Report (.tex)
            </button>
        </div>
    </div>
  );
};

export default ResultDisplay;