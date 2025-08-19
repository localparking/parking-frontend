import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import { useRouter } from '@tanstack/react-router'

export function useOrderModal(storeResponse) {
  const alertDialog = useAlertDialog()
  const router = useRouter()

  const backAlertModal = () => {
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
        router.navigate({ to: '/map', search: { storeId: storeResponse.storeId } })
      },
      onConfirm: () => {
        alertDialog.close()
      },
    })
  }

  return {
    backAlertModal,
  }
}
