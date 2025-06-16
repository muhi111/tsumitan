export const cleanMeaning = (text: string): string => {
  return text
    .replace(/\([^)]*\)/g, '') // 半角かっこ (…)
    .replace(/《.*?》/g, '') // 山かっこ《…》
    .replace(/〈.*?〉/g, '') // 山かっこ《…》
    .replace(/\s+/g, ' ') // 余分な空白を1つに
    .trim();
};

export type Status = 'all' | 'unchecked' | 'correct' | 'wrong';

export const statusLabels: Record<Status, string> = {
  all: 'すべて',
  unchecked: '未復習',
  correct: '復習済み',
  wrong: '苦手'
};
