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
  parentIdToPrefixMap: Map<number, string>
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

const CATEGORY_NAME_TO_PREFIX_MAP: Record<string, string> = {
  커피: 'cafe',
  음식점: 'food',
  문화: 'culture',
  여가: 'leisure',
  상점: 'shopping',
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

  const { categoryTree, parentIdToPrefixMap } = useMemo(() => {
    const categoriesById = new Map<number, CategoryNode>()
    const tree: CategoryNode[] = []
    const idToPrefixMap = new Map<number, string>()

    if (allCategories.length === 0) {
      return { categoryTree: [], parentIdToPrefixMap: new Map() }
    }

    allCategories.forEach((cat) => {
      categoriesById.set(cat.categoryId, { ...cat, children: [] })
    })

    categoriesById.forEach((node) => {
      if (node.parentId === null || node.parentId === undefined) {
        // 부모 카테고리인 경우
        tree.push(node)
        const prefix = CATEGORY_NAME_TO_PREFIX_MAP[node.categoryName || ''] || 'store'
        idToPrefixMap.set(node.categoryId, prefix)
      } else {
        // 자식 카테고리인 경우
        const parent = categoriesById.get(node.parentId)
        if (parent) {
          parent.children.push(node)
          // 자식 카테고리는 부모의 prefix를 상속받음
          const parentPrefix = CATEGORY_NAME_TO_PREFIX_MAP[parent.categoryName || ''] || 'store'
          idToPrefixMap.set(node.categoryId, parentPrefix)
        }
      }
    })

    return { categoryTree: tree, parentIdToPrefixMap: idToPrefixMap }
  }, [allCategories])

  return (
    <CategoryContext.Provider
      value={{
        allCategories,
        categoryTree,
        isCategoriesLoading,
        parentIdToPrefixMap,
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
