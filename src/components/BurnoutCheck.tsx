import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, HeartPulse, RefreshCw, MessageSquare } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  category: '소진' | '냉담' | '성취감';
}

const QUESTIONS: Question[] = [
  { id: 1, text: '학교에 출근할 생각을 하면 아침부터 온몸에 기운이 빠지고 답답하다.', category: '소진' },
  { id: 2, text: '학생들의 질문이나 행동에 예전처럼 온화하게 대하기 어렵고 짜증이 먼저 난다.', category: '냉담' },
  { id: 3, text: '퇴근 후에도 하루 종일 학부모 전화나 학교 문제가 머릿속을 맴돌아 쉬지 못한다.', category: '소진' },
  { id: 4, text: '학생들을 교육하기보다 그저 "아무 일 없이 오늘 하루만 무사히 넘어가라"는 마음이 든다.', category: '냉담' },
  { id: 5, text: '내가 과연 아이들에게 긍정적인 영향을 주고 있는지 회의감이 들고 무력하다.', category: '성취감' },
  { id: 6, text: '학부모나 동료와의 갈등을 겪을 때 어디에도 기댈 곳 없이 철저히 혼자인 것 같다.', category: '소진' },
];

interface BurnoutCheckProps {
  onStartCounseling?: () => void;
}

export const BurnoutCheck: React.FC<BurnoutCheckProps> = ({ onStartCounseling }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCalculated, setIsCalculated] = useState(false);

  const handleSelectOption = (qId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const isCompleted = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const getResultDetails = () => {
    if (totalScore <= 6) {
      return {
        level: '🟢 안정 및 회복 상태',
        title: '건강한 회복탄력성을 유지하고 계십니다.',
        description:
          '현재 교직 생활의 피로 속에서도 스스로의 중심과 에너지를 잘 지켜내고 계십니다. 가끔 지칠 때도 지금처럼 퇴근 후의 온전한 쉼을 잊지 마세요.',
        action: '주말에는 교실 일을 완전히 잊고 자연과 취미 속에서 감각을 깨워보세요.',
        color: 'emerald',
      };
    } else if (totalScore <= 12) {
      return {
        level: '🟡 주의: 에너지 배터리 경고',
        title: '감정적 소진이 상당 부분 누적된 상태입니다.',
        description:
          '교실에서 받는 자극과 책임감의 무게가 한계치에 다다르고 있습니다. "내가 더 참아야지"라는 생각은 소진을 가속화합니다. 의도적인 거리두기와 휴식이 절실합니다.',
        action: '당분간 업무 외 연락을 차단하고, 매일 30분씩 아무것도 하지 않는 절대 정적의 시간을 가지세요.',
        color: 'amber',
      };
    } else {
      return {
        level: '🔴 위험: 심각한 번아웃 위기',
        title: '마음의 비상벨이 울리고 있습니다. 당장 멈춤이 필요합니다.',
        description:
          '현재 선생님의 마음은 완전히 방전되었으며, 스스로를 자책할수록 상처만 깊어지는 위기 단계입니다. 이것은 개인의 나약함이 아니라 감당하기 힘든 환경적 압박 때문입니다.',
        action: '혼자 버티지 마시고, 교원치유지원센터나 전문 심리상담, 필요시 병가나 연가를 적극적으로 고려하세요.',
        color: 'rose',
      };
    }
  };

  const result = getResultDetails();

  const handleReset = () => {
    setAnswers({});
    setIsCalculated(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              교사 번아웃 & 감정 소진 자가진단
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              교직 감정노동과 민원 스트레스로 인한 나의 소진 지수를 안심하고 점검해보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-6 divide-y divide-stone-100">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className={`${idx !== 0 ? 'pt-6' : ''}`}>
              <div className="flex items-start gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm sm:text-base font-medium text-stone-800">
                  {q.text}
                </p>
              </div>

              {/* 4-level scale */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '전혀 아니다', score: 0 },
                  { label: '가끔 그렇다', score: 1 },
                  { label: '자주 그렇다', score: 2 },
                  { label: '항상 그렇다', score: 3 },
                ].map((opt) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.score)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium text-center transition cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 font-semibold shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Calculate button */}
        {!isCalculated ? (
          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => setIsCalculated(true)}
              disabled={!isCompleted}
              className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold transition cursor-pointer shadow-sm"
            >
              진단 결과 확인하기 ({Object.keys(answers).length}/{QUESTIONS.length})
            </button>
          </div>
        ) : (
          /* Result Card */
          <div className="mt-6 pt-6 border-t border-stone-200 space-y-5">
            <div
              className={`p-6 rounded-2xl border ${
                result.color === 'emerald'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : result.color === 'amber'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">{result.level}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 shadow-2xs">
                  총점: {totalScore}점 / 18점
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2">{result.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed mb-4">{result.description}</p>

              <div className="bg-white/80 p-3.5 rounded-xl border border-current/20 text-xs sm:text-sm">
                <span className="font-bold block mb-1">🌿 선생님을 위한 긴급 회복 가이드:</span>
                <p>{result.action}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 검사하기</span>
              </button>

              {onStartCounseling && (
                <button
                  onClick={onStartCounseling}
                  className="flex items-center gap-1.5 text-xs sm:text-sm bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI 마음 상담사와 대화 나누기</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
