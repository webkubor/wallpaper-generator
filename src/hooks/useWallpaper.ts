import { ref, computed, watch } from 'vue'
import demoWallpaper from '@/assets/demo.png'
import { analyzeImageColor } from '@/utils/colorUtils'
import type { Template } from '@/types/interfaces/utils'
import type { 
  Device, 
  FontOption, 
  PositionOption, 
  TitleSettings, 
  WatermarkSettings, 
  BackgroundSettings 
} from '@/types/interfaces/home'


export const deviceTypes: Device[] = [
  { id: 'iphone', name: 'iPhone', width: 390, height: 780, hasFrame: true }, // iPhone 比例
  { id: 'ipad', name: 'iPad', width: 693, height: 520, hasFrame: true }, // iPad 4:3 比例
  { id: 'mac', name: 'Mac', width: 960, height: 600, hasFrame: true }, // Mac 16:10 比例
  { id: 'car', name: '车机', width: 832, height: 468, hasFrame: true }, // 车机 16:9 比例
  { id: 'combo', name: '组合设备', width: 640, height: 800, hasFrame: true }, // 组合设备（mac+ipad+iphone）
  { id: 'custom', name: '自定义尺寸', width: 832, height: 468, hasFrame: false } 
]

// 获取设备信息
export const getDeviceById = (id: string): Device | undefined => {
  return deviceTypes.find(device => device.id === id)
}

// 水印位置样式计算
export const getWatermarkPositionStyle = (watermarkSettings: WatermarkSettings) => {
  const { rotation, offsetX, offsetY, padding, position } = watermarkSettings;
  const baseTransform = `rotate(${rotation}deg) translate(${offsetX}px, ${offsetY}px)`;

  const positions = {
    'top-left': { top: `${padding}px`, left: `${padding}px`, transform: baseTransform },
    'top-center': { top: `${padding}px`, left: '50%', transform: `translateX(-50%) ${baseTransform}` },
    'top-right': { top: `${padding}px`, right: `${padding}px`, transform: baseTransform },
    'center-left': { top: '50%', left: `${padding}px`, transform: `translateY(-50%) ${baseTransform}` },
    'center-center': { top: '50%', left: '50%', transform: `translate(-50%, -50%) ${baseTransform}` },
    'center-right': { top: '50%', right: `${padding}px`, transform: `translateY(-50%) ${baseTransform}` },
    'bottom-left': { bottom: `${padding}px`, left: `${padding}px`, transform: baseTransform },
    'bottom-center': { bottom: `${padding}px`, left: '50%', transform: `translateX(-50%) ${baseTransform}` },
    'bottom-right': { bottom: `${padding}px`, right: `${padding}px`, transform: baseTransform },
    'center': { top: '50%', left: '50%', transform: `translate(-50%, -50%) ${baseTransform}` }
  };

  return positions[position as keyof typeof positions] || positions['bottom-right'];
}

// 默认水印设置
export const defaultWatermarkSettings: WatermarkSettings = {
  type: 'text',
  text: 'Design by 司南烛',
  fontSize: 24,
  color: '#000000',
  opacity: 0.5,
  fontFamily: 'wuxia',
  position: 'bottom-right',
  padding: 20,
  rotation: 0,
  offsetX: 0,
  offsetY: 0
}


export const defaultPreviewSettings = {
  selectedDevice: 'custom', // 默认选择自定义尺寸
  showCombined: false,
  showDeviceBorder: true,
  hasNotch: true, // iPhone 刘海开关，默认开启
  devices: deviceTypes.map(device => ({
    ...device,
    selected: false
  }))
}



// 默认背景设置
export const defaultBackgroundSettings: BackgroundSettings = {
  type: 'perspective',
  color: '#7D6A6A5E',
  fontColor: '#ffffff'
};

// Shared state
const imageUrl = ref<string | null>(demoWallpaper);
const watermarkImageUrl = ref<string | null>(null);
const watermarkSettings = ref<WatermarkSettings>({...defaultWatermarkSettings});
const currentDevice = computed(() => {
  return getDeviceById(previewSettings.value.selectedDevice) || deviceTypes[1]
});
export const defaultTitleSettings: TitleSettings = {
  show: false,
  text: '默认标题',
  fontFamily: 'wuxia',
  color: '#ffffff',
  fontSize: 24, // 默认字体大小
  direction: 'vertical',
  offsetX: 0,
  offsetY: 0,
  shadowEffect: 'default',
  shadowColor: '#000000',
  shadowSize: 2,
  strokeEnabled: false,
  strokeColor: '#000000',
  strokeWidth: 1
};
const titleSettings = ref<TitleSettings>({...defaultTitleSettings});
const previewSettings = ref({...defaultPreviewSettings});
const backgroundSettings = ref<BackgroundSettings>({...defaultBackgroundSettings});

// 自定义尺寸状态
const customWidth = ref(832);
const customHeight = ref(468);

// 存储图片颜色信息
const imageColorInfo = ref<{
  isDark: boolean;
  rgba: { r: number; g: number; b: number; a: number };
  hex: string;
} | null>(null);

// 根据图片颜色动态更新文本颜色和阴影效果
const updateTextColorBasedOnImage = async (url: string | null) => {
  if (!url) {
    watermarkSettings.value.color = defaultWatermarkSettings.color;
    titleSettings.value.color = defaultTitleSettings.color;
    backgroundSettings.value.fontColor = defaultBackgroundSettings.fontColor;
    imageColorInfo.value = null;
    return;
  }
  
  const colorResult = await analyzeImageColor(url);
  if (colorResult) {
    watermarkSettings.value.color = colorResult.textColor;
    titleSettings.value.color = colorResult.textColor;
    backgroundSettings.value.fontColor = colorResult.textColor;
    
    // 存储图片颜色信息供阴影效果使用
    imageColorInfo.value = {
      isDark: colorResult.isDark,
      rgba: colorResult.rgba,
      hex: colorResult.hex
    };
  } else {
    watermarkSettings.value.color = defaultWatermarkSettings.color;
    titleSettings.value.color = defaultTitleSettings.color;
    backgroundSettings.value.fontColor = defaultBackgroundSettings.fontColor;
    imageColorInfo.value = null;
  }
};

// 监听 imageUrl 的变化，并在变化时更新文本颜色
watch(imageUrl, updateTextColorBasedOnImage, { immediate: true });

// 定义统一的字体选项，供整个应用使用
export const fontOptions: FontOption[] = [
  { label: '阿里妈妈方圆体', value: 'AlimamaFangYuanTiVF-Thin' },
  { label: '可爱体', value: 'cute' },
  { label: '古典风', value: 'AncientStyle' },
  { label: '武侠风', value: 'wuxia' },
  { label: '细雨体', value: 'drizzle' },
  { label: '默认字体', value: 'system-ui, sans-serif' }
];

// 重置配置函数
const resetConfig = async () => {
  // 重置所有设置为默认值
  Object.assign(watermarkSettings.value, JSON.parse(JSON.stringify(defaultWatermarkSettings)));
  Object.assign(titleSettings.value, JSON.parse(JSON.stringify(defaultTitleSettings)));
  Object.assign(previewSettings.value, JSON.parse(JSON.stringify(defaultPreviewSettings)));
  Object.assign(backgroundSettings.value, JSON.parse(JSON.stringify(defaultBackgroundSettings)));
  
  // 重置自定义尺寸
  customWidth.value = 832;
  customHeight.value = 468;
  
  // 重新计算当前图片的颜色信息
  await updateTextColorBasedOnImage(imageUrl.value);
};

// 模板相关功能
const personalTemplatesRef = ref<{ loadTemplates: () => Promise<void> } | null>(null);

const loadTemplate = (template: Template) => {
  try {
    Object.assign(watermarkSettings.value, template.config.watermarkSettings);
    Object.assign(titleSettings.value, template.config.titleSettings);
    Object.assign(previewSettings.value, template.config.previewSettings);
    // 仅应用字体颜色，避免影响 PC 端背景设置
    if (template.config.backgroundSettings?.fontColor) {
      backgroundSettings.value.fontColor = template.config.backgroundSettings.fontColor;
    }
    window.$message.success(`已加载模板: ${template.name}`);
  } catch (error) {
    console.error('加载模板失败:', error);
    window.$message.error('加载模板失败');
  }
};

const handleImageUpload = (fileInfo: any) => {
  try {
    console.log('handleImageUpload received:', fileInfo, typeof fileInfo);
    
    let file: File;
    if (fileInfo instanceof File) {
      file = fileInfo;
    } else if (fileInfo && fileInfo.file instanceof File) {
      file = fileInfo.file;
    } else if (fileInfo && fileInfo.file && fileInfo.file.file instanceof File) {
      file = fileInfo.file.file;
    } else {
      console.error('Invalid file parameter:', fileInfo);
      window.$message.error('无效的文件参数');
      return;
    }
    
    console.log('Extracted file:', file, file instanceof File);

    if (!file.type.startsWith('image/')) {
      window.$message.error('请上传图片文件');
      return;
    }

    // 读取图片并直接设置为背景
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.src = e.target?.result as string;
        await img.decode();
        
        // 直接使用图片，不进行比例检查
        imageUrl.value = img.src;
        await updateTextColorBasedOnImage(img.src);
        window.$message.success('背景图片上传成功');
      } catch (error) {
        console.error('图片处理失败:', error);
        window.$message.error('图片处理失败');
      }
    };
    reader.onerror = () => {
      window.$message.error('图片读取失败');
    };
    reader.readAsDataURL(file);
  } catch (error: any) {
    console.error('图片上传失败:', error);
    window.$message.error(error?.message || '图片上传失败');
  }
};

// 设置背景图片函数
const setBackgroundImage = (url: string) => {
  if (!url) {
    window.$message.error('无效的图片URL');
    return;
  }
  
  try {
    // 创建一个新的图片对象来加载URL
    const img = new Image();
    img.onload = async () => {
      // 图片加载成功后，设置为背景
      imageUrl.value = url;
      backgroundSettings.value.type = 'perspective'; // 确保设置为透视背景模式
      await updateTextColorBasedOnImage(url);
      window.$message.success('背景图片设置成功');
    };
    
    img.onerror = () => {
      window.$message.error('图片加载失败');
    };
    
    // 开始加载图片
    img.src = url;
  } catch (error: any) {
    console.error('设置背景图片失败:', error);
    window.$message.error(error?.message || '设置背景图片失败');
  }
};

// 使用壁纸生成器
export const useWallpaper = () => {

  const positionOptions = [
    { label: '左上', value: 'top-left' },
    { label: '中上', value: 'top-center' },
    { label: '右上', value: 'top-right' },
    { label: '左中', value: 'center-left' },
    { label: '居中', value: 'center-center' },
    { label: '右中', value: 'center-right' },
    { label: '左下', value: 'bottom-left' },
    { label: '中下', value: 'bottom-center' },
    { label: '右下', value: 'bottom-right' },
  ];


  const deviceOptions = computed(() => {
    return deviceTypes.map(device => ({
      label: device.name,
      value: device.id,
    }))
  });

  // 计算属性
  const selectedDeviceInfo = computed(() => {
    return getDeviceById(previewSettings.value.selectedDevice) || deviceTypes[1]
  })
  
  const watermarkText = computed(() => {
    return watermarkSettings.value.text
  })
  
  const watermarkPositionStyle = ref(getWatermarkPositionStyle(watermarkSettings.value));
  
  watch(watermarkSettings, () => {
    watermarkPositionStyle.value = getWatermarkPositionStyle(watermarkSettings.value);
  }, { deep: true, immediate: true });
  
  // 获取选中的设备列表
  const selectedDevices = computed(() => {
    return previewSettings.value.devices.filter(device => device.selected)
  })
  
  // 设备选择切换
  const handleDeviceToggle = (device: { id: string; selected: boolean }) => {
    const deviceIndex = previewSettings.value.devices.findIndex(d => d.id === device.id)
    if (deviceIndex !== -1) {
      previewSettings.value.devices[deviceIndex].selected = !previewSettings.value.devices[deviceIndex].selected
    }
  }
  

  
  // 根据图片颜色生成适合的阴影效果
  const shadowEffect = computed(() => {
    if (!imageColorInfo.value) {
      // 默认阴影效果（深色）
      return {
        normalShadow: '0 10px 30px rgba(0,0,0,0.15), inset 0 0 8px rgba(0,0,0,0.6)',
        hoverShadow: `
          inset 0 1px 2px rgba(255, 255, 255, 0.8),
          inset 0 -1px 2px rgba(0, 0, 0, 0.4),
          5px 5px 4px rgba(0, 0, 0, 0.03),
          10px 10px 8px rgba(0, 0, 0, 0.04),
          20px 20px 16px rgba(0, 0, 0, 0.05),
          40px 40px 32px rgba(0, 0, 0, 0.06),
          120px 120px 100px rgba(0, 0, 0, 0.09)
        `,
        isDark: true
      };
    }

    const { isDark } = imageColorInfo.value;
    
    if (isDark) {
      // 图片是深色的，使用浅色阴影
      return {
        normalShadow: `0 10px 30px rgba(255,255,255,0.1), inset 0 0 8px rgba(255,255,255,0.3)`,
        hoverShadow: `
          inset 0 1px 2px rgba(255, 255, 255, 0.8),
          inset 0 -1px 2px rgba(255, 255, 255, 0.4),
          5px 5px 4px rgba(255, 255, 255, 0.02),
          10px 10px 8px rgba(255, 255, 255, 0.03),
          20px 20px 16px rgba(255, 255, 255, 0.04),
          40px 40px 32px rgba(255, 255, 255, 0.05),
          120px 120px 100px rgba(255, 255, 255, 0.07)
        `,
        isDark: true
      };
    } else {
      // 图片是浅色的，使用深色阴影
      return {
        normalShadow: `0 10px 30px rgba(0,0,0,0.15), inset 0 0 8px rgba(0,0,0,0.6)`,
        hoverShadow: `
          inset 0 1px 2px rgba(255, 255, 255, 0.8),
          inset 0 -1px 2px rgba(0, 0, 0, 0.4),
          5px 5px 4px rgba(0, 0, 0, 0.03),
          10px 10px 8px rgba(0, 0, 0, 0.04),
          20px 20px 16px rgba(0, 0, 0, 0.05),
          40px 40px 32px rgba(0, 0, 0, 0.06),
          120px 120px 100px rgba(0, 0, 0, 0.09)
        `,
        isDark: false
      };
    }
  });

  return {
    imageUrl,
    watermarkImageUrl,
    watermarkSettings,
    previewSettings,
    backgroundSettings,
    customWidth,
    customHeight,
    deviceOptions,
    fontOptions,
    positionOptions,
    currentDevice,
    selectedDeviceInfo,
    selectedDevices,
    watermarkText,
    watermarkPositionStyle,
    titleSettings,
    handleDeviceToggle,
    deviceTypes,
    shadowEffect,  // 导出阴影效果
    updateTextColorBasedOnImage,  // 导出颜色更新函数
    resetConfig,  // 导出重置配置函数
    personalTemplatesRef,  // 导出模板引用
    loadTemplate,  // 导出加载模板函数
    handleImageUpload,  // 导出图片上传处理函数
    setBackgroundImage  // 导出设置背景图片函数
  }
}
