import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaSave,
  FaInstagram,
  FaTelegram,
  FaYoutube,
  FaLinkedin,
  FaDiscord,
  FaTwitter,
  FaEdit
} from 'react-icons/fa';
import styled from 'styled-components';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: white;
`;

const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const CommunityCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.color || 'linear-gradient(135deg, #00d2ff, #3a7bd5)'};
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.15);

    &:before {
      transform: translateX(100%);
    }
  }
`;

const CardIcon = styled.div`
  width: 70px;
  height: 70px;
  background: ${props => props.bg || 'rgba(0, 210, 255, 0.1)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${props => props.color || '#00d2ff'};
  margin: 0 auto 15px;
`;

const PlatformName = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const PlatformUrl = styled.a`
  color: #a0aec0;
  font-size: 0.9rem;
  text-decoration: none;
  display: block;
  margin-bottom: 15px;
  word-break: break-all;
  
  &:hover {
    color: #00d2ff;
  }
`;

const EditButton = styled(motion.button)`
  background: rgba(0, 210, 255, 0.1);
  border: none;
  color: #00d2ff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.2);
    transform: scale(1.05);
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
  padding: 30px;
  background: rgba(10, 20, 40, 0.4);
  border-radius: 15px;
  border: 1px solid rgba(0, 210, 255, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.h3`
  font-size: 1.8rem;
  color: #00d2ff;
  margin-bottom: 5px;
`;

const StatLabel = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled(motion.button)`
  padding: 12px 25px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const CancelButton = styled(motion.button)`
  padding: 12px 25px;
  background: transparent;
  border: 2px solid #a0aec0;
  color: #a0aec0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
`;

const AdminCommunity = () => {
  const { community, updateCommunity } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [formData, setFormData] = useState({ platform: '', url: '' });

  const platforms = [
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: community.instagram,
      color: '#E4405F',
      bg: 'rgba(228, 64, 95, 0.1)',
      key: 'instagram'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: community.telegram,
      color: '#0088cc',
      bg: 'rgba(0, 136, 204, 0.1)',
      key: 'telegram'
    },
    {
      name: 'YouTube',
      icon: <FaYoutube />,
      url: community.youtube,
      color: '#FF0000',
      bg: 'rgba(255, 0, 0, 0.1)',
      key: 'youtube'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin />,
      url: community.linkedin,
      color: '#0077B5',
      bg: 'rgba(0, 119, 181, 0.1)',
      key: 'linkedin'
    },
    {
      name: 'Discord',
      icon: <FaDiscord />,
      url: community.discord,
      color: '#5865F2',
      bg: 'rgba(88, 101, 242, 0.1)',
      key: 'discord'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: community.twitter,
      color: '#1DA1F2',
      bg: 'rgba(29, 161, 242, 0.1)',
      key: 'twitter'
    }
  ];

  const handleOpenModal = (platform) => {
    setEditingPlatform(platform);
    setFormData({
      platform: platform.key,
      url: platform.url || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlatform(null);
    setFormData({ platform: '', url: '' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    updateCommunity(formData.platform, formData.url);
    handleCloseModal();
    toast.success('Community link updated successfully');
  };

  const stats = [
    { value: '50K+', label: 'Instagram Followers' },
    { value: '25K+', label: 'Telegram Members' },
    { value: '100K+', label: 'YouTube Subscribers' },
    { value: '30K+', label: 'LinkedIn Followers' }
  ];

  return (
    <Container>
      <Header>
        <Title>Manage Community Links</Title>
      </Header>

      <CommunityGrid>
        {platforms.map((platform, index) => (
          <CommunityCard
            key={platform.name}
            color={platform.color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CardIcon color={platform.color} bg={platform.bg}>
              {platform.icon}
            </CardIcon>
            <PlatformName>{platform.name}</PlatformName>
            {platform.url ? (
              <PlatformUrl href={platform.url} target="_blank" rel="noopener noreferrer">
                {platform.url.replace(/^https?:\/\//, '')}
              </PlatformUrl>
            ) : (
              <PlatformUrl style={{ color: '#ff6b6b' }}>Not set</PlatformUrl>
            )}
            <EditButton
              onClick={() => handleOpenModal(platform)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit Link
            </EditButton>
          </CommunityCard>
        ))}
      </CommunityGrid>

      <StatsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {stats.map((stat, index) => (
          <StatItem key={index}>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Edit ${editingPlatform?.name} Link`}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              {editingPlatform?.icon} {editingPlatform?.name} URL
            </Label>
            <Input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder={`https://${editingPlatform?.name.toLowerCase()}.com/techwithpraveen`}
              required
            />
          </FormGroup>

          <FormActions>
            <CancelButton
              type="button"
              onClick={handleCloseModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSave /> Update Link
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminCommunity;