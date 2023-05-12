import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import "./App.css"

Modal.setAppElement('#root');

function App() {

  const [todoCards, setTodoCards] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/getAllTodoCards')
      .then(res => setTodoCards(res.data))
      .catch(err => console.log(err));
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
    setTaskName('');
    setComment('');
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!taskName || !comment) {
      alert("Please fill all the fields!")
      return;
    }

    axios.post('http://localhost:3001/addtodoCard', { taskName, comment, date: new Date() })
      .then(res => {
        setTodoCards([...todoCards, res.data]);
        closeModal();
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='page'>
    <button className='add-button' onClick={openModal}>ADD TODO CARD</button>

    <div className='card-added'>
    <ul>
      {todoCards.map(todoCard => (
        <div className='new-card'>
        <li key={todoCard.id}>
          <h4 className='task'>{todoCard.taskName}</h4>
          <p className='date'>{new Date(todoCard.date).toLocaleString()}</p>
          <p className='comment'>{todoCard.comment}</p>
        </li>
        </div>
      ))}
    </ul>
    </div>
    

    <Modal className="modal-open" isOpen={modalIsOpen} onRequestClose={closeModal}>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} />
        </label>

        <br />

        <label>
          Comment:
          <input type="text" value={comment} onChange={e => setComment(e.target.value)} />
        </label>

        <br />

        <button className='submit-button' type="submit" disabled={!taskName || !comment}>Submit</button>
      </form>
      </Modal>

    </div>
  );
}

export default App;
