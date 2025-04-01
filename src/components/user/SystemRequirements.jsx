export const SystemRequirements = ({ requirements }) => {
  return (
    <div className='w-full'>
      <div className='bg-secondary-bg p-4 rounded-lg'>
        <h3 className='text-lg font-bold mb-2 text-primary-text'>
          Recommended
        </h3>
        <ul className='space-y-1'>
          {Object.entries(requirements).map(([key, value]) => (
            <li
              key={key}
              className='flex'>
              <span className='w-1/3 text-secondary-text capitalize'>
                {key}:
              </span>
              <span className='w-2/3 text-primary-text'>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
