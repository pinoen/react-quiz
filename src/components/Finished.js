import React from 'react'

const Finished = ({ points, maxPoints, highscore, dispatch }) => {
  const effectivity = Math.ceil((points / maxPoints) * 100)
  let emoji;
  if (effectivity >= 80) emoji = '🥇️';
  else if (effectivity >= 50 && effectivity < 80) emoji = '🥈️';
  else if (effectivity >= 30 && effectivity < 50) emoji = '🥉️';
  else emoji = '🤔️'

  return (
    <>
      <p className='result'>Your score: <strong>{points}</strong> out of {maxPoints} points</p>
      <p className='result'>Effectivity: {effectivity}% <span>{emoji}</span></p>
      <p className='highscore'>Highscore: {highscore}</p>
      <button className='btn btn-ui' onClick={() => dispatch({ type: 'reset' })}>Reset quiz</button>
    </>
  )
}

export default Finished