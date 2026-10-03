import React from 'react';
import { PhoneCall, ShieldAlert, HeartHandshake, ExternalLink, AlertCircle, FileText, CheckCircle } from 'lucide-react';

export const EmergencyHotline: React.FC = () => {
  const hotlines = [
    {
      title: '교육부 교원마음 1395 핫라인',
      number: '1395',
      desc: '교원치유지원센터 통합 콜센터: 심리상담, 법률 지원, 교권 침해 사안 대응 원스톱 지원',
      hours: '평일 09:00 ~ 18:00 (전국 공통)',
      color: 'bg-amber-500',
    },
    {
      title: '정신건강 위기상담전화',
      number: '1577-0199',
      desc: '정신건강전문요원의 24시간 심리적 위기 상담 및 응급 개입',
      hours: '연중무휴 24시간 무료 운영',
      color: 'bg-emerald-600',
    },
    {
      title: '24시간 자살예방 위기상담전화',
      number: '109 / 1393',
      desc: '감당할 수 없는 절망감이나 극단적 충동이 들 때 즉각적인 생명 지킴 상담',
      hours: '연중무휴 24시간 상시 운영',
      color: 'bg-rose-600',
    },
    {
      title: '한국교원단체총연합회 / 교사노조 교권상담',
      number: '교직 단체 교권국',
      desc: '악성 민원 사안 대응, 변호사 법률 동행 지원 및 소송비 지원 제도',
      hours: '소속 시도 지부별 접수',
      color: 'bg-indigo-600',
    },
  ];

  const safetySteps = [
    {
      title: '1. 개인 연락처 차단 및 안심번호 전환',
      desc: '퇴근 후 학부모의 개인 카톡 및 전화는 학교 유선 대표번호 또는 교원 안심번호 앱으로 연결되도록 설정하세요. 개인 번호로 온 메시지는 캡처 후 답장하지 않습니다.',
    },
    {
      title: '2. 통화 녹음 고지 및 공문서화',
      desc: '폭언이나 무리한 요구 시 "교원지위법에 따라 본 통화 내용은 녹음됩니다"라고 고지하고, 통화 일시와 상대방의 발언 요지를 일지로 기록해둡니다.',
    },
    {
      title: '3. 혼자 감당하지 말고 관리자 및 교원치유센터 보고',
      desc: '악성 민원은 교사 개인의 잘못이 아닌 학교 차원의 대응 사안입니다. 즉시 교감·교장 등 관리자에게 보고하고 교원치유지원센터에 보호 조치를 신청하세요.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              교권 및 위기 긴급 핫라인
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              선생님은 결코 혼자가 아닙니다. 감당하기 힘든 위기나 부당한 침해 상황에서 기댈 수 있는 공식 전문 창구입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Hotline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotlines.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase">{item.hours}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <h3 className="text-base font-bold text-stone-800">{item.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-lg font-extrabold text-amber-700">{item.number}</span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5" />
                전화 연결
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Rights & Defensive Guide */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-amber-600" />
          <h3 className="text-base sm:text-lg font-bold text-stone-800">
            악성 민원 및 폭언 발생 시 교사 보호 실전 3원칙
          </h3>
        </div>

        <div className="space-y-3">
          {safetySteps.map((step, idx) => (
            <div key={idx} className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80">
              <h4 className="text-xs sm:text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {step.title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal pl-5">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-stone-100/80 border border-stone-200 rounded-2xl p-4 text-center">
        <p className="text-xs text-stone-500 leading-relaxed">
          본 쉼터는 지친 교사들을 위한 심리적 지지와 회복을 돕는 보조 도구입니다. 법적 분쟁이나 심각한 우울 증세가 지속될 경우 반드시 상기 전문 기관의 도움을 받으시길 권장합니다.
        </p>
      </div>
    </div>
  );
};
