import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CategoryDto } from '@data/user-api-axios/api'
import { categoryService } from '@/shared/services/category.service'

export interface CategoryNode extends CategoryDto {
  children: CategoryNode[]
}

interface CategoryContextType {
  allCategories: CategoryDto[]
  categoryTree: CategoryNode[]
  isCategoriesLoading: boolean
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

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

  const { categoryTree } = useMemo(() => {
    const categoriesById = new Map<number, CategoryNode>()
    const tree: CategoryNode[] = []

    if (allCategories.length === 0) {
      return { categoryTree: [] }
    }

    allCategories.forEach((cat) => {
      categoriesById.set(cat.categoryId, { ...cat, children: [] })
    })

    categoriesById.forEach((node) => {
      if (node.parentId === null || node.parentId === undefined) {
        // 부모 카테고리인 경우
        tree.push(node)
      } else {
        // 자식 카테고리인 경우
        const parent = categoriesById.get(node.parentId)
        if (parent) {
          parent.children.push(node)
        }
      }
    })

    return { categoryTree: tree }
  }, [allCategories])

  return (
    <CategoryContext.Provider
      value={{
        allCategories,
        categoryTree,
        isCategoriesLoading,
      }}
    >
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
