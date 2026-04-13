import React from 'react';

/**
 * UserAvatar Component
 * Displays user profile picture or initials consistently across the app
 * 
 * @param {Object} user - User object containing name and profilePicture
 * @param {string} size - Size variant: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * @param {string} className - Additional CSS classes
 * @param {boolean} showBorder - Whether to show border (default: false)
 * @param {string} borderColor - Border color class (default: 'border-cyan-200')
 */
const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '', 
  showBorder = false,
  borderColor = 'border-cyan-200'
}) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl',
    '4xl': 'w-32 h-32 text-4xl'
  };

  const borderClass = showBorder ? `border-2 ${borderColor}` : '';
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (user?.profilePicture?.url) {
    return (
      <img 
        src={user.profilePicture.url} 
        alt={user.name || 'User'}
        className={`rounded-full object-cover ${sizeClass} ${borderClass} ${className}`}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }

  return (
    <div className={`rounded-full bg-gradient-to-r from-[#19aaba] to-[#158c99] flex items-center justify-center ${sizeClass} ${borderClass} ${className}`}>
      <span className="text-white font-bold">
        {getInitials(user?.name)}
      </span>
    </div>
  );
};

export default UserAvatar;
