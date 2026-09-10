import { CipherLetter, SymbolTheme } from '../types';

export const ALPHABET_LIST: CipherLetter[] = [
  { letter: 'A', number: 1 },
  { letter: 'B', number: 2 },
  { letter: 'C', number: 3 },
  { letter: 'D', number: 4 },
  { letter: 'E', number: 5 },
  { letter: 'F', number: 6 },
  { letter: 'G', number: 7 },
  { letter: 'H', number: 8 },
  { letter: 'I', number: 9 },
  { letter: 'J', number: 10 },
  { letter: 'K', number: 11 },
  { letter: 'L', number: 12 },
  { letter: 'M', number: 13 },
  { letter: 'N', number: 14 },
  { letter: 'O', number: 15 },
  { letter: 'P', number: 16 },
  { letter: 'Q', number: 17 },
  { letter: 'R', number: 18 },
  { letter: 'S', number: 19 },
  { letter: 'T', number: 20 },
  { letter: 'U', number: 21 },
  { letter: 'V', number: 22 },
  { letter: 'W', number: 23 },
  { letter: 'X', number: 24 },
  { letter: 'Y', number: 25 },
  { letter: 'Z', number: 26 },
];

export const THEMED_SYMBOLS: Record<SymbolTheme, Record<string, string>> = {
  emojis: {
    A: '🍎', B: '🎈', C: '🚗', D: '🎲', E: '⭐', F: '🔥', G: '🎸', H: '🚁',
    I: '🍦', J: '🕹️', K: '🥝', L: '🍋', M: '🌙', N: '☁️', O: '🍊', P: '🍕',
    Q: '🧀', R: '🤖', S: '☀️', T: '🎾', U: '🍇', V: '🎻', W: '🍉', X: '❌',
    Y: '🪀', Z: '⚡',
  },
  animals: {
    A: '🐝', B: '🐳', C: '🐶', D: '🐬', E: '🐘', F: '🦩', G: '🐱', H: '🦛',
    I: '🦎', J: '🐆', K: '🐨', L: '🦁', M: '🐵', N: '🦥', O: '🐑', P: '🐼',
    Q: '🦆', R: '🦊', S: '🐸', T: '🐯', U: '🐻', V: '🐮', W: '🐺', X: '🦗',
    Y: '🦙', Z: '🦓',
  },
  space: {
    A: '🚀', B: '🪐', C: '☄️', D: '🛸', E: '🌟', F: '✨', G: '🌌', H: '🛰️',
    I: '🔭', J: '🌍', K: '🌕', L: '🌑', M: '🌙', N: '🌠', O: '☀️', P: '👽',
    Q: '💥', R: '👾', S: '📡', T: '👨‍🚀', U: '🌈', V: '💎', W: '⏳', X: '🧭',
    Y: '🔆', Z: '⚡',
  },
  shapes: {
    A: '🔺', B: '🔷', C: '🔴', D: '🟩', E: '⭐', F: '🔶', G: '🟣', H: '🟨',
    I: '🔹', J: '🔸', K: '⬛', L: '⬜', M: '♥️', N: '♦️', O: '🟢', P: '🎯',
    Q: '🌀', R: '⏹️', S: '🔼', T: '🔽', U: '🔘', V: '💠', W: '🟠', X: '❌',
    Y: '➕', Z: '⚡',
  },
  geometric: {
    A: '◬', B: '◈', C: '◉', D: '◪', E: '★', F: '◮', G: '◐', H: '▰',
    I: '❘', J: '◖', K: '◗', L: '⌞', M: '▲', N: '▼', O: '●', P: '◆',
    Q: '◎', R: '■', S: '✦', T: '▲', U: '⊔', V: '▽', W: '◇', X: '✕',
    Y: '⅄', Z: '⚡',
  },
};

export function letterToNumber(char: string): number | null {
  const upper = char.toUpperCase();
  const code = upper.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return code - 64;
  }
  return null;
}

export function numberToLetter(num: number): string | null {
  if (num >= 1 && num <= 26) {
    return String.fromCharCode(64 + num);
  }
  return null;
}

export function encodeWord(word: string): number[] {
  return word
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents for coding
    .split('')
    .map((c) => letterToNumber(c))
    .filter((n): n is number => n !== null);
}
