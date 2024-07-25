import React, { useState, useEffect, useContext } from 'react';
import { Check, GearSix, List, Repeat, Timer, X } from 'phosphor-react';
import { DataCon } from './Context/Context';
import { CorrectAnswer } from './Components/CorrectAnswer';

function App() {
  const initialLvl = {
    easy: parseInt(localStorage.getItem('lvl_easy')) || 1,
    medium: parseInt(localStorage.getItem('lvl_medium')) || 1,
    hard: parseInt(localStorage.getItem('lvl_hard')) || 1,
  };

  const [lvl, setLvl] = useState(initialLvl);
  const [time, setTime] = useState(60);
  const [start, setStart] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [answer, setAnswer] = useState("");
  const [ask_1, setAsk_1] = useState(null);
  const [ask_2, setAsk_2] = useState(null);
  const [ask_3, setAsk_3] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [color, setColor] = useState(null);
  const [login, setLogin] = useState(localStorage.getItem("Login") || false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem("userAvatar") || "");
  const [mony, setMony] = useState(localStorage.getItem("mony") || 0)
  const { correctAnswer_2, setOP, setCorrectAnswer_2 } = useContext(DataCon);
  const [nav, setNav] = useState(false)

  useEffect(() => {
    if (start) {
      resetQuestion();
      if (difficulty === 'easy') {
        setColor("bg-green-500");
        setTime(60);
      } else if (difficulty === 'medium') {
        setColor("bg-yellow-500");
        setTime(30);
      } else if (difficulty === 'hard') {
        setColor("bg-red-500");
        setTime(10);
      }
    }
  }, [start, difficulty]);

  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            alert("Time's up!");
            resetLevelAndStop();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [start, time, difficulty]);

  const resetLevelAndStop = () => {
    setLvl({ ...lvl, [difficulty]: 1 });
    localStorage.setItem(`lvl_${difficulty}`, 1);
    setStart(false);
  };

  const timeForDifficulty = (diff) => {
    if (diff === 'easy') return 60;
    else if (diff === 'medium') return 30;
    else if (diff === 'hard') return 10;
    return 60;
  };

  const generateQuestion = () => {
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
    setCorrectAnswer_2(N)
  };

  const handleNumberClick = (value) => {
    setAnswer(prevAnswer => prevAnswer + value);
  };

  const handleCheckAnswer = () => {
    if (parseInt(answer) === correctAnswer) {
      const newLvl = { ...lvl, [difficulty]: lvl[difficulty] + 1 };
      setLvl(newLvl);
      alert("Correct!");
      localStorage.setItem(`lvl_${difficulty}`, newLvl[difficulty]);
      let reward = 0;
      if (difficulty) {
        if (difficulty === "easy") {
          reward = 5;
        } else if (difficulty === "medium") {
          reward = 10;
        } else if (difficulty === "hard") {
          reward = 15;
        }
        setMony(+mony + reward);
      }
    } else {
      alert("Incorrect");
    }
    resetQuestion();
  };

  const resetQuestion_2 = () => {
    if (+mony >= 10) {
      setAnswer("");
      generateQuestion();
      setTime(timeForDifficulty(difficulty));
      setMony(+mony - 10)
    } else {
      alert("You don't have enough money!");
    }
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

  useEffect(() => {
    localStorage.setItem("mony", mony);
  }, [mony]);
  useEffect(() => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userAvatar", userAvatar);
  }, [userName, userAvatar])

  const handleLogin = () => {
    if (!userName || !userAvatar) {
      alert('Please fill in all fields!');
      return;
    }
    else {
      localStorage.setItem("Login", true);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userAvatar", userAvatar);
      localStorage.setItem("mony", mony);
      setLogin(true);
    }
  };

  const handleLogout = () => {
    const d = window.confirm("Want to update or delete your account?")
    if (d) {
      localStorage.clear();
      setLogin(false);
      setUserName("");
      setUserAvatar("");
      setLvl({ easy: 1, medium: 1, hard: 1 });
      setStart(false);
    }
  };

  const correctAnswer_Funk = () => {
    if (mony >= 30) {
      setOP(true)
      setMony(+mony - 30)
    }
    else {
      alert("You don't have enough money!");
    }
  }

  return (
    <section>
      {!login ? (
        <div className="container bg-blue-300 max-h-screen flex w-full h-full justify-center gap-10 items-center flex-col">
          <h2 className='text-3xl font-bold h11 text-red-500'>Login:</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full h-10 px-5 rounded-xl"
          />
          <input
            type="text"
            placeholder="Please paste image URL or write null"
            value={userAvatar}
            onChange={(e) => setUserAvatar(e.target.value)}
            className="w-full h-10 px-5 rounded-xl"
          />
          <button className='bg-blue-500 w-full rounded-xl text-white py-2' onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          {!start && (
            <div className="container bg-blue-300 items-center justify-center flex flex-col rounded-lg1">
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
              <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">Logout</button>
            </div>
          )}
          {start && (
            <div className="container bg-blue-300 rounded-lg1">
              <nav className='w-full h-[70px] flex items-center justify-between'>
                <p className='text-2xl flex items-center gap-1'>
                  <Timer weight='bold' />
                  00:{time < 10 ? `0${time}` : time}
                </p>
                <p className='h-full text-xl flex items-center justify-center gap-1'><img width={"30px"} src="../img/coin.png" alt="m" /> {mony}</p>
                {nav ? (
                  <X onClick={() => setNav(!nav)} className='text-3xl' />
                ) : (
                  <List onClick={() => setNav(!nav)} className='text-3xl' />
                )}
              </nav>
              <nav className={`w-[70%] h-full z-10 container  aa ${nav ? "left-0" : "-left-full"} bg-blue-900 top-0 fixed pt-10`}>
                <div className="flex items-center flex-col">
                  <img
                    src={userAvatar.slice(0, 8) === "https://" ? userAvatar : "../img/avatar_1.png"}
                    alt="User Avatar"
                    className="w-[60px] h-[60px] rounded-full mr-2"
                  />

                  <div className='w-[100px] text-center overflow-hidden'>
                    {userName.length > 8 ? (
                      <marquee className='text-white font-mono text-xl' >{userName}</marquee>
                    ) : (
                      <h1 className='text-white font-mono text-xl'>{userName}</h1>
                    )}
                  </div>
                </div>
                <br />
                <div className='w-full gap-2 flex items-center justify-around flex-col'>
                  <h1 className='text-white'>Your Name:</h1>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className='w-full h-10 px-5'

                  />
                  <h1 className='text-white'>Your Avatar_URL:</h1>
                  <input
                    type="text"
                    placeholder="Please paste image URL or write null"
                    value={userAvatar}
                    onChange={(e) => setUserAvatar(e.target.value)}
                    className='w-full h-10 px-5'
                  />
                </div>
                <br />
                <h1 className='text-white text-center'>Your Lvls:</h1>
                <div className='w-full h-[45px] flex  items-center justify-between px-3 rounded-lg bg-yellow-400'>
                  <p className={`w-[60px] h-[20px] rounded-lg flex items-center justify-center text-white ${color}`}>{difficulty}</p>
                  lvl: {lvl[difficulty]}</div>
                <br />
                <button className='w-[100px] h-[40px] text-xs flex items-center justify-center mx-auto bg-red-500 text-white rounded-lg'>Delete Account!</button>
              </nav>
              <br />
              <p className='text-3xl h11 text-yellow-500'>Question :</p>
              <br />
              <div className='w-full bg-white rounded-lg h-[50px] text-3xl border border-gray-500 flex items-center justify-center'>
                <div className='text-3xl text-center text-nowrap h11 overflow-hidden max-h-full max-w-full'>
                  {ask_1} {ask_3} {ask_2} = {answer.length > 0 ? answer : "?"}
                </div>
              </div>
              <CorrectAnswer />
              <br />
              <div className='w-full rounded-lg flex-col h-[300px] border border-gray-500 flex items-center justify-center'>
                <div className="w-full h-[50px] flex items-center justify-center">
                  <div className='text-3xl h11 max-h-full max-w-full overflow-hidden text-center text-nowrap'>{answer}</div>
                </div>
                <div className='w-full h11 px-3 h-[250px] flex items-center justify-around gap-1 flex-wrap'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "-"].map((num) => (
                    <button
                      key={num}
                      value={num}
                      onClick={() => handleNumberClick(num)}
                      className='w-[50px] flex active:scale-90 items-center justify-center text-xl font-bold h-[50px] rounded-lg border-[2px] text-red-600 border-yellow-400'
                    >
                      {num}
                    </button>
                  ))}
                  <div className='w-full flex justify-around items-center'>
                    <button onClick={handleCheckAnswer} className='w-[50px] bg-green-500 text-white flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg'>
                      <Check className='hover:rotate-[360deg] transition-all ' />
                    </button>
                    <button onClick={() => setAnswer("")} className='w-[50px] flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg bg-red-500 text-white'>
                      <X className='hover:rotate-[360deg] transition-all ' />
                    </button>
                    <button onClick={resetQuestion_2} className='relative w-[50px] flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg bg-red-500 text-white'>
                      <Repeat className='hover:rotaterotate-[360deg] transition-all ' />
                      <div className='w-[30px] rounded-full text-[15px] -top-5 -right-3 h-[30px] bg-yellow-400 flex items-center justify-center absolute'>
                        <h1 className='font-serif'>-10</h1>
                      </div>
                    </button>
                    <button onClick={() => correctAnswer_Funk()} className='relative w-[50px] flex active:scale-90 items-center justify-center text-3xl font-bold h-[50px] rounded-lg bg-red-500 text-white'>
                      <img className='p-1' src='https://cdn-icons-png.flaticon.com/256/8832/8832725.png' alt="hint-icon" />
                      <div className='w-[30px] rounded-full text-[15px] -top-5 -right-3 h-[30px] bg-yellow-400 flex items-center justify-center absolute'>
                        <h1 className='font-serif'>-30</h1>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default App;
