import { useContext } from "react";
import { MainContext } from "./contexts/MainContext";

const ScoreSec = ()=>{
    const {TotalCorrect, questions, CircularProgressBar} = useContext(MainContext);
    return  <>
    <h1 className="text-3xl font-bold text-center text-cyan-500">Quiz Results</h1>
    <div className="flex justify-center">
      <CircularProgressBar percentage={((TotalCorrect * 100) / questions.length).toFixed(2)} size={120} strokeWidth={10} />
    </div>
    <p className="text-center text-lg">
      You got <span className="font-semibold text-cyan-400">{TotalCorrect}/{questions.length}</span> correct answers
    </p>
    <button
      onClick={() => location.reload()}
      className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition cursor-pointer"
    >
      Restart Quiz
    </button>
  </>
}

export default ScoreSec