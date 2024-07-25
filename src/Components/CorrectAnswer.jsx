import React, { useContext } from 'react'
import { DataCon } from '../Context/Context'

export function CorrectAnswer() {
    const { correctAnswer_2, op, setOP } = useContext(DataCon)
    return (
        <div className={`container ${op ? "fixed" : "hidden"} top-auto left-auto `}>
            <div className="w-[280px] h-[250px] bg-white rounded-lg flex items-center justify-between py-10 px-3 z-[9999] flex-col font-bold h11 text-center text-3xl">
                {correctAnswer_2 !== null && (
                    <p>Correct Answer: <span className='text-green-500'>{correctAnswer_2}</span></p>
                )}
                <button onClick={() => setOP(false)} className='px-[30px] py-[10px] bg-blue-500 text-white font-sans rounded-lg'>OK</button>
            </div>
        </div >
    )
}
