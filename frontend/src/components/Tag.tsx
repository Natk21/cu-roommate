// src/components/Tag.tsx

type TagProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

function Tag({ label, variant = 'primary' }: TagProps) {
  // Different style variants
  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600'
  };

  return (
    <div className={`
      inline-flex items-center justify-center
      px-4 py-2
      rounded-full
      text-sm font-medium
      transition-all duration-200
      shadow-sm
      ${variants[variant]}
    `}>
      <span>{label}</span>
    </div>
  );
}

export default Tag;