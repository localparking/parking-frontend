import { type CategoryNode } from '@/shared/context/category-context'

// 선택된 카테고리 ID 배열로 부모 카테고리를 찾아 반환하는 함수
export const findParentCategoryByIds = (
  categoryTree: CategoryNode[],
  categoryIds: number[] | undefined
): CategoryNode | null => {
  if (!categoryIds || categoryIds.length === 0) return null

  const firstCategoryId = categoryIds[0]

  // 선택된 ID가 이미 상위 카테고리인 경우
  const directParent = categoryTree.find((cat) => cat.categoryId === firstCategoryId)
  if (directParent && (directParent.parentId === null || directParent.parentId === undefined)) {
    return directParent
  }

  // 자식 카테고리인 경우 부모를 탐색
  for (const parent of categoryTree) {
    if (parent.children.some((child) => child.categoryId === firstCategoryId)) {
      return parent
    }
  }
  return null
}
