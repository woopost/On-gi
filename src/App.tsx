/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChatCounselor } from './components/ChatCounselor';
import { DailyPrescription } from './components/DailyPrescription';
import { MindShredder } from './components/MindShredder';
import { HealingLetter } from './components/HealingLetter';
import { BurnoutCheck } from './components/BurnoutCheck';
import { AfterSchoolLounge } from './components/AfterSchoolLounge';
import { EmergencyHotline } from './components/EmergencyHotline';
import { Heart, Sparkles, Shield, Coffee, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-stone-800 selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:px-6">
        {activeTab === 'chat' && <ChatCounselor />}
        {activeTab === 'prescription' && <DailyPrescription />}
        {activeTab === 'letter' && <HealingLetter />}
        {activeTab === 'shredder' && <MindShredder />}
        {activeTab === 'burnout' && (
          <BurnoutCheck onStartCounseling={() => setActiveTab('chat')} />
        )}
        {activeTab === 'lounge' && <AfterSchoolLounge />}
        {activeTab === 'hotline' && <EmergencyHotline />}
      </main>

      {/* Warm Footer */}
      <footer className="border-t border-amber-100 bg-[#f7f4ef]/80 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            </div>
            <span className="font-semibold text-stone-700">교사 마음 쉼터 온기(溫氣)</span>
            <span>—</span>
            <span>대한민국 모든 선생님들의 존엄과 건강한 일상을 온 마음으로 응원합니다.</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setActiveTab('hotline')}
              className="hover:text-stone-700 transition underline cursor-pointer"
            >
              긴급 상담 번호 (1395)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('lounge')}
              className="hover:text-stone-700 transition cursor-pointer"
            >
              퇴근 후 이완 호흡
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
