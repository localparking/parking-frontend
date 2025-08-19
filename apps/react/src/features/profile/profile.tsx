import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Button from '@/shared/ui/button'
import { MyPageHeader } from '@/shared/ui'
import type { MyInfoUpdateRequestDto } from '@data/user-api-axios/api'
import { ProfileInputField, ProfileInfoDisplay, ProfileToggleSwitch } from '@/features/profile/ui'
import { useMyProfile } from '@/features/profile/hooks'

const PROFILE_FIELDS = [
  { key: 'name', label: '이름', placeholder: '이름을 입력해주세요' },
  { key: 'tel', label: '전화번호', placeholder: '전화번호를 입력해주세요' },
  { key: 'regionName', label: '차량 지역 정보', placeholder: '지역 정보를 선택하세요' },
  { key: 'vehicleNumber', label: '차량번호', placeholder: '차량번호를 입력하세요 예) 123가 1234' },
] as const

export function MyPageProfile() {
  const { user, profileData, isLoading, isUpdating, updateProfile } = useMyProfile()
  const navigate = useNavigate()

  const [basicInfo, setBasicInfo] = useState<MyInfoUpdateRequestDto | null>(null)

  useEffect(() => {
    if (profileData && basicInfo === null) {
      setBasicInfo(profileData)
    }
  }, [profileData, basicInfo])

  const handleBasicInfoChange = <K extends keyof MyInfoUpdateRequestDto>(key: K, value: MyInfoUpdateRequestDto[K]) => {
    if (basicInfo) {
      setBasicInfo((prev) => (prev ? { ...prev, [key]: value } : null))
    }
  }

  const hasChanges = useMemo(() => {
    if (!profileData || !basicInfo) return false
    const keys = Object.keys(profileData) as Array<keyof MyInfoUpdateRequestDto>
    return keys.some((key) => profileData[key] !== basicInfo[key])
  }, [profileData, basicInfo])

  const handleSubmit = () => {
    if (basicInfo) {
      updateProfile(basicInfo)
    }
  }

  if (isLoading || !basicInfo || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-2">프로필 정보를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <MyPageHeader title="계정정보" onClick={() => navigate({ to: '/mypage' })} />
      <div className="flex flex-col gap-3 p-6">
        {/* 계정 이메일 */}
        <ProfileInfoDisplay label="계정 이메일" value={user.email} />
        <div className="h-px w-full bg-gray-300" />

        {/* 프로필 입력 필드 */}
        {PROFILE_FIELDS.map((field) => (
          <ProfileInputField
            key={field.key}
            label={field.label}
            value={basicInfo[field.key]}
            onChange={(value) => handleBasicInfoChange(field.key, value)}
            placeholder={field.placeholder}
          />
        ))}

        <div className="h-px w-full bg-gray-300" />

        {/* 마케팅 정보 수신 동의 */}
        <ProfileToggleSwitch
          label="마케팅 정보 수신 동의"
          checked={basicInfo.isNotification}
          onChange={(checked) => handleBasicInfoChange('isNotification', checked)}
        />

        {hasChanges && (
          <div className="mt-6">
            <Button loading={isUpdating} onClick={handleSubmit} className="w-full" disabled={isUpdating}>
              저장하기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
