import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaInstagram, 
  FaTelegram, 
  FaYoutube, 
  FaLinkedin, 
  FaDiscord, 
  FaTwitter,
  FaHeart,
  FaArrowUp
} from 'react-icons/fa';
import styled from 'styled-components';
import { useData } from '../../hooks/useData';

const FooterContainer = styled.footer`
  background: #0a0f1f;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  padding: 60px 0 20px;
  position: relative;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

const Column = styled.div`
  h3 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    }
  }
`;

const Logo = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Description = styled.p`
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 10px;
`;

const StyledLink = styled.a`
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
  display: inline-block;

  &:hover {
    color: #00d2ff;
    transform: translateX(5px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialIcon = styled(motion.a)`
  width: 40px;
  height: 40px;
  background: rgba(0, 210, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
    transform: translateY(-3px);
  }
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 210, 255, 0.1);
  color: #a0aec0;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const BackToTop = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00d2ff, #3a7bd5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 210, 255, 0.3);
  z-index: 100;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Footer = () => {
  const { community } = useData();
  const [showBackToTop, setShowBackToTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Resources', href: '#resources' },
    { label: 'Job Updates', href: '#jobs' },
    { label: 'Learning Roadmaps', href: '#roadmaps' },
    { label: 'Live Sessions', href: '#sessions' },
    { label: 'Community', href: '#community' }
  ];

  const resources = [
    { label: 'Free Certifications', href: '#' },
    { label: 'AI Tools Guide', href: '#' },
    { label: 'DevOps Roadmap', href: '#' },
    { label: 'Cloud Cheat Sheet', href: '#' },
    { label: 'Resume Templates', href: '#' },
    { label: 'Interview Prep', href: '#' }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, url: community.instagram, label: 'Instagram' },
    { icon: <FaTelegram />, url: community.telegram, label: 'Telegram' },
    { icon: <FaYoutube />, url: community.youtube, label: 'YouTube' },
    { icon: <FaLinkedin />, url: community.linkedin, label: 'LinkedIn' },
    { icon: <FaDiscord />, url: community.discord, label: 'Discord' },
    { icon: <FaTwitter />, url: community.twitter, label: 'Twitter' }
  ];

  return (
    <FooterContainer>
      <Content>
        <Grid>
          <Column>
            <Logo>Tech with Praveen</Logo>
            <Description>
              Helping students build careers in technology. Join thousands of learners mastering Cloud, DevOps, AI, and more.
            </Description>
            <SocialLinks>
              {socialLinks.map((social, index) => (
                <SocialIcon
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </SocialLinks>
          </Column>

          <Column>
            <h3>Quick Links</h3>
            <LinkList>
              {quickLinks.map((link, index) => (
                <LinkItem key={index}>
                  <StyledLink href={link.href}>{link.label}</StyledLink>
                </LinkItem>
              ))}
            </LinkList>
          </Column>

          <Column>
            <h3>Resources</h3>
            <LinkList>
              {resources.map((resource, index) => (
                <LinkItem key={index}>
                  <StyledLink href={resource.href}>{resource.label}</StyledLink>
                </LinkItem>
              ))}
            </LinkList>
          </Column>

          <Column>
            <h3>Contact</h3>
            <LinkList>
              <LinkItem>
                <StyledLink href="mailto:praveen@techwithpraveen.com">
                  praveen@techwithpraveen.com
                </StyledLink>
              </LinkItem>
              <LinkItem>
                <StyledLink href="#">Support</StyledLink>
              </LinkItem>
              <LinkItem>
                <StyledLink href="#">FAQs</StyledLink>
              </LinkItem>
              <LinkItem>
                <StyledLink href="#">Privacy Policy</StyledLink>
              </LinkItem>
              <LinkItem>
                <StyledLink href="#">Terms of Service</StyledLink>
              </LinkItem>
            </LinkList>
          </Column>
        </Grid>

        <BottomBar>
          <p>
            © {new Date().getFullYear()} Tech with Praveen. All rights reserved.
          </p>
          <p>
            Made with <FaHeart style={{ color: '#ff6b6b', margin: '0 5px' }} /> by Praveen
          </p>
        </BottomBar>
      </Content>

      {showBackToTop && (
        <BackToTop
          onClick={scrollToTop}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp />
        </BackToTop>
      )}
    </FooterContainer>
  );
};

export default Footer;