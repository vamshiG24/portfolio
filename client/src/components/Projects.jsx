import { ZoomParallax } from './ui/zoom-parallax';

const Projects = ({ lowSpecMode }) => {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Portfolio Showcase Hub',
      title: 'Project Gallery Hub',
      description: 'Explore my interactive AI & Full Stack web applications. Scroll down to trigger the Zoom Parallax showcase.',
      tech: ['React', 'Framer Motion', 'Tailwind']
    },
    {
      src: '/biosecure_showcase.png',
      alt: 'BioSecure Access System',
      title: 'BioSecure Authentication',
      description: 'Voice + Face biometric validation using custom ECAPA-TDNN speech models and DeepFace neural embeddings.',
      tech: ['Flask', 'React', 'Python', 'Deep Learning'],
      github: 'https://github.com/vamshiG24/BioSecure-Access',
      demo: 'https://github.com/vamshiG24/BioSecure-Access'
    },
    {
      src: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
      alt: 'EEG Seizure Detection Web App',
      title: 'EEG Medical AI Predictor',
      description: 'Clinical-grade seizure prediction app running CNN inference on streaming patient EEG signal frequencies.',
      tech: ['Flask', 'TensorFlow', 'Keras', 'React'],
      github: 'https://github.com/vamshiG24/Seizure-Detection-project-main',
      demo: '#'
    },
    {
      src: 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&w=800&q=80',
      alt: 'Secure Digital Evidence Management',
      title: 'Evidence Ledger Logs',
      description: 'MERN law enforcement case manager with automated SHA-256 evidence file integrity checking.',
      tech: ['MongoDB', 'Express.js', 'React', 'Node.js'],
      github: 'https://github.com/vamshiG24/secure-digital-evidence',
      demo: 'https://secure-digital-evidence.vercel.app'
    },
    {
      src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      alt: 'BioSecure Face scan',
      title: 'DeepFace Biometric Scanner',
      description: 'Sub-450ms verification server tracking face matching embeddings with granular security validation checks.',
      tech: ['PyTorch', 'DeepFace', 'Python'],
      github: 'https://github.com/vamshiG24/BioSecure-Access',
      demo: 'https://github.com/vamshiG24/BioSecure-Access'
    },
    {
      src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      alt: 'Cryptographic SHA-256 ledger validation',
      title: 'Case Data Hash Checker',
      description: 'Role-based ACL verification pipeline comparing client assets hashes against cryptographic database records.',
      tech: ['NodeJS', 'Crypto', 'SHA-256'],
      github: 'https://github.com/vamshiG24/secure-digital-evidence',
      demo: 'https://secure-digital-evidence.vercel.app'
    },
    {
      src: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
      alt: 'Epileptic seizure inference signals',
      title: 'Fast Fourier Signal Processor',
      description: 'Pre-processing pipeline executing fast Fourier transform matrices on EEG channels for medical AI diagnostics.',
      tech: ['SciPy', 'NumPy', 'Pandas'],
      github: 'https://github.com/vamshiG24/Seizure-Detection-project-main',
      demo: '#'
    }
  ];

  return (
    <section
      id="projects"
      style={{
        width: '100%',
        backgroundColor: '#0c0c0c',
        position: 'relative',
        // A clipping ancestor prevents the sticky parallax scene from painting
        // for its full scroll range.
        overflow: 'visible',
        borderTop: '1px solid rgba(255, 0, 0, 0.05)',
      }}
    >
      {/* Header Details */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 0px 24px', textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 700, 
          letterSpacing: '0.2em', 
          color: '#ff0000', 
          background: 'rgba(255,0,0,0.06)', 
          border: '1px solid rgba(255,0,0,0.18)', 
          padding: '6px 16px', 
          borderRadius: '99px',
          fontFamily: 'var(--font-mono)'
        }}>
          FEATURED PORTFOLIO
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: 'white', marginTop: '20px', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
          Innovative <span className="shimmer-gowni">Projects</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '15px auto 0 auto', lineHeight: 1.6 }}>
          A visual archive of dual-factor biometric scanners, cryptographic ledgers, and EEG Seizure Predictor neural networks. Hover over any zooming block to view metadata and links.
        </p>
      </div>

      <ZoomParallax images={images} lowSpecMode={lowSpecMode} />
    </section>
  );
};

export default Projects;
