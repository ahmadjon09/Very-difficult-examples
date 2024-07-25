import React, { createContext, useState } from 'react'
export const DataCon = createContext()
export function Context({ children }) {
    const [correctAnswer_2, setCorrectAnswer_2] = useState(null)
    const [op, setOP] = useState(false)
    return <DataCon.Provider value={{ correctAnswer_2, setCorrectAnswer_2, op, setOP }}>{children}</DataCon.Provider>
}
