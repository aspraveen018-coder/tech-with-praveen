import React from 'react';
import { motion } from 'framer-motion';
import { FaLink } from 'react-icons/fa';
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

const Title = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 15px;
`;

const LinksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
`;

const Link = styled.a`
  color: #a0aec0;
  text-decoration: none;
  padding: 8px 12px;
  background: rgba(0, 210, 255, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.1);
    color: #00d2ff;
  }
`;

const ResourceCard = ({ resource }) => {
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Title>{resource.title}</Title>
      
      <LinksList>
        {resource.links.map((link, index) => (
          <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            <FaLink size={12} /> {link.text}
          </Link>
        ))}
      </LinksList>

      <ActionButtons 
        item={resource} 
        type="resource"
      />
    </Card>
  );
};

export default ResourceCard;