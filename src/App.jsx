import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { URL } from "./Constants";
import Answer from "./compo/Answer";

function App() {
  const [questions, setQuestions] = useState("");
  const [result, setResult] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState();
  const scrollToAns = useRef();
  const [loading, setLoading] = useState(false);
  const [recentHistory, setRecentHistory] = useState(() => {
    const stored = localStorage.getItem("history");
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const handleAskQuestions = async () => {
    const currentQuestion = questions || selectedHistory;
    if (!currentQuestion) return;

    if (questions) {
      const history = [
        questions,
        ...(JSON.parse(localStorage.getItem("history")) || []),
      ];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: currentQuestion,
            },
          ],
        },
      ],
    };

    setLoading(true);
    try {
      const res = await axios.post(URL, payload);
      let dataString = res?.data?.candidates[0]?.content?.parts[0]?.text;
      const answers = dataString?.split("* ").map((x) => x.trim()) || [];

      setResult((prev) => [
        ...prev,
        { type: "q", text: currentQuestion },
        { type: "a", text: answers },
      ]);
      setQuestions("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollToAns.current) {
      scrollToAns.current.scrollTo({
        top: scrollToAns.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [result]);

  useEffect(() => {
    handleAskQuestions();
  }, [selectedHistory]);

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const isEnter = (e) => {
    if (e.key === "Enter") handleAskQuestions();
  };

  return (
    <div className="grid grid-cols-5 h-screen overflow-hidden text-center">
      {/* Left Panel */}
      <div className="col-span-1 bg-zinc-900 flex flex-col">
        <div className="flex justify-between items-center p-2">
          <h1 className="text-white">Recent History</h1>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              fill="#e3e3e3"
              viewBox="0 -960 960 960"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
          </button>
        </div>
        <hr className="text-white" />
        {/* <ul className="text-left overflow-auto px-2"> */}

        <ul className="h-screen overflow-y-auto scroll-hide text-left px-2">
          {recentHistory.map((item, index) => (
            <li
              key={index}
              className="p-1 mt-1 text-zinc-400 cursor-pointer hover:bg-zinc-800 overflow-hidden whitespace-nowrap text-ellipsis"
              onClick={() => setSelectedHistory(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="col-span-4 flex flex-col overflow-hidden">
        <h1 className="text-white mt-3 text-2xl">
          Hello Rohit, Ask me Anything
        </h1>

        {loading && (
          <div role="status" className="mt-8 justify-center flex">
            <p className="text-amber-300 text-2xl mr-2 ">Please Wait..</p>
         <div role="status">
    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
          </div>
        )}

        <div ref={scrollToAns} className="flex-1 overflow-auto px-6 mt-4">
          <ul className="text-white space-y-2">
            {result.map((item, index) => (
              <div
                key={index}
                className={item.type === "q" ? "flex justify-end" : ""}
              >
                {item.type === "q" ? (
                  <li className="text-right border w-fit border-zinc-700 bg-zinc-700 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl p-2">
                    <Answer
                      ans={item.text}
                      totalResult={1}
                      index={index}
                      type={item.type}
                    />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li key={ansIndex} className="text-left p-1">
                      <Answer
                        ans={ansItem}
                        totalResult={item.text.length}
                        index={ansIndex}
                        type={item.type}
                      />
                    </li>
                  ))
                )}
              </div>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-700 sticky  text-white w-1/2 p-1 pr-5 mx-auto my-12 rounded-4xl border-amber-200 border flex">
          <input
            type="text"
            className="w-full p-2 bg-transparent outline-none"
            value={questions}
            onKeyDown={isEnter}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button type="submit" onClick={handleAskQuestions} className="ml-2">
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// import { useEffect, useRef, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import axios from "axios";
// import { URL } from "./Constants";
// import Answer from "./compo/Answer";
// import RecentSearch from "./compo/RecentSearch";
// function App() {
//   const [questions, setQuestions] = useState("");
//   const [result, setResult] = useState([]);
//   const [selectedHistory, setSelectedHistory] = useState();
//   const scrollToAns = useRef();
//   const [loading, setLoading] = useState(false);
//   const [recentHistory, setRecentHistory] = useState(() => {
//     const stored = localStorage.getItem("history");
//     try {
//       const parsed = JSON.parse(stored);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return [];
//     }
//   });

//   const handleAskQuestions = async () => {
//     if (!questions && !selectedHistory) {
//       return false;
//     }

//     if (questions) {
//       if (localStorage.getItem("history")) {
//         let history = JSON.parse(localStorage.getItem("history"));
//         history = [questions, ...history];
//         localStorage.setItem("history", JSON.stringify(history));
//         setRecentHistory(history);
//       } else {
//         localStorage.setItem("history", JSON.stringify([questions]));
//         setRecentHistory([questions]);
//       }
//     }
//     const payloadData = questions ? questions : selectedHistory;

//     const payload = {
//       contents: [
//         {
//           parts: [
//             {
//               text: questions,
//             },
//           ],
//         },
//       ],
//     };
//     console.log(questions); // assuming this is declared elsewhere
//     setLoading(true);
//     try {
//       const res = await axios.post(URL, payload);
//       let dataString = res?.data?.candidates[0]?.content?.parts[0]?.text;
//       dataString = dataString.split("* ");
//       dataString = dataString.map((x) => x.trim());
//       console.log(res);
//       setResult([
//         ...result,
//         { type: "q", text: questions ? questions : selectedHistory },
//         { type: "a", text: dataString },
//       ]);
//       setQuestions("");
//       // setTimeout(() => {
//       //   if (scrollToAns.current) {
//       //     scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
//       //   }
//       // }, 1500);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (scrollToAns.current) {
//       scrollToAns.current.scrollTo({
//         top: scrollToAns.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [result]);

//   const clearHistory = () => {
//     localStorage.clear();
//     setRecentHistory([]);
//   };

//   const isEnter = (e) => {
//     if (e.key === "Enter") {
//       handleAskQuestions();
//     }
//   };

//   useEffect(() => {
//     handleAskQuestions();
//   }, [selectedHistory]);

//   return (
//     <>
//       <div className="grid grid-cols-5 h-screen text-center">
//         {/* <RecentSearch clearHistory={clearHistory} recentHistory={recentHistory} setSelectedHistory={setSelectedHistory} /> */}
//         <div className="col-span-1 bg-zinc-900">
//           <div className="flex justify-center mt-1">
//             <h1 className="text-white p-2">Recent History</h1>
//             <button className=" cursor-pointer" onClick={clearHistory}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 height="20px"
//                 viewBox="0 -960 960 960"
//                 width="24px"
//                 fill="#e3e3e3"
//               >
//                 <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
//               </svg>
//             </button>{" "}
//           </div>
//           <ul className="text-left overflow-auto">
//             {recentHistory &&
//               recentHistory?.map((item, index) => (
//                 // <li
//                 //   className="p-1 pl-4 text-zinc-400 cursor-pointer hover:bg-zinc-500"
//                 //   key={index}
//                 //   onClick={() => setSelectedHistory(item)}
//                 // >
//                 //   {item}
//                 // </li>

//                 <li
//                   className="p-1 pl-4 text-zinc-400 cursor-pointer hover:bg-zinc-500 overflow-hidden whitespace-nowrap text-ellipsis"
//                   key={index}
//                   onClick={() => setSelectedHistory(item)}
//                 >
//                   {item}
//                 </li>
//               ))}
//           </ul>
//         </div>
//         <div className="col-span-4">
//           <h1 className="text-white mt-1 text-2xl">
//             Hello Rohit, Ask me Anything{" "}
//           </h1>
//           {loading && (
//             <>
//               <div role="status">
//                 <svg
//                   aria-hidden="true"
//                   className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
//                   viewBox="0 0 100 101"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                     fill="currentColor"
//                   />
//                   <path
//                     d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                     fill="currentFill"
//                   />
//                 </svg>
//                 <span className="sr-only">Loading...</span>
//               </div>
//             </>
//           )}

//           <div
//             ref={scrollToAns}
//             className="h-[calc(100vh-220px)] overflow-auto px-4"
//           >
//             <div className=" text-white mx-6 mt-5 ">
//               <ul>
//                 {result?.map((item, index) => (
//                   <div
//                     className={item.type == "q" ? "flex justify-end" : ""}
//                     key={index + Math.random()}
//                   >
//                     {item.type == "q" ? (
//                       <li
//                         key={index + Math.random()}
//                         className="text-right border w-fit border-zinc-700 bg-zinc-700 rounded-bl-3xl rounded-tl-3xl rounded-br-3xl"
//                       >
//                         <Answer
//                           ans={item.text}
//                           totalResult={1}
//                           index={index}
//                           type={item?.type}
//                         />
//                       </li>
//                     ) : (
//                       item.text.map((ansItem, ansIndex) => (
//                         <li
//                           key={ansIndex + Math.random()}
//                           className="text-left p-1"
//                         >
//                           <Answer
//                             ans={ansItem}
//                             totalResult={item.length}
//                             index={ansIndex}
//                             type={item?.type}
//                           />
//                         </li>
//                       ))
//                     )}
//                   </div>
//                 ))}
//               </ul>

//               {/* {result &&
//                 result?.map((item, index) => (
//                   <li key={index +Math.random()}>
//                     <Answer ans={item} totalResult={result?.length} index={index} />
//                   </li>
//                 ))} */}
//             </div>
//           </div>
//           <div className=" flex bg-zinc-700 text-white w-1/2 p-1 pr-5 m-auto rounded-4xl border-amber-200 border">
//             <input
//               type="text"
//               className="w-full h-full p-2 outline-none"
//               value={questions}
//               onKeyDown={isEnter}
//               onChange={(e) => setQuestions(e.target.value)}
//               placeholder="ask me Anything...."
//             ></input>
//             <button type="submit" onClick={handleAskQuestions}>
//               Ask
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

// import React, { useState } from "react";

// export default function App() {
//   const [todos, setTodos] = useState([]);
//   const [input, setInput] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [viewTodo, setViewTodo] = useState(null); // <-- for viewing a single todo

//   const handleAddTodo = () => {
//     if (!input.trim()) return;

//     if (editId !== null) {
//       setTodos(
//         todos.map((todo) =>
//           todo.id === editId ? { ...todo, text: input } : todo
//         )
//       );
//       setEditId(null);
//     } else {
//       const newTodo = {
//         id: Date.now(),
//         text: input,
//       };
//       setTodos([...todos, newTodo]);
//     }

//     setInput("");
//   };

//   const handleDelete = (id) => {
//     setTodos(todos.filter((todo) => todo.id !== id));
//   };

//   const handleEdit = (id) => {
//     const todo = todos.find((todo) => todo.id === id);
//     setInput(todo.text);
//     setEditId(id);
//   };

//   const handleView = (id) => {
//     const todo = todos.find((todo) => todo.id === id);
//     setViewTodo(todo);
//   };

//   const closeViewModal = () => setViewTodo(null);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
//         <h1 className="text-2xl font-bold mb-4 text-center">ToDo App</h1>

//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Enter a todo"
//             className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleAddTodo}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             {editId !== null ? "Update" : "Add"}
//           </button>
//         </div>

//         <ul className="space-y-2">
//           {todos.length === 0 && (
//             <li className="text-gray-500 text-center">No todos yet</li>
//           )}
//           {todos.map((todo) => (
//             <li
//               key={todo.id}
//               className="flex justify-between items-center bg-gray-50 p-2 rounded-md border"
//             >
//               <span className="text-gray-800 truncate w-2/5">{todo.text}</span>
//               <div className="flex gap-2 text-sm">
//                 <button
//                   onClick={() => handleView(todo.id)}
//                   className="text-green-600 hover:underline"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => handleEdit(todo.id)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(todo.id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>

//         {/* View Modal */}
//         {viewTodo && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
//               <h2 className="text-lg font-semibold mb-4">Todo Details</h2>
//               <p className="text-gray-700 mb-4">{viewTodo.text}</p>
//               <button
//                 onClick={closeViewModal}
//                 className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
//               >
//                 ×
//               </button>
//               <div className="text-right">
//                 <button
//                   onClick={closeViewModal}
//                   className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const [submittedData, setSubmittedData] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form Submitted:', formData);
//     setSubmittedData(prev => [...prev, formData]);
//     setFormData({ name: '', email: '', message: '' });
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
//       <div className="w-full max-w-2xl mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg">
//           <div>
//             <label className="block mb-1 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Message</label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               required
//               rows="4"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             ></textarea>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Submit
//           </button>
//         </form>

//         {/* Scrollable Output */}
//         {submittedData.length > 0 && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold mb-2 text-center">Submitted Data:</h3>
//             <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg max-h-60 overflow-y-auto space-y-4">
//               {submittedData.map((data, index) => (
//                 <div key={index} className="border-b border-green-300 pb-2 break-words">
//                   <p><strong>Name:</strong> {data.name}</p>
//                   <p><strong>Email:</strong> {data.email}</p>
//                   <p><strong>Message:</strong> {data.message}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
