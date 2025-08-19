import React, { useImperativeHandle, forwardRef } from 'react'
import { useTimePicker } from '../../hook/use-wheel-picker'

export interface TimePickerActions {
  getSelectedTimeAsISO: () => string
  isValid: boolean
}

const WheelColumn: React.FC<{
  scrollRef: React.RefObject<HTMLDivElement | null>
  data: (string | number)[]
  selectedValue: string | number
  onScroll: () => void
  onClick: (value: any) => void
  formatLabel: (value: any) => string
}> = ({ scrollRef, data, selectedValue, onScroll, onClick, formatLabel }) => {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="h-full flex-1 snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="py-[75px]">
        {data.map((item) => (
          <div
            key={item}
            onClick={() => onClick(item)}
            className={`flex h-[50px] w-full cursor-pointer snap-center items-center justify-center text-lg transition-all ${
              item === selectedValue ? 'font-bold text-black' : 'font-normal text-gray-400'
            }`}
          >
            {formatLabel(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

export const TimePicker = forwardRef<
  TimePickerActions,
  {
    initialValue?: string
    closingTime?: string
  }
>(({ initialValue, closingTime }, ref) => {
  const { refs, data, state, actions, isValid } = useTimePicker({ initialTime: initialValue, closingTime })

  useImperativeHandle(ref, () => ({
    getSelectedTimeAsISO: actions.getSelectedTimeAsISO,
    isValid: isValid,
  }))

  return (
    <div className="relative h-[200px] w-full overflow-hidden">
      <div className="pointer-events-none absolute top-0 z-10 h-[75px] w-full bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 z-10 h-[75px] w-full bg-gradient-to-t from-white to-transparent" />
      <div className="pointer-events-none absolute top-[75px] z-10 h-[50px] w-full rounded-lg border border-blue-500" />

      <div className="absolute inset-0 flex">
        <WheelColumn
          scrollRef={refs.ampmRef}
          data={data.availableAmpms}
          selectedValue={state.ampm}
          onScroll={actions.handleAmPmScroll}
          onClick={(value) => actions.setSelectedTime({ ...state, ampm: value })}
          formatLabel={(v) => `${v}`}
        />
        <WheelColumn
          scrollRef={refs.hourRef}
          data={data.availableHours}
          selectedValue={state.hour}
          onScroll={actions.handleHourScroll}
          onClick={(value) => actions.setSelectedTime({ ...state, hour: value })}
          formatLabel={(v) => `${v}시`}
        />
        <WheelColumn
          scrollRef={refs.minuteRef}
          data={data.availableMinutes}
          selectedValue={state.minute}
          onScroll={actions.handleMinuteScroll}
          onClick={(value) => actions.setSelectedTime({ ...state, minute: value })}
          formatLabel={(v) => `${String(v).padStart(2, '0')}분`}
        />
      </div>
    </div>
  )
})
TimePicker.displayName = 'TimePicker'
