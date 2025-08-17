import { CategoryDto } from '@data/user-api-axios/api'

import CafeIcon from '@/assets/icons/cafe.svg'
import FoodIcon from '@/assets/icons/food.svg'
import CultureIcon from '@/assets/icons/culture.svg'
import LeisureIcon from '@/assets/icons/leisure.svg'
import StoreIcon from '@/assets/icons/store.svg'

export const STORE_ICON_MAP = {
  1: CafeIcon,
  2: FoodIcon,
  3: CultureIcon,
  4: LeisureIcon,
  5: StoreIcon,
}

interface StoreCategoryIconProps {
  category: CategoryDto | undefined
  className?: string
}

export const StoreCategoryIcon = (props: StoreCategoryIconProps) => {
  const { category, className = 'w-10 h-10' } = props
  if (!category) return null

  const Icon = STORE_ICON_MAP[category.parentId ?? category.categoryId]
  return Icon ? <Icon className={className} /> : null
}
