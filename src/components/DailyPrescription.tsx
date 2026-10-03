import React, { useState } from 'react';
import { PrescriptionResult, SchoolLevel } from '../types';
import {
  FileText,
  Sparkles,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RotateCw,
  Sun,
  Coffee,
  Bookmark,
} from 'lucide-react';

const FEELING_TAGS = [
  { label: '💔 자책감 & 미안함', value: '자책감과 내가 부족한 교사라는 미안함' },
  { label: '🪫 완전한 에너지 탈진', value: '말 한마디 할 힘도 남아있지 않은 완전한 탈진' },
  { label: '😡 억울함 & 부당함', value: '악성 민원과 부당한 요구로 인한 깊은 억울함' },
  { label: '😰 내일 출근의 공포', value: '또 어떤 일이 터질지 몰라 불안하고 두려움' },
  { label: '🧊 차가운 고립감', value: '학교라는 공간에서 나 혼자만 외딴섬이 된 것 같은 외로움' },
  { label: '🌪️ 끝없는 분노와 허무', value: '열정을 쏟아부어도 아무것도 달라지지 않는 허탈감' },
];

const PRESET_SITUATIONS = [
  '학부모로부터 상식 밖의 항의 전화와 메시지를 받아 밤잠을 설침',
  '수업 시간 동안 규칙을 무시하고 소란을 피우는 학생들을 지도하느라 기진맥진함',
  '학생 간 학교폭력 및 교실 다툼 사안 처리에 시달리며 양측 학부모 사이에 끼여 고통받음',
  '나이스 마감과 산더미 같은 공문 행정 업무로 인해 점심조차 제대로 먹지 못함',
  '내 뜻과 다르게 아이들에게 큰 소리로 화를 내고 난 뒤 밀려오는 깊은 후회',
];

export const DailyPrescription: React.FC = () => {
  const [selectedFeeling, setSelectedFeeling] = useState(FEELING_TAGS[0].value);
  const [situationText, setSituationText] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('초등학교');
  const [isLoading, setIsLoading] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGeneratePrescription = async (overrideSituation?: string) => {
    setIsLoading(true);
    setCopied(false);
    const targetSituation = overrideSituation !== undefined ? overrideSituation : situationText;

    try {
      const res = await fetch('/api/prescribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeling: selectedFeeling,
          situation: targetSituation || '오늘 하루 교실에서 온 힘을 다해 학생들과 업무를 감당함',
          schoolLevel,
        }),
      });

      if (!res.ok) throw new Error('처방전 생성 실패');
      const data = await res.json();
      setPrescription(data);
    } catch (err) {
      console.error(err);
      // Fallback fallback prescription
      setPrescription({
        diagnosisTitle: '교실의 파도를 홀로 견뎌낸 교사의 감정 과열 상태',
        validationMessage:
          '선생님, 오늘 하루도 상처받은 마음을 꾹꾹 눌러 담으며 버텨내셨습니다. 지치고 아픈 것은 선생님이 약해서가 아니라, 너무나 진심으로 아이들과 교실을 지키셨기 때문입니다.',
        permissionStatement: '오늘 밤은 훌륭한 교사의 가면을 벗어두고, 오직 나 자신의 아픔을 위해 울어주어도 괜찮습니다.',
        microActions: [
          '퇴근 후 신발을 벗을 때 "오늘 교실 일은 교실에 두고 왔다"라고 소리 내어 말해보기',
          '따뜻한 물로 샤워하며 어깨와 뒷목의 굳은 긴장 풀어주기',
          '오늘 밤은 메신저 알림을 끄고 선생님이 가장 좋아하는 온도의 차를 천천히 음미하기',
        ],
        comfortQuote: '선생님의 온기는 어떤 거친 파도 앞에서도 결코 사라지지 않는 보석입니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCard = () => {
    if (!prescription) return;
    const text = `[교사 마음 처방전]\n🏷️ 진단: ${prescription.diagnosisTitle}\n\n🌿 공감의 말:\n${prescription.validationMessage}\n\n🕊️ 나에게 주는 허락:\n"${prescription.permissionStatement}"\n\n🍵 오늘의 미니 처방:\n${prescription.microActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n💌 헌정 문구:\n"${prescription.comfortQuote}"`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              오늘의 교사 마음 처방전
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              어떤 상처를 입으셨나요? 교사의 마음에 필요한 온전한 지지와 맞춤형 퇴근 케어를 처방해 드립니다.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-5 bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-100">
          {/* Feeling Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              1. 오늘 퇴근길, 선생님의 마음을 가장 무겁게 짓누르는 감정은 무엇인가요?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEELING_TAGS.map((tag) => {
                const isSelected = selectedFeeling === tag.value;
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => setSelectedFeeling(tag.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium text-left transition cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Situation Presets */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              2. 오늘 있었던 일을 들려주세요 (아래 상황을 누르시거나 직접 적어주세요):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {PRESET_SITUATIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSituationText(preset)}
                  className="text-xs bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 px-2.5 py-1 rounded-lg border border-stone-200/70 transition cursor-pointer"
                >
                  + {preset.slice(0, 24)}...
                </button>
              ))}
            </div>
            <textarea
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              placeholder="예: 학부모님이 상담 도중 제 자질을 운운하며 언성을 높이셨어요. 교실에서 학생들도 제 말을 안 듣고... 오늘 하루 온몸에 힘이 빠집니다."
              rows={3}
              className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-3 bg-stone-50/50 focus:bg-white focus:border-amber-400 focus:outline-hidden transition resize-none"
            />
          </div>

          {/* School Level & Generate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold">학교 환경:</span>
              <select
                value={schoolLevel}
                onChange={(e) => setSchoolLevel(e.target.value as SchoolLevel)}
                className="bg-stone-100 rounded-lg px-2.5 py-1 text-xs border border-stone-200"
              >
                <option value="초등학교">초등학교</option>
                <option value="중학교">중학교</option>
                <option value="고등학교">고등학교</option>
                <option value="유치원">유치원</option>
                <option value="특수학교">특수학교</option>
                <option value="비교과(보건/상담/영양/사서)">비교과 (보건/상담/영양/사서)</option>
              </select>
            </div>

            <button
              onClick={() => handleGeneratePrescription()}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>마음 처방전을 조제하고 있습니다...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>맞춤형 마음 처방전 발급받기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Prescription Result Card */}
      {prescription && (
        <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Top Stamp */}
          <div className="flex items-center justify-between pb-4 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Official Teacher Soul Prescription
              </span>
            </div>
            <button
              onClick={handleCopyCard}
              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">복사 완료</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>처방전 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Diagnosis Title */}
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">마음 진단명</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-800 mt-1">
              {prescription.diagnosisTitle}
            </h3>
          </div>

          {/* Validation Message */}
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
              <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
              선생님께 건네는 무조건적 지지
            </div>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
              {prescription.validationMessage}
            </p>
          </div>

          {/* Permission Statement */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 text-center shadow-2xs">
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              오늘 밤, 선생님이 스스로에게 주어야 할 '마음의 허락'
            </span>
            <p className="text-base sm:text-lg font-bold text-emerald-900 italic">
              "{prescription.permissionStatement}"
            </p>
          </div>

          {/* Micro Actions */}
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-3">
              퇴근 후 1분 미니 회복 처방
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {prescription.microActions.map((action, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-stone-700">
                      {idx === 0 ? '신체 이완' : idx === 1 ? '생각 끄기' : '내일의 방패'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comfort Quote Card */}
          <div className="bg-stone-900 text-amber-100 rounded-2xl p-5 sm:p-6 text-center shadow-md">
            <Sun className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <p className="text-sm sm:text-base font-medium leading-relaxed">
              "{prescription.comfortQuote}"
            </p>
            <span className="text-[11px] text-stone-400 mt-2 block">
              — 교사 마음 쉼터 온기(溫氣) 헌정 —
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
