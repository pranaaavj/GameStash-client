import { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export const ImageZoomPreview = ({ src, alt }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const zoomPreview = (
    <div
      className='fixed top-1/2 right-44 transform -translate-y-1/2 w-[450px] h-[450px] overflow-hidden pointer-events-none rounded-lg shadow-lg border-2 border-gray-300 bg-white'
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: '200%',
        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
      }}>
      <div className='absolute inset-0 rounded-lg border-2 border-dashed border-gray-400 opacity-50'></div>
    </div>
  );

  return (
    <div
      className='relative'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}>
      <img
        src={src}
        alt={alt}
        className='w-full h-auto object-cover rounded-md cursor-pointer'
      />

      {/* Render zoom preview in a portal */}
      {isHovered && ReactDOM.createPortal(zoomPreview, document.body)}
    </div>
  );
};

ImageZoomPreview.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default ImageZoomPreview;
