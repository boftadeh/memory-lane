import { AVAILABLE_TAGS, Tag } from '@/types/tags';

type TagSelectorProps = {
  selectedTag: Tag | null;
  onChange: (tag: Tag | null) => void;
  className?: string;
};

export default function TagSelector({ selectedTag, onChange, className = '' }: TagSelectorProps) {
  return (
    <div className={`filter ${className}`}>
      <input 
        type="radio" 
        name="tag-filter" 
        className="btn filter-reset" 
        aria-label="All"
        checked={selectedTag === null}
        onChange={() => onChange(null)}
      />
      {AVAILABLE_TAGS.map((tag) => (
        <input
          key={tag}
          type="radio"
          name="tag-filter"
          className="btn capitalize"
          aria-label={tag}
          checked={selectedTag === tag}
          onChange={() => onChange(tag)}
        />
      ))}
    </div>
  );
} 