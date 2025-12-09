import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizModal = ({ isOpen, onClose }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

  useEffect(() => {
    if (isOpen) {
      fetchQuiz();
    }
  }, [isOpen]);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${API}/quiz`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
    }
  };

  const handleAnswerSelect = (optionText) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionText;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/quiz/submit`, { answers });
      setResult(response.data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const handleViewIsland = () => {
    if (result?.island) {
      navigate(`/islands/${result.island.slug}`);
      onClose();
      handleReset();
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      handleReset();
    }, 300);
  };

  if (!isOpen) return null;

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" data-testid="quiz-modal">
        <div className="bg-[#F2EFE9] p-12 rounded max-w-md text-center">
          <p>Quiz not configured yet. Please check back later.</p>
          <button onClick={handleClose} className="btn-primary mt-6">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" data-testid="quiz-modal">
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="bg-[#F2EFE9] w-full max-w-3xl rounded-lg overflow-hidden">
          {/* Close Button */}
          <div className="flex justify-end p-6">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#EAE7E2] rounded-full transition-colors"
              data-testid="close-quiz-button"
            >
              <X size={24} />
            </button>
          </div>

          {!result ? (
            <div className="px-12 pb-12">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-[#5C6B70] mb-2">
                  <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
                </div>
                <div className="h-2 bg-[#EAE7E2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A27B5C] transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-12">
                <h2
                  className="text-3xl md:text-4xl mb-8 text-center"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  data-testid="quiz-question"
                >
                  {quiz.questions[currentQuestion].question}
                </h2>

                {/* Options */}
                <div className="space-y-4">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option.text)}
                      className={`w-full p-6 text-left border-2 rounded transition-all hover:border-[#A27B5C] hover:bg-[#EAE7E2] ${
                        answers[currentQuestion] === option.text
                          ? 'border-[#A27B5C] bg-[#EAE7E2]'
                          : 'border-[#D1CCC0]'
                      }`}
                      data-testid={`quiz-option-${index}`}
                    >
                      <span className="text-lg">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="previous-question-button"
                >
                  <ArrowLeft size={18} />
                  Previous
                </button>

                {currentQuestion === quiz.questions.length - 1 && answers.length === quiz.questions.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary inline-flex items-center gap-2"
                    data-testid="submit-quiz-button"
                  >
                    {loading ? 'Loading...' : (
                      <>
                        <Sparkles size={18} />
                        Get Result
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!answers[currentQuestion] || currentQuestion >= quiz.questions.length - 1}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="next-question-button"
                  >
                    Next
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result */
            <div className="px-12 pb-12 text-center" data-testid="quiz-result">
              <Sparkles size={48} className="mx-auto mb-6 text-[#A27B5C]" />
              <h2
                className="text-4xl md:text-5xl mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Island is...
              </h2>
              <h3
                className="text-5xl md:text-6xl mb-6 text-[#A27B5C]"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontStyle: 'italic' }}
                data-testid="result-island-name"
              >
                {result.island.name}
              </h3>
              <p className="text-lg text-[#5C6B70] mb-8 max-w-2xl mx-auto leading-relaxed">
                {result.island.story}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleViewIsland}
                  className="btn-primary"
                  data-testid="view-island-button"
                >
                  Explore {result.island.name}
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  data-testid="retake-quiz-button"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;