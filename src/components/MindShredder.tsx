import React, { useState } from 'react';
import { Trash2, Flame, Wind, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

const SHRED_TEMPLATES = [
  '“선생님이 애를 제대로 안 보셔서 그런 거 아니에요?”라는 학부모의 날선 목소리',
  '“내가 과연 교사 자격이 있을까?” 하고 스스로를 깎아내리는 자책감',
  '수업 중에 나를 무시하고 비웃던 학생의 차가운 눈빛과 말투',
  '퇴근 후에도 밤 10시 넘어 울리던 개인 연락처와 부당한 독촉',
  '내 열정과 노력을 당연하게 여기고 폄하하던 사람들의 무례한 태도',
];

export const MindShredder: React.FC = () => {
  const [content, setContent] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [shredMethod, setShredMethod] = useState<'shred' | 'burn' | 'fly'>('shred');
  const [shreddedCount, setShreddedCount] = useState(0);
  const [lastShreddedText, setLastShreddedText] = useState<string | null>(null);

  const handleStartShred = (method: 'shred' | 'burn' | 'fly') => {
    if (!content.trim() || isShredding) return;
    setShredMethod(method);
    setIsShredding(true);
    setLastShreddedText(content);

    setTimeout(() => {
      setIsShredding(false);
      setContent('');
      setShreddedCount((prev) => prev + 1);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-100 to-rose-50 border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              마음 쓰레기통 (감정 분쇄기)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              오늘 하루 선생님의 마음에 박힌 모진 말, 악성 민원의 파편, 자책의 독을 종이에 적어 미련 없이 태워버리세요.
            </p>
          </div>
        </div>

        {/* Counter tag */}
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-100/70 border border-rose-200/80 px-3 py-1.5 rounded-xl w-fit">
          <Sparkles className="w-3.5 h-3.5" />
          <span>오늘 비워낸 상처: {shreddedCount}개</span>
        </div>
      </div>

      {/* Main Shredder Canvas */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <label className="block text-xs font-bold text-stone-700 mb-2">
          선생님의 마음을 아프게 한 말이나 자책하는 생각을 가감 없이 적어주세요:
        </label>

        {/* Template suggestions */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SHRED_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setContent(tmpl)}
              className="text-xs bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 px-2.5 py-1 rounded-lg border border-stone-200 transition cursor-pointer"
            >
              + {tmpl.slice(0, 22)}...
            </button>
          ))}
        </div>

        {/* The Paper Sheet */}
        <div className="relative">
          <div
            className={`w-full bg-amber-50/40 border-2 border-dashed border-stone-300 rounded-2xl p-4 transition-all duration-700 ${
              isShredding
                ? shredMethod === 'shred'
                  ? 'animate-shred'
                  : shredMethod === 'burn'
                  ? 'scale-90 opacity-20 filter blur-xs bg-rose-200'
                  : '-translate-y-20 scale-50 opacity-0'
                : 'scale-100 opacity-100'
            }`}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isShredding}
              placeholder="여기에 적힌 말들은 결코 선생님의 진실이 아닙니다. 이 종이가 사라지면 그 상처도 함께 흔적 없이 날아갑니다..."
              rows={5}
              className="w-full bg-transparent text-sm sm:text-base text-stone-800 placeholder-stone-400 focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

          {/* Shredding status overlay */}
          {isShredding && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-2xl">
              <div className="flex flex-col items-center gap-2 text-rose-700 font-bold text-sm animate-pulse">
                {shredMethod === 'shred' && <Trash2 className="w-8 h-8 text-stone-600 animate-spin" />}
                {shredMethod === 'burn' && <Flame className="w-8 h-8 text-rose-600 animate-bounce" />}
                {shredMethod === 'fly' && <Wind className="w-8 h-8 text-teal-600 animate-pulse" />}
                <span>상처의 흔적을 영원히 비워내는 중입니다...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleStartShred('shred')}
            disabled={!content.trim() || isShredding}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>잘게 분쇄하기</span>
          </button>

          <button
            onClick={() => handleStartShred('burn')}
            disabled={!content.trim() || isShredding}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Flame className="w-4 h-4" />
            <span>흔적 없이 태우기</span>
          </button>

          <button
            onClick={() => handleStartShred('fly')}
            disabled={!content.trim() || isShredding}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs"
          >
            <Wind className="w-4 h-4" />
            <span>바람에 날려보내기</span>
          </button>
        </div>

        {/* Affirmation message upon shredding */}
        {lastShreddedText && !isShredding && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 space-y-1">
              <p className="font-bold">
                상처가 깨끗하게 비워졌습니다.
              </p>
              <p className="text-emerald-700 leading-relaxed font-normal">
                선생님께서 방금 버리신 그 무례하고 차가운 말들은 선생님의 가치를 1도 훼손할 수 없습니다. 선생님은 내일도, 오늘도 존엄하고 아름다운 교육자입니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
