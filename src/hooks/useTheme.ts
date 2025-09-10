import { darkTheme } from "naive-ui";
import { useDark } from "@vueuse/core";
import { computed } from "vue";

export function useTheme() {
  const isDark = useDark();
  
  const themeOverrides = computed(() => ({
    common: {
      primaryColor: isDark.value ? '#ffd700' : '#1a1f36',
      primaryColorHover: isDark.value ? '#ffed4e' : '#2d3348',
      primaryColorPressed: isDark.value ? '#e6c200' : '#0f1419',
      primaryColorSuppl: isDark.value ? 'rgba(255, 215, 0, 0.5)' : 'rgba(26, 31, 54, 0.5)'
    },
    Card: {
      borderRadius: '16px',
      color: isDark.value ? '#1e1e1e' : '#ffffff',
      colorModal: isDark.value ? '#1e1e1e' : '#ffffff',
      colorPopover: isDark.value ? '#1e1e1e' : '#ffffff',
      boxShadow: isDark.value 
        ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' 
        : '0 8px 32px rgba(26, 31, 54, 0.15), 0 4px 16px rgba(26, 31, 54, 0.1)'
    },
    Button: {
      borderRadius: '12px',
      colorPrimary: isDark.value 
        ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' 
        : 'linear-gradient(135deg, #1a1f36 0%, #2d3348 100%)',
      colorHoverPrimary: isDark.value 
        ? 'linear-gradient(135deg, #ffed4e 0%, #fff176 100%)' 
        : 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      colorPressedPrimary: isDark.value 
        ? 'linear-gradient(135deg, #e6c200 0%, #ffd700 100%)' 
        : 'linear-gradient(135deg, #0f1419 0%, #1a1f36 100%)'
    },
    Collapse: {
      titleFontWeight: '600'
    }
  }));

  return {
    isDark,
    darkTheme,
    themeOverrides
  };
}