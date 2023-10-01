import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, faceLocations }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto' />
        {faceLocations && faceLocations.map((location, index) => (
          <div
            key={index}
            className='bounding-box'
            style={{
              top: location.topRow,
              right: location.rightCol,
              bottom: location.bottomRow,
              left: location.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;