import { useEffect, useState } from "react";
import { CheckHeading, ReplaceHeadingStart } from "./helper";

const Answer = ({ ans, index,totalResult ,type}) => {
  const [heading, setHeading] = useState(false);
    const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (CheckHeading(ans)) {
      setHeading(true);
      setAnswer(ReplaceHeadingStart(ans));
    }
  }, []);

  
  return (
      <div className="text-start m-2 ">
        {/* <>{heading ? <span className="pt-2 block text-lg">{answer}</span> : <span className="pl-3 text-sm">{answer}</span>}</> */}
      

      {index == 0 && totalResult > 1 ? <span className=" text-2xl block">{answer}</span>:
      heading ? <span className=" block text-lg">{answer}</span> :<span className={type == 'q'?'pl-1':'pl-5'}>{answer}</span>
      }
    </div>
  );
};

export default Answer;
