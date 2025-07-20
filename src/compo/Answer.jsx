// import { useEffect, useState } from "react";
// import { CheckHeading, ReplaceHeadingStart } from "./helper";

// const Answer = ({ ans, index,totalResult ,type}) => {
//   const [heading, setHeading] = useState(false);
//     const [answer, setAnswer] = useState(ans);

//   useEffect(() => {
//     if (CheckHeading(ans)) {
//       setHeading(true);
//       setAnswer(ReplaceHeadingStart(ans));
//     }
//   }, []);

//   return (
//       <div className="text-start m-2 ">

//       {index == 0 && totalResult > 1 ? <span className=" text-2xl block">{answer}</span>:
//       heading ? <span className=" block text-lg">{answer}</span> :<span className={type == 'q'?'pl-1':'pl-5'}>{answer}</span>
//       }
//     </div>
//   );
// };

// export default Answer;

// import { useEffect, useState } from "react";
// import { CheckHeading, ReplaceHeadingStart } from "./helper";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// const Answer = ({ ans, index, totalResult, type }) => {
//   const [heading, setHeading] = useState(false);
//   const [answer, setAnswer] = useState(ans);

//   useEffect(() => {
//     if (CheckHeading(ans)) {
//       setHeading(true);
//       setAnswer(ReplaceHeadingStart(ans));
//     }
//   }, [ans]);

//   // If it's a heading or first line, render plain text
//   if (index === 0 && totalResult > 1) {
//     return <div className="text-start m-2"><span className="text-2xl block">{answer}</span></div>;
//   }

//   if (heading) {
//     return <div className="text-start m-2"><span className="block text-lg">{answer}</span></div>;
//   }

//   // Otherwise, render as Markdown with code support
//   return (
//  <div className={type === "q" ? "pl-1" : "pl-5"}>
//   <ReactMarkdown
//     components={{
//       code({ node, inline, className, children, ...props }) {
//         const match = /language-(\w+)/.exec(className || "");
//         const mergedClass = `bg-gray-800 text-white px-1 py-0.5 rounded ${props.className || ""}`;

//         return !inline && match ? (
//           <SyntaxHighlighter
//             style={oneDark}
//             language={match[1]}
//             PreTag="div"
//             {...props}
//           >
//             {String(children).replace(/\n$/, "")}
//           </SyntaxHighlighter>
//         ) : (
//           <code className={mergedClass} {...props}>
//             {children}
//           </code>
//         );
//       },
//     }}
//   >
//     {answer}
//   </ReactMarkdown>
// </div>

//   );
// };

// export default Answer;

// import { useEffect, useState } from "react";
// import { CheckHeading, ReplaceHeadingStart } from "./helper";
// import ReactMarkdown from "react-markdown";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import prettier from "prettier/standalone";
// import parserBabel from "prettier/plugins/babel";
// import parserEstree from "prettier/plugins/estree"; // 👈 this is the fix

// const Answer = ({ ans, index, totalResult, type }) => {
//   const [heading, setHeading] = useState(false);
//   const [answer, setAnswer] = useState(ans);

//   useEffect(() => {
//     if (CheckHeading(ans)) {
//       setHeading(true);
//       setAnswer(ReplaceHeadingStart(ans));
//     }
//   }, [ans]);

//   const formatCode = (code, lang) => {
//     try {
//       if (["js", "jsx", "javascript"].includes(lang)) {
//         return prettier.format(code, {
//           parser: "babel",
//           plugins: [parserBabel, parserEstree],
//         });
//       }
//     } catch (e) {
//       console.warn("Code formatting error:", e);
//     }
//     return code;
//   };

//   if (index === 0 && totalResult > 1) {
//     return (
//       <div className="text-start m-2">
//         <span className="text-2xl block">{answer}</span>
//       </div>
//     );
//   }

//   if (heading) {
//     return (
//       <div className="text-start m-2">
//         <span className="block text-lg">{answer}</span>
//       </div>
//     );
//   }

//   return (
//     <div className={`text-start m-2 ${type === "q" ? "pl-1" : "pl-5"}`}>
//       <ReactMarkdown
//         components={{
//           code({ node, inline, className, children, ...props }) {
//             const match = /language-(\w+)/.exec(className || "");
//             const codeString = String(children).replace(/\n$/, ""); // ✅ Ensure it's a string

//             if (!inline && match) {
//               return (
//                 <SyntaxHighlighter
//                   style={oneDark}
//                   language={match[1]}
//                   PreTag="div"
//                   {...props}
//                 >
//                   {codeString}
//                 </SyntaxHighlighter>
//               );
//             }

//             return (
//               <code
//                 className="bg-gray-800 text-white px-1 py-0.5 rounded"
//                 {...props}
//               >
//                 {codeString}
//               </code>
//             );
//           },
//         }}
//       >
//         {answer}
//       </ReactMarkdown>
//     </div>
//   );
// };

// export default Answer;




import { useEffect, useState } from "react";
import { CheckHeading, ReplaceHeadingStart } from "./helper";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import prettier from "prettier/standalone";
import parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";

const Answer = ({ ans, index, totalResult, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    const trimmed = ans.trim();
    const isCodeBlock = trimmed.startsWith("```") && trimmed.endsWith("```");

    // Only apply heading logic if not a full Markdown code block
    if (!isCodeBlock && CheckHeading(trimmed)) {
      setHeading(true);
      setAnswer(ReplaceHeadingStart(trimmed));
    } else {
      setHeading(false);
      setAnswer(ans);
    }
  }, [ans]);
const formatCode = (code, lang) => {
  try {
    if (
      typeof code === "string" &&
      ["js", "jsx", "javascript"].includes(lang)
    ) {
      const formatted = prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel, parserEstree],
      });

      return typeof formatted === "string" ? formatted : String(formatted);
    }
  } catch (e) {
    console.warn("Prettier error:", e);
  }

  return typeof code === "string" ? code : String(code ?? "");
};


  // Check for full code block on first line
  const isCodeBlockAtStart = answer.trim().startsWith("```");

  if (index === 0 && totalResult > 1 && !isCodeBlockAtStart) {
    return (
      <div className="text-start m-2">
        <span className="text-2xl block">{answer}</span>
      </div>
    );
  }

  if (heading) {
    return (
      <div className="text-start m-2">
        <span className="block text-lg">{answer}</span>
      </div>
    );
  }

  return (
    <div className={`text-start m-2 ${type === "q" ? "pl-1" : "pl-5"}`}>
    <ReactMarkdown
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const lang = match?.[1] || "";
      const rawCode = Array.isArray(children)
        ? children.join("")
        : String(children ?? "");

      if (!inline && lang) {
        return (
          <SyntaxHighlighter
            style={oneDark}
            language={lang}
            PreTag="div"
            {...props}
          >
            {rawCode}
          </SyntaxHighlighter>
        );
      }

      return (
        <code
          className="bg-gray-800 text-white px-1 py-0.5 rounded"
          {...props}
        >
          {rawCode}
        </code>
      );
    },
  }}
>
  {answer}
</ReactMarkdown>

    </div>
  );
};

export default Answer;
