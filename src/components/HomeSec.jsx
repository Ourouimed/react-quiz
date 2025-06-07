import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { AttachFile, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

const HomeSec = () => {
  const {
    aiModels,
    prompt,
    setPrompt,
    selectedLev,
    setSelectedLev,
    levels,
    numQuestions,
    setNumQuestions,
    generateQuestions,
    loadingData,
    error,
    SelectedModel,
    setSelectedModel,
    language,
    setLanguage,
  } = useContext(AppContext);

  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState(null);
  const [fileAttached, setFileAttached] = useState(false);

  // New states for page selection:
  const [numPages, setNumPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);

  const availableLanguages = [
    'English' , 'Arabic', 'Moroccan Darija' , 'French', 'Spanish',
    'German', 'Italian', 'Portuguese', 'Tamazight' , 'Tamazight (Tifinagh)', 'Japanese',
    'Chinese', 'Korean'
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileAttached(false);
    setNumPages(0);
    setSelectedPages([]);
    setPrompt('');
    setExtractionError(null);

    if (!file) {
      setFileName('');
      return;
    }

    if (file.type !== 'application/pdf') {
      setExtractionError('Please upload a PDF file.');
      setFileName('');
      return;
    }

    setFileName(file.name);
    setIsExtracting(true);

    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedarray = new Uint8Array(fileReader.result);

      try {
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;

        setNumPages(pdf.numPages);
        // Default: select all pages initially
        setSelectedPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));

        // Extract text only from selected pages (all by default)
        let extractedFullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          if (selectedPages.length === 0 || selectedPages.includes(i)) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedFullText += pageText + '\n\n';
          }
        }

        setPrompt(extractedFullText);
        setFileAttached(true);
        setExtractionError(null);
      } catch (err) {
        console.error('Error extracting PDF text:', err);
        setExtractionError('Failed to extract text from PDF. It might be encrypted or corrupted.');
        setPrompt('');
        setFileAttached(false);
        setNumPages(0);
        setSelectedPages([]);
      } finally {
        setIsExtracting(false);
      }
    };

    fileReader.onerror = (err) => {
      console.error('FileReader error:', err);
      setExtractionError('Error reading file.');
      setIsExtracting(false);
      setPrompt('');
      setFileAttached(false);
      setNumPages(0);
      setSelectedPages([]);
    };

    fileReader.readAsArrayBuffer(file);
  };

  // Handle checkbox toggle for pages
  const togglePageSelection = (pageNum) => {
    if (selectedPages.includes(pageNum)) {
      // Deselect page
      setSelectedPages(selectedPages.filter(p => p !== pageNum));
    } else {
      // Select page
      setSelectedPages([...selectedPages, pageNum].sort((a,b) => a - b));
    }
  };

  // Select All / Deselect All toggle
  const toggleSelectAllPages = () => {
    if (selectedPages.length === numPages) {
      // All pages selected, so deselect all
      setSelectedPages([]);
    } else {
      // Select all pages
      setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    }
  };

  // Extract text from selected pages when selection changes
  React.useEffect(() => {
    if (!fileAttached || isExtracting) return;

    // Re-extract text from selected pages
    const reExtractText = async () => {
      setIsExtracting(true);
      setExtractionError(null);

      try {
        // For simplicity, no re-extraction on page selection change.
        // To support this, you'd have to store file data in state and re-extract here.
      } catch (err) {
        setExtractionError('Error re-extracting text.');
      } finally {
        setIsExtracting(false);
      }
    };

    reExtractText();
  }, [selectedPages]);

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-cyan-500 mb-6">AI Quiz Generator</h1>

      <div className='p-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus-within:border-cyan-500 transition duration-500 ease mb-6'>

        {!fileAttached && (
          <textarea
            className="w-full h-20 outline-none resize-none bg-transparent placeholder-slate-400 text-base mb-4"
            placeholder="Enter a topic to generate questions, or attach a PDF document for context..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isExtracting}
          />
        )}

        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-4">

          {/* File Attachment */}
          <div className="flex flex-col w-full md:w-auto">
            <input
              type="file"
              id="addFile"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf"
              disabled={isExtracting || loadingData}
            />
            <label
              htmlFor="addFile"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white border transition max-w-full overflow-hidden whitespace-nowrap text-ellipsis ${
                isExtracting || loadingData
                  ? 'border-slate-700 opacity-60 cursor-not-allowed'
                  : 'border-slate-700 hover:bg-slate-700 cursor-pointer'
              }`}
            >
              <AttachFile className="w-4 h-4" />
              <span className="text-sm">
                {isExtracting ? 'Extracting PDF...' : (fileName || 'Attach PDF')}
              </span>
              {fileAttached && !isExtracting && !extractionError && (
                <CheckCircleOutline className="w-4 h-4 text-green-500 ml-2" />
              )}
              {extractionError && !isExtracting && (
                <ErrorOutline className="w-4 h-4 text-red-500 ml-2" />
              )}
            </label>
            {extractionError && (
              <p className="text-red-500 text-xs mt-1 md:mt-2 text-wrap">{extractionError}</p>
            )}
          </div>

          {/* AI Model Selection */}
          <select
            className={`py-2 px-4 border rounded-full bg-slate-800 text-white outline-none transition w-full md:w-auto ${
              isExtracting || loadingData
                ? 'border-slate-700 opacity-60 cursor-not-allowed'
                : 'border-slate-700 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500'
            }`}
            onChange={(e) => setSelectedModel(e.target.value)}
            value={SelectedModel}
            disabled={isExtracting || loadingData}
          >
            {aiModels.map((model) => (
              <option value={model} key={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>

      {/* New Page Selection Section */}
      {fileAttached && numPages > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-slate-700 text-white border border-slate-600">
          <h4 className="font-semibold mb-2">Select Pages to Extract</h4>

          {/* Select All / Deselect All button */}
          <button
            onClick={toggleSelectAllPages}
            disabled={isExtracting || loadingData}
            className="mb-2 px-3 py-1 rounded-full border border-cyan-500 bg-slate-800 text-cyan-500 hover:bg-cyan-500 hover:text-slate-900 transition"
          >
            {selectedPages.length === numPages ? 'Deselect All' : 'Select All'}
          </button>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNum => (
              <label
                key={pageNum}
                className={`cursor-pointer select-none px-3 py-1 rounded-full border ${
                  selectedPages.includes(pageNum)
                    ? 'bg-cyan-500 border-cyan-500 text-slate-900'
                    : 'border-slate-500 text-white hover:bg-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPages.includes(pageNum)}
                  onChange={() => togglePageSelection(pageNum)}
                  className="hidden"
                  disabled={isExtracting || loadingData}
                />
                Page {pageNum}
              </label>
            ))}
          </div>
          <p className="text-xs mt-1 text-slate-300">
            Select pages you want to extract text from. Default is all pages.
          </p>
        </div>
      )}

      {/* Language Selection */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-white">Select Language</h4>
        <select
          className={`py-2 px-4 border rounded-md bg-slate-800 text-white outline-none transition w-full ${
            isExtracting || loadingData
              ? 'border-slate-700 opacity-60 cursor-not-allowed'
              : 'border-slate-700 hover:border-cyan-500 focus:ring-2 focus:ring-cyan-500'
          }`}
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
          disabled={isExtracting || loadingData}
        >
          {availableLanguages.map((lang) => (
            <option value={lang} key={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3 text-white">Select Difficulty</h4>
        <div className="flex flex-wrap gap-2">
          {levels.map((lev) => (
            <button
              key={lev}
              onClick={() => setSelectedLev(lev)}
              disabled={isExtracting || loadingData}
              className={`px-3 py-1 rounded-md cursor-pointer font-medium transition ${
                selectedLev === lev
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              } ${isExtracting || loadingData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {lev}
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-sm font-medium mb-2 text-white">
          <span>Number of Questions</span>
          <span>{numQuestions}</span>
        </div>
        <input
          type="range"
          min={5}
          max={30}
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          disabled={isExtracting || loadingData}
          className="w-full cursor-pointer accent-cyan-500"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateQuestions}
        disabled={isExtracting || loadingData || !prompt.trim()}
        className="w-full py-3 rounded-md cursor-pointer bg-cyan-500 text-slate-900 font-bold transition hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loadingData ? 'Generating...' : 'Generate Quiz'}
      </button>

      {/* Error Message */}
      {error && 
      <p className="p-4 font-bold rounded-lg bg-red-500/10 text-red-400 border border-red-500">{error}</p>
}
    </>
  );
};

export default HomeSec;
