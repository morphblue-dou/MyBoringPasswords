import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export function useClipboard() {
  const copyToClipboard = useCallback(async (text: string, clearAfter: number = 30000) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (clearAfter > 0) {
      setTimeout(async () => {
        const currentContent = await Clipboard.getStringAsync();
        if (currentContent === text) {
          await Clipboard.setStringAsync('');
        }
      }, clearAfter);
    }
  }, []);

  return { copyToClipboard };
}
