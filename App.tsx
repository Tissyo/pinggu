
import React, { useState, useMemo, useEffect } from 'react';
import { PatientInfo, AssessmentState, Gender, InfoSource } from './types.ts';
import PatientInfoForm from './components/PatientInfoForm.tsx';
import RiskScreening from './components/RiskScreening.tsx';
import TraumaAssessment from './components/TraumaAssessment.tsx';
import ResilienceAssessment from './components/ResilienceAssessment.tsx';
import SummarySection from './components/SummarySection.tsx';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'jianji_assessment_data';

const initialPatient: PatientInfo = {
  name: '',
  gender: '男',
  age: 0,
  dob: '',
  date: new Date().toISOString().split('T')[0],
  id: '',
  clinician: '',
  source: '本人'
};

const initialState: AssessmentState = {
  patient: initialPatient,
  cssrs: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, intensityScore: 0, intensityDescription: '', frequency: '' },
  ucla: { history: { naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false }, scores: {}, totalScore: 0 },
  pcl5: { history: { naturalDisaster: false, accident: false, witnessViolence: false, physicalAbuse: false, sexualTrauma: false, loss: false, medicalTrauma: false }, indexTrauma: '', indexTraumaDate: '', scores: {}, totalScore: 0 },
  resilience: {
    child: { scores: {} },
    teen: { scores: {} },
    adult: { cdrisc: {}, mspss: {} }
  },
  summary: { clinicalFormulation: '', needs: '', actionPlan: '' }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [data, setData] = useState<AssessmentState>(initialState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isDataLoaded]);

  const isAdult = data.patient.age >= 18;

  const tabs = [
    { id: 'basic', label: '基本信息', icon: '👤' },
    { id: 'risk', label: '安全风险', icon: '🛡️' },
    { id: 'trauma', label: '创伤评估', icon: '🧠' },
    { id: 'resilience', label: '复原力', icon: '🌱' },
    { id: 'summary', label: '结论报告', icon: '📋' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const resetData = () => {
    if (window.confirm("确定要清空当前所有评估数据并开始新的档案吗？此操作不可撤销。")) {
      setData(initialState);
      localStorage.removeItem(STORAGE_KEY);
      setActiveTab('basic');
    }
  };

  const generateAIFormulation = async () => {
    if (!process.env.API_KEY) {
      alert("请先在 index.html 的 window.process 中配置 API_KEY 以使用 AI 功能。");
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        作为一名资深临床心理学家，请根据以下评估数据生成一份结构化的临床综合画像。
        [基本信息] ${JSON.stringify(data.patient)}
        [风险数据] C-SSRS: ${JSON.stringify(data.cssrs)}
        [症状数据] ${isAdult ? `PCL-5 总分: ${data.pcl5.totalScore}` : `UCLA PTSD-RI 总分: ${data.ucla.totalScore}`}
        请按结构输出中文：1.核心症状 2.风险等级 3.资源画像 4.建议。
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      if (response.text) {
        setData(prev => ({
          ...prev,
          summary: { ...prev.summary, clinicalFormulation: response.text }
        }));
      }
    } catch (error) {
      alert("AI 生成失败，请检查配置。");
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-slate-50">
      <div className="h-1 bg-teal-600 w-full no-print"></div>
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold shadow-md">见</div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 leading-none">见己 · 深度评估系统</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter mt-1">Clinical Record Pro</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={resetData} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="新建评估">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12a10 10 0 1 1 10 10A10 10 0 0 1 2 12m10-8a8 8 0 1 0 8 8a8 8 0 0 0-8-8m-1 7H8v2h3v3h2v-3h3v-2h-3V8h-2z"/></svg>
            </button>
            <button onClick={handlePrint} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-200">导出 PDF</button>
            <button onClick={generateAIFormulation} className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-lg shadow-teal-700/20 transition-all flex items-center">
              <span className="mr-1.5">✨</span> AI 画像
            </button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <ul className="flex space-x-8">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    activeTab === tab.id ? 'border-teal-700 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="main-card bg-white shadow-xl rounded-3xl border border-slate-200 min-h-[70vh] p-6 sm:p-14">
          {activeTab === 'basic' && <PatientInfoForm data={data.patient} onChange={(val) => setData(prev => ({ ...prev, patient: val }))} />}
          {activeTab === 'risk' && <RiskScreening data={data.cssrs} onChange={(val) => setData(prev => ({ ...prev, cssrs: val }))} />}
          {activeTab === 'trauma' && <TraumaAssessment isAdult={isAdult} ucla={data.ucla} pcl5={data.pcl5} onUCLAChange={(val) => setData(prev => ({ ...prev, ucla: val }))} onPCL5Change={(val) => setData(prev => ({ ...prev, pcl5: val }))} />}
          {activeTab === 'resilience' && <ResilienceAssessment age={data.patient.age} data={data.resilience} onChange={(val) => setData(prev => ({ ...prev, resilience: val }))} />}
          {activeTab === 'summary' && <SummarySection data={data} onChange={(val) => setData(prev => ({ ...prev, summary: val }))} />}
        </div>
        <div className="mt-4 flex justify-end no-print text-[10px] text-slate-400">
           <div className="flex items-center space-x-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <span>数据已安全存储在本地浏览器</span>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
