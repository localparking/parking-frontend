import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog'
import { useNavigate } from '@tanstack/react-router'
import userService from '@/shared/services/user.service'
import type { MyInfoUpdateRequestDto } from '@data/user-api-axios/api'

export function useMyProfile() {
  const { user, updateMyInfo } = useAuth()
  const navigate = useNavigate()
  const { open } = useAlertDialog()
  const queryClient = useQueryClient()

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['myProfile', user?.email],
    queryFn: () => userService.getMyProfile(),
    enabled: !!user,
    select: (res) => {
      const d = res?.data
      if (!d) return null
      return {
        nickname: d.nickname || '',
        name: d.name || '',
        tel: d.tel || '',
        regionName: d.regionName || '',
        vehicleNumber: d.vehicleNumber || '',
        isNotification: !!d.isNotification,
      }
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: MyInfoUpdateRequestDto) => {
      const result = await updateMyInfo(payload)

      if (!result.success) {
        throw new Error(result.message)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile', user?.email] })
      open({
        title: '프로필이 업데이트되었어요',
        onConfirm: () => navigate({ to: '..', replace: true }),
      })
    },
    onError: (error: any) => {
      open({
        title: '업데이트 실패',
        description: error?.message || '잠시 후 다시 시도해주세요.',
      })
    },
  })

  return {
    user,
    profileData,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  }
}
