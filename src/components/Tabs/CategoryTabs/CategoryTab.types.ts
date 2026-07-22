export interface Tab {
  value: number
  label: string
  clickable?: boolean
}

export interface FollowTargetTab {
  targetIndex: number
  progress: number
}
