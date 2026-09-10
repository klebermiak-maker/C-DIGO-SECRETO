import React, { useState } from 'react';
import { ALPHABET_LIST, THEMED_SYMBOLS } from '../data/alphabet';
import { SymbolTheme } from '../types';
import { soundManager } from '../utils/audio';
import { triggerFullMissionConfetti } from '../utils/confetti';
import { Sparkles, Users, Lock, Unlock, RefreshCw, Send, Check, Copy } from 'lucide-react';

interface CustomCodeCreatorProps {
  onSelectTheme: (theme: SymbolTheme) => void;
  activeTheme: SymbolTheme;
  customSymbols: Record<string, string>;
  setCustomSymbols: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const CustomCodeCreator: React.FC<CustomCodeCreatorProps> = ({
  onSelectTheme,
  activeTheme,
  customSymbols,
  setCustomSymbols,
}) => {
  const [secretInput, setSecretInput] = useState('AMIZADE');
  const [peerGuess, setPeerGuess] = useState('');
  const [peerMode, setPeerMode] = useState(false);
  const [isPeerCracked, setIsPeerCracked] = useState(false);
  const [copied, setCopied] = useState(false);

  const themeOptions: { id: SymbolTheme; label: string; icon: string }[] = [
    { id: 'emojis', label: 'Emojis Divertidos', icon: '🍎' },
    { id: 'animals', label: 'Animais Incríveis', icon: '🐶' },
    { id: 'space', label: 'Missão Espacial', icon: '🚀' },
    { id: 'shapes', label: 'Formas Coloridas', icon: '🔺' },
    { id: 'geometric', label: 'Símbolos Misteriosos', icon: '◬' },
  ];

  const handleSymbolChange = (letter: string, symbol: string) => {
    soundManager.playClick();
    setCustomSymbols((prev) => ({
      ...prev,
      [letter]: symbol,
    }));
  };

  const getSymbol = (letter: string) => {
    return customSymbols[letter] || THEMED_SYMBOLS[activeTheme]?.[letter] || '⭐';
  };

  // Clean secret text for encoding
  const cleanWord = secretInput
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const encodedSymbols = cleanWord.split('').map((char) => {
    if (char === ' ') return '␣';
    return getSymbol(char);
  });

  const checkPeerSolution = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    const normalizedGuess = peerGuess
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const target = cleanWord.trim();

    if (normalizedGuess === target) {
      soundManager.playFanfare();
      triggerFullMissionConfetti();
      setIsPeerCracked(true);
    } else {
      soundManager.playError();
      setIsPeerCracked(false);
    }
  };

  const copyToClipboard = () => {
    soundManager.playClick();
    const encodedText = encodedSymbols.join(' ');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`🔐 Mensagem Secreta do Colega: ${encodedText}`).catch(() => {});
      }
    } catch {
      // ignore in restricted iframe
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-6">
      {/* Header matching Box 3 of the worksheet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>AGORA É SUA VEZ!</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Criador de Código
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Crie seu próprio código! Escolha símbolos para cada letra, escreva uma mensagem e desafie um colega!
            </p>
          </div>
        </div>

        {/* Theme presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-500">Temas:</span>
          {themeOptions.map((th) => (
            <button
              key={th.id}
              onClick={() => {
                soundManager.playClick();
                onSelectTheme(th.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTheme === th.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span>{th.icon}</span>
              <span className="hidden md:inline">{th.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symbol Table preview matching Box 3 of paper */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <span>Sua Tabela de Símbolos Customizada:</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Você pode clicar no símbolo para editar!
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          {/* Row A - M */}
          <div className="min-w-[620px] rounded-xl border border-emerald-200 overflow-hidden mb-2 shadow-2xs">
            <div className="grid grid-cols-14 text-center divide-x divide-emerald-200 bg-emerald-100/90 text-emerald-950 font-bold text-xs py-1">
              <div className="bg-emerald-200/50 flex items-center justify-center text-[10px]">
                LETRA
              </div>
              {ALPHABET_LIST.slice(0, 13).map((item) => (
                <div key={item.letter} className="py-0.5 font-black text-sm">
                  {item.letter}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-14 text-center divide-x divide-emerald-200 bg-white font-bold text-xs py-1">
              <div className="bg-slate-50 flex items-center justify-center text-[10px] text-slate-600">
                SÍMBOLO
              </div>
              {ALPHABET_LIST.slice(0, 13).map((item) => (
                <div key={item.letter} className="py-0.5 text-base hover:scale-125 transition-transform cursor-pointer">
                  {getSymbol(item.letter)}
                </div>
              ))}
            </div>
          </div>

          {/* Row N - Z */}
          <div className="min-w-[620px] rounded-xl border border-emerald-200 overflow-hidden shadow-2xs">
            <div className="grid grid-cols-14 text-center divide-x divide-emerald-200 bg-emerald-100/90 text-emerald-950 font-bold text-xs py-1">
              <div className="bg-emerald-200/50 flex items-center justify-center text-[10px]">
                LETRA
              </div>
              {ALPHABET_LIST.slice(13, 26).map((item) => (
                <div key={item.letter} className="py-0.5 font-black text-sm">
                  {item.letter}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-14 text-center divide-x divide-emerald-200 bg-white font-bold text-xs py-1">
              <div className="bg-slate-50 flex items-center justify-center text-[10px] text-slate-600">
                SÍMBOLO
              </div>
              {ALPHABET_LIST.slice(13, 26).map((item) => (
                <div key={item.letter} className="py-0.5 text-base hover:scale-125 transition-transform cursor-pointer">
                  {getSymbol(item.letter)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section to write secret message and peer challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Creator panel */}
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="input-secret-message" className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
              <span>✍️ Escreva sua mensagem secreta:</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold">
              {secretInput.length} letras
            </span>
          </div>

          <input
            id="input-secret-message"
            type="text"
            value={secretInput}
            onChange={(e) => {
              setSecretInput(e.target.value.toUpperCase());
              setIsPeerCracked(false);
            }}
            placeholder="Digite qualquer palavra ou frase..."
            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-slate-800 font-black uppercase text-base tracking-wider focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          {/* Live Encrypted preview */}
          <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Mensagem Codificada em Símbolos:
              </span>
              <button
                onClick={copyToClipboard}
                className="text-[11px] flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-xl sm:text-2xl p-2 bg-emerald-50/50 rounded-lg min-h-[48px] items-center">
              {encodedSymbols.length > 0 ? (
                encodedSymbols.map((sym, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center p-1 bg-white rounded-md border border-emerald-200 shadow-2xs"
                    title={cleanWord[idx]}
                  >
                    {sym}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-medium">
                  Digite uma palavra acima para ver o código secreto gerado!
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setPeerMode(!peerMode);
                setPeerGuess('');
                setIsPeerCracked(false);
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                peerMode
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{peerMode ? 'Voltar para Modo Criação' : 'Ativar Modo Desafiar Colega!'}</span>
            </button>
          </div>
        </div>

        {/* Peer Challenge Panel ("Troque com um colega e peça para ele decodificar") */}
        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <Users className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs sm:text-sm font-bold">
              Troque com um colega para ele decodificar:
            </h3>
          </div>

          {peerMode ? (
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-amber-300">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-amber-900">Desafio para o colega: </span>
                Olhe os símbolos abaixo, consulte a tabela de símbolos e digite qual é a palavra secreta!
              </div>

              {/* Only symbols are shown, original text is hidden */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap gap-2 text-2xl items-center justify-center min-h-[56px]">
                {encodedSymbols.map((sym, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center p-1.5 bg-white rounded-lg border border-amber-300 shadow-xs"
                  >
                    {sym}
                  </span>
                ))}
              </div>

              <form onSubmit={checkPeerSolution} className="space-y-2">
                <label htmlFor="input-peer-guess" className="text-xs font-bold text-slate-700">
                  Resposta do colega:
                </label>
                <div className="flex gap-2">
                  <input
                    id="input-peer-guess"
                    type="text"
                    value={peerGuess}
                    onChange={(e) => setPeerGuess(e.target.value.toUpperCase())}
                    placeholder="DIGITE A PALAVRA SECRETA..."
                    className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-800 font-black uppercase text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Testar</span>
                  </button>
                </div>
              </form>

              {isPeerCracked && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Sensacional! O colega decodificou a mensagem com perfeição! 🎉</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-2 py-4">
              <p>
                No botão ao lado, você pode ativar o <strong>Modo Desafiar Colega</strong>!
              </p>
              <p className="bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                💡 <strong>Regra de Ouro da Informática:</strong> Um código só faz sentido quando o emissor e o receptor compartilham a mesma regra de codificação. Ao compartilhar sua tabela com seu colega, vocês dois estão estabelecendo um <strong>protocolo de comunicação</strong>!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
