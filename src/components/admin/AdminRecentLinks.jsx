import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaLink,
  FaNewspaper,
  FaVideo,
  FaBlog,
  FaExternalLinkAlt
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

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.3);
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const LinkCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 10px 20px rgba(0, 210, 255, 0.1);
  }
`;

const LinkIcon = styled.div`
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

const LinkContent = styled.div`
  flex: 1;
`;

const LinkTitle = styled.h4`
  color: white;
  font-size: 1rem;
  margin-bottom: 5px;
  font-weight: 600;
`;

const LinkMeta = styled.p`
  color: #a0aec0;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LinkActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;

  &.edit {
    background: rgba(0, 210, 255, 0.2);
    color: #00d2ff;
    
    &:hover {
      background: rgba(0, 210, 255, 0.3);
    }
  }

  &.delete {
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    
    &:hover {
      background: rgba(255, 107, 107, 0.3);
    }
  }

  &.view {
    background: rgba(160, 174, 192, 0.2);
    color: #a0aec0;
    
    &:hover {
      background: rgba(160, 174, 192, 0.3);
      color: white;
    }
  }
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

const Select = styled.select`
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

  option {
    background: #0a0f1f;
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

const AdminRecentLinks = () => {
  const { recentLinks, addRecentLink, updateRecentLink, deleteRecentLink } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    meta: '',
    url: '',
    icon: 'FaLink'
  });

  const iconOptions = [
    { value: 'FaNewspaper', label: 'News', icon: <FaNewspaper /> },
    { value: 'FaVideo', label: 'Video', icon: <FaVideo /> },
    { value: 'FaBlog', label: 'Blog', icon: <FaBlog /> },
    { value: 'FaLink', label: 'General Link', icon: <FaLink /> }
  ];

  const handleOpenModal = (link = null) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        meta: link.meta,
        url: link.url,
        icon: link.icon
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: '',
        meta: '',
        url: '',
        icon: 'FaLink'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingLink) {
      updateRecentLink(editingLink.id, formData);
    } else {
      addRecentLink(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteRecentLink(id);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Manage Recent Links</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add New Link
        </AddButton>
      </Header>

      <LinksGrid>
        {recentLinks.map((link, index) => (
          <LinkCard
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LinkIcon>
              {iconOptions.find(opt => opt.value === link.icon)?.icon || <FaLink />}
            </LinkIcon>
            <LinkContent>
              <LinkTitle>{link.title}</LinkTitle>
              <LinkMeta>{link.meta}</LinkMeta>
            </LinkContent>
            <LinkActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(link)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit />
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(link.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash />
              </ActionButton>
              <ActionButton
                className="view"
                as="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaExternalLinkAlt />
              </ActionButton>
            </LinkActions>
          </LinkCard>
        ))}
      </LinksGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., New AWS Certifications Launch 2024"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Meta Information</Label>
            <Input
              type="text"
              name="meta"
              value={formData.meta}
              onChange={handleInputChange}
              placeholder="e.g., Cloud • 2 hours ago"
            />
          </FormGroup>

          <FormGroup>
            <Label>URL</Label>
            <Input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com/article"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Icon</Label>
            <Select name="icon" value={formData.icon} onChange={handleInputChange}>
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
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
              <FaSave /> {editingLink ? 'Update' : 'Add'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminRecentLinks;