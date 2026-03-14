import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleAuth } from '../../contexts/GoogleAuthContext';
import { useData } from '../../hooks/useData';
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaBriefcase,
  FaHistory,
  FaBookmark,
  FaHeart,
  FaCamera,
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaTrash
} from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #030614 0%, #0a0f1f 100%);
  padding: 100px 20px 40px;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 30px;
  background: rgba(10, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 50px;
  padding: 12px 25px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1rem;
  z-index: 100;

  &:hover {
    border-color: #00d2ff;
    color: #00d2ff;
  }
`;

const ProfileCard = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(10, 20, 40, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const CoverPhoto = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  position: relative;
  opacity: 0.8;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -75px;
  padding: 0 30px 30px;
  position: relative;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 50%;
  border: 5px solid #00d2ff;
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.3);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
`;

const AvatarEditOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 5px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const UserEmail = styled.p`
  color: #a0aec0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
`;

const Profession = styled.div`
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.3);
  padding: 12px 30px;
  border-radius: 50px;
  color: #00d2ff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  color: #00d2ff;
  font-weight: 700;
`;

const StatLabel = styled.div`
  color: #a0aec0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 30px;
  background: rgba(0, 210, 255, 0.02);
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(0, 210, 255, 0.1);
`;

const InfoIcon = styled.div`
  width: 45px;
  height: 45px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
  font-size: 1.3rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.p`
  color: #a0aec0;
  font-size: 0.8rem;
  margin-bottom: 3px;
`;

const InfoValue = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: 500;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 30px 30px 0;
`;

const Tab = styled(motion.button)`
  background: ${props => props.active ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'transparent'};
  border: 2px solid ${props => props.active ? 'transparent' : 'rgba(0, 210, 255, 0.3)'};
  color: ${props => props.active ? 'white' : '#a0aec0'};
  padding: 12px 35px;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #00d2ff, #3a7bd5)' : 'rgba(0, 210, 255, 0.1)'};
    color: ${props => props.active ? 'white' : '#00d2ff'};
    transform: translateY(-2px);
  }
`;

const ContentArea = styled.div`
  padding: 30px;
  min-height: 400px;
`;

const ContentItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(0, 210, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 210, 255, 0.05);
    transform: translateX(5px);
    border-color: #00d2ff;
  }
`;

const ItemIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
  font-size: 1.5rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 5px;
`;

const ItemMeta = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemType = styled.span`
  background: rgba(0, 210, 255, 0.1);
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #00d2ff;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionIcon = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.active ? '#ff6b6b' : '#a0aec0'};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    color: ${props => props.active ? '#ff6b6b' : '#00d2ff'};
    background: rgba(0, 210, 255, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #a0aec0;

  svg {
    font-size: 4rem;
    color: #00d2ff;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
`;

const ExploreButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
  }
`;

const EditProfileButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 40px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 30px auto;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const EditForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00d2ff;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SaveBtn = styled(motion.button)`
  flex: 1;
  padding: 15px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const CancelBtn = styled(motion.button)`
  flex: 1;
  padding: 15px;
  background: transparent;
  border: 2px solid #a0aec0;
  color: #a0aec0;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }
`;

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useGoogleAuth();
  const { 
    getSavedItems, 
    getLikedItems, 
    getUserHistory,
    toggleSave,
    toggleLike 
  } = useData();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('saved');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profession: user?.profession || 'Tech Professional',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      toast.error('Please login to view profile');
    }
  }, [user, navigate]);

  if (!user) return null;

  const savedItems = getSavedItems ? getSavedItems(user.email) : [];
  const likedItems = getLikedItems ? getLikedItems(user.email) : [];
  const historyItems = getUserHistory ? getUserHistory(user.email) : [];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUserProfile(formData);
    if (success) {
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ picture: reader.result });
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSaved = (itemId) => {
    toggleSave(user.email, { id: itemId });
  };

  const handleUnlike = (itemId) => {
    toggleLike(user.email, { id: itemId });
  };

  const getItemIcon = (type) => {
    switch(type) {
      case 'resource': return '📚';
      case 'job': return '💼';
      case 'roadmap': return '🗺️';
      case 'session': return '🎥';
      case 'download': return '📥';
      case 'link': return '🔗';
      default: return '📌';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now - itemDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <AnimatePresence>
            {savedItems.length > 0 ? (
              savedItems.map((item, index) => (
                <ContentItem
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemIcon>{getItemIcon(item.type)}</ItemIcon>
                  <ItemDetails>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemMeta>
                      <ItemType>{item.type}</ItemType>
                      Saved {formatDate(item.savedDate)}
                    </ItemMeta>
                  </ItemDetails>
                  <ItemActions>
                    <ActionIcon
                      as="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaExternalLinkAlt />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleRemoveSaved(item.id)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaTrash />
                    </ActionIcon>
                  </ItemActions>
                </ContentItem>
              ))
            ) : (
              <EmptyState>
                <FaBookmark />
                <p>No saved items yet</p>
                <ExploreButton
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Content
                </ExploreButton>
              </EmptyState>
            )}
          </AnimatePresence>
        );

      case 'liked':
        return (
          <AnimatePresence>
            {likedItems.length > 0 ? (
              likedItems.map((item, index) => (
                <ContentItem
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemIcon>{getItemIcon(item.type)}</ItemIcon>
                  <ItemDetails>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemMeta>
                      <ItemType>{item.type}</ItemType>
                      Liked {formatDate(item.likedDate)}
                    </ItemMeta>
                  </ItemDetails>
                  <ItemActions>
                    <ActionIcon
                      as="a"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaExternalLinkAlt />
                    </ActionIcon>
                    <ActionIcon
                      active={true}
                      onClick={() => handleUnlike(item.id)}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaHeart />
                    </ActionIcon>
                  </ItemActions>
                </ContentItem>
              ))
            ) : (
              <EmptyState>
                <FaHeart />
                <p>No liked items yet</p>
                <ExploreButton
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Content
                </ExploreButton>
              </EmptyState>
            )}
          </AnimatePresence>
        );

      case 'history':
        return (
          <AnimatePresence>
            {historyItems.length > 0 ? (
              historyItems.map((item, index) => (
                <ContentItem
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ItemIcon>{getItemIcon(item.type)}</ItemIcon>
                  <ItemDetails>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemMeta>
                      <ItemType>{item.type}</ItemType>
                      Viewed {formatDate(item.viewedDate)}
                    </ItemMeta>
                  </ItemDetails>
                </ContentItem>
              ))
            ) : (
              <EmptyState>
                <FaHistory />
                <p>No history yet</p>
                <ExploreButton
                  onClick={() => navigate('/')}
                  whileHover={{ scale: 1.05 }}
                >
                  Explore Content
                </ExploreButton>
              </EmptyState>
            )}
          </AnimatePresence>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <BackButton
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Back
      </BackButton>

      <ProfileCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CoverPhoto />
        
        <ProfileHeader>
          <AvatarContainer onClick={handleAvatarClick}>
            {user.picture ? (
              <Avatar src={user.picture} alt={user.name} />
            ) : (
              <AvatarPlaceholder>
                <FaUserCircle />
              </AvatarPlaceholder>
            )}
            <AvatarEditOverlay
              whileHover={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCamera />
            </AvatarEditOverlay>
          </AvatarContainer>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />

          <UserName>{user.name}</UserName>
          <UserEmail>
            <FaEnvelope /> {user.email}
          </UserEmail>

          <Profession>
            <FaBriefcase /> {formData.profession}
          </Profession>

          <StatsContainer>
            <StatItem>
              <StatNumber>{savedItems.length}</StatNumber>
              <StatLabel>Saved</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{likedItems.length}</StatNumber>
              <StatLabel>Liked</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{historyItems.length}</StatNumber>
              <StatLabel>History</StatLabel>
            </StatItem>
          </StatsContainer>
        </ProfileHeader>

        <InfoGrid>
          {formData.phone && (
            <InfoItem>
              <InfoIcon><FaPhone /></InfoIcon>
              <InfoContent>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{formData.phone}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
          
          {formData.location && (
            <InfoItem>
              <InfoIcon><FaMapMarkerAlt /></InfoIcon>
              <InfoContent>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>{formData.location}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
          
          <InfoItem>
            <InfoIcon><FaCalendarAlt /></InfoIcon>
            <InfoContent>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{new Date(user.loginTime).toLocaleDateString()}</InfoValue>
            </InfoContent>
          </InfoItem>
          
          {formData.bio && (
            <InfoItem style={{ gridColumn: 'span 2' }}>
              <InfoIcon><FaUser /></InfoIcon>
              <InfoContent>
                <InfoLabel>Bio</InfoLabel>
                <InfoValue>{formData.bio}</InfoValue>
              </InfoContent>
            </InfoItem>
          )}
        </InfoGrid>

        {!isEditing ? (
          <>
            <TabsContainer>
              <Tab
                active={activeTab === 'saved'}
                onClick={() => setActiveTab('saved')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBookmark /> Saved
              </Tab>
              <Tab
                active={activeTab === 'liked'}
                onClick={() => setActiveTab('liked')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart /> Liked
              </Tab>
              <Tab
                active={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHistory /> History
              </Tab>
            </TabsContainer>

            <ContentArea>
              {renderContent()}
            </ContentArea>

            <EditProfileButton
              onClick={() => setIsEditing(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit Profile
            </EditProfileButton>
          </>
        ) : (
          <EditForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Profession</Label>
              <Input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="e.g., Cloud Engineer"
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </FormGroup>

            <FormGroup>
              <Label>Bio</Label>
              <Input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              />
            </FormGroup>

            <FormActions>
              <CancelBtn
                type="button"
                onClick={() => setIsEditing(false)}
                whileHover={{ scale: 1.02 }}
              >
                Cancel
              </CancelBtn>
              <SaveBtn
                type="submit"
                whileHover={{ scale: 1.02 }}
              >
                Save Changes
              </SaveBtn>
            </FormActions>
          </EditForm>
        )}
      </ProfileCard>
    </PageContainer>
  );
};

export default UserProfilePage;