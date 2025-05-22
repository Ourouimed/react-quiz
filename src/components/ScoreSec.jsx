import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import CircularProgressBar from "./CircularProgressBar";

const ScoreSec = ()=>{
    const {TotalCorrect, questions } = useContext(AppContext);
    return  <>
    <h1 className="text-3xl font-bold text-center text-cyan-500">Quiz Results</h1>
    <div className="flex justify-center">
      <CircularProgressBar percentage={((TotalCorrect * 100) / questions.length).toFixed(2)} />
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
}

export default ScoreSec