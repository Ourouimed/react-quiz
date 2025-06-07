import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'


const QuizSec = ()=>{
    const {CurrentQuestion, questions, SelectedAnswerId, IsCorrect, correctAnswer, NextQuestion, SelectedAnswer} = useContext(AppContext);
    const {question, answers, code} = questions[CurrentQuestion]
    return <>
    <h2 className="text-xl font-bold">{CurrentQuestion + 1}) {question}</h2>
    {code != null && <SyntaxHighlighter
  language={code.language}
  style={oneDark}
  customStyle={{
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a', // Tailwind's slate-950
    padding: '1.25rem',
    border: '1px solid #1e293b', // slate-800
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  }}
>
  {code.content}
</SyntaxHighlighter>}
    
    <ul className="space-y-2">
      {answers.map((answer, index) => (
        <li
          key={index}
          onClick={() => SelectedAnswer(index)}
          className={`px-5 py-3 rounded-lg border-3 cursor-pointer transition-all 
            ${
              SelectedAnswerId === index
            ? IsCorrect
              ? 'border-green-500 bg-green-500/30' 
              : IsCorrect === false
              ? 'border-red-500 bg-red-500/30'
              : 'border-cyan-500 bg-cyan-500/30' 
            : correctAnswer === index
            ? 'border-green-500 bg-green-500/30' 
            : 'border-gray-700 bg-gray-700/30' 
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
        className={`py-3 px-5 rounded-lg font-bold transition
          ${
            SelectedAnswerId === null
              ? 'bg-cyan-500/50 cursor-not-allowed text-white/70'
              : 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-lg cursor-pointer'
          }`}
      >
        Next Quesion
      </button>
    </div>
  </>
}

export default QuizSec