import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Printer, HelpCircle, ShieldCheck, Star } from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  student: StudentProfile;
  onUpdateStudent: (field: keyof StudentProfile, value: string) => void;
  activeTab: 'sheet' | 'missions' | 'creator' | 'print';
  setActiveTab: (tab: 'sheet' | 'missions' | 'creator' | 'print') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  starsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  onUpdateStudent,
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  starsCount,
}) => {
  const [starAnimate, setStarAnimate] = useState(false);

  useEffect(() => {
    if (starsCount > 0) {
      setStarAnimate(true);
      const timer = setTimeout(() => setStarAnimate(false), 900);
      return () => clearTimeout(timer);
    }
  }, [starsCount]);

  return (
    <header className="w-full bg-white border-b border-amber-200 shadow-xs">
      {/* BNCC Notification Strip */}
      <div className="bg-amber-600 text-white px-4 py-1.5 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-200 shrink-0" />
          <span>INFORMÁTICA EDUCATIVA • 4º ANO DO ENSINO FUNDAMENTAL</span>
          <span className="hidden sm:inline bg-amber-700 text-amber-100 px-2 py-0.5 rounded-full text-[11px]">
            Habilidade BNCC: EF04CO04
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-100 hidden md:inline">
            Codificação e Representação da Informação
          </span>
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-300 ${
              starAnimate
                ? 'bg-yellow-300 text-amber-950 scale-110 shadow-sm'
                : 'bg-amber-700/80 text-amber-100'
            }`}
          >
            <span>⭐</span>
            <span>{starsCount} Estrelas</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-200">
              <span className="text-2xl sm:text-3xl">🔐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                  CÓDIGO SECRETO
                </h1>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  4º Ano
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Decodifique mensagens secretas e descubra como o computador representa a informação!
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Animated Stars Pill */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm border transition-all duration-300 ${
                starAnimate
                  ? 'scale-110 bg-amber-400 text-amber-950 border-amber-500 shadow-md ring-4 ring-amber-200'
                  : 'bg-amber-50 text-amber-900 border-amber-200 shadow-2xs'
              }`}
              title="Estrelas conquistadas!"
            >
              <span className={`text-base transition-transform inline-block ${starAnimate ? 'scale-125 rotate-12' : ''}`}>
                ⭐
              </span>
              <span className="font-black text-sm">{starsCount}</span>
              <span className="hidden sm:inline font-semibold text-xs">
                {starsCount === 1 ? 'Estrela' : 'Estrelas'}
              </span>
            </div>

            <button
              id="btn-help"
              onClick={() => {
                soundManager.playClick();
                onOpenHelp();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              title="O que é a habilidade EF04CO04 e regras do jogo"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Como Funciona</span>
            </button>

            <button
              id="btn-sound-toggle"
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled
                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                  : 'border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="btn-nav-print"
              onClick={() => {
                soundManager.playClick();
                setActiveTab('print');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Imprimir folha de atividades igual da professora"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir Folha</span>
            </button>
          </div>
        </div>

        {/* Student identification fields (Header identical to paper activity) */}
        <div className="mt-3.5 pt-3 border-t border-dashed border-amber-200 bg-amber-50/70 p-3 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-900 uppercase tracking-wide">Escola:</span>
              <input
                id="input-student-school"
                type="text"
                value={student.school}
                onChange={(e) => onUpdateStudent('school', e.target.value)}
                placeholder="Nome da sua escola..."
                className="flex-1 bg-white border border-amber-200 rounded-md px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-900 uppercase tracking-wide">Nome:</span>
              <input
                id="input-student-name"
                type="text"
                value={student.name}
                onChange={(e) => onUpdateStudent('name', e.target.value)}
                placeholder="Seu nome completo..."
                className="flex-1 bg-white border border-amber-200 rounded-md px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-900 uppercase tracking-wide">Data:</span>
              <input
                id="input-student-date"
                type="text"
                value={student.date}
                onChange={(e) => onUpdateStudent('date', e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-28 bg-white border border-amber-200 rounded-md px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-900 uppercase tracking-wide">Turma:</span>
              <input
                id="input-student-class"
                type="text"
                value={student.classroom}
                onChange={(e) => onUpdateStudent('classroom', e.target.value)}
                placeholder="4º Ano B"
                className="flex-1 bg-white border border-amber-200 rounded-md px-2 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            id="tab-sheet"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('sheet');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'sheet'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>📝</span>
            <span>Atividade da Folha</span>
            <span className="bg-white/25 px-1.5 py-0.2 rounded-full text-[11px]">5 Itens</span>
          </button>

          <button
            id="tab-missions"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('missions');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'missions'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>🕵️</span>
            <span>Missões do Detetive</span>
            <span className="bg-white/25 px-1.5 py-0.2 rounded-full text-[11px]">13 Fases</span>
          </button>

          <button
            id="tab-creator"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('creator');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'creator'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>🎨</span>
            <span>Agora é Sua Vez!</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full text-[11px]">Criar Código</span>
          </button>

          <button
            id="tab-print"
            onClick={() => {
              soundManager.playClick();
              setActiveTab('print');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'print'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>🖨️</span>
            <span>Folha Para Imprimir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
