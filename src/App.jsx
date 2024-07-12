import React, { useState, useEffect } from 'react';
import { Check, Repeat, Timer, X } from 'phosphor-react';

function App() {
  const [lvl, setLvl] = useState(1);
  const [time, setTime] = useState(60);
  const [start, setStart] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [answer, setAnswer] = useState("");
  const [ask_1, setAsk_1] = useState(null);
  const [ask_2, setAsk_2] = useState(null);
  const [ask_3, setAsk_3] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (start) {
      resetQuestion();
      if (difficulty === 'easy') {
        setColor("bg-green-500")
        setTime(60);
      }
      else if (difficulty === 'medium') {
        setColor("bg-yellow-500")
        setTime(30);
      }
      else if (difficulty === 'hard') {
        setColor("bg-red-500")
        setTime(20);
      }
    }
  }, [start, difficulty]);

  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert("Time's up");
            resetQuestion();
            return timeForDifficulty(difficulty);
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [start, time, difficulty]);

  function timeForDifficulty(diff) {
    if (diff === 'easy') return 60;
    else if (diff === 'medium') return 30;
    else if (diff === 'hard') return 20;
    return 60;
  }

  function generateQuestion() {
    const ask1 = Math.floor(Math.random() * 100);
    const ask2 = Math.floor(Math.random() * 100);
    setAsk_1(ask1);
    setAsk_2(ask2);

    const A = ask1 + ask2;
    const B = ask1 - ask2;
    const C = ask1 * ask2;
    const S = [A, B, C];
    const N = S[Math.floor(Math.random() * S.length)];
    setCorrectAnswer(N);
    if (N === A) {
      setAsk_3("+");
    } else if (N === B) {
      setAsk_3("-");
    } else if (N === C) {
      setAsk_3("*");
    }
  }

  const handleNumberClick = (value) => {
    setAnswer(prevAnswer => prevAnswer + value);
  };

  const handleCheckAnswer = () => {
    if (parseInt(answer) === correctAnswer) {
      alert("Correct");
      setLvl(prevLvl => prevLvl + 1);
    } else {
      alert("Incorrect");
    }
    resetQuestion();
  };

  const resetQuestion = () => {
    setAnswer("");
    generateQuestion();
    setTime(timeForDifficulty(difficulty));
  };

  const handleStart = (diff) => {
    setDifficulty(diff);
    setStart(true);
  };

  return (
    <section>
      {!start && (
        <div className="container items-center justify-center flex flex-col rounded-lg1">
          <div className="flex flex-col items-center">
            <h1 className='text-5xl text-center h11'><span className='text-green-500'>Very</span> <span className='text-yellow-500'>Difficult</span> <span className='text-red-500'>Examples</span></h1>
            <br />
            <h1 className='text-5xl h11 flex gap-1'><span className='text-green-500'>V</span>.<span className='text-yellow-500'>D</span>.<span className='text-red-400'>E</span></h1>
          </div>
          <br /><br />
          <h1 className="text-3xl mb-4 h11 text-center">Select Difficulty:</h1>
          <div className="flex justify-around">
            <button onClick={() => handleStart('easy')} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Easy</button>
            <button onClick={() => handleStart('medium')} className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2">Medium</button>
            <button onClick={() => handleStart('hard')} className="bg-red-500 text-white px-4 py-2 rounded-lg">Hard</button>
          </div>
        </div>
      )}
      {start && (
        <div className="container rounded-lg1">
          <nav className='w-full h-[50px] flex items-center justify-between'>
            <p className='text-3xl flex items-center gap-1'>
              <Timer weight='bold' />
              00:{time < 10 ? `0${time}` : time}
            </p>
            <p className={`w-[70px] h-[40px] rounded-lg flex items-center justify-center text-white ${color}`}>{difficulty}</p>
            <p className='px-5 py-2 rounded-lg bg-yellow-400'>lvl: {lvl}</p>
          </nav>
          <br />
          <p className='text-3xl h11'>Question :</p>
          <div className='w-full h-[100px] flex items-center justify-center'>
            <div className='text-2xl rounded-lg font-bold overflow-hidden bg-yellow-400 w-full h-full flex items-center justify-center gap-1'>
              <p>{ask_1}</p>
              <p>{ask_3}</p>
              <p>{ask_2}</p>
              <p>=</p>
              <p>{answer.length > 0 ? answer : "?"}</p>
            </div>
          </div>
          <br />
          <div className='w-full rounded-lg flex-col h-[300px] border border-gray-500 flex items-center justify-center'>
            <div className="w-full h-[50px] flex items-center justify-center">
              <div className='text-3xl'>{answer}</div>
            </div>
            <div className='w-full px-3 h-[250px] flex items-center justify-around gap-1 flex-wrap'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                  key={num}
                  value={num}
                  onClick={() => handleNumberClick(num)}
                  className='w-[50px] flex active:scale-90 items-center justify-center text-lg font-bold h-[50px] rounded-lg border border-black'
                >
                  {num}
                </button>
              ))}
              <div className='w-full flex justify-around items-center'>
                <button onClick={handleCheckAnswer} className='w-[50px] bg-green-500 text-white flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg'>
                  <Check />
                </button>
                <button onClick={() => setAnswer("")} className='w-[50px] flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg bg-red-500 text-white'>
                  <X />
                </button>
                <button onClick={resetQuestion} className='w-[50px] flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg bg-red-500 text-white'>
                  <Repeat />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
