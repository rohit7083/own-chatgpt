import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { URL } from "./Constants";
import Answer from "./compo/Answer";
function App() {
  const [questions, setQuestions] = useState("");
  const [result, setResult] = useState("");
  const payload = {
    contents: [
      {
        parts: [
          {
            text: questions,
          },
        ],
      },
    ],
  };

  const handleAskQuestions = async () => {
    console.log(questions); // assuming this is declared elsewhere
    try {
      const res = await axios.post(URL, payload);
      let dataString = res?.data?.candidates[0]?.content?.parts[0]?.text;
      dataString = dataString.split("* ");
      dataString = dataString.map((x) => x.trim());
      console.log(res);
      setResult(dataString);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 h-screen text-center">
        <div className="col-span-1 bg-zinc-700"> </div>
        <div className="col-span-4">
          <div className="container h-115  overflow-auto">
            <div className=" text-white bg-black mt-10 ">
              {/* {result} */}

              {result &&
                result?.map((item, index) => (
                  // <li>
                    <Answer ans={item} key={index} />
                  // </li>
                ))}
            </div>
          </div>
          <div className=" flex bg-zinc-700 text-white w-1/2 p-1 pr-5 m-auto rounded-4xl border-amber-200 border">
            <input
              type="text"
              className="w-full h-full p-3 outline-none"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="ask me Anything...."
            ></input>
            <button type="submit" onClick={handleAskQuestions}>
              Ask
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
