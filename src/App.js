import "./App.css";
import axios from "axios";
import { useState } from "react";
import speakers from "./Speakers.js";
import { Audio } from "react-loader-spinner";

function App() {
  const [bark_url, setBURL] = useState("");
  const [audio_url, setAURL] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [response_url, setResAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [prompt, setPrompt] = useState(false);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (code) => {
    // eslint-disable-next-line
    selectedItem == code
      ? setSelectedItem(null) && setPrompt(false)
      : setSelectedItem(code) && setPrompt(true);
    console.log(selectedItem);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const handleSubmit = async () => {
    if (audioFile && bark_url) {
      setLoading(true);
      if (selectedItem !== "" || null || undefined) {
        console.log("With Prompt");
        const newBURL = bark_url + "/process_text_custom_voice";
        try {
          const formdata = new FormData();
          formdata.append("audio", audioFile);
          formdata.append("bark_url", newBURL);
          formdata.append("voice", selectedItem);

          const response = await axios.post(
            `${audio_url}/generate_audio`,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Response:", response.data);
          setResAudio(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.log("Without Prompt");
        const newBURL = bark_url + "/process_text";
        try {
          const formdata = new FormData();
          formdata.append("audio", audioFile);
          formdata.append("bark_url", newBURL);
          formdata.append("voice", "");

          const response = await axios.post(
            `${audio_url}/generate_audio`,
            formdata,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Response:", response.data);
          setResAudio(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    } else {
      setLoading(false);
      prompt("The Audio File or Bark Url is not Filled");
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-urls-input">
          <input
            name="bark_url"
            type="text"
            placeholder="Enter the Bark Model URL"
            onChange={(e) => setBURL(e.target.value)}
          />
          <input
            name="audio_url"
            type="text"
            placeholder="Enter the audio URL"
            onChange={(e) => setAURL(e.target.value)}
          />
        </div>
        <div className="row-div">
          <div className="row-div1">
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="row-div2">
            {response_url ? (
              !loading ? (
                <audio src={response_url} controls />
              ) : (
                <div style={{}}>
                  <Audio
                    height="80"
                    width="80"
                    radius="9"
                    color="purple"
                    ariaLabel="three-dots-loading"
                    wrapperStyle
                    wrapperClass
                  />
                </div>
              )
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="prompt-autostic">
          <h3>Acoustic Prompt</h3>
          <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
              {selectedItem
                ? speakers.find((speaker) => speaker.code === selectedItem).name // Find the speaker name based on code
                : "Unconditional"}
              <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
            </div>
            <div className={`dropdown-body ${isOpen && "open"}`}>
              {speakers.map((speaker) => (
                <div
                  key={speaker.code} // Use the speaker code as the key
                  className="dropdown-item"
                  onClick={() => handleItemClick(speaker.code)} // Use the speaker code as the id
                  id={speaker.code}
                >
                  <span
                    className={`dropdown-item-dot ${
                      selectedItem === speaker.code && "selected"
                    }`}
                  >
                    ✅
                  </span>
                  {speaker.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="button"
          onClick={handleSubmit}
          disabled={!loading ? false : true}
        >
          Process Audio
        </button>
      </header>
    </div>
  );
}

export default App;
