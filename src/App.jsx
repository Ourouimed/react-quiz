import { useState } from 'react';
import questions from './questions';
import PropTypes from 'prop-types';

// Circular Total Correct answers Porcentrage Bar 
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
// Set PropTypes for CircularProgressBar
CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

// Main App component
const App = () => {
  const [CurrentQuestion, setCurrentQuestion] = useState(-1);
  const [TotalCorrect , setTotalCorrect] = useState(0)
  const [SelectedAnswerId, setSelectedAnswerId] = useState(null)
  // Start Quiz Button
  const StartQuiz = () => {
    // Show Current Question
    setCurrentQuestion(CurrentQuestion + 1);
    // Check if the selected answer is correct and update the total correct answers count
    if (SelectedAnswerId === questions[CurrentQuestion].correctAnswer){
      setTotalCorrect(TotalCorrect + 1)
    }
    // Reset Selected Answer Id
    setSelectedAnswerId(null); 
  };
  // Select Answer Button
  const SelectedAnswer = (id) => {
    setSelectedAnswerId(id);
  };
  //  If Current Question is -1, show the start quiz button
  if (CurrentQuestion !== -1) {
    // If Current Question is more than the length of the questions array, show the results
    if (CurrentQuestion === questions.length - 1) {
      // Resest Current Total Correct Answers
      setTotalCorrect(0)
      return (
        <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md flex flex-col gap-2 justify-content-center items-center">
          <h1 className='text-center font-bold text-4xl'>Quiz Results</h1>
          <CircularProgressBar percentage={(TotalCorrect*100)/questions.length} size={120} strokeWidth={10}/>
          <p>You have <span className='text-cyan font-bold text-center'>{TotalCorrect}/{questions.length}</span> Correct answers</p>
          <button
          onClick={()=>{
            setCurrentQuestion(-1)
          }}
          className="bg-cyan-500 px-4 py-2 mx-auto my-2 text-white rounded-lg w-full block cursor-pointer"
        >
          Restart Quiz
        </button>
        </div>
      )
    }
    // If Current Question is less than the length of the questions array, show the current question
    return (
      <div className="w-[500px] max-w-[90%] bg-white p-2 rounded-lg shadow-md">
        <h1 className="text-xl font-bold">
          {CurrentQuestion + 1}) - {questions[CurrentQuestion].question}
        </h1>
        <ul className="py-3 flex flex-col gap-2">
          {/* Map through the answers and display them as list items */}
          {questions[CurrentQuestion].answers.map((answer, index) => (
            <li
              key={index}
              className={`border-2 p-3 cursor-pointer rounded-lg 
                ${
                // If the selected answer is the same as the current index, add a border color 
                SelectedAnswerId === index 
                  ?  'border-cyan-500' 
                  : 'border-gray-200'
              }`}
              /*Select the clicked Answer*/
              onClick={() => SelectedAnswer(index)}
            >
              {answer}
            </li>
          ))}
        </ul>
        <div className="border-t-2 border-gray-200 pt-2 flex items-center gap-2 justify-between">
          <div>
            {/* Show the current question number and the total number of questions */}
            Question {CurrentQuestion + 1}/{questions.length}
          </div>
          {/* Move to the next question */}
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
  // If the quiz is not started yet, show the start button
  else {
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