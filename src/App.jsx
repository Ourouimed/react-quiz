import { useState } from 'react';
import questions from './questions';
import PropTypes from 'prop-types';

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

// PropTypes for CircularProgressBar
CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

// Main App Component
const App = () => {
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  const [TotalCorrect, setTotalCorrect] = useState(0);
  const [SelectedAnswerId, setSelectedAnswerId] = useState(null);
  const [IsCorrect, setIsCorrect] = useState(null);

  // Start Quiz Button
  const StartQuiz = () => {
    if (CurrentQuestion !== -1) {
      if (SelectedAnswerId === null) {
        // If no answer is selected, ask the user if they want to skip
        const skip = window.confirm("Are you sure you want to skip this question?");
        if (skip) {
          setCurrentQuestion(CurrentQuestion + 1);
        }
      } else {
        // Check if the selected answer is correct
        const isAnswerCorrect = SelectedAnswerId === questions[CurrentQuestion].correctAnswer;
        setIsCorrect(isAnswerCorrect);

        // Update the total correct answers if the answer is correct
        if (isAnswerCorrect) {
          setTotalCorrect(TotalCorrect + 1);
        }

        // Move to the next question after a delay
        setTimeout(() => {
          setCurrentQuestion(CurrentQuestion + 1);
          setSelectedAnswerId(null); // Reset selected answer
          setIsCorrect(null); // Reset correctness state
        }, 2000);
      }
    } else {
      // Start the quiz
      setCurrentQuestion(CurrentQuestion + 1);
    }
  };

  // Select Answer
  const SelectedAnswer = (id) => {
    setSelectedAnswerId(id);
  };

  // Render Quiz Results
  if (CurrentQuestion === questions.length) {
    return (
      <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md flex flex-col gap-2 justify-content-center items-center">
        <h1 className='text-center font-bold text-4xl'>Quiz Results</h1>
        <CircularProgressBar percentage={(TotalCorrect * 100) / questions.length} size={120} strokeWidth={10} />
        <p>You have <span className='text-cyan font-bold text-center'>{TotalCorrect}/{questions.length}</span> correct answers</p>
        <button
          onClick={() => location.reload()}
          className="bg-cyan-500 px-4 py-2 mx-auto my-2 text-white rounded-lg w-full block cursor-pointer"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  // Render Current Question
  if (CurrentQuestion !== -1) {
    return (
      <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">
          {CurrentQuestion + 1}) - {questions[CurrentQuestion].question}
        </h1>
        <ul className="py-3 flex flex-col gap-2">
          {questions[CurrentQuestion].answers.map((answer, index) => (
            <li
              key={index}
              className={`border-2 p-3 cursor-pointer rounded-lg 
                ${
                  SelectedAnswerId === index
                    ? IsCorrect === true
                      ? 'border-green-500' // Correct answer
                      : IsCorrect === false
                      ? 'border-red-500' // Incorrect answer
                      : 'border-cyan-500' // Selected but not evaluated
                    : 'border-gray-200' // Not selected
                }
              `}
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
  }

  // Render Start Quiz Button
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
};

export default App;