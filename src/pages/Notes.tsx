import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, Trash2, Save, ChevronLeft, Edit3 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('sims-notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notes', e);
      }
    }
    return [
      {
        id: '1',
        title: 'Welcome to Notes',
        content: 'This is your personal space to jot down ideas for your Sims world.\n\n- Story ideas\n- Build plans\n- CC shopping list\n\nEverything is saved automatically to your browser.',
        updatedAt: Date.now(),
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('sims-notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    // On mobile, close sidebar to focus on editing
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    ));
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
      setActiveNoteId(newNotes[0]?.id || null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 pt-16 pb-20 md:px-12 md:pt-20 md:pb-28">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel w-full h-full rounded-3xl overflow-hidden flex flex-col relative group"
      >
        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay"></div>
        
        {/* Window Header */}
        <div className="absolute top-0 left-0 w-full h-12 flex items-center px-5 border-b border-white/5 z-20 bg-white/5 backdrop-blur-md">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
            <div className="w-3 h-3 rounded-full bg-white/20 border border-white/5"></div>
          </div>
          <div className="mx-auto text-[10px] tracking-widest text-white/30 uppercase font-semibold pointer-events-none">
            Notes.exe
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex pt-12 overflow-hidden z-10 relative">
          
          {/* Sidebar - Note List */}
          <div 
            className={`absolute md:relative z-30 w-full md:w-80 h-full bg-[#050505] md:bg-transparent md:backdrop-blur-none border-r border-white/5 flex flex-col transition-all duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <FileText size={18} />
                <span className="font-semibold tracking-wide">All Notes</span>
                <span className="text-xs text-white/40 ml-1">({notes.length})</span>
              </div>
              <button 
                onClick={createNote}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all group relative ${
                    activeNoteId === note.id 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  <div className="font-medium text-sm truncate pr-6">{note.title || 'Untitled Note'}</div>
                  <div className="text-xs text-white/40 mt-1 truncate">{note.content || 'No content'}</div>
                  <div className="text-[10px] text-white/20 mt-2 font-mono">{formatDate(note.updatedAt)}</div>
                  
                  <div 
                    onClick={(e) => deleteNote(note.id, e)}
                    className="absolute right-2 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </div>
                </button>
              ))}
              
              {notes.length === 0 && (
                <div className="p-8 text-center text-white/30 text-sm">
                  No notes yet.<br/>Click + to create one.
                </div>
              )}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col h-full bg-white/[0.02] relative w-full">
            {/* Mobile Header for Editor */}
            <div className="md:hidden flex items-center p-4 border-b border-white/5 text-white/60">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="text-sm font-medium">All Notes</span>
              </button>
            </div>

            {activeNote ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Note Title"
                  className="w-full bg-transparent text-2xl md:text-3xl font-bold text-white px-6 md:px-8 pt-6 md:pt-8 pb-4 focus:outline-none placeholder-white/20"
                />
                <div className="px-6 md:px-8 pb-2 text-xs text-white/30 font-mono flex items-center gap-2">
                  <span>Last edited: {formatDate(activeNote.updatedAt)}</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Start typing..."
                  className="flex-1 w-full bg-transparent text-white/80 px-6 md:px-8 py-4 resize-none focus:outline-none leading-relaxed custom-scrollbar text-sm md:text-base"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                <Edit3 size={48} strokeWidth={1} className="mb-4 opacity-50" />
                <p>Select a note or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
};
