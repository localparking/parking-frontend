import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import { useRouter } from '@tanstack/react-router'

export function useOrderModal() {
  const alertDialog = useAlertDialog()
  const router = useRouter()

  const backAlertModal = ({ storeId }: { storeId: string }) => {
    alertDialog.open({
      title: (
        <>
          잠깐만요!
          <br /> 같은 가게의 메뉴만 담을 수 있어요
        </>
      ),
      description: <>지금 담긴 메뉴를 유지할까요?</>,
      cancelText: '새로 담을게요',
      confirmText: '네 유지할래요',
      onCancel: () => {
        alertDialog.close()
        router.navigate({ to: '/map', search: { storeId } })
      },
      onConfirm: () => {
        alertDialog.close()
      },
    })
  }

  const saveVisitorInfoModal = ({ onConfirm }: { onConfirm: () => void }) => {
    alertDialog.open({
      title: (
        <>
          해당 방문자 정보를 <br />
          기본값으로 저장하시겠습니까?
        </>
      ),
      description: <>언제든지 마이페이지에서 수정할 수 있어요</>,
      cancelText: '닫기',
      confirmText: '저장하기',
      onCancel: () => {
        alertDialog.close()
      },
      onConfirm: () => {
        alertDialog.close()
        onConfirm()
      },
    })
  }

  const deleteItemModal = ({ onConfirm }: { onConfirm: () => void }) => {
    alertDialog.open({
      title: (
        <>
          선택하신 메뉴를
          <br />
          삭제하시겠습니까?
        </>
      ),
      cancelText: '유지할래요',
      confirmText: '네 삭제할게요',
      onCancel: () => {
        alertDialog.close()
      },
      onConfirm: () => {
        alertDialog.close()
        onConfirm()
      },
    })
  }

  return {
    backAlertModal,
    saveVisitorInfoModal,
    deleteItemModal,
  }
}
