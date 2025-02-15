import {useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
  // Gemini ai generated quiz 
  const [prompt , setPrompt] = useState('')
  const [selectedLev , setSelectedLev] = useState('easy')
  const levels = ['easy' , 'medium' , 'hard']
  const [numQuestions , setNumQuestions] = useState(15)
  const [questions , setQuestions] = useState([])
  const [loadingData , setLoadingData] = useState(null)
  const [error , setError] = useState('')

  // generate questions using gemini Api

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`  
  const GenerateQuest = async ()=>{
    setLoadingData(true)
    try {
      const response = await axios.post(API_URL, {
        contents: [{
          role: "user",
          parts: [{ text: 
            `
         Generate a quiz with the following specifications:

Number of questions: ${numQuestions}

Topic: ${prompt}

Difficulty level: ${selectedLev}

Format the output as a JSON-like array of objects, where each object represents a question and includes:

A question key with the question text.

An answers key with an array of possible answers.

A correctAnswer key with the index of the correct answer in the answers array.

Example structure:
[
{
"question": "What is the capital of France?",
"answers": ["Paris", "London", "Berlin", "Madrid"],
"correctAnswer": 0
},
...
]

Additional instructions:

Return only the output in plain text (not code) so it can be easily transformed into an object.

If the input topic (${prompt}) is unclear, illogical, or cannot be used to generate meaningful questions, return only the following error message: "Error: Invalid or unclear topic provided."

Ensure the questions, answers, and difficulty level (${selectedLev}) are appropriate and relevant to the topic.     
  ` 
}]
        }]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    
      const data = response.data; // Axios automatically parses the JSON response
      let content = (data.candidates[0].content.parts[0].text).replace(/```json|```/g, "").trim()
      let parsedQuestions = JSON.parse(content)
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Error Generating questions")
      }
      else {
        setQuestions(parsedQuestions)
        NextQuestion()
      }
      setLoadingData(null)
    }
    catch(err){
      console.error(`error : ${err}`)
      setError('Error generating questions please try again')
      setLoadingData(null)
    }
  }

  
  // Start Quiz Button
  const NextQuestion = () => {
    if (CurrentQuestion !== -1) {
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
          setIsCorrect(null); //
        }, 500);
    } 
    else {
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
        <div className="border-t-2 border-gray-200 pt-2 flex items-center gap-2 justify-between cursor-pointer">
          <div>
            Question {CurrentQuestion + 1}/{questions.length}
          </div>
          <button
            onClick={NextQuestion}
            className={`bg-cyan-500 px-4 py-2 text-white rounded-lg ${SelectedAnswerId === null ? 'opacity-75 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`} 
            disabled={SelectedAnswerId === null}
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
      <h1 className="text-2xl text-center text-cyan-500 font-bold">AI Quiz generator</h1>
      <input  
        className='w-full p-2 border border-2 border-gray-300 outline-none my-2 rounded-md' 
        value={prompt} 
        onChange={
          (e) =>{
            setPrompt(e.target.value)
          }}
        placeholder='write a topic to generate quiz for'></input>
      <h4 className='font-bold'>Quiz level</h4>
      <ul className='flex align-center gap-1 my-1'>
        {levels.map(lev => <li key={lev} 
                               className={`cursor-pointer py-1 px-2 border border-2 border-cyan-500 rounded-lg ${selectedLev == lev ? "bg-cyan-500 text-white" : "bg-white"}`}
                               onClick={()=>{
                                setSelectedLev(lev)
                               }}
                               >
                                {lev}
                                </li>)}
      </ul>
      <div className='flex justify-between align-center'>
        <h4>Number of questions :</h4>
        <h4>{numQuestions}</h4>
      </div>
      <input type='range' min={5} max={30} value={numQuestions} onChange={(e)=>{
        setNumQuestions(e.target.value)
      }}  className='w-full p-1'></input>
      <button
        onClick={GenerateQuest}
        className={`bg-cyan-500 px-4 py-2 text-white rounded-lg w-full ${prompt == "" || loadingData ? 'opacity-75 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`} 
        disabled={prompt == "" || loadingData}
      >
        {loadingData ? "Generting questions...." : "Generate questions"}
        
      </button>
      {error != '' ? <p className="text-red-500 mt-2">{error}</p>: null}
    </div>
  );
};

export default App;