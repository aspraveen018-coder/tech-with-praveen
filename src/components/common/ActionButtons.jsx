import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaBookmark, FaRegHeart, FaRegBookmark } from 'react-icons/fa';
import styled from 'styled-components';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import { useData } from '../../hooks/useData';
import toast from 'react-hot-toast';

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' 
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? '#00d2ff' : 'rgba(0, 210, 255, 0.2)'};
  color: ${props => props.active ? 'white' : '#a0aec0'};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' 
      : 'rgba(0, 210, 255, 0.1)'};
    color: ${props => props.active ? 'white' : '#00d2ff'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1rem;
  }
`;

const Count = styled.span`
  font-size: 0.8rem;
  margin-left: 4px;
  color: inherit;
`;

const ActionButtons = ({ item, type, onActionComplete }) => {
  const { user, isAuthenticated } = useGoogleAuth();
  const { 
    toggleSave, 
    toggleLike, 
    isItemSaved, 
    isItemLiked,
    addToHistory 
  } = useData();

  const isSaved = user ? isItemSaved(user.email, item.id) : false;
  const isLiked = user ? isItemLiked(user.email, item.id) : false;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save items');
      return;
    }

    await toggleSave(user.email, {
      id: item.id,
      title: item.title || item.name || item.company,
      type: type,
      url: item.url || item.applyLink || item.downloadUrl || '#',
      image: item.image || item.picture,
      metadata: {
        company: item.company,
        role: item.role,
        description: item.description,
        date: item.date,
        time: item.time
      }
    });

    if (onActionComplete) onActionComplete();
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to like items');
      return;
    }

    await toggleLike(user.email, {
      id: item.id,
      title: item.title || item.name || item.company,
      type: type,
      url: item.url || item.applyLink || item.downloadUrl || '#',
      image: item.image || item.picture,
      metadata: {
        company: item.company,
        role: item.role,
        description: item.description,
        date: item.date,
        time: item.time
      }
    });

    if (onActionComplete) onActionComplete();
  };

  const handleView = () => {
    if (isAuthenticated && user) {
      addToHistory(user.email, {
        id: item.id,
        title: item.title || item.name || item.company,
        type: type,
        url: item.url || item.applyLink || item.downloadUrl || '#',
        metadata: {
          company: item.company,
          role: item.role,
          description: item.description
        }
      });
    }
  };

  return (
    <ButtonsContainer onClick={handleView}>
      <ActionButton
        onClick={handleLike}
        active={isLiked}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isLiked ? 'Unlike' : 'Like'}
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
        Like
        {item.likes > 0 && <Count>({item.likes})</Count>}
      </ActionButton>
      
      <ActionButton
        onClick={handleSave}
        active={isSaved}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isSaved ? 'Unsave' : 'Save'}
      >
        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        Save
        {item.saves > 0 && <Count>({item.saves})</Count>}
      </ActionButton>
    </ButtonsContainer>
  );
};

export default ActionButtons;