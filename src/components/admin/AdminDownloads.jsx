import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../hooks/useData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaDownload,
  FaRobot,
  FaRoad,
  FaCloud,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileArchive
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

const DownloadsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const DownloadCard = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  position: relative;
`;

const PreviewBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  background: rgba(0, 210, 255, 0.2);
  color: #00d2ff;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
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

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
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

const AdminDownloads = () => {
  const { downloads, addDownload, updateDownload, deleteDownload } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileSize: '',
    downloadUrl: '',
    icon: 'FaFileAlt',
    fileName: ''
  });

  const iconOptions = [
    { value: 'FaRobot', label: 'AI/Robot', icon: <FaRobot /> },
    { value: 'FaRoad', label: 'Roadmap', icon: <FaRoad /> },
    { value: 'FaCloud', label: 'Cloud', icon: <FaCloud /> },
    { value: 'FaFileAlt', label: 'General', icon: <FaFileAlt /> },
    { value: 'FaFilePdf', label: 'PDF', icon: <FaFilePdf /> },
    { value: 'FaFileWord', label: 'Word', icon: <FaFileWord /> },
    { value: 'FaFileExcel', label: 'Excel', icon: <FaFileExcel /> },
    { value: 'FaFileArchive', label: 'Archive', icon: <FaFileArchive /> }
  ];

  const handleOpenModal = (download = null) => {
    if (download) {
      setEditingDownload(download);
      setFormData({
        title: download.title,
        description: download.description,
        fileSize: download.fileSize,
        downloadUrl: download.downloadUrl,
        icon: download.icon,
        fileName: download.fileName || ''
      });
    } else {
      setEditingDownload(null);
      setFormData({
        title: '',
        description: '',
        fileSize: '',
        downloadUrl: '',
        icon: 'FaFileAlt',
        fileName: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDownload(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.downloadUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingDownload) {
      updateDownload(editingDownload.id, formData);
    } else {
      addDownload(formData);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this download?')) {
      deleteDownload(id);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Manage Downloads</Title>
        <AddButton
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Add New Download
        </AddButton>
      </Header>

      <DownloadsGrid>
        {downloads.map((download, index) => (
          <DownloadCard
            key={download.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PreviewBadge>FREE</PreviewBadge>

            <CardHeader>
              <Icon>
                {iconOptions.find(opt => opt.value === download.icon)?.icon || <FaFileAlt />}
              </Icon>
              <CardTitle>{download.title}</CardTitle>
            </CardHeader>

            <FileInfo>
              {download.fileName && <span>{download.fileName}</span>}
              {download.fileSize && <span>• {download.fileSize}</span>}
            </FileInfo>

            <Description>{download.description}</Description>

            <CardActions>
              <ActionButton
                className="edit"
                onClick={() => handleOpenModal(download)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit /> Edit
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(download.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash /> Delete
              </ActionButton>
            </CardActions>
          </DownloadCard>
        ))}
      </DownloadsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDownload ? 'Edit Download' : 'Add New Download'}
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., AI Agents Guide"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what's included in this download..."
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
            <Label>File Name (Optional)</Label>
            <Input
              type="text"
              name="fileName"
              value={formData.fileName}
              onChange={handleInputChange}
              placeholder="e.g., ai-agents-guide.pdf"
            />
          </FormGroup>

          <FormGroup>
            <Label>File Size (Optional)</Label>
            <Input
              type="text"
              name="fileSize"
              value={formData.fileSize}
              onChange={handleInputChange}
              placeholder="e.g., 2.5 MB"
            />
          </FormGroup>

          <FormGroup>
            <Label>Download URL</Label>
            <Input
              type="url"
              name="downloadUrl"
              value={formData.downloadUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/file.pdf"
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
              <FaSave /> {editingDownload ? 'Update' : 'Add'}
            </SubmitButton>
          </FormActions>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminDownloads;