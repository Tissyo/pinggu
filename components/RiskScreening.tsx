
import React from 'react';
import { CSSRSData } from '../types';

interface Props {
  data: CSSRSData;
  onChange: (val: CSSRSData) => void;
}

const RiskScreening: React.FC<Props> = ({ data, onChange }) => {
  const toggle = (field: keyof CSSRSData, val: boolean) => {
    onChange({ ...data, [field]: val });
  };

  const isAnyIdeation = data.q1 === true || data.q2 === true;
  const isHighRisk = data.q4 === true || data.q5 === true || data.q6 === true;
  const isModerateRisk = (data.q1 === true || data.q2 === true) && !data.q3 && !data.q4 && !data.q5;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-6 bg-red-500 rounded"></div>
          <h2 className="text-2xl font-bold text-slate-800">第一部分：安全风险筛查 (C-SSRS)</h2>
        </div>
        {isHighRisk && (
          <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-bold animate-pulse flex items-center">
            <span className="mr-2">⚠</span> 红色警报: 高风险
          </div>
        )}
        {!isHighRisk && isModerateRisk && (
          <div className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full font-bold flex items-center">
            <span className="mr-2">⚠</span> 橙色警报: 中风险
          </div>
        )}
      </div>

      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        哥伦比亚-自杀严重程度评定量表 (Columbia-Suicide Severity Rating Scale) - 筛查版。全球预防自杀领域金标准。
      </p>

      <div className="space-y-6">
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">部分A：自杀意念 (Suicidal Ideation)</h3>
          
          <div className="space-y-6">
            <Question 
              label="1. 死的愿望 (Wish to be Dead)" 
              desc="你是否曾希望自己睡着了就不要醒来，或者希望自己已经死掉？"
              val={data.q1}
              onToggle={(v) => toggle('q1', v)}
            />
            <Question 
              label="2. 非特异性的主动自杀念头" 
              desc="你是否真的有过自杀（结束自己生命）的念头？"
              val={data.q2}
              onToggle={(v) => toggle('q2', v)}
            />

            {(isAnyIdeation) && (
              <div className="pl-6 border-l-4 border-teal-100 space-y-6 mt-6 animate-in slide-in-from-left duration-300">
                <Question 
                  label="3. 有方法但无意图的主动自杀念头" 
                  desc="你是否想过要是你要自杀你会怎么做（方法）？但你并不是真的想去死。"
                  val={data.q3}
                  onToggle={(v) => toggle('q3', v)}
                />
                <Question 
                  label="4. 有些许意图但无具体计划的主动自杀念头" 
                  desc="你是否有过自杀的念头，并且甚至想真的去死？"
                  val={data.q4}
                  onToggle={(v) => toggle('q4', v)}
                />
                <Question 
                  label="5. 有具体计划和意图的主动自杀念头" 
                  desc="你是否已经想好了细节？并且你打算去实施这个计划？"
                  val={data.q5}
                  onToggle={(v) => toggle('q5', v)}
                />
              </div>
            )}
          </div>
        </div>

        {isAnyIdeation && (
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">部分B：思维强度 (Intensity)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">最严重的意念 (1-5评分)</label>
                <input 
                  type="number" 
                  min="1" max="5"
                  value={data.intensityScore}
                  onChange={(e) => onChange({...data, intensityScore: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">频率</label>
                <select 
                  value={data.frequency}
                  onChange={(e) => onChange({...data, frequency: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">请选择</option>
                  <option value="1次">1次</option>
                  <option value="偶尔">偶尔</option>
                  <option value="经常">经常</option>
                  <option value="总是">总是</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">部分C：自杀行为 (Suicidal Behavior)</h3>
          <Question 
            label="6. 自杀行为" 
            desc="你是否做过任何事情、或者尝试做任何事情来伤害你自己以达到结束生命的目的？(如：吞药、准备遗书、买药等)"
            val={data.q6}
            onToggle={(v) => toggle('q6', v)}
          />
        </div>
      </div>
    </section>
  );
};

const Question: React.FC<{ label: string, desc: string, val: boolean | null, onToggle: (v: boolean) => void }> = ({ label, desc, val, onToggle }) => (
  <div className="flex justify-between items-start gap-4">
    <div>
      <h4 className="font-semibold text-slate-800">{label}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
    <div className="flex space-x-2 shrink-0">
      <button 
        onClick={() => onToggle(true)}
        className={`px-4 py-1 rounded border transition-colors ${val === true ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
      >
        是
      </button>
      <button 
        onClick={() => onToggle(false)}
        className={`px-4 py-1 rounded border transition-colors ${val === false ? 'bg-slate-200 border-slate-200 text-slate-600' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
      >
        否
      </button>
    </div>
  </div>
);

export default RiskScreening;
