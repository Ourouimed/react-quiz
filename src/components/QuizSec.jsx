import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const QuizSec = ()=>{
    const {CurrentQuestion, questions, SelectedAnswerId, IsCorrect, correctAnswer, NextQuestion, SelectedAnswer} = useContext(AppContext);
    return <>
    <h2 className="text-xl font-bold">{CurrentQuestion + 1}) {questions[CurrentQuestion].question}</h2>
    <ul className="space-y-2">
      {questions[CurrentQuestion].answers.map((answer, index) => (
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