import React from 'react';
import { motion } from 'framer-motion';
import { FaRoad, FaCheckCircle } from 'react-icons/fa';
import styled from 'styled-components';
import ActionButtons from '../common/ActionButtons';

const Card = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #00d2ff;
`;

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  flex: 1;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const Steps = styled.div`
  margin: 15px 0;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  color: #a0aec0;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  font-size: 0.8rem;
  color: #a0aec0;
`;

const Badge = styled.span`
  background: rgba(0, 210, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  color: #00d2ff;
`;

const RoadmapCard = ({ roadmap }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Header>
        <Icon>
          <FaRoad />
        </Icon>
        <Title>{roadmap.title}</Title>
      </Header>

      <Description>{roadmap.description}</Description>

      <MetaInfo>
        <Badge>{roadmap.level}</Badge>
        <Badge>{roadmap.duration}</Badge>
      </MetaInfo>

      <Steps>
        {roadmap.steps.slice(0, 3).map((step, idx) => (
          <Step key={idx}>
            <FaCheckCircle size={12} /> {step}
          </Step>
        ))}
        {roadmap.steps.length > 3 && (
          <Step>+{roadmap.steps.length - 3} more steps</Step>
        )}
      </Steps>

      <ActionButtons 
        item={roadmap} 
        type="roadmap"
      />
    </Card>
  );
};

export default RoadmapCard;