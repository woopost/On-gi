import React from 'react';
import { HeartHandshake, Sparkles, MessageCircle, FileText, Send, Trash2, Activity, Coffee, PhoneCall } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedQuotesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'chat', label: '마음 상담실', icon: MessageCircle, badge: 'AI 대화' },
    { id: 'prescription', label: '마음 처방전', icon: FileText, badge: '오늘의 치유' },
    { id: 'letter', label: '나를 위한 헌사', icon: Send, badge: '위로 편지' },
    { id: 'shredder', label: '마음 쓰레기통', icon: Trash2, badge: '감정 비우기' },
    { id: 'burnout', label: '번아웃 체크', icon: Activity, badge: '자가진단' },
    { id: 'lounge', label: '퇴근 후 라운지', icon: Coffee, badge: '호흡 & 사운드' },
    { id: 'hotline', label: '긴급 핫라인', icon: PhoneCall, badge: '교권 지원' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-amber-100/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-800 tracking-tight flex items-center gap-1.5">
                  교사 마음 쉼터 <span className="text-amber-600 font-extrabold text-sm sm:text-base">온기(溫氣)</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100/70 text-amber-800 border border-amber-200/60">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  교사 안심 쉼터
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                교실 문을 닫고 나온 지금, 무거운 짐을 내려놓고 온전한 당신으로 숨 쉬는 시간
              </p>
            </div>
          </div>

          {/* Calming quick quote banner */}
          <div className="text-xs text-stone-600 bg-amber-50/70 border border-amber-200/50 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-md">
            <span className="text-amber-700 font-semibold shrink-0">🌿 오늘의 토닥임:</span>
            <span className="truncate italic">"선생님은 오늘 하루도 최선을 다하셨습니다. 지친 것은 결코 잘못이 아닙니다."</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
