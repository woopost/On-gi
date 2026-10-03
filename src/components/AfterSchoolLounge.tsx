import React, { useState, useEffect } from 'react';
import { ambientSound } from '../utils/soundGenerator';
import { Coffee, CloudRain, Flame, Trees, Radio, Play, Square, Volume2, Sparkles, Heart } from 'lucide-react';

export const AfterSchoolLounge: React.FC = () => {
  // Breathing state: 'inhale' (4s), 'hold' (7s), 'exhale' (8s), 'idle'
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Audio state
  const [activeSound, setActiveSound] = useState<'rain' | 'campfire' | 'forest' | 'whitenoise' | null>(null);
  const [volume, setVolume] = useState(0.4);

  // Breathing timer cycle
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isBreathingActive) {
      if (breathPhase === 'idle' || breathPhase === 'exhale') {
        setBreathPhase('inhale');
        setSecondsLeft(4);
      } else if (breathPhase === 'inhale' && secondsLeft <= 0) {
        setBreathPhase('hold');
        setSecondsLeft(7);
      } else if (breathPhase === 'hold' && secondsLeft <= 0) {
        setBreathPhase('exhale');
        setSecondsLeft(8);
      }

      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else if (breathPhase === 'exhale') {
              setBreathPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('idle');
      setSecondsLeft(0);
    }

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, secondsLeft]);

  // Handle Audio playback
  const handleToggleSound = (type: 'rain' | 'campfire' | 'forest' | 'whitenoise') => {
    if (activeSound === type) {
      ambientSound.stop();
      setActiveSound(null);
    } else {
      ambientSound.play(type, volume);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  const sounds = [
    { id: 'rain', label: '차분한 창가 빗소리', icon: CloudRain, desc: '복잡한 생각을 씻어내리는 부드러운 빗방울' },
    { id: 'campfire', label: '따뜻한 모닥불 장작소리', icon: Flame, desc: '타닥타닥 타오르며 마음을 녹여주는 불꽃' },
    { id: 'forest', label: '고요한 숲속 솔바람', icon: Trees, desc: '교실을 벗어나 자연 속 피톤치드 바람' },
    { id: 'whitenoise', label: '포근한 백색소음', icon: Radio, desc: '외부 소음과 잡념을 차단하는 안정의 소리' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
              퇴근 후 온기 라운지
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              교실 문을 닫고 나온 지금, 심장박동을 안정시키는 4-7-8 이완 호흡과 평온한 앰비언트 사운드로 뇌를 쉬게 해주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 4-7-8 Breathing Circle */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full text-left mb-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              미주신경 안정화
            </span>
            <h3 className="text-lg font-bold text-stone-800">4-7-8 퇴근 이완 호흡</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              4초 들이마시고, 7초 머금고, 8초간 길게 한숨 내쉬기
            </p>
          </div>

          {/* Animated Circle */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Outer glow ring */}
            <div
              className={`w-52 h-52 rounded-full transition-all duration-1000 flex items-center justify-center ${
                breathPhase === 'inhale'
                  ? 'scale-110 bg-emerald-100/60 ring-8 ring-emerald-300/40'
                  : breathPhase === 'hold'
                  ? 'scale-110 bg-amber-100/60 ring-8 ring-amber-300/40'
                  : breathPhase === 'exhale'
                  ? 'scale-90 bg-teal-100/40 ring-4 ring-teal-200/30'
                  : 'bg-stone-100'
              }`}
            >
              {/* Inner core */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-inner ${
                  breathPhase === 'inhale'
                    ? 'bg-emerald-500 text-white'
                    : breathPhase === 'hold'
                    ? 'bg-amber-500 text-white'
                    : breathPhase === 'exhale'
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                <span className="text-xs font-medium">
                  {breathPhase === 'idle'
                    ? '시작하기'
                    : breathPhase === 'inhale'
                    ? '들이마시기'
                    : breathPhase === 'hold'
                    ? '숨 멈추기'
                    : '천천히 내쉬기'}
                </span>
                <span className="text-2xl font-bold mt-1">
                  {breathPhase === 'idle' ? '준비' : `${secondsLeft}초`}
                </span>
              </div>
            </div>
          </div>

          {/* Control Button */}
          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
              isBreathingActive
                ? 'bg-stone-800 hover:bg-stone-900 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isBreathingActive ? (
              <>
                <Square className="w-4 h-4" />
                <span>호흡 멈추기</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>호흡 가이드 시작하기</span>
              </>
            )}
          </button>
        </div>

        {/* Ambient Sound Player */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  자연의 안식
                </span>
                <h3 className="text-lg font-bold text-stone-800">마음 정화 사운드</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  교실 소음과 전화 벨소리의 긴장을 부드럽게 지워줍니다.
                </p>
              </div>
            </div>

            {/* Sound options */}
            <div className="space-y-2.5">
              {sounds.map((sound) => {
                const Icon = sound.icon;
                const isPlaying = activeSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => handleToggleSound(sound.id as any)}
                    className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-50/80 border-amber-400 text-amber-900 shadow-xs'
                        : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200/80 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isPlaying ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                          <span>{sound.label}</span>
                          {isPlaying && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{sound.desc}</div>
                      </div>
                    </div>

                    <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/80 border border-stone-200">
                      {isPlaying ? '재생 중' : '듣기'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-stone-500 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-xs text-stone-500 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Grounding Exercise Note */}
      <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-5 flex items-start gap-3">
        <Heart className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-stone-700 space-y-1">
          <p className="font-bold text-amber-900">
            선생님을 위한 5-4-3-2-1 그라운딩 기법
          </p>
          <p className="text-stone-600 leading-relaxed font-normal">
            불안이나 자책감이 엄습할 때, 눈앞에 보이는 5가지 사물(예: 찻잔, 커튼 등)을 바라보고, 만질 수 있는 4가지 감촉을 느끼며, 들리는 3가지 소리에 귀 기울여보세요. 선생님의 몸과 마음은 지금 안전한 집에 머물고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
