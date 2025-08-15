import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const ctwMerge = extendTailwindMerge({
  extend: {
    theme: {
      font: ['suit'],
      text: [
        'title-1',
        'title-2',
        'subtitle-1',
        'subtitle-2',
        'subtitle-3',
        'body-1',
        'body-2',
        'body-3',
        'body-4',
        'body-5',
        'body-6',
        'caption-1',
        'caption-2',
        'caption-3',
        'caption-4',
        'caption-5',
      ],
      animate: ['up', 'down'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return ctwMerge(clsx(inputs))
}
