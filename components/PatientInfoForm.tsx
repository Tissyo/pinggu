
import React from 'react';
import { PatientInfo, Gender, InfoSource } from '../types';

interface Props {
  data: PatientInfo;
  onChange: (val: PatientInfo) => void;
}

const PatientInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof PatientInfo, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <section>
      <div className="mb-8 flex items-center space-x-2">
        <div className="w-1 h-6 bg-teal-500 rounded"></div>
        <h2 className="text-2xl font-bold text-slate-800">基本信息 / Patient Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">姓名 (Name)</label>
          <input 
            type="text" 
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="请输入姓名"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">档案编号 (ID)</label>
          <input 
            type="text" 
            value={data.id}
            onChange={(e) => handleChange('id', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="ID-XXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">性别 (Gender)</label>
          <div className="flex space-x-4">
            {(['男', '女', '其他'] as Gender[]).map(g => (
              <label key={g} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="gender" 
                  checked={data.gender === g}
                  onChange={() => handleChange('gender', g)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">年龄 (Age)</label>
          <input 
            type="number" 
            value={data.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">出生日期 (DOB)</label>
          <input 
            type="date" 
            value={data.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">评估日期 (Assessment Date)</label>
          <input 
            type="date" 
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">评估师 (Clinician)</label>
          <input 
            type="text" 
            value={data.clinician}
            onChange={(e) => handleChange('clinician', e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">信息来源</label>
          <div className="flex space-x-4">
            {(['本人', '家长', '其他'] as InfoSource[]).map(s => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="source" 
                  checked={data.source === s}
                  onChange={() => handleChange('source', s)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700">{s}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientInfoForm;
