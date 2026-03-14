import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaRoad,
  FaCheckCircle
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

const RoadmapsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const RoadmapCard = styled(motion.div)`
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

const CardTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  flex: 1;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const StepsList = styled.div`
  margin: 15px 0;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #a0aec0;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
    font-size: 0.9rem;
  }
`;

const ResourcesSection = styled.div`
  margin: 15px 0;
`;

const ResourcesTitle = styled.h4`
  color: white;
  font-size: 0.95rem;
  margin-bottom: 8px;
`;

const ResourceItem = styled.div`
  color: #a0aec0;
  font-size: 0.85rem;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 5px;

  &:before {
    content: '•';
    color: #00d2ff;
  }
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
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
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

const TextArea = styled.textarea`
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00d2ff;
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.3);
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StepInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ResourcesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResourceInput = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  background: rgba(10, 20, 40, 0.95);
  padding: 15px 0;
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

const AdminRoadmaps = () => {
  const { roadmaps, addRoadmap, updateRoadmap, deleteRoadmap } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    resources: ['']
  });

  const handleOpenModal = (roadmap = null) => {
    if (roadmap) {
      setEditingRoadmap(roadmap);
      setFormData({
        title: roadmap.title,
        description: roadmap.description,
        steps: roadmap.steps.length ? roadmap.steps : [''],
        resources: roadmap.resources.length ? roadmap.resources : ['']
      });
    } else {
      setEditingRoadmap(null);
      setFormData({
        title: '',
        description: '',
        steps: [''],
        resources: ['']
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoadmap(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData({
      ...formData,
      steps: updatedSteps
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    });
  };

  const removeStep = (index) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      steps: updatedSteps
    });
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, '']
    });
  };

  const removeResource = (index) => {
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.description) {
      toast.error('Please enter a description');
      return;
    }

    const validSteps = formData.steps.filter(step => step.trim() !== '');
    if (validSteps.length === 0) {
      toast.error('Please add at least one step');
      return;
    }

    const validResources = formData.resources.filter(res => res.trim() !== '');

    const roadmapData = {
      ...formData,
      steps: validSteps,
      resources: validResources
    };

    if (editingRoadmap) {
      updateRoadmap(editingRoadmap.id, roadmapData);
    } else {
      addRoadmap(roadmapData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      deleteRoadmap(id);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Manage Learning Roadmaps</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add New Roadmap
        </AddButton>
      </Header>

      <RoadmapsGrid>
        {roadmaps.map((roadmap, index) => (
          <RoadmapCard
            key={roadmap.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CardHeader>
              <Icon>
                <FaRoad />
              </Icon>
              <CardTitle>{roadmap.title}</CardTitle>
            </CardHeader>

            <Description>{roadmap.description}</Description>

            <StepsList>
              {roadmap.steps.slice(0, 3).map((step, idx) => (
                <Step key={idx}>
                  <FaCheckCircle /> {step}
                </Step>
              ))}
              {roadmap.steps.length > 3 && (
                <Step>+{roadmap.steps.length - 3} more steps</Step>
              )}
            </StepsList>

            <ResourcesSection>
              <ResourcesTitle>Resources:</ResourcesTitle>
              {roadmap.resources.slice(0, 2).map((resource, idx) => (
                <ResourceItem key={idx}>{resource}</ResourceItem>
              ))}
              {roadmap.resources.length > 2 && (
                <ResourceItem>+{roadmap.resources.length - 2} more resources</ResourceItem>
              )}
            </ResourcesSection>

            <CardActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(roadmap)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(roadmap.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete
              </ActionButton>
            </CardActions>
          </RoadmapCard>
        ))}
      </RoadmapsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingRoadmap ? 'Edit Roadmap' : 'Add New Roadmap'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Cloud Engineer Roadmap"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this roadmap covers..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Learning Steps</Label>
            <StepsContainer>
              {formData.steps.map((step, index) => (
                <StepInput key={index}>
                  <Input
                    type="text"
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {formData.steps.length > 1 && (
                    <ActionButton
                      className="delete"
                      type="button"
                      onClick={() => removeStep(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTimes />
                    </ActionButton>
                  )}
                </StepInput>
              ))}
              <AddButton
                type="button"
                onClick={addStep}
                style={{ width: 'fit-content', padding: '8px 15px' }}
              >
                <FaPlus /> Add Step
              </AddButton>
            </StepsContainer>
          </FormGroup>

          <FormGroup>
            <Label>Resources (Optional)</Label>
            <ResourcesContainer>
              {formData.resources.map((resource, index) => (
                <ResourceInput key={index}>
                  <Input
                    type="text"
                    placeholder="Resource URL or name"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {formData.resources.length > 1 && (
                    <ActionButton
                      className="delete"
                      type="button"
                      onClick={() => removeResource(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTimes />
                    </ActionButton>
                  )}
                </ResourceInput>
              ))}
              <AddButton
                type="button"
                onClick={addResource}
                style={{ width: 'fit-content', padding: '8px 15px' }}
              >
                <FaPlus /> Add Resource
              </AddButton>
            </ResourcesContainer>
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
              <FaSave /> {editingRoadmap ? 'Update' : 'Save'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminRoadmaps;