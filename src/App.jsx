import { useState } from 'react';
import ScoreSec from './components/ScoreSec';
import { AppContext } from './context/AppContext';
import HomeSec from './components/HomeSec';
import QuizSec from './components/QuizSec';

import { geminiAi , deepSeekAi, openAi} from './models';

const App = () => {
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  const [TotalCorrect, setTotalCorrect] = useState(0);
  const [SelectedAnswerId, setSelectedAnswerId] = useState(null);
  const [IsCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [selectedLev, setSelectedLev] = useState('easy');
  const levels = ['easy', 'medium', 'hard'];
  const [numQuestions, setNumQuestions] = useState(15);
  const [questions, setQuestions] = useState([]);
  const [loadingData, setLoadingData] = useState(null);
  const [error, setError] = useState('');
  const aiModels = ['gemini-1.5-flash','DeepSeek-V3' , 'gpt-3.5-turbo'];
  const [SelectedModel, setSelectedModel] = useState(aiModels[0]);
  const generatedPrompt = ()=> `
    Generate a quiz with the following specifications:
    
    Number of questions: ${numQuestions}
    Topic: ${prompt}
    Difficulty level: ${selectedLev}
    
    Format the output as a JSON-like array of objects:
    [
      {
        "question": "question text",
        "answers": ["answer1", "answer2", ...],
        "correctAnswer": correctAnswerIndex
      },
      ...
    ]
    
    Only return raw text (no markdown, no \`\`\`). If the topic is invalid, return: "Error: Invalid or unclear topic provided."`
  const generateQuestions = async () => {
    const fullPrompt = generatedPrompt();
    switch (SelectedModel) {
      case 'gemini-1.5-flash':
        await geminiAi(fullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
        break;
    
      case 'DeepSeek-V3':
        await deepSeekAi(fullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
        break;
      
      case 'gpt-3.5-turbo' :
        await openAi(fullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
        break;
      
    
      default:
        setError('Unknown model selected.');
    }
    
  };
  

  const NextQuestion = () => {
    if (CurrentQuestion !== -1) {
      const isAnswerCorrect = SelectedAnswerId === questions[CurrentQuestion].correctAnswer;
      setIsCorrect(isAnswerCorrect);
      setCorrectAnswer(questions[CurrentQuestion].correctAnswer);
      if (isAnswerCorrect) setTotalCorrect(TotalCorrect + 1);

      setTimeout(() => {
        setCurrentQuestion(CurrentQuestion + 1);
        setSelectedAnswerId(null);
        setIsCorrect(null);
        setCorrectAnswer(null);
      }, 800);
    } else {
      setCurrentQuestion(0);
    }
  };

  const SelectedAnswer = (id) => {
    setSelectedAnswerId(id);
  };

  return <AppContext.Provider value={
    {
      aiModels,
      TotalCorrect, questions , CurrentQuestion , SelectedAnswerId, IsCorrect, correctAnswer, NextQuestion, SelectedAnswer ,
      prompt,
    setPrompt,
    selectedLev,
    setSelectedLev,
    levels,
    numQuestions,
    setNumQuestions,
    generateQuestions,
    loadingData,
    error,
    SelectedModel,
    setSelectedModel 
    }
  }>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-slate-900 rounded-2xl shadow-lg p-6 space-y-6">
          {CurrentQuestion === questions.length ? (
           <ScoreSec/>
          ) : CurrentQuestion !== -1 ? (
            <QuizSec/>
          ) : (
            <HomeSec/>
          )}
        </div>
        <footer className="mt-6 text-sm text-gray-400 text-center">
          Built by <a href="https://github.com/ourouimed" className="text-cyan-500 font-semibold" target="_blank">ourouimed</a> &copy; {new Date().getFullYear()}
        </footer>
      </div>
      </AppContext.Provider>
};

export default App;
