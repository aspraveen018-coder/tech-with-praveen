import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #030614, #0a0f1f);
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 210, 255, 0.1);
  border-top-color: #00d2ff;
  border-right-color: #3a7bd5;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  margin-top: 20px;
  color: #a0aec0;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
      <Message>{message}</Message>
    </SpinnerContainer>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string
};

export default LoadingSpinner;