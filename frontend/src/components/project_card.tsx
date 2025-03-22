import React, { useState, useEffect } from 'react';

interface ProjectCardProps {
  title: string;
  imageUrl: string;
  technologies?: string[];
  projectLink?: string;
  githubLink?: string;
  width?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  imageUrl,
  technologies = [],
  projectLink,
  githubLink,
  width = 20,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Calculate font size and padding based on width prop
  const getTitleFontSize = () => {
    // More conservative scaling for smaller cards
    return width < 15 ? '0.85rem' : `clamp(1rem, ${width / 25}rem, 1.75rem)`;
  };
  
  const getButtonStyles = () => {
    // For small cards, make buttons much smaller
    if (width < 15) {
      return {
        padding: '0.25rem 0.5rem',
        fontSize: '0.7rem',
        maxWidth: '100%',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden' as const,
        textOverflow: 'ellipsis' as const
      };
    }
    
    // For larger cards, maintain original proportional scaling
    const paddingY = `${Math.min(0.6, Math.max(0.3, width / 60))}rem`;
    const paddingX = `${Math.min(1, Math.max(0.5, width / 30))}rem`;
    const fontSize = `${Math.min(1.1, Math.max(0.75, width / 30))}rem`;
    
    return {
      padding: `${paddingY} ${paddingX}`,
      fontSize: fontSize
    };
  };
  
  return (
    <div
      className="relative rounded-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl bg-gray-800 group mx-auto"
      style={{
        width: `${width}vw`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Technology icons */}
      {technologies.length > 0 && (
        <div className="absolute left-3 flex z-20" style={{ top: 0, transform: 'translateY(-50%)' }}>
          {technologies.map((tech, index) => (
            <div
              key={tech}
              className="rounded-full bg-white bg-opacity-90 shadow-md flex items-center justify-center border border-gray-300 transition-transform group-hover:scale-105"
              style={{ 
                marginLeft: index === 0 ? 0 : '0.75rem',
                width: `2.2rem`,
                height: `2.3rem`,
              }}
            >
              <img
                src={`/icons/${tech.toLowerCase()}.svg`}
                alt={tech}
                title={tech}
                style={{ 
                  width: `1.8rem`,
                  height: `1.8rem`,
                }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* image/gif */}
      <div className="w-full rounded-lg overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-b from-black/70 to-black/50 text-white flex flex-col justify-center items-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          padding: width < 15 ? '0.5rem' : `${Math.max(0.75, width / 25)}rem`,
          overflow: 'hidden' // Remove auto overflow to prevent scrollbars
        }}
      >
        <div className="text-center mb-4">
          <p 
            className="text-white font-semibold" 
            style={{ fontSize: getTitleFontSize() }}
          >
            {title}
          </p>
        </div>
        
        <div className={`flex ${width < 15 ? 'flex-col' : 'flex-row'} justify-center ${width < 15 ? 'gap-1' : 'gap-2'}`}>
          {projectLink && (
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black rounded-md font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center"
              style={getButtonStyles()}
            >
              <span>{width < 15 ? "View" : "Check it out!"}</span>
              <svg
                style={{ 
                  width: width < 15 ? '0.7rem' : `${Math.max(0.8, width / 35)}rem`, 
                  height: width < 15 ? '0.7rem' : `${Math.max(0.8, width / 35)}rem`,
                  marginLeft: width < 15 ? '0.15rem' : '0.25rem' 
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors duration-300 flex items-center"
              style={getButtonStyles()}
            >
              <span>{width < 15 ? "Code" : "See the code"}</span>
              <img 
                src="icons/github-white.svg" 
                style={{ 
                  width: width < 15 ? '0.7rem' : `${Math.max(0.8, width / 35)}rem`, 
                  height: width < 15 ? '0.7rem' : `${Math.max(0.8, width / 35)}rem`,
                  marginLeft: width < 15 ? '0.15rem' : '0.25rem' 
                }}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;