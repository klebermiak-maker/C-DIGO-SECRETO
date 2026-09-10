import React, { useState, useEffect } from 'react';
import { ORIGINAL_SHEET_MISSIONS } from '../data/missions';
import { numberToLetter } from '../data/alphabet';
import { soundManager } from '../utils/audio';
import { triggerLineCompletedConfetti, triggerFullMissionConfetti } from '../utils/confetti';
import { CheckCircle2, Unlock, Lock, Lightbulb, RefreshCw, Sparkles, Volume2, Trophy, Award } from 'lucide-react';

interface SheetDecoderProps {
  onSelectNumberForHighlight: (num: number) => void;
  onAwardStar: () => void;
  completedItems: string[];
  setCompletedItems: React.Dispatch<React.SetStateAction<string[]>>;
  onCelebrate?: (data: { type: 'line' | 'mission'; title: string; message: string }) => void;
}

export const SheetDecoder: React.FC<SheetDecoderProps> = ({
  onSelectNumberForHighlight,
  onAwardStar,
  completedItems,
  setCompletedItems,
  onCelebrate,
}) => {
  // Store user inputs for each mission by ID
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    ORIGINAL_SHEET_MISSIONS.forEach((m) => {
      if (completedItems.includes(m.id)) {
        initial[m.id] = m.targetWord.split('');
      } else {
        initial[m.id] = Array(m.code.length).fill('');
      }
    });
    return initial;
  });

  const [activeHints, setActiveHints] = useState<Record<string, boolean>>({});

  // Sync answers with completedItems on resets or external state changes
  useEffect(() => {
    setAnswers((prev) => {
      const updated = { ...prev };
      let changed = false;
      ORIGINAL_SHEET_MISSIONS.forEach((m) => {
        const isDone = completedItems.includes(m.id);
        const currentSlotList = updated[m.id] || Array(m.code.length).fill('');
        if (isDone && currentSlotList.some((c) => !c)) {
          updated[m.id] = m.targetWord.split('');
          changed = true;
        } else if (!isDone && completedItems.length === 0 && currentSlotList.some((c) => !!c)) {
          updated[m.id] = Array(m.code.length).fill('');
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [completedItems]);

  const handleInputChange = (missionId: string, index: number, value: string) => {
    soundManager.playClick();
    const char = value.slice(-1).toUpperCase();
    
    // Validate only A-Z
    if (char && !/[A-Z]/.test(char)) return;

    setAnswers((prev) => {
      const copy = { ...prev };
      const currentList = [...(copy[missionId] || [])];
      currentList[index] = char;
      copy[missionId] = currentList;

      // Auto-check if complete
      checkCompletion(missionId, currentList);
      return copy;
    });

    // Auto-advance focus to next input if character typed
    if (char) {
      const nextInput = document.getElementById(`slot-${missionId}-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    missionId: string,
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!answers[missionId]?.[index] && index > 0) {
        const prevInput = document.getElementById(`slot-${missionId}-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`slot-${missionId}-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight') {
      const mission = ORIGINAL_SHEET_MISSIONS.find((m) => m.id === missionId);
      if (mission && index < mission.code.length - 1) {
        const nextInput = document.getElementById(`slot-${missionId}-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const checkCompletion = (missionId: string, letters: string[]) => {
    const mission = ORIGINAL_SHEET_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;

    const currentWord = letters.join('').toUpperCase();
    const target = mission.targetWord.toUpperCase();
    const isCorrect =
      currentWord === target ||
      (mission.acceptedAlternatives &&
        mission.acceptedAlternatives.some((alt) => alt.toUpperCase() === currentWord));

    if (isCorrect && !completedItems.includes(missionId)) {
      const nextCompleted = [...completedItems, missionId];
      setCompletedItems(nextCompleted);
      onAwardStar();

      const isWholeSheetComplete = nextCompleted.length === ORIGINAL_SHEET_MISSIONS.length;

      if (isWholeSheetComplete) {
        soundManager.playFanfare();
        triggerFullMissionConfetti();
        if (onCelebrate) {
          onCelebrate({
            type: 'mission',
            title: 'Folha de Atividades Completa!',
            message: 'Incrível! Você decodificou todas as 5 mensagens da folha e dominou o código!',
          });
        }
      } else {
        soundManager.playSuccess();
        soundManager.playUnlock();
        triggerLineCompletedConfetti();
        if (onCelebrate) {
          onCelebrate({
            type: 'line',
            title: `Mensagem ${mission.label} Decodificada!`,
            message: `Palavra: "${target}". +1 Estrela conquistada! ⭐`,
          });
        }
      }

      // Speak word encouragement
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const message = isWholeSheetComplete
            ? `Parabéns, detetive! Você desvendou todas as palavras da folha de informática!`
            : `Muito bem! Você descobriu: ${target}!`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = 'pt-BR';
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }
    }
  };

  const resetMission = (missionId: string) => {
    soundManager.playClick();
    const mission = ORIGINAL_SHEET_MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;

    setAnswers((prev) => ({
      ...prev,
      [missionId]: Array(mission.code.length).fill(''),
    }));
    setCompletedItems((prev) => prev.filter((id) => id !== missionId));
  };

  const fillHint = (missionId: string) => {
    soundManager.playClick();
    setActiveHints((prev) => ({ ...prev, [missionId]: !prev[missionId] }));
  };

  const speakClue = (mission: (typeof ORIGINAL_SHEET_MISSIONS)[0]) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const codeText = mission.code.join(', ');
        const utterance = new SpeechSynthesisUtterance(
          `Mensagem ${mission.label}. Código: ${codeText}. Qual é a palavra?`
        );
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }
  };

  const allDone = ORIGINAL_SHEET_MISSIONS.every((m) => completedItems.includes(m.id));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-amber-300 shadow-sm">
      {/* Title matching section 2 of the sheet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>DECODIFIQUE AS MENSAGENS</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                {completedItems.length} de 5 Resolvidas
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Use a tabela de código acima para descobrir as palavras e nomes escondidos na folha original!
            </p>
          </div>
        </div>

        {allDone && (
          <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-xl text-xs font-bold animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Parabéns! Folha 100% Concluída! ⭐</span>
          </div>
        )}
      </div>

      {/* List of Messages (a, b, c, d, e) */}
      <div className="space-y-4">
        {ORIGINAL_SHEET_MISSIONS.map((mission) => {
          const isDone = completedItems.includes(mission.id);
          const currentSlots = answers[mission.id] || Array(mission.code.length).fill('');
          const showHint = activeHints[mission.id];

          return (
            <div
              key={mission.id}
              className={`rounded-xl p-3 sm:p-4 border transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left: Label and Numbers display */}
                <div className="flex items-center gap-3">
                  <span className="font-black text-amber-900 text-base sm:text-lg w-7">
                    {mission.label}
                  </span>

                  {/* Code box mimicking paper style: 3 - 15 - 18 - 5 */}
                  <div className="flex items-center flex-wrap gap-1.5 bg-white px-3 py-1.5 rounded-lg border-2 border-slate-300 shadow-2xs">
                    {mission.code.map((num, idx) => (
                      <React.Fragment key={idx}>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playClick();
                            onSelectNumberForHighlight(num);
                          }}
                          className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-200 text-amber-900 rounded-md font-black text-sm sm:text-base transition-colors"
                          title={`Clique para destacar o número ${num} na tabela`}
                        >
                          {num}
                        </button>
                        {idx < mission.code.length - 1 && (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => speakClue(mission)}
                    className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                    title="Ouvir mensagem"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Center / Right: Interactive Letter Inputs (Slots) */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {mission.code.map((num, idx) => {
                      const letter = currentSlots[idx] || '';
                      const expectedLetter = numberToLetter(num) || '';
                      const isSlotCorrect = letter.toUpperCase() === expectedLetter;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <input
                            id={`slot-${mission.id}-${idx}`}
                            type="text"
                            maxLength={1}
                            value={letter}
                            onChange={(e) => handleInputChange(mission.id, idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(mission.id, idx, e)}
                            className={`w-9 h-10 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-black uppercase rounded-lg border-2 transition-all focus:outline-hidden ${
                              isDone || isSlotCorrect
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                                : letter
                                ? 'bg-amber-50 border-amber-400 text-amber-950'
                                : 'bg-white border-slate-300 hover:border-amber-400 focus:border-amber-600'
                            }`}
                            placeholder="_"
                          />
                          <span className="text-[10px] font-bold text-slate-400">
                            #{num}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions for this line */}
                  <div className="flex items-center gap-1.5 ml-2">
                    {isDone ? (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-2.5 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">Correto!</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fillHint(mission.id)}
                        className="p-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1"
                        title="Dica de ajuda"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Dica</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => resetMission(mission.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      title="Limpar campos"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hint and Explanation details */}
              {showHint && !isDone && (
                <div className="mt-2 text-xs bg-amber-100/90 text-amber-900 p-2.5 rounded-lg border border-amber-300 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Dica da Professora: </span>
                    {mission.hint}
                  </div>
                </div>
              )}

              {isDone && (
                <div className="mt-2.5 text-xs bg-emerald-100/80 text-emerald-950 p-2.5 rounded-lg border border-emerald-300 flex items-start gap-2">
                  <Unlock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Decodificado com sucesso! </span>
                    {mission.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Sheet Completed Celebration Banner */}
      {completedItems.length === ORIGINAL_SHEET_MISSIONS.length && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 border-2 border-yellow-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-amber-600 flex items-center justify-center text-2xl shadow-md shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                MISSÃO COMPLETA: TODAS AS 5 LINHAS DESVENDADAS!
              </h3>
              <p className="text-xs sm:text-sm text-yellow-100 font-medium">
                Você conquistou 5 estrelas e dominou o código secreto da folha de informática!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playFanfare();
              triggerFullMissionConfetti();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-yellow-50 text-amber-800 font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Chuva de Confetes! 🎊</span>
          </button>
        </div>
      )}
    </div>
  );
};
