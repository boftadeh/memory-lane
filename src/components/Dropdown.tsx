import { type ReactNode } from 'react';

type DropdownOption = {
  label: string;
  labelIcon?: ReactNode;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
};

type DropdownProps = {
  options: DropdownOption[];
  actionIcon: ReactNode;
  align?: 'start' | 'end';
  className?: string;
};

export default function Dropdown({ options, actionIcon, align = 'end', className = '' }: DropdownProps) {
  const handleOptionClick = (onClick: () => void): void => {
    onClick();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className={`dropdown dropdown-${align} ${className}`}>
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {actionIcon}
      </div>
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52"
        role="menu"
      >
        {options.map((option, index) => (
          <li key={`${option.label}-${index}`} role="none">
            <button
              onClick={() => handleOptionClick(option.onClick)}
              className={option.className || (option.isActive ? 'active' : '')}
              role="menuitem"
              type="button"
            >
              {option.labelIcon && <span className="w-5 h-5">{option.labelIcon}</span>}
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 