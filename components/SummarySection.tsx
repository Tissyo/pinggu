
import React, { useMemo } from 'react';
import { AssessmentState } from '../types';
import RadarChart from './RadarChart';

interface Props {
  data: AssessmentState;
  onChange: (val: any) => void;
}

const SummarySection: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data.summary, [field]: value });
  };

  const radarData = useMemo(() => {
    const { age } = data.patient;
    const res = data.resilience;
    
    let p = 0, f = 0, s = 0;

    const getScore = (map: any, ids: string[], max: number, min: number = 0) => {
      let sum = 0;
      ids.forEach(id => sum += (map[id] || min));
      return ((sum - (ids.length * min)) / (ids.length * (max - min))) * 100;
    };

    if (age > 0 && age < 13) {
      p = getScore(res.child.scores, ['1', '2', '3'], 2);
      f = getScore(res.child.scores, ['4', '5'], 2);
      s = getScore(res.child.scores, ['6', '7', '8'], 2);
    } else if (age >= 13 && age < 18) {
      p = getScore(res.teen.scores, ['1', '2', '3', '4'], 5, 1);
      f = getScore(res.teen.scores, ['5', '6', '7', '8'], 5, 1);
      s = getScore(res.teen.scores, ['9', '10', '11', '12'], 5, 1);
    } else if (age >= 18) {
      // Adult: CD-RISC (0-4)
      // Fix: Use explicitly typed reduce generic to ensure cdScore is treated as a number in arithmetic operations.
      const cdScore = Object.values(res.adult.cdrisc).reduce<number>((acc: number, cur: any) => acc + (Number(cur) || 0), 0);
      p = (cdScore / 40) * 100;
      // MSPSS: (1-7)
      f = getScore(res.adult.mspss, ['3', '4', '8', '11'], 7, 1);
      const socialIds = ['1', '2', '6', '7', '9', '10', '12'];
      s = getScore(res.adult.mspss, socialIds, 7, 1);
    }

    return [
      { label: '个人能力', value: Math.max(5, p || 0) },
      { label: '家庭支持', value: Math.max(5, f || 0) },
      { label: '社会环境', value: Math.max(5, s || 0) }
    ];
  }, [data.resilience, data.patient.age]);

  return (
    <section className="space-y-12 pb-12">
      <div className="mb-6 flex items-center space-x-2">
        <div className="w-1 h-6 bg-teal-800 rounded"></div>
        <h2 className="text-2xl font-bold text-slate-800">评估结论与数字化画像</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center shadow-inner">
          <h3 className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-widest">资源与保护因素分布图 (数字化画像)</h3>
          <RadarChart data={radarData} size={300} />
          <div className="mt-10 grid grid-cols-3 gap-6 w-full text-center">
            {radarData.map(d => (
              <div key={d.label}>
                <p className="text-[10px] text-slate-400 font-bold mb-1">{d.label}</p>
                <p className="text-xl font-bold text-teal-600">{Math.round(d.value)}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">1. 临床综合画像 (Clinical Formulation)</label>
            <textarea 
              value={data.summary.clinicalFormulation}
              onChange={(e) => handleChange('clinicalFormulation', e.target.value)}
              className="w-full h-80 border border-slate-300 rounded-2xl p-6 focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed text-slate-700 bg-white shadow-sm"
              placeholder="请描述症状表现、风险等级及资源分析..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">2. 核心需求与目标</label>
          <textarea 
            value={data.summary.needs}
            onChange={(e) => handleChange('needs', e.target.value)}
            className="w-full h-32 border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
            placeholder="列出关键需求..."
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">3. 下一步行动计划</label>
          <textarea 
            value={data.summary.actionPlan}
            onChange={(e) => handleChange('actionPlan', e.target.value)}
            className="w-full h-32 border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
            placeholder="干预频率、流派及转介建议..."
          />
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="h-0.5 bg-slate-300 w-full mb-6"></div>
            <p className="text-sm font-bold text-slate-500">来访者/监护人 (Client/Guardian)</p>
          </div>
          <div className="space-y-4">
            <div className="h-0.5 bg-slate-300 w-full mb-6"></div>
            <p className="text-sm font-bold text-slate-500">主评估师 (Clinician)</p>
          </div>
          <div className="space-y-4">
            <div className="h-0.5 bg-slate-300 w-full mb-6"></div>
            <p className="text-sm font-bold text-slate-500">档案审核人 (Supervisor)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SummarySection;
