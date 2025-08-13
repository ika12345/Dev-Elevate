import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Tag, Calendar, User, Brain, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/modal';
import { Note, useNotes } from '../../contexts/AppContext';
import { AIService } from '../../services/aiService';
import { formatDate, generateId } from '../../utils/helperAI';

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });

  // Safety check for notes
  if (!notes) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="mx-auto mb-4 w-8 h-8 rounded-full border-4 border-blue-500 animate-spin border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading notes...</p>
        </div>
      </div>
    );
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: generateId(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: '1',
      isPublic: false,
      collaborators: [],
    };

    // Generate AI tags if content exists
    if (newNote.content.trim()) {
      try {
        setAiLoading(true);
        const aiTags = await AIService.generateTags(newNote.content);
        note.tags = [...new Set([...newNote.tags, ...aiTags])];
      } catch (error) {
        console.error('Failed to generate AI tags:', error);
      } finally {
        setAiLoading(false);
      }
    }

    addNote(note);
    setIsCreateModalOpen(false);
    setNewNote({ title: '', content: '', tags: [] });
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    updateNote(noteId, { ...updates, updatedAt: new Date() });
  };

  const handleAISummarize = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    try {
      setAiLoading(true);
      const summary = await AIService.summarizeText(note.content);
      updateNote(noteId, { aiSummary: summary });
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const NoteCard: React.FC<{ note: Note }> = ({ note }) => (
    <div
      className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
      onClick={() => setSelectedNote(note)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate dark:text-white">
          {note.title}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAISummarize(note.id);
            }}
            disabled={aiLoading}
          >
            <Brain size={16} />
          </Button>
        </div>
      </div>
      
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {note.content.substring(0, 150)}...
      </p>

      {note.aiSummary && (
        <div className="p-3 mb-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <Brain size={14} className="inline mr-1" />
            AI Summary: {note.aiSummary}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {formatDate(note.createdAt)}
          </span>
          <span className="flex items-center">
            <User size={14} className="mr-1" />
            You
          </span>
        </div>
        
        {note.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            {note.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const NoteEditor: React.FC<{ note: Note }> = ({ note }) => {
    const [editedNote, setEditedNote] = useState(note);

    const handleSave = () => {
      handleUpdateNote(note.id, editedNote);
      setIsEditing(false);
    };

    return (
      <div className="space-y-4">
        <Input
          value={editedNote.title}
          onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
          placeholder="Note title..."
          className="text-2xl font-bold"
        />
        
        <textarea
          value={editedNote.content}
          onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
          placeholder="Start writing your note..."
          rows={15}
          className="p-4 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between items-center">
          <Input
            value={editedNote.tags.join(', ')}
            onChange={(e) => setEditedNote({ 
              ...editedNote, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            })}
            placeholder="Add tags (comma separated)..."
            icon={<Tag size={16} />}
            className="flex-1 mr-4"
          />
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {notes.length} notes • AI-powered organization
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <Button variant="outline">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>

      {/* Create Note Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Note"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          
          <textarea
            placeholder="Start writing your note..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={10}
            className="p-4 w-full text-gray-900 bg-white rounded-lg border border-gray-300 resize-none dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Input
            placeholder="Add tags (comma separated)..."
            value={newNote.tags.join(', ')}
            onChange={(e) => setNewNote({ 
              ...newNote, 
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            })}
            icon={<Tag size={16} />}
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateNote}
              loading={aiLoading}
            >
              Create Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Note Detail Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => {
          setSelectedNote(null);
          setIsEditing(false);
        }}
        title={selectedNote?.title || 'Note'}
        size="xl"
      >
        {selectedNote && (
          <div className="space-y-4">
            {isEditing ? (
              <NoteEditor note={selectedNote} />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Created {formatDate(selectedNote.createdAt)}</span>
                    <span>Updated {formatDate(selectedNote.updatedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAISummarize(selectedNote.id)}
                      disabled={aiLoading}
                    >
                      <Brain size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Share2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {selectedNote.aiSummary && (
                  <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                    <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                      <Brain size={16} className="inline mr-2" />
                      AI Summary
                    </h4>
                    <p className="text-blue-800 dark:text-blue-200">{selectedNote.aiSummary}</p>
                  </div>
                )}

                <div className="max-w-none prose dark:prose-invert">
                  <div className="text-gray-900 whitespace-pre-wrap dark:text-white">
                    {selectedNote.content}
                  </div>
                </div>

                {selectedNote.tags.length > 0 && (
                  <div className="flex items-center pt-4 space-x-2 border-t border-gray-200 dark:border-gray-700">
                    <Tag size={16} className="text-gray-500 dark:text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};