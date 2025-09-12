interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({ current, goal, className = '', showPercentage = true }: ProgressBarProps) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${current.toLocaleString()} raised</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;