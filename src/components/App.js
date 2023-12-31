import { useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Main';
import Start from './Start';
import Loader from './Loader';
import Error from './Error';
import Question from './Question';
import Next from './Next';
import Progress from './Progress';
import Finished from './Finished';
import Footer from './Footer';
import Timer from './Timer';

const initialState = {
  questions: [],
  // possible status: loading, error, ready, active, finished 
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  seconds: null
}

const SECS_QUESTION = 30

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      }
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      }
    case 'start':
      return {
        ...state,
        status: 'active',
        seconds: state.questions.length * SECS_QUESTION
      }
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }
    case 'finished':
      return {
        ...state,
        status: 'finished',
        highscore: state.points > state.highscore ? state.points : state.highscore
      }
    case 'reset':
      return {
        ...initialState,
        status: 'ready',
        questions: state.questions
      }
    case 'timer':
      return {
        ...state,
        seconds: state.seconds - 1,
        status: state.seconds === 0 ? 'finished' : state.status
      }
    default:
      throw new Error('Action unknown')
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore, seconds }, dispatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0)

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'dataFailed' }))
  }, [])

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <Start numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch} seconds={seconds} />
              <Next dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
            </Footer>
          </>
        }
        {status === 'finished' && <Finished points={points} maxPoints={maxPoints} highscore={highscore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;