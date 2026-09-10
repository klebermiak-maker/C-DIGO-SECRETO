import React, { useState } from 'react';
import { ALPHABET_LIST, THEMED_SYMBOLS } from '../data/alphabet';
import { SymbolTheme } from '../types';
import { soundManager } from '../utils/audio';
import { Search, Volume2, Sparkles, Hash, Smile, Eye } from 'lucide-react';

interface CodeTableProps {
  selectedNumber?: number | null;
  selectedLetter?: string | null;
  onSelectLetter?: (letter: string, number: number) => void;
  activeTheme?: SymbolTheme;
  showCustomSymbols?: boolean;
  customSymbols?: Record<string, string>;
}

export const CodeTable: React.FC<CodeTableProps> = ({
  selectedNumber,
  selectedLetter,
  onSelectLetter,
  activeTheme = 'emojis',
  showCustomSymbols = false,
  customSymbols,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState<'numbers' | 'symbols' | 'both'>('numbers');

  const row1 = ALPHABET_LIST.slice(0, 13); // A - M
  const row2 = ALPHABET_LIST.slice(13, 26); // N - Z

  const isHighlighted = (letter: string, num: number) => {
    if (selectedNumber && selectedNumber === num) return true;
    if (selectedLetter && selectedLetter.toUpperCase() === letter) return true;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toUpperCase();
      if (term === letter) return true;
      if (parseInt(term, 10) === num) return true;
    }
    return false;
  };

  const speakLetterAndNumber = (letter: string, num: number) => {
    soundManager.playClick();
    if (onSelectLetter) {
      onSelectLetter(letter, num);
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`Letra ${letter}, número ${num}`);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis fallback
      }
    }
  };

  const getSymbolForLetter = (letter: string) => {
    if (showCustomSymbols && customSymbols && customSymbols[letter]) {
      return customSymbols[letter];
    }
    return THEMED_SYMBOLS[activeTheme]?.[letter] || '❓';
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm relative overflow-hidden">
      {/* Decorative badge */}
      <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 bg-amber-500/10 w-24 h-24 rounded-full pointer-events-none" />

      {/* Header of Section 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>TABELA DE CÓDIGO</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                Referência
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cada letra do alfabeto está representada por um número de 1 a 26!
            </p>
          </div>
        </div>

        {/* View mode toggle & search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-table"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar (ex: 15 ou O)"
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-36 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Mode switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              id="btn-mode-numbers"
              onClick={() => {
                soundManager.playClick();
                setMode('numbers');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                mode === 'numbers' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
              }`}
              title="Apenas Números (Padrão da Folha)"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Números</span>
            </button>
            <button
              id="btn-mode-symbols"
              onClick={() => {
                soundManager.playClick();
                setMode('symbols');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                mode === 'symbols' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600'
              }`}
              title="Ver Símbolos / Emojis"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Símbolos</span>
            </button>
            <button
              id="btn-mode-both"
              onClick={() => {
                soundManager.playClick();
                setMode('both');
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                mode === 'both' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
              }`}
              title="Ver Números e Símbolos juntos"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ambos</span>
            </button>
          </div>
        </div>
      </div>

      {/* The Alphabet Table Grid - matching the layout of the paper */}
      <div className="space-y-3 overflow-x-auto pb-1">
        {/* Row 1: A - M */}
        <div className="min-w-[620px] rounded-xl border border-amber-200 overflow-hidden shadow-2xs">
          <div className="grid grid-cols-14 text-center divide-x divide-amber-200 bg-amber-100/90 text-amber-950 font-bold text-xs py-1.5 uppercase tracking-wider">
            <div className="flex items-center justify-center font-extrabold text-[11px] text-amber-900 bg-amber-200/50">
              LETRA
            </div>
            {row1.map((item) => {
              const active = isHighlighted(item.letter, item.number);
              return (
                <div
                  key={item.letter}
                  onClick={() => speakLetterAndNumber(item.letter, item.number)}
                  className={`cursor-pointer transition-colors py-0.5 text-sm font-black ${
                    active ? 'bg-amber-400 text-amber-950 scale-105 rounded-xs' : 'hover:bg-amber-200/60'
                  }`}
                  title={`Clique para ouvir letra ${item.letter} = ${item.number}`}
                >
                  {item.letter}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-14 text-center divide-x divide-amber-200 bg-white font-bold text-xs py-1.5">
            <div className="flex items-center justify-center font-extrabold text-[11px] text-slate-600 bg-slate-50">
              NÚMERO
            </div>
            {row1.map((item) => {
              const active = isHighlighted(item.letter, item.number);
              return (
                <div
                  key={item.letter}
                  onClick={() => speakLetterAndNumber(item.letter, item.number)}
                  className={`cursor-pointer transition-colors py-0.5 text-xs sm:text-sm font-extrabold ${
                    active ? 'bg-amber-300 text-amber-950 font-black' : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {item.number}
                </div>
              );
            })}
          </div>

          {(mode === 'symbols' || mode === 'both') && (
            <div className="grid grid-cols-14 text-center divide-x divide-indigo-100 bg-indigo-50/50 text-xs py-1">
              <div className="flex items-center justify-center font-extrabold text-[11px] text-indigo-800 bg-indigo-100/50">
                SÍMBOLO
              </div>
              {row1.map((item) => (
                <div key={item.letter} className="text-sm py-0.5">
                  {getSymbolForLetter(item.letter)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 2: N - Z */}
        <div className="min-w-[620px] rounded-xl border border-amber-200 overflow-hidden shadow-2xs">
          <div className="grid grid-cols-14 text-center divide-x divide-amber-200 bg-amber-100/90 text-amber-950 font-bold text-xs py-1.5 uppercase tracking-wider">
            <div className="flex items-center justify-center font-extrabold text-[11px] text-amber-900 bg-amber-200/50">
              LETRA
            </div>
            {row2.map((item) => {
              const active = isHighlighted(item.letter, item.number);
              return (
                <div
                  key={item.letter}
                  onClick={() => speakLetterAndNumber(item.letter, item.number)}
                  className={`cursor-pointer transition-colors py-0.5 text-sm font-black ${
                    active ? 'bg-amber-400 text-amber-950 scale-105 rounded-xs' : 'hover:bg-amber-200/60'
                  }`}
                  title={`Clique para ouvir letra ${item.letter} = ${item.number}`}
                >
                  {item.letter}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-14 text-center divide-x divide-amber-200 bg-white font-bold text-xs py-1.5">
            <div className="flex items-center justify-center font-extrabold text-[11px] text-slate-600 bg-slate-50">
              NÚMERO
            </div>
            {row2.map((item) => {
              const active = isHighlighted(item.letter, item.number);
              return (
                <div
                  key={item.letter}
                  onClick={() => speakLetterAndNumber(item.letter, item.number)}
                  className={`cursor-pointer transition-colors py-0.5 text-xs sm:text-sm font-extrabold ${
                    active ? 'bg-amber-300 text-amber-950 font-black' : 'text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  {item.number}
                </div>
              );
            })}
          </div>

          {(mode === 'symbols' || mode === 'both') && (
            <div className="grid grid-cols-14 text-center divide-x divide-indigo-100 bg-indigo-50/50 text-xs py-1">
              <div className="flex items-center justify-center font-extrabold text-[11px] text-indigo-800 bg-indigo-100/50">
                SÍMBOLO
              </div>
              {row2.map((item) => (
                <div key={item.letter} className="text-sm py-0.5">
                  {getSymbolForLetter(item.letter)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          Dica: Clique em qualquer letra ou número para ouvir e destacar!
        </span>
        <span className="text-amber-800 font-semibold hidden sm:inline">
          Alfabeto de 26 letras da Língua Portuguesa
        </span>
      </div>
    </div>
  );
};
