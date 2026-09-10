import React from 'react';
import { X, Cpu, Binary, BookOpen, ShieldCheck, Lightbulb, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 border-2 border-amber-300 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                Como Funciona a Informação no Computador?
              </h2>
            </div>
            <p className="text-xs text-amber-800 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              BNCC Computação – Habilidade EF04CO04 (4º Ano)
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Card 1: BNCC explanation in kid-friendly terms */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="font-bold text-amber-950 flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-amber-600" />
              O que diz a Habilidade EF04CO04?
            </h3>
            <p className="text-slate-700 leading-relaxed">
              "Reconhecer e utilizar diferentes formas de codificação da informação, compreendendo como informações podem ser representadas por símbolos, códigos, números e outros sistemas de representação."
            </p>
            <p className="mt-2 text-amber-900 font-semibold text-[11px]">
              👉 Traduzindo para o 4º ano: Você aprendeu que letras, palavras e ideias podem ser transformadas em números ou símbolos e depois decodificadas de volta!
            </p>
          </div>

          {/* Card 2: Coding vs Decoding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-2xl p-3.5 border border-blue-200">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <span>🔒 Codificar</span>
              </div>
              <p className="text-slate-600 text-xs">
                Transformar um texto ou informação em um código ou símbolo seguindo uma regra combinada (exemplo: A vira 1, B vira 2).
              </p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <span>🔓 Decodificar</span>
              </div>
              <p className="text-slate-600 text-xs">
                Ler o código e usar a regra para descobrir a mensagem original escondida (exemplo: ver o número 15 e saber que é a letra O).
              </p>
            </div>
          </div>

          {/* Card 3: How computers actually do this */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              Sabia que o computador faz isso o tempo todo?
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Texto em Números:</strong> No computador existe uma tabela chamada <em>ASCII</em> ou <em>Unicode</em> onde cada letra é um número (a letra 'A', por exemplo, é guardada como o número 65!).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Código Binário:</strong> No fundo, todos os números viram apenas 0 e 1 (bits), que representam eletricidade ligada ou desligada.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Emojis:</strong> Cada carinha divertida ou emoji é um código numérico especial que todos os celulares e computadores do planeta concordaram em usar!
                </span>
              </li>
            </ul>
          </div>

          {/* Golden Rule from sheet */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-4 shadow-md flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-amber-200 shrink-0" />
            <div>
              <div className="font-bold text-sm text-amber-100 uppercase tracking-wide">
                Regra de Ouro:
              </div>
              <p className="text-xs sm:text-sm font-medium mt-0.5">
                "Um código só faz sentido para quem conhece a regra! Codificar é transformar a informação para que outros possam entender!"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
          >
            Entendi! Quero Jogar! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
