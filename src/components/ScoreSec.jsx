import { useContext } from "react";
import { AppContext }
 from "../context/AppContext";
import CircularProgressBar from "./CircularProgressBar"; 

const ScoreSec = ()=>{
    const { TotalCorrect, questions } = useContext(AppContext);

    const percentage = questions.length > 0
        ? ((TotalCorrect * 100) / questions.length).toFixed(0) 
        : 0;

    const message = parseFloat(percentage) >= 70
        ? "Excellent job!"
        : parseFloat(percentage) >= 50
        ? "Good effort!"
        : "Keep practicing!";

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-extrabold text-center text-cyan-500 mb-4 animate-fadeIn">
                Quiz Results
            </h1>
            <p className="text-center text-xl text-gray-300 mb-8 animate-fadeIn delay-100">
                {message}
            </p>

            <div className="flex justify-center mb-8">
                <CircularProgressBar percentage={percentage} />
            </div>

            <p className="text-center text-lg md:text-xl text-white mb-6 animate-fadeIn delay-200">
                You answered <span className="font-semibold text-cyan-400">{TotalCorrect}/{questions.length}</span> questions correctly!
            </p>

            <button
                onClick={() => window.location.reload()} 
                className="w-full py-3 rounded-lg font-bold transition bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-lg cursor-pointer"
            >
                Start a New Quiz
            </button>
        </>
    );
}

export default ScoreSec;