import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CategoryDto } from '@data/user-api-axios/api'
import { categoryService } from '@/shared/services/category.service'

interface CategoryContextType {
  allCategories: CategoryDto[]
  isCategoriesLoading: boolean
  parentIdToPrefixMap: Map<number, string>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

const PARENT_ID_PREFIX_MAP_CONFIG = {
  1: 'cafe', // 커피
  2: 'food', // 음식점
  3: 'culture', // 문화
  4: 'leisure', // 여가
  5: 'shopping', // 상점
}

export function CategoryProvider({ children }: { children: ReactNode }) {
  const { data: allCategories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const response = await categoryService.getCategoriesAll()
      return response
    },
    select: (response) => response.data?.category || [],
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const parentIdToPrefixMap = useMemo(() => {
    const map = new Map<number, string>()

    Object.entries(PARENT_ID_PREFIX_MAP_CONFIG).forEach(([id, prefix]) => {
      map.set(Number(id), prefix)
    })
    return map
  }, [])

  return (
    <CategoryContext.Provider value={{ allCategories, isCategoriesLoading, parentIdToPrefixMap }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryContext() {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider')
  }
  return context
}
