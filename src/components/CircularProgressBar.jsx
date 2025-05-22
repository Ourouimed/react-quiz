import PropTypes from 'prop-types';
const CircularProgressBar = ({ percentage}) => {

    return (
      <div className="w-4/5 my-5 mx-auto">
    <svg viewBox="0 0 36 36" className="block mx-auto max-w-full max-h-[250px]">
      <path
        className="fill-none stroke-gray-200"
        strokeWidth="3.8"
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="fill-none stroke-cyan-500"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text
        x="18"
        y="20.35"
        className="fill-white text-[0.5em] text-center font-sans"
        textAnchor="middle"
      >
        {Math.floor(percentage)}%
      </text>
    </svg>
  </div>
  
    );
};
  
  CircularProgressBar.propTypes = {
    percentage: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
  };


  export default CircularProgressBar