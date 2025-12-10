import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '../../components/AdminLayout';

const ManageQuiz = () => {
  const [quiz, setQuiz] = useState({ questions: [] });
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizRes, islandsRes] = await Promise.all([
        axios.get(`${API}/quiz`),
        axios.get(`${API}/islands`)
      ]);
      setQuiz(quizRes.data);
      setIslands(islandsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      question: '',
      options: [
        {
          text: '',
          island_weights: islands.reduce((acc, island) => ({ ...acc, [island.id]: 0 }), {})
        }
      ]
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const removeQuestion = (questionIndex) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, idx) => idx !== questionIndex)
    });
  };

  const updateQuestion = (questionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.push({
      text: '',
      island_weights: islands.reduce((acc, island) => ({ ...acc, [island.id]: 0 }), {})
    });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
      (_, idx) => idx !== optionIndex
    );
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const updateWeight = (questionIndex, optionIndex, islandId, weight) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex].island_weights[islandId] = parseInt(weight) || 0;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API}/admin/quiz`, quiz);
      toast.success('Quiz updated successfully');
    } catch (error) {
      console.error('Failed to update quiz:', error);
      toast.error('Failed to update quiz');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div data-testid="manage-quiz-page">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Manage Quiz
          </h1>
          <div className="flex gap-3">
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-[#5F7161] text-white rounded-full hover:bg-[#4F6151] transition-colors"
              data-testid="add-question-button"
            >
              <Plus size={20} />
              Add Question
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#A27B5C] text-white rounded-full hover:bg-[#8B6A4D] transition-colors"
              data-testid="save-quiz-button"
            >
              <Save size={20} />
              Save Quiz
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {quiz.questions.map((question, qIdx) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm" data-testid={`question-${qIdx}`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium">Question {qIdx + 1}</h3>
                <button
                  onClick={() => removeQuestion(qIdx)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                  data-testid={`remove-question-${qIdx}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <input
                type="text"
                value={question.question}
                onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                placeholder="Enter question"
                className="w-full p-3 border border-[#D1CCC0] rounded mb-4"
                data-testid={`question-input-${qIdx}`}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm uppercase tracking-widest font-medium">Options</h4>
                  <button
                    onClick={() => addOption(qIdx)}
                    className="text-sm text-[#A27B5C] hover:underline"
                    data-testid={`add-option-${qIdx}`}
                  >
                    + Add Option
                  </button>
                </div>

                {question.options.map((option, oIdx) => (
                  <div key={oIdx} className="border border-[#D1CCC0] rounded p-4" data-testid={`option-${qIdx}-${oIdx}`}>
                    <div className="flex gap-3 mb-3">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(qIdx, oIdx, 'text', e.target.value)}
                        placeholder="Option text"
                        className="flex-1 p-2 border border-[#D1CCC0] rounded"
                        data-testid={`option-text-${qIdx}-${oIdx}`}
                      />
                      <button
                        onClick={() => removeOption(qIdx, oIdx)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded"
                        data-testid={`remove-option-${qIdx}-${oIdx}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {islands.map((island) => (
                        <div key={island.id}>
                          <label className="block text-xs text-[#5C6B70] mb-1">{island.name}</label>
                          <input
                            type="number"
                            value={option.island_weights[island.id] || 0}
                            onChange={(e) => updateWeight(qIdx, oIdx, island.id, e.target.value)}
                            className="w-full p-2 border border-[#D1CCC0] rounded text-sm"
                            min="0"
                            max="5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {quiz.questions.length === 0 && (
          <div className="bg-white p-12 rounded-lg text-center">
            <p className="text-[#5C6B70] mb-4">No questions yet. Click "Add Question" to start.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageQuiz;
