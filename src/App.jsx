import { useState } from 'react';
import PropTypes from 'prop-types';
import { geminiAi , deepSeekAi, openAi} from './models';
import { extractPdf } from './test';
// Circular Progress Bar Component
const CircularProgressBar = ({ percentage, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-cyan-500 transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-lg font-bold">{percentage}%</span>
      </div>
    </div>
  );
};

CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};


console.log(extractPdf())


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

  

  const GenerateQuest = async () => {
    const FullPrompt = `
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
    switch (SelectedModel) {
      case 'gemini-1.5-flash':
        await geminiAi(FullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
        break;
    
      case 'DeepSeek-V3':
        await deepSeekAi(FullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
        break;
      
      case 'gpt-3.5-turbo' :
        await openAi(FullPrompt, setLoadingData, setError, setQuestions, () => setCurrentQuestion(0));
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

  return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-slate-900 rounded-2xl shadow-lg p-6 space-y-6">
          {CurrentQuestion === questions.length ? (
           <>
           <h1 className="text-3xl font-bold text-center text-cyan-500">Quiz Results</h1>
           <div className="flex justify-center">
             <CircularProgressBar percentage={((TotalCorrect * 100) / questions.length).toFixed(2)} size={120} strokeWidth={10} />
           </div>
           <p className="text-center text-lg">
             You got <span className="font-semibold text-cyan-400">{TotalCorrect}/{questions.length}</span> correct answers
           </p>
           <button
             onClick={() => location.reload()}
             className="w-full py-2 rounded-lg font-semibold transition cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white"
           >
             Restart Quiz
           </button>
         </>
          ) : CurrentQuestion !== -1 ? (
            <>
    <h2 className="text-xl font-bold">{CurrentQuestion + 1}) {questions[CurrentQuestion].question}</h2>
    <ul className="space-y-2">
      {questions[CurrentQuestion].answers.map((answer, index) => (
        <li
          key={index}
          onClick={() => SelectedAnswer(index)}
          className={`p-3 rounded-lg border-2 cursor-pointer transition-all
            ${
              SelectedAnswerId === index
            ? IsCorrect
              ? 'border-green-500' 
              : IsCorrect === false
              ? 'border-red-500'
              : 'border-cyan-500' 
            : correctAnswer === index
            ? 'border-green-500' 
            : 'border-gray-700'
            }`}
        >
          {answer}
        </li>
      ))}
    </ul>
    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
      <span className="text-sm text-gray-300">Question {CurrentQuestion + 1}/{questions.length}</span>
      <button
        onClick={NextQuestion}
        disabled={SelectedAnswerId === null}
        className={`px-4 py-2 rounded-lg font-semibold transition  cursor-pointer
          ${
            SelectedAnswerId === null
              ? 'bg-cyan-500/50 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
      >
        Next
      </button>
    </div>
  </>
          ) : (
            <>
      <h1 className="text-2xl font-bold text-center text-cyan-500">AI Quiz Generator</h1>

      <div className='p-3 rounded-md bg-slate-800 text-white border border-slate-700 focus-within:border-cyan-500 transition duration-500 ease'>
        <textarea
          className="w-full h-40 outline-none resize-none"
          placeholder="Enter a topic to generate questions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className='flex justify-end'>
          <select
            className='py-2 px-4 border border-slate-700 rounded-full bg-slate-800 outline-none'
            onChange={(e) => setSelectedModel(e.target.value)}
            value={SelectedModel}
          >
            {aiModels.map(model => (
              <option value={model} key={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Select Difficulty</h4>
        <div className="flex space-x-2">
          {levels.map((lev) => (
            <button
              key={lev}
              onClick={() => setSelectedLev(lev)}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer
                ${
                  selectedLev === lev
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
            >
              {lev}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center text-sm font-medium mb-1">
          <span>Number of Questions</span>
          <span>{numQuestions}</span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={GenerateQuest}
        disabled={prompt === '' || loadingData}
        className={`w-full py-2 rounded-lg font-semibold transition cursor-pointer
          ${
            prompt === '' || loadingData
              ? 'bg-cyan-500/50 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
      >
        {loadingData ? 'Generating...' : 'Generate Questions'}
      </button>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
    </>
          )}
        </div>
        <footer className="mt-6 text-sm text-gray-400 text-center">
          Built by <a href="https://github.com/ourouimed" className="text-cyan-500 font-semibold" target="_blank">ourouimed</a> &copy; {new Date().getFullYear()}
        </footer>
      </div>
  );
};

export default App;
