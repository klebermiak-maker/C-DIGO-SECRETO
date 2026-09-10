import React, { useState, useEffect } from 'react';
import { EXTRA_MISSION_CATEGORIES } from '../data/missions';
import { numberToLetter } from '../data/alphabet';
import { soundManager } from '../utils/audio';
import { triggerLineCompletedConfetti, triggerFullMissionConfetti } from '../utils/confetti';
import { CheckCircle2, Lightbulb, RefreshCw, Volume2, Sparkles, Award, Compass, Trophy } from 'lucide-react';
import { SecretMessage } from '../types';

interface MissionsGameProps {
  onSelectNumberForHighlight: (num: number) => void;
  onAwardStar: () => void;
  completedMissions: string[];
  setCompletedMissions: React.Dispatch<React.SetStateAction<string[]>>;
  onCelebrate?: (data: { type: 'line' | 'mission'; title: string; message: string }) => void;
}

export const MissionsGame: React.FC<MissionsGameProps> = ({
  onSelectNumberForHighlight,
  onAwardStar,
  completedMissions,
  setCompletedMissions,
  onCelebrate,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(EXTRA_MISSION_CATEGORIES[0].id);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});

  // Reset inputs if all missions are cleared from outer game reset
  useEffect(() => {
    if (completedMissions.length === 0) {
      setInputs({});
    }
  }, [completedMissions]);

  const activeCategory =
    EXTRA_MISSION_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
    EXTRA_MISSION_CATEGORIES[0];

  const totalMissionsCount = EXTRA_MISSION_CATEGORIES.reduce(
    (acc, cat) => acc + cat.missions.length,
    0
  );

  const handleTextChange = (missionId: string, value: string, mission: SecretMessage) => {
    soundManager.playClick();
    const upper = value.toUpperCase();
    setInputs((prev) => ({ ...prev, [missionId]: upper }));

    const cleanInput = upper.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const cleanTarget = mission.targetWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const isMatch =
      cleanInput === cleanTarget ||
      (mission.acceptedAlternatives &&
        mission.acceptedAlternatives.some(
          (alt) => alt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() === cleanInput
        ));

    if (isMatch && !completedMissions.includes(missionId)) {
      const updatedCompleted = [...completedMissions, missionId];
      setCompletedMissions(updatedCompleted);
      onAwardStar();

      const allInCategoryComplete = activeCategory.missions.every((m) =>
        updatedCompleted.includes(m.id)
      );

      const allMissionsInGameComplete = updatedCompleted.length >= totalMissionsCount;

      if (allMissionsInGameComplete) {
        soundManager.playFanfare();
        triggerFullMissionConfetti();
        if (onCelebrate) {
          onCelebrate({
            type: 'mission',
            title: `🏆 MESTRE DETETIVE SUPREMO!`,
            message: `Impressionante! Você decodificou todas as 20 missões do jogo! Você é um gênio da computação!`,
          });
        }
      } else if (allInCategoryComplete) {
        soundManager.playFanfare();
        triggerFullMissionConfetti();
        if (onCelebrate) {
          onCelebrate({
            type: 'mission',
            title: `Missão "${activeCategory.title}" Concluída!`,
            message: `Fantástico! Você decodificou todas as palavras desta categoria!`,
          });
        }
      } else {
        soundManager.playSuccess();
        soundManager.playUnlock();
        triggerLineCompletedConfetti();
        if (onCelebrate) {
          onCelebrate({
            type: 'line',
            title: `Palavra Decodificada!`,
            message: `Você desvendou "${mission.targetWord}". +1 Estrela conquistada! ⭐`,
          });
        }
      }

      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const speechMsg = allMissionsInGameComplete
            ? `Extraordinário! Você concluiu todas as 20 missões de código secreto!`
            : allInCategoryComplete
            ? `Parabéns, detetive! Você completou todas as palavras da missão ${activeCategory.title}!`
            : `Sensacional! A palavra é ${mission.targetWord}`;
          const utterance = new SpeechSynthesisUtterance(speechMsg);
          utterance.lang = 'pt-BR';
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }
    }
  };

  const toggleHint = (id: string) => {
    soundManager.playClick();
    setHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetSingle = (id: string) => {
    soundManager.playClick();
    setInputs((prev) => ({ ...prev, [id]: '' }));
    setCompletedMissions((prev) => prev.filter((m) => m !== id));
  };

  const speakClue = (mission: SecretMessage) => {
    soundManager.playClick();
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const codeString = mission.code.join(', ');
        const utterance = new SpeechSynthesisUtterance(
          `Missão ${mission.label}. Código ${codeString}. Dica: ${mission.hint}`
        );
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-indigo-300 shadow-sm space-y-5">
      {/* Category selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            🕵️
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>MISSÕES DO DETETIVE DA INFORMAÇÃO</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                {completedMissions.length} de {totalMissionsCount} Missões Cumpridas
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Escolha uma categoria e decodifique mais palavras secretas usando os números da tabela!
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {EXTRA_MISSION_CATEGORIES.map((cat) => {
            const catCompletedCount = cat.missions.filter((m) =>
              completedMissions.includes(m.id)
            ).length;
            const isCatComplete = catCompletedCount === cat.missions.length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategoryId(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategoryId === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    selectedCategoryId === cat.id
                      ? isCatComplete
                        ? 'bg-emerald-400 text-emerald-950'
                        : 'bg-indigo-800 text-indigo-100'
                      : isCatComplete
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {isCatComplete ? '✓ 5/5' : `${catCompletedCount}/${cat.missions.length}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description banner */}
      <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 flex items-center justify-between">
        <div className="text-xs text-indigo-950">
          <span className="font-bold">{activeCategory.title}: </span>
          {activeCategory.description}
        </div>
        <div className="text-xs font-bold text-indigo-700 hidden sm:block">
          {activeCategory.missions.filter((m) => completedMissions.includes(m.id)).length} /{' '}
          {activeCategory.missions.length} resolvidos
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {activeCategory.missions.map((mission) => {
          const isDone = completedMissions.includes(mission.id);
          const showHint = hints[mission.id];
          const val =
            inputs[mission.id] !== undefined
              ? inputs[mission.id]
              : isDone
              ? mission.targetWord
              : '';

          return (
            <div
              key={mission.id}
              className={`rounded-xl p-3.5 border transition-all ${
                isDone
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  {mission.label}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakClue(mission)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                    title="Ouvir dica de áudio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleHint(mission.id)}
                    className="p-1 text-amber-600 hover:text-amber-800 rounded-md"
                    title="Ver dica"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => resetSingle(mission.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                    title="Limpar"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code numbers */}
              <div className="flex items-center flex-wrap gap-1 bg-white p-2 rounded-lg border border-slate-200 mb-2.5">
                {mission.code.map((num, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        onSelectNumberForHighlight(num);
                      }}
                      className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-md font-black text-xs transition-colors"
                      title={`Número ${num} = ${numberToLetter(num)}`}
                    >
                      {num}
                    </button>
                    {idx < mission.code.length - 1 && (
                      <span className="text-slate-300 text-xs font-bold">-</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Input field */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleTextChange(mission.id, e.target.value, mission)}
                  placeholder="DIGITE A PALAVRA..."
                  className={`flex-1 px-3 py-1.5 text-xs sm:text-sm font-black uppercase rounded-lg border-2 transition-all focus:outline-hidden ${
                    isDone
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                      : 'bg-white border-slate-300 focus:border-indigo-500'
                  }`}
                />
                {isDone && (
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-1.5 rounded-lg shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Acertou!</span>
                  </div>
                )}
              </div>

              {/* Hint */}
              {showHint && (
                <div className="mt-2 text-[11px] bg-amber-50 text-amber-900 p-2 rounded-lg border border-amber-200">
                  <span className="font-bold">Dica: </span>
                  {mission.hint}
                </div>
              )}

              {/* Explanation on completion */}
              {isDone && mission.explanation && (
                <div className="mt-2 text-[11px] bg-emerald-100/70 text-emerald-950 p-2 rounded-lg border border-emerald-300">
                  <span className="font-bold">Você sabia? </span>
                  {mission.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Completed Celebration Banner */}
      {activeCategory.missions.every((m) => completedMissions.includes(m.id)) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-2 border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white text-indigo-600 flex items-center justify-center text-2xl shadow-md shrink-0">
              🏅
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                CATEGORIA "{activeCategory.title.toUpperCase()}" CONCLUÍDA!
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium">
                Você decifrou com sucesso todas as mensagens e acumulou mais estrelas de detetive!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundManager.playFanfare();
              triggerFullMissionConfetti();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-900 font-bold rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Chuva de Confetes! 🎊</span>
          </button>
        </div>
      )}
    </div>
  );
};
