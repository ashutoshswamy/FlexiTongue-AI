import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import {
  Languages,
  Type,
  Globe,
  AlertCircle,
  Github,
  Linkedin,
  Loader2,
} from "lucide-react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [style, setStyle] = useState("casual");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const styles = [
    "casual",
    "formal",
    "friendly",
    "professional",
    "poetic",
    "humorous",
    "technical",
  ];

  const translateText = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    if (!targetLanguage.trim()) {
      setError("Please specify a target language");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Translate the following text to ${targetLanguage} in a ${style} style: "${inputText}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedContent = response.text();

      setTranslatedText(translatedContent);
    } catch (err) {
      setError(err.message || "An error occurred during translation");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>FlexiTongue AI</h1>
      <div className="translation-container">
        <div className="input-section">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            rows={6}
          />

          <div className="controls">
            <div className="input-group">
              <label>
                <Languages size={16} className="icon" /> Target Language:
              </label>
              <input
                type="text"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                placeholder="e.g. Spanish, French, Japanese"
              />
            </div>

            <div className="select-group">
              <label>
                <Type size={16} className="icon" /> Style:
              </label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                {styles.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={translateText} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Translating...
                </>
              ) : (
                <>
                  <Globe size={18} /> Translate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className="output-section">
          <h3>
            <Languages size={18} /> Translation:
          </h3>
          <div className="translated-text">
            {translatedText ? (
              <div className="markdown-content">
                <ReactMarkdown>{translatedText}</ReactMarkdown>
              </div>
            ) : (
              "Translation will appear here..."
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Developed by Ashutosh Swamy</p>
        <div className="social-links">
          <a
            href="https://github.com/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/ashutoshswamy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={18} /> LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
