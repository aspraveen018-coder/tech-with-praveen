import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaCloud, 
  FaDev, 
  FaPython, 
  FaCertificate, 
  FaBriefcase, 
  FaGraduationCap,
  FaRocket,
  FaUsers
} from 'react-icons/fa';
import styled from 'styled-components';

const AboutContainer = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #0a0f1f 0%, #030614 100%);
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #a0aec0;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 50px;
  line-height: 1.8;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const Card = styled(motion.div)`
  background: rgba(10, 20, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d2ff, transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(0, 210, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 210, 255, 0.1);

    &:before {
      transform: translateX(100%);
    }
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  color: #00d2ff;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.3rem;
  color: white;
  margin-bottom: 15px;
`;

const CardDescription = styled.p`
  color: #a0aec0;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 60px;
  padding: 40px;
  background: rgba(10, 20, 40, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(0, 210, 255, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: #00d2ff;
  margin-bottom: 10px;
`;

const StatLabel = styled.p`
  color: #a0aec0;
  font-size: 1rem;
`;

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <FaCloud />,
      title: 'Cloud Concepts',
      description: 'Master AWS, Azure, and Google Cloud with practical hands-on tutorials and real-world projects.'
    },
    {
      icon: <FaDev />,
      title: 'DevOps Learning',
      description: 'Learn Docker, Kubernetes, Jenkins, and CI/CD pipelines to automate and streamline deployments.'
    },
    {
      icon: <FaPython />,
      title: 'Python Development',
      description: 'From basics to advanced, build powerful applications and automate tasks with Python.'
    },
    {
      icon: <FaCertificate />,
      title: 'Free Certifications',
      description: 'Access free certification courses and validate your skills with industry-recognized credentials.'
    },
    {
      icon: <FaBriefcase />,
      title: 'IT Job Updates',
      description: 'Stay updated with the latest job openings, internship opportunities, and career guidance.'
    },
    {
      icon: <FaGraduationCap />,
      title: 'Career Guidance',
      description: 'Get personalized career advice, resume reviews, and interview preparation tips.'
    }
  ];

  const stats = [
    { number: '5+', label: 'Students Helped' },
    { number: '100+', label: 'Free Resources' },
    { number: '10+', label: 'Job Placements' },
    { number: '24/7', label: 'Community Support' }
  ];

  return (
    <AboutContainer id="about" ref={ref}>
      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Praveen
        </Title>
        
        <Description
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
         Hi, I’m Praveen, a passionate tech creator focused on simplifying complex technology concepts for students and aspiring IT professionals.
I share practical knowledge on Cloud Computing, DevOps, Python, and modern technology trends, helping learners understand real-world industry skills in a simple and easy way.
Through my content, I aim to guide students in building strong technical foundations, discovering learning resources, and staying updated with IT job opportunities, internships, certifications, and career roadmaps.
My mission is to bridge the gap between academic learning and industry requirements, making technology more accessible to everyone who wants to build a career in IT.
In the future, I also plan to conduct technical learning sessions with my team, where students can gain deeper knowledge, hands-on guidance, and career support.
        </Description>

        <Grid
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, delay: index * 0.1 }}
            >
              <Icon>{feature.icon}</Icon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </Grid>

        <StatsContainer
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsContainer>
      </Content>
    </AboutContainer>
  );
};

export default About;