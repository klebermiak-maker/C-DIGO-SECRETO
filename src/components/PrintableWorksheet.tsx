import React from 'react';
import { StudentProfile } from '../types';
import { ALPHABET_LIST } from '../data/alphabet';
import { ORIGINAL_SHEET_MISSIONS } from '../data/missions';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintableWorksheetProps {
  student: StudentProfile;
  onBack: () => void;
}

export const PrintableWorksheet: React.FC<PrintableWorksheetProps> = ({ student, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const row1 = ALPHABET_LIST.slice(0, 13);
  const row2 = ALPHABET_LIST.slice(13, 26);

  return (
    <div className="space-y-4">
      {/* Control Toolbar - hidden when printing */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Jogo</span>
        </button>

        <div className="text-xs text-slate-600 font-medium hidden sm:block">
          Folha de Atividades formatada no padrão A4 para impressão escolar!
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Folha (A4)</span>
        </button>
      </div>

      {/* Printable Sheet Canvas - styled exactly like the classroom worksheet */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-dashed border-slate-400 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 font-sans">
        {/* Curricular Header */}
        <div className="mb-4">
          <div className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wide">
            INFORMÁTICA: Codificação da informação.
          </div>
          <div className="text-xs sm:text-sm font-black text-slate-900">
            Habilidade – EF04CO04
          </div>
          <p className="text-[11px] sm:text-xs text-slate-700 mt-1 leading-snug">
            Reconhecer e utilizar diferentes formas de codificação da informação, compreendendo como
            informações podem ser representadas por símbolos, códigos, números e outros sistemas de
            representação.
          </p>
        </div>

        {/* Student Identification Box */}
        <div className="border border-slate-400 rounded-xl p-3 sm:p-4 mb-4 bg-slate-50/50 print:bg-transparent">
          <div className="grid grid-cols-2 gap-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-bold">ESCOLA:</span>{' '}
              <span className="underline decoration-dotted underline-offset-4 font-semibold">
                {student.school || '_____________________________________________'}
              </span>
            </div>
            <div>
              <span className="font-bold">TURMA:</span>{' '}
              <span className="underline decoration-dotted underline-offset-4 font-semibold">
                {student.classroom || '4º ANO _____'}
              </span>
            </div>
            <div>
              <span className="font-bold">NOME:</span>{' '}
              <span className="underline decoration-dotted underline-offset-4 font-semibold">
                {student.name || '_____________________________________________'}
              </span>
            </div>
            <div>
              <span className="font-bold">DATA:</span>{' '}
              <span className="underline decoration-dotted underline-offset-4 font-semibold">
                {student.date || '_____ / _____ / _________'}
              </span>
            </div>
          </div>
        </div>

        {/* Title Banner */}
        <div className="text-center my-3">
          <div className="inline-flex items-center gap-2 text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wider">
            <span>🔒</span>
            <span>CÓDIGO SECRETO</span>
            <span>🗝️</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 italic mt-0.5">
            As informações podem ser representadas de diferentes maneiras! Nesta atividade, você vai
            decodificar mensagens e criar seu próprio código.
          </p>
        </div>

        {/* 1. TABELA DE CÓDIGO */}
        <div className="my-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="font-bold text-xs sm:text-sm uppercase">TABELA DE CÓDIGO</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 mb-2">
            Observe a tabela abaixo. Cada letra do alfabeto está representada por um número.
          </p>

          <div className="space-y-2">
            {/* Table Row 1 */}
            <div className="border border-slate-400 rounded-md overflow-hidden text-xs text-center">
              <div className="grid grid-cols-14 divide-x divide-slate-400 bg-slate-200 font-bold py-1">
                <div className="font-black bg-slate-300 text-[10px]">LETRA</div>
                {row1.map((i) => (
                  <div key={i.letter}>{i.letter}</div>
                ))}
              </div>
              <div className="grid grid-cols-14 divide-x divide-slate-400 font-bold py-1">
                <div className="font-black bg-slate-100 text-[10px]">NÚMERO</div>
                {row1.map((i) => (
                  <div key={i.letter}>{i.number}</div>
                ))}
              </div>
            </div>

            {/* Table Row 2 */}
            <div className="border border-slate-400 rounded-md overflow-hidden text-xs text-center">
              <div className="grid grid-cols-14 divide-x divide-slate-400 bg-slate-200 font-bold py-1">
                <div className="font-black bg-slate-300 text-[10px]">LETRA</div>
                {row2.map((i) => (
                  <div key={i.letter}>{i.letter}</div>
                ))}
              </div>
              <div className="grid grid-cols-14 divide-x divide-slate-400 font-bold py-1">
                <div className="font-black bg-slate-100 text-[10px]">NÚMERO</div>
                {row2.map((i) => (
                  <div key={i.letter}>{i.number}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. DECODIFIQUE AS MENSAGENS */}
        <div className="my-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="font-bold text-xs sm:text-sm uppercase">DECODIFIQUE AS MENSAGENS</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 mb-2">
            Use a tabela de código para descobrir as palavras e frases escondidas.
          </p>

          <div className="space-y-2 text-xs sm:text-sm">
            {ORIGINAL_SHEET_MISSIONS.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="font-bold w-6">{m.label}</span>
                <div className="border border-slate-400 px-3 py-1 rounded-md font-mono font-bold tracking-wider w-44 text-center bg-slate-50 print:bg-transparent">
                  {m.code.join(' – ')}
                </div>
                <div className="flex-1 border-b-2 border-dotted border-slate-500 h-6"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AGORA É SUA VEZ! */}
        <div className="my-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="font-bold text-xs sm:text-sm uppercase">AGORA É SUA VEZ!</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 mb-2">
            Crie seu próprio código! Escolha símbolos ou desenhos para representar cada letra. Depois,
            escreva uma mensagem secreta e peça para um colega decodificar.
          </p>

          <div className="space-y-2 mb-3">
            {/* Blank Symbol Table Row 1 */}
            <div className="border border-slate-400 rounded-md overflow-hidden text-xs text-center">
              <div className="grid grid-cols-14 divide-x divide-slate-400 bg-slate-200 font-bold py-1">
                <div className="font-black bg-slate-300 text-[10px]">LETRA</div>
                {row1.map((i) => (
                  <div key={i.letter}>{i.letter}</div>
                ))}
              </div>
              <div className="grid grid-cols-14 divide-x divide-slate-400 font-bold h-7">
                <div className="font-black bg-slate-100 text-[10px] flex items-center justify-center">
                  SÍMBOLO
                </div>
                {row1.map((i) => (
                  <div key={i.letter}></div>
                ))}
              </div>
            </div>

            {/* Blank Symbol Table Row 2 */}
            <div className="border border-slate-400 rounded-md overflow-hidden text-xs text-center">
              <div className="grid grid-cols-14 divide-x divide-slate-400 bg-slate-200 font-bold py-1">
                <div className="font-black bg-slate-300 text-[10px]">LETRA</div>
                {row2.map((i) => (
                  <div key={i.letter}>{i.letter}</div>
                ))}
              </div>
              <div className="grid grid-cols-14 divide-x divide-slate-400 font-bold h-7">
                <div className="font-black bg-slate-100 text-[10px] flex items-center justify-center">
                  SÍMBOLO
                </div>
                {row2.map((i) => (
                  <div key={i.letter}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-3 text-xs sm:text-sm">
            <div>
              <span className="font-bold">Escreva sua mensagem secreta usando o seu código:</span>
              <div className="border-b-2 border-dotted border-slate-500 h-7 w-full mt-1"></div>
            </div>
            <div>
              <span className="font-bold">Troque com um colega e peça para ele decodificar:</span>
              <div className="border-b-2 border-dotted border-slate-500 h-7 w-full mt-1"></div>
            </div>
          </div>
        </div>

        {/* Pedagogical Note Box */}
        <div className="border-2 border-slate-700 rounded-xl p-3 mt-4 text-center text-xs sm:text-sm bg-amber-50 print:bg-transparent">
          <span className="font-bold">💡 Lembre-se:</span> um código só faz sentido para quem
          conhece a regra! Codificar é transformar informação para que outros possam entender!
        </div>
      </div>
    </div>
  );
};
