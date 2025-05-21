import { useContext } from "react";
import { MainContext } from "./contexts/MainContext";

const HomeSec = () => {
  const {
    prompt,
    setPrompt,
    selectedLev,
    setSelectedLev,
    levels,
    numQuestions,
    setNumQuestions,
    GenerateQuest,
    loadingData,
    error,
    SelectedModel,
    setSelectedModel,
    aiModels,
  } = useContext(MainContext);

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-cyan-500">AI Quiz Generator</h1>

      <div className='p-3 rounded-md bg-slate-800 text-white border border-slate-700 focus-within:border-cyan-500 transition duration-500 ease'>
        <textarea
          className="w-full h-40 outline-none resize-none"
          placeholder="Enter a topic to generate questions..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className='flex justify-end'>
          <select
            className='py-2 px-4 border border-slate-700 rounded-full bg-slate-800 outline-none'
            onChange={(e) => setSelectedModel(e.target.value)}
            value={SelectedModel}
          >
            {aiModels.map(model => (
              <option value={model} key={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Select Difficulty</h4>
        <div className="flex space-x-2">
          {levels.map((lev) => (
            <button
              key={lev}
              onClick={() => setSelectedLev(lev)}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer
                ${
                  selectedLev === lev
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
            >
              {lev}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center text-sm font-medium mb-1">
          <span>Number of Questions</span>
          <span>{numQuestions}</span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={GenerateQuest}
        disabled={prompt === '' || loadingData}
        className={`w-full py-2 rounded-lg font-semibold transition cursor-pointer
          ${
            prompt === '' || loadingData
              ? 'bg-cyan-500/50 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
      >
        {loadingData ? 'Generating...' : 'Generate Questions'}
      </button>

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
    </>
  );
};

export default HomeSec;
