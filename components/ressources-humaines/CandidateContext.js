import React, { createContext, useState, useEffect } from 'react';

export const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
    const [candidats, setCandidats] = useState([]);

    useEffect(() => {
        // Load candidates from local storage if available
        if (typeof window !== 'undefined') {
            const savedCandidates = localStorage.getItem('candidats');
            if (savedCandidates) {
                setCandidats(JSON.parse(savedCandidates));
            }
        }
    }, []);

    useEffect(() => {
        // Save candidates to local storage whenever they change
        if (typeof window !== 'undefined') {
            localStorage.setItem('candidats', JSON.stringify(candidats));
            console.log('Candidates saved to local storage:', candidats);
        }
    }, [candidats]);

    return (
        <CandidateContext.Provider value={{ candidats, setCandidats }}>
            {children}
        </CandidateContext.Provider>
    );
};
