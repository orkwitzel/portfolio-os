import { basename } from '@/utils/paths'

export const NOTEPAD_FIELD_CLASS = 'notepad-field'

export function notepadWindowTitle(path: string | null, dirty: boolean): string {
  const name = path ? basename(path) : 'Untitled'
  return `${dirty ? '*' : ''}${name} - Notepad`
}

export function saveChangesMessage(path: string | null): string {
  const name = path ? basename(path) : 'Untitled'
  return `The text in ${name} has changed.\nDo you want to save changes?`
}
