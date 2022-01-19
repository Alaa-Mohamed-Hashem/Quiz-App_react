import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = 'https://opentdb.com/api.php?';

const url = '';

const AppContext = React.createContext({});

const AppProvider = ({ children }) => {
  // state
  const [waiting, setWaitiing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(false);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
  });

  // functions
  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaitiing(false)

    const response = await axios(url).catch(err => {
      console.log(err);
    });

    if (response) {
      const data = response.data.results;

      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setWaitiing(false);
        setError(false);
      } else {
        setWaitiing(true);
        setError(true);
      }

    } else {
      setWaitiing(true);
    }

  };

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;
      if (index > questions.length - 1) {
        openModal();
        return 0
      }
      return index
    })
  };

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1)
    }
    nextQuestion();
  };

  const openModal = () => {
    setIsModelOpen(true);
  };

  const closeModal = () => {
    setWaitiing(true);
    setCorrect(0)
    setIsModelOpen(false);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({ ...quiz, [name]: value });

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { amount, category, difficulty } = quiz;

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    
    fetchQuestions(url);
  };

  return <AppContext.Provider value={{
    waiting,
    loading,
    questions,
    index,
    correct,
    error,
    isModelOpen,
    nextQuestion,
    checkAnswer,
    closeModal,
    quiz,
    handleChange,
    handleSubmit,
  }}>
    {children}
  </AppContext.Provider>
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
};

export { AppContext, AppProvider };
