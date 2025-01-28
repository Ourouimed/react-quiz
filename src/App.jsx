import { useState } from 'react';
import questions from './questions';

const App = () => {
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  const [TotalCorrect , setTotalCorrect] = useState(0)
  const [SelectedAnswerId, setSelectedAnswerId] = useState(null)

  const StartQuiz = () => {
    setCurrentQuestion(CurrentQuestion + 1);
    if (SelectedAnswerId === questions[CurrentQuestion].correctAnswer){
      setTotalCorrect(TotalCorrect + 1)
    }
    console.log(TotalCorrect)
    setSelectedAnswerId(null); 
  };

  const SelectedAnswer = (id) => {
    setSelectedAnswerId(id);
  };

  if (CurrentQuestion !== -1) {
    if (CurrentQuestion === questions.length - 1) {
      setCurrentQuestion(-1);
    }
    return (
      <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">
          {CurrentQuestion + 1}) - {questions[CurrentQuestion].question}
        </h1>
        <ul className="py-3 flex flex-col gap-2">
          {questions[CurrentQuestion].answers.map((answer, index) => (
            <li
              key={index}
              className={`border-2 p-3 cursor-pointer rounded-lg ${
                SelectedAnswerId === index 
                  ?  'border-cyan-500' 
                  : 'border-gray-200'
              }`}
              onClick={() => SelectedAnswer(index)}
            >
              {answer}
            </li>
          ))}
        </ul>
        <div className="border-t-2 border-gray-200 pt-2 flex items-center gap-2 justify-between">
          <div>
            Question {CurrentQuestion + 1}/{questions.length}
          </div>
          <button
            onClick={StartQuiz}
            className="bg-cyan-500 px-4 py-2 text-white rounded-lg cursor-pointer"
          >
            Next Question
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md">
        <h1 className="text-4xl text-cyan-500 font-bold text-center">Quiz</h1>
        <button
          onClick={StartQuiz}
          className="bg-cyan-500 px-4 py-2 mx-auto my-2 text-white rounded-lg w-full block cursor-pointer"
        >
          Start Quiz
        </button>
      </div>
    );
  }
};

export default App;