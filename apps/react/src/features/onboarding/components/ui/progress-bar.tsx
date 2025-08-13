interface ProgressBarProps {
  currentStep?: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const progressSteps = 3

  if (!currentStep) return null

  return (
    <div className="flex items-center gap-2 pt-7">
      {Array.from({ length: progressSteps }, (_, index) => (
        <div
          key={index}
          className={`h-[3px] flex-1 rounded-full ${index < currentStep ? 'bg-primary-1' : 'bg-gray-3'}`}
        />
      ))}
    </div>
  )
}
