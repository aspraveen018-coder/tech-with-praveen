import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCertificate,
  FaRobot,
  FaCloud,
  FaRoad,
  FaPython,
  FaCode,
  FaLink
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

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const ResourceCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
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

const CardTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  flex: 1;
`;

const LinksList = styled.div`
  margin: 15px 0;
`;

const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(0, 210, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #a0aec0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
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

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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

const AdminResources = () => {
  const { resources, addResource, updateResource, deleteResource } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'FaCode',
    links: [{ text: '', url: '' }]
  });

  const iconOptions = [
    { value: 'FaCertificate', label: 'Certificate', icon: <FaCertificate /> },
    { value: 'FaRobot', label: 'AI/Robot', icon: <FaRobot /> },
    { value: 'FaCloud', label: 'Cloud', icon: <FaCloud /> },
    { value: 'FaRoad', label: 'Roadmap', icon: <FaRoad /> },
    { value: 'FaPython', label: 'Python', icon: <FaPython /> },
    { value: 'FaCode', label: 'Code', icon: <FaCode /> }
  ];

  const handleOpenModal = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        icon: resource.icon,
        links: resource.links
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        icon: 'FaCode',
        links: [{ text: '', url: '' }]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  const addLinkField = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { text: '', url: '' }]
    });
  };

  const removeLinkField = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    const validLinks = formData.links.filter(link => link.text && link.url);
    if (validLinks.length === 0) {
      toast.error('Please add at least one valid link');
      return;
    }

    const resourceData = {
      ...formData,
      links: validLinks
    };

    if (editingResource) {
      updateResource(editingResource.id, resourceData);
    } else {
      addResource(resourceData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteResource(id);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Manage Resources</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add New Resource
        </AddButton>
      </Header>

      <ResourcesGrid>
        {resources.map((resource, index) => (
          <ResourceCard
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CardHeader>
              <Icon>
                {iconOptions.find(opt => opt.value === resource.icon)?.icon || <FaCode />}
              </Icon>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>

            <LinksList>
              {resource.links.slice(0, 3).map((link, idx) => (
                <LinkItem key={idx}>
                  <FaLink size={12} />
                  {link.text}
                </LinkItem>
              ))}
              {resource.links.length > 3 && (
                <LinkItem>+{resource.links.length - 3} more links</LinkItem>
              )}
            </LinksList>

            <CardActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(resource)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(resource.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete
              </ActionButton>
            </CardActions>
          </ResourceCard>
        ))}
      </ResourcesGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Free Certifications"
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

          <FormGroup>
            <Label>Links</Label>
            <LinksContainer>
              {formData.links.map((link, index) => (
                <LinkInput key={index}>
                  <Input
                    type="text"
                    placeholder="Link text"
                    value={link.text}
                    onChange={(e) => handleLinkChange(index, 'text', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {formData.links.length > 1 && (
                    <ActionButton
                      className="delete"
                      type="button"
                      onClick={() => removeLinkField(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTimes />
                    </ActionButton>
                  )}
                </LinkInput>
              ))}
              <AddButton
                type="button"
                onClick={addLinkField}
                style={{ width: 'fit-content', padding: '8px 15px' }}
              >
                <FaPlus /> Add Link
              </AddButton>
            </LinksContainer>
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
              <FaSave /> {editingResource ? 'Update' : 'Save'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminResources;