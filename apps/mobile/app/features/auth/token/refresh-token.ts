import axios, { isAxiosError } from 'axios'
import { AuthStorage } from '../lib/auth-storage'

export async function refreshToken(): Promise<{ accessToken: string | null }> {
  try {
    const token = await AuthStorage.getRefreshToken()
    const apiResponse = await axios.post(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )

    if (apiResponse.data && apiResponse.data.data) {
      const { accessToken, refreshToken } = apiResponse.data.data
      await AuthStorage.setAccessToken(accessToken)
      await AuthStorage.setRefreshToken(refreshToken)
    }

    return {
      accessToken: apiResponse.data.data?.accessToken || null,
    }
  } catch (apiError) {
    if (isAxiosError(apiError)) {
      if (apiError.response) {
        return { accessToken: null }
      }
    }
    return { accessToken: null }
  }
}
