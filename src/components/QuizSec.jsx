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
}

export default QuizSec