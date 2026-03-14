import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars, 
  Float, 
  Sparkles,
  Html
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import * as THREE from 'three';

// Animation for tap instruction
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-5px) translateX(5px); }
  50% { transform: translateY(0px) translateX(10px); }
  75% { transform: translateY(5px) translateX(5px); }
`;

const HeroContainer = styled.section`
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0a1a2f;  /* Solid dark blue background */
  cursor: crosshair;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 20;
  width: 100%;
  padding: 0 20px;
  pointer-events: none;
`;

const Title = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #00d2ff 70%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 20px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  pointer-events: auto;
`;

const TapInstruction = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 1.1rem;
  z-index: 30;
  background: rgba(0,0,0,0.3);
  padding: 12px 24px;
  border-radius: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  pointer-events: none;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px 18px;
    white-space: normal;
    text-align: center;
    width: 90%;
  }
`;

const TapIcon = styled.span`
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px #00d2ff);
`;

// Moving Stars Effect
const MovingStars = () => {
  const starsRef = useRef();
  
  useFrame(({ clock }) => {
    if (starsRef.current) {
      // Create illusion of movement by rotating the stars
      starsRef.current.rotation.y += 0.0002;
      starsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
};

// Small Living Amoeba
const SmallAmoeba = () => {
  const meshRef = useRef();
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const time = useRef(0);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      targetPosition.current = {
        x: x * 2.5,
        y: y * 1.5,
        z: Math.sin(x * y) * 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      time.current = clock.getElapsedTime();
      
      meshRef.current.position.x += (targetPosition.current.x - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetPosition.current.y - meshRef.current.position.y) * 0.05;
      meshRef.current.position.z += (targetPosition.current.z - meshRef.current.position.z) * 0.05;
      
      const pulseScale = 1 + Math.sin(time.current * 4) * 0.08;
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      
      meshRef.current.rotation.x = Math.sin(time.current * 0.6) * 0.15;
      meshRef.current.rotation.y = Math.sin(time.current * 0.4) * 0.2;
      meshRef.current.rotation.z = Math.cos(time.current * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <MeshDistortMaterial
        color="#00d2ff"
        emissive="#3a7bd5"
        roughness={0.2}
        metalness={0.1}
        distort={0.5}
        speed={2.5}
        radius={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};

// Floating Logo Component
const FloatingLogo = ({ logo, position }) => {
  const meshRef = useRef();
  const startY = position[1];
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      meshRef.current.position.y = startY + Math.sin(time * 2) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  const renderLogo = () => {
    switch(logo.type) {
      case 'javascript':
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial color="#f7df1e" emissive="#f7df1e" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0, 0.41]} center>
              <div style={{ color: 'black', fontSize: '24px', fontWeight: 'bold' }}>JS</div>
            </Html>
          </group>
        );
      case 'python':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 0.9, 16]} />
              <meshStandardMaterial color="#3776ab" emissive="#3776ab" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0, 0.5]} center>
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>PY</div>
            </Html>
          </group>
        );
      case 'react':
        return (
          <group>
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.3} />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.5, 0.05, 8, 24]} />
              <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.2} />
            </mesh>
            <mesh rotation={[0, Math.PI/2, 0]}>
              <torusGeometry args={[0.5, 0.05, 8, 24]} />
              <meshStandardMaterial color="#61dafb" emissive="#61dafb" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.8, 0]} center>
              <div style={{ color: '#61dafb', fontSize: '16px', fontWeight: 'bold' }}>React</div>
            </Html>
          </group>
        );
      case 'java':
        return (
          <group>
            <mesh>
              <torusKnotGeometry args={[0.4, 0.15, 32, 6]} />
              <meshStandardMaterial color="#f89820" emissive="#f89820" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.7, 0]} center>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Java</div>
            </Html>
          </group>
        );
      case 'docker':
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 0.7, 8]} />
              <meshStandardMaterial color="#2496ed" emissive="#2496ed" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.4, 0.2, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#2496ed" emissive="#2496ed" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, -0.6, 0]} center>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Docker</div>
            </Html>
          </group>
        );
      case 'kubernetes':
        return (
          <group>
            <mesh>
              <torusGeometry args={[0.5, 0.1, 16, 32]} />
              <meshStandardMaterial color="#326ce5" emissive="#326ce5" emissiveIntensity={0.2} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#326ce5" emissive="#326ce5" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.8, 0]} center>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>K8s</div>
            </Html>
          </group>
        );
      case 'aws':
        return (
          <group>
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.3, 0.2, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#ff9900" emissive="#ff9900" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, -0.6, 0]} center>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>AWS</div>
            </Html>
          </group>
        );
      case 'html':
        return (
          <group>
            <mesh>
              <coneGeometry args={[0.5, 0.8, 4]} />
              <meshStandardMaterial color="#e34c26" emissive="#e34c26" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.6, 0]} center>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>HTML5</div>
            </Html>
          </group>
        );
      case 'css':
        return (
          <group>
            <mesh rotation={[0, 0, Math.PI/4]}>
              <coneGeometry args={[0.5, 0.8, 4]} />
              <meshStandardMaterial color="#264de4" emissive="#264de4" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.6, 0]} center>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>CSS3</div>
            </Html>
          </group>
        );
      case 'git':
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshStandardMaterial color="#f05032" emissive="#f05032" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.5, 0.31]} center>
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Git</div>
            </Html>
          </group>
        );
      case 'github':
        return (
          <group>
            <mesh>
              <octahedronGeometry args={[0.4, 0]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
            </mesh>
            <Html position={[0, -0.6, 0]} center>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>GitHub</div>
            </Html>
          </group>
        );
      case 'linkedin':
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.6, 0.6, 0.2]} />
              <meshStandardMaterial color="#0077b5" emissive="#0077b5" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0, 0.2]} center>
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>in</div>
            </Html>
          </group>
        );
      case 'internet':
        return (
          <group>
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={0.2} />
            </mesh>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.6, 0.05, 8, 24]} />
              <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={0.2} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <torusGeometry args={[0.6, 0.05, 8, 24]} />
              <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={0.2} />
            </mesh>
            <Html position={[0, 0.9, 0]} center>
              <div style={{ color: 'white', fontSize: '24px' }}>🌐</div>
            </Html>
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderLogo()}
    </group>
  );
};

// Click handler to spawn logos (with instruction disabling)
const ClickSpawner = ({ onFirstClick }) => {
  const [logos, setLogos] = useState([]);
  const [hasClicked, setHasClicked] = useState(false);
  
  const logoTypes = [
    'javascript', 'python', 'react', 'java', 'docker', 
    'kubernetes', 'aws', 'html', 'css', 'git', 'github', 
    'linkedin', 'internet'
  ];

  useEffect(() => {
    const handleClick = (e) => {
      // Trigger first click callback to hide instruction
      if (!hasClicked) {
        setHasClicked(true);
        if (onFirstClick) onFirstClick();
      }

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      const randomType = logoTypes[Math.floor(Math.random() * logoTypes.length)];
      
      const newLogo = {
        id: Date.now() + Math.random(),
        type: randomType,
        position: [x * 4, y * 3, -2 + Math.random() * 2]
      };
      
      setLogos(prev => [...prev, newLogo]);
      
      setTimeout(() => {
        setLogos(prev => prev.filter(l => l.id !== newLogo.id));
      }, 8000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [hasClicked, onFirstClick]);

  return (
    <>
      {logos.map((logo) => (
        <FloatingLogo key={logo.id} logo={logo} position={logo.position} />
      ))}
    </>
  );
};

// Main Hero Component
const Hero = () => {
  const [showInstruction, setShowInstruction] = useState(true);

  const handleFirstClick = () => {
    setShowInstruction(false);
  };

  return (
    <HeroContainer id="hero">
      {/* Solid blue background - no gradient orbs */}

      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#0a1a2f'  /* Solid dark blue matching container */
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 2, 3]} intensity={0.5} color="#00d2ff" />
          
          {/* Moving Stars - creates illusion of movement */}
          <MovingStars />
          
          <SmallAmoeba />
          <ClickSpawner onFirstClick={handleFirstClick} />
          
          <Sparkles 
            count={30} 
            scale={8} 
            size={0.8} 
            speed={0.2} 
            color="white" 
            opacity={0.3}
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate={false}
          />
        </Suspense>
      </Canvas>

      {/* Tap Instruction - disappears after first click */}
      <AnimatePresence>
        {showInstruction && (
          <TapInstruction
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <TapIcon>👆</TapIcon>
            Tap anywhere to spawn tech logos
            <TapIcon>✨</TapIcon>
          </TapInstruction>
        )}
      </AnimatePresence>

      <Content>
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Tech with Praveen
        </Title>
        
        <Subtitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Learn Tech | Cloud | DevOps | AI | Job Updates
        </Subtitle>
        
        <Description
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Helping students learn technology, find IT jobs, and grow their careers.
        </Description>
        
        <ButtonGroup
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('resources').scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Resources
          </motion.button>
          <motion.button 
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('community').scrollIntoView({ behavior: 'smooth' })}
          >
            Join Community
          </motion.button>
        </ButtonGroup>
      </Content>
    </HeroContainer>
  );
};

export default Hero;