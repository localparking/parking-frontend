import { CategoryDto } from '@data/user-api-axios/api'
import { cn } from '@ui/common/lib/utils'

import CafeIcon from '@/assets/icons/cafe.png'
import FoodIcon from '@/assets/icons/food.png'
import CultureIcon from '@/assets/icons/culture.png'
import LeisureIcon from '@/assets/icons/leisure.png'
import StoreIcon from '@/assets/icons/store.png'

export const STORE_ICON_MAP = {
  1: CafeIcon,
  2: FoodIcon,
  3: CultureIcon,
  4: LeisureIcon,
  5: StoreIcon,
}

interface StoreCategoryIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category: CategoryDto | undefined
  className?: string
}

export const StoreCategoryIcon = (props: StoreCategoryIconProps) => {
  const { category, className = 'w-10 h-10', ...rest } = props
  if (!category) return null

  const categoryId = category?.parentId ?? category?.categoryId
  const icon = STORE_ICON_MAP[categoryId]

  return (
    <img
      src={icon}
      alt={icon}
      className={cn('h-full w-full object-contain', className)}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  )
}
