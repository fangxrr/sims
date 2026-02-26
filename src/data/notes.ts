export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const NOTES_DATA: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is your personal space to jot down ideas for your Sims world.\n\n- Story ideas\n- Build plans\n- CC shopping list\n\nEverything is saved automatically to your browser.',
    updatedAt: Date.now(),
  }
];
