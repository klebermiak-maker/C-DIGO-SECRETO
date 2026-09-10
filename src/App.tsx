import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeTable } from './components/CodeTable';
import { SheetDecoder } from './components/SheetDecoder';
import { MissionsGame } from './components/MissionsGame';
import { CustomCodeCreator } from './components/CustomCodeCreator';
import { PrintableWorksheet } from './components/PrintableWorksheet';
import { EducationalModal } from './components/EducationalModal';
import { CelebrationToast, CelebrationData } from './components/CelebrationToast';
import { StudentProfile, SymbolTheme } from './types';
import { soundManager } from './utils/audio';
import { Lightbulb, Sparkles, Award, RotateCcw } from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('codigo_secreto_student');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`;

    return {
      name: '',
      school: 'Escola Municipal',
      classroom: '4º Ano A',
      date: formattedDate,
    };
  });

  const [activeTab, setActiveTab] = useState<'sheet' | 'missions' | 'creator' | 'print'>('sheet');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('codigo_secreto_stars');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });

  const [completedSheetItems, setCompletedSheetItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('codigo_secreto_sheet_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem('codigo_secreto_missions');
    return saved ? JSON.parse(saved) : [];
  });

  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [highlightedLetter, setHighlightedLetter] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<SymbolTheme>('emojis');
  const [customSymbols, setCustomSymbols] = useState<Record<string, string>>({});
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('codigo_secreto_student', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('codigo_secreto_stars', starsCount.toString());
  }, [starsCount]);

  useEffect(() => {
    localStorage.setItem('codigo_secreto_sheet_items', JSON.stringify(completedSheetItems));
  }, [completedSheetItems]);

  useEffect(() => {
    localStorage.setItem('codigo_secreto_missions', JSON.stringify(completedMissions));
  }, [completedMissions]);

  const handleUpdateStudent = (field: keyof StudentProfile, value: string) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundManager.enabled = newState;
    if (newState) {
      soundManager.playClick();
    }
  };

  const handleAwardStar = () => {
    setStarsCount((prev) => prev + 1);
  };

  const handleSelectNumberForHighlight = (num: number) => {
    setHighlightedNumber(num);
    setHighlightedLetter(null);
  };

  const handleSelectLetter = (letter: string, num: number) => {
    setHighlightedLetter(letter);
    setHighlightedNumber(num);
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      soundManager.playClick();
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    soundManager.playClick();
    setCompletedSheetItems([]);
    setCompletedMissions([]);
    setStarsCount(0);
    localStorage.removeItem('codigo_secreto_sheet_items');
    localStorage.removeItem('codigo_secreto_missions');
    localStorage.removeItem('codigo_secreto_stars');
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Header */}
      <Header
        student={student}
        onUpdateStudent={handleUpdateStudent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
        starsCount={starsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'print' ? (
          <PrintableWorksheet
            student={student}
            onBack={() => {
              soundManager.playClick();
              setActiveTab('sheet');
            }}
          />
        ) : (
          <>
            {/* Always visible interactive Reference Code Table (Box 1 of sheet) */}
            <CodeTable
              selectedNumber={highlightedNumber}
              selectedLetter={highlightedLetter}
              onSelectLetter={handleSelectLetter}
              activeTheme={activeTheme}
              showCustomSymbols={activeTab === 'creator'}
              customSymbols={customSymbols}
            />

            {/* Tab 1: Interactive sheet activity (Box 2) */}
            {activeTab === 'sheet' && (
              <div className="space-y-6">
                <SheetDecoder
                  onSelectNumberForHighlight={handleSelectNumberForHighlight}
                  onAwardStar={handleAwardStar}
                  completedItems={completedSheetItems}
                  setCompletedItems={setCompletedSheetItems}
                  onCelebrate={(data) => setCelebration({ ...data, id: Date.now().toString() })}
                />

                {/* Pedagogical Note from the bottom of the original sheet */}
                <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-2xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    💡
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-amber-950">
                      Lembre-se: Um código só faz sentido para quem conhece a regra!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-medium">
                      Codificar é transformar informação para que outros possam entender! Na informática,
                      os computadores usam códigos para guardar textos, fotos, sons e jogos na memória!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab('creator');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap"
                  >
                    Criar Meu Código 🎨
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Detective Missions */}
            {activeTab === 'missions' && (
              <MissionsGame
                onSelectNumberForHighlight={handleSelectNumberForHighlight}
                onAwardStar={handleAwardStar}
                completedMissions={completedMissions}
                setCompletedMissions={setCompletedMissions}
                onCelebrate={(data) => setCelebration({ ...data, id: Date.now().toString() })}
              />
            )}

            {/* Tab 3: Custom Code Creator (Box 3) */}
            {activeTab === 'creator' && (
              <CustomCodeCreator
                onSelectTheme={setActiveTheme}
                activeTheme={activeTheme}
                customSymbols={customSymbols}
                setCustomSymbols={setCustomSymbols}
              />
            )}

            {/* Progress & Reset Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>
                  Conquistas acumuladas: <strong>{starsCount} estrelas</strong> | Folha original:{' '}
                  <strong>{completedSheetItems.length}/5</strong> | Missões do Detetive:{' '}
                  <strong>{completedMissions.length}/20</strong>
                </span>
              </div>
              <button
                onClick={handleResetProgress}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  confirmReset
                    ? 'bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-300'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title="Reiniciar progresso para jogar novamente"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{confirmReset ? 'Confirmar Reiniciar Jogo?' : 'Reiniciar Jogo'}</span>
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          Atividade Educativa de Informática • 4º Ano do Ensino Fundamental • BNCC EF04CO04
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Inspirado na atividade pedagógica original "Código Secreto" • Desenvolvido para aprendizagem digital lúdica
        </p>
      </footer>

      {/* Educational BNCC Modal */}
      <EducationalModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Celebratory Reward Toast & Star Award Notification */}
      <CelebrationToast
        celebration={celebration}
        onDismiss={() => setCelebration(null)}
      />
    </div>
  );
}
