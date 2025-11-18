export interface PreviewImage {
  file: File,
  url: string
}

export interface LoginState {
  onLogin?: (token: string) => void
  onLogout: () => void
}
