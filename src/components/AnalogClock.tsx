import React from 'react';
import styled from '@emotion/styled';

interface ClockProps {
  time: {
    hours: number;
    minutes: number;
  };
}

const ClockFace = styled.div`
  width: 200px;
  height: 200px;
  border: 8px solid #4a90e2;
  border-radius: 50%;
  position: relative;
  background: white;
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
`;

const ClockNumber = styled.div<{ $rotation: number }>`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform: rotate(${props => props.$rotation}deg);
  font-family: 'Quicksand', 'Comic Sans MS', 'Arial', sans-serif;
  font-size: 1.2rem;
  color: #2d3748;
  font-weight: 600;

  span {
    display: inline-block;
    transform: rotate(${props => -props.$rotation}deg);
    width: 24px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    top: 10px;
    left: calc(50% - 12px);
  }
`;

const ClockHand = styled.div<{ $rotation: number; $width: number; $height: number; $color: string }>`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background: ${props => props.$color};
  border-radius: 4px;
  transform: translateX(-50%) rotate(${props => props.$rotation}deg);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.2);
`;

const ClockCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #4a90e2, #7e57c2);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(74, 144, 226, 0.3);
`;

const AnalogClock: React.FC<ClockProps> = ({ time }) => {
  const hourRotation = ((time.hours % 12) * 30) + (time.minutes * 0.5); // 30 degrees per hour + 0.5 degrees per minute
  const minuteRotation = time.minutes * 6; // 6 degrees per minute

  return (
    <ClockFace>
      {[...Array(12)].map((_, i) => (
        <ClockNumber key={i} $rotation={i * 30}>
          <span>{i === 0 ? 12 : i}</span>
        </ClockNumber>
      ))}
      <ClockHand $rotation={hourRotation} $width={4} $height={60} $color="#4a90e2" />
      <ClockHand $rotation={minuteRotation} $width={3} $height={80} $color="#7e57c2" />
      <ClockCenter />
    </ClockFace>
  );
};

export default AnalogClock; 