import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Toolbar from './Toolbar';
import Config from '../Config'; // Import your configuration for the baseURL

function HomePage() {
  const [questions, setQuestions] = useState([]);
  const [difficultyValues, setDifficultyValues] = useState([]);

  useEffect(() => {
    // Fetch questions from the backend when the component mounts
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${Config.baseURL}/api/questions/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${yourToken}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          setDifficultyValues(data.map(() => 1));
        } else {
          console.error('Failed to fetch questions:', response.status);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleDifficultyChange = (index, value) => {
    const newValues = [...difficultyValues];
    newValues[index] = value;
    setDifficultyValues(newValues);
  };

  return (
    <div className="home-container">
      <Toolbar />
      <div className="home-content">
        <h1>Questions</h1>
        <table className="questions-table">
          <thead>
            <tr>
              <th>QNo.</th>
              <th>Question Name</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Correct Answer</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/question/${question.id}`}>{question.question_name}</Link>
                </td>
                <td>{question.subject}</td>
                <td>{question.topic}</td>
                <td>{question.correct_answer}</td>
                <td>
                  <div className="difficulty-meter">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      className="difficulty-input"
                      value={difficultyValues[index]}
                      onChange={(e) => handleDifficultyChange(index, e.target.value)}
                    />
                    <span className="difficulty-number">{difficultyValues[index]}</span>
                  </div>
                </td>
                <td className="actions-cell">
                  <Link to={`/comments/${question.id}`}>
                    <button className="comment-button">Comment</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
