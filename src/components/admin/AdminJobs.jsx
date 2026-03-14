import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaMapMarkerAlt,
  FaBriefcase,
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

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`;

const JobCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const CompanyLogo = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #00d2ff;
  font-weight: bold;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const JobRole = styled.p`
  color: #00d2ff;
  font-size: 0.95rem;
`;

const JobDetails = styled.div`
  margin: 15px 0;
  padding: 10px 0;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  border-bottom: 1px solid rgba(0, 210, 255, 0.1);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  margin-bottom: 8px;
  font-size: 0.9rem;

  svg {
    color: #00d2ff;
  }
`;

const PostedDate = styled.p`
  color: #a0aec0;
  font-size: 0.85rem;
  margin: 10px 0;
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

const AdminJobs = () => {
  const { jobs, addJob, updateJob, deleteJob } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    applyLink: '',
    postedDate: new Date().toISOString().split('T')[0]
  });

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        company: job.company,
        role: job.role,
        location: job.location,
        applyLink: job.applyLink,
        postedDate: job.postedDate
      });
    } else {
      setEditingJob(null);
      setFormData({
        company: '',
        role: '',
        location: '',
        applyLink: '',
        postedDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.company || !formData.role || !formData.location || !formData.applyLink) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      deleteJob(id);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Container>
      <Header>
        <Title>Manage Jobs</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Post New Job
        </AddButton>
      </Header>

      <JobsGrid>
        {jobs.map((job, index) => (
          <JobCard
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CompanyHeader>
              <CompanyLogo>
                {getInitials(job.company)}
              </CompanyLogo>
              <CompanyInfo>
                <CompanyName>{job.company}</CompanyName>
                <JobRole>{job.role}</JobRole>
              </CompanyInfo>
            </CompanyHeader>

            <JobDetails>
              <DetailItem>
                <FaMapMarkerAlt /> {job.location}
              </DetailItem>
              <DetailItem>
                <FaBriefcase /> Full Time
              </DetailItem>
            </JobDetails>

            <PostedDate>Posted: {new Date(job.postedDate).toLocaleDateString()}</PostedDate>

            <CardActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(job)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(job.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete
              </ActionButton>
              <ActionButton
                className="edit"
                as="a"
                href={job.applyLink}
                target="_blank"
                style={{ textDecoration: 'none' }}
              >
                <FaExternalLinkAlt /> View
              </ActionButton>
            </CardActions>
          </JobCard>
        ))}
      </JobsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingJob ? 'Edit Job' : 'Post New Job'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Company Name</Label>
            <Input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="e.g., Google, Microsoft"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Job Role</Label>
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="e.g., Cloud Engineer"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Bangalore (Remote)"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Apply Link</Label>
            <Input
              type="url"
              name="applyLink"
              value={formData.applyLink}
              onChange={handleInputChange}
              placeholder="https://company.com/careers"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Posted Date</Label>
            <Input
              type="date"
              name="postedDate"
              value={formData.postedDate}
              onChange={handleInputChange}
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
              <FaSave /> {editingJob ? 'Update' : 'Post Job'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminJobs;