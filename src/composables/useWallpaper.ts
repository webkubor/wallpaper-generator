import { ref, computed, watch } from 'vue'
import demoWallpaper from '../assets/demo.png'
import { FastAverageColor } from 'fast-average-color'

// 类型定义
export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  selected?: boolean;
  hasFrame?: boolean;
}

export interface FontOption {
  label: string;
  value: string;
}

export interface PositionOption {
  value: string;
  label: string;
}

export interface TitleSettings {
  text: string;
  fontFamily: string;
  color: string;
  direction: 'horizontal' | 'vertical';
  offsetX: number;
  offsetY: number;
}

export interface WatermarkSettings {
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  fontSize: number;
  color: string;
  opacity: number;
  fontFamily: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  padding: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}


export const deviceTypes: Device[] = [
  { id: 'iphone', name: 'iPhone', width: 300, height: 600, hasFrame: true }, // 更新宽高比
  { id: 'ipad', name: 'iPad', width: 533, height: 400, hasFrame: true }, // 4:3
  { id: 'car', name: '车机', width: 640, height: 360, hasFrame: true }, // 16:9比例
  { id: 'combo', name: '组合设备', width: 640, height: 800, hasFrame: true }, // 组合设备预览
  { id: 'custom', name: '自定义尺寸', width: 400, height: 400, hasFrame: false }  
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
    'top-right': { top: `${padding}px`, right: `${padding}px`, transform: baseTransform },
    'bottom-left': { bottom: `${padding}px`, left: `${padding}px`, transform: baseTransform },
    'bottom-right': { bottom: `${padding}px`, right: `${padding}px`, transform: baseTransform },
    'center': { top: '50%', left: '50%', transform: `translate(-50%, -50%) ${baseTransform}` }
  };

  return positions[position as keyof typeof positions];
}

// 默认水印设置
export const defaultWatermarkSettings: WatermarkSettings = {
  type: 'text',
  text: 'Design by 司南烛',
  fontSize: 24,
  color: '#000000',
  opacity: 0.5,
  fontFamily: 'Chinese3',
  position: 'bottom-right',
  padding: 20,
  rotation: 0,
  offsetX: 0,
  offsetY: 0
}


// 默认预览设置
export const defaultPreviewSettings = {
  selectedDevice: 'car', // 默认选择车机尺寸
  showCombined: false,
  showDeviceBorder: true,
  devices: deviceTypes.map(device => ({
    ...device,
    selected: false
  }))
}

// Shared state
const imageUrl = ref<string | null>(demoWallpaper);
const watermarkImageUrl = ref<string | null>(null);
const watermarkSettings = ref<WatermarkSettings>({...defaultWatermarkSettings});
export const defaultTitleSettings: TitleSettings = {
  text: '默认标题',
  fontFamily: 'Arial',
  color: '#ffffff',
  direction: 'vertical',
  offsetX: 0,
  offsetY: 0,
};
const titleSettings = ref<TitleSettings>({...defaultTitleSettings});
const previewSettings = ref({...defaultPreviewSettings});

// 实例化颜色分析器
const fac = new FastAverageColor();

// 根据图片颜色动态更新文本颜色
const updateTextColorBasedOnImage = async (url: string | null) => {
  if (!url) {
    watermarkSettings.value.color = defaultWatermarkSettings.color;
    titleSettings.value.color = defaultTitleSettings.color;
    return;
  }
  try {
    const color = await fac.getColorAsync(url);
    const newColor = color.isDark ? '#ffffff' : '#000000';
    watermarkSettings.value.color = newColor;
    titleSettings.value.color = newColor;
  } catch (e) {
    console.error(e);
    watermarkSettings.value.color = defaultWatermarkSettings.color;
    titleSettings.value.color = defaultTitleSettings.color;
  }
};

// 监听 imageUrl 的变化，并在变化时更新文本颜色
watch(imageUrl, updateTextColorBasedOnImage, { immediate: true });

// 使用壁纸生成器
export const useWallpaper = () => {
  
  const fontOptions: FontOption[] = [
    { label: '阿里妈妈方圆体', value: 'AlimamaFangYuanTiVF-Thin' },
    { label: '细雨体', value: 'drizzle' },
    { label: '可爱体', value: 'cute' },
    { label: '吸血鬼战争', value: 'vampire-wars' },
    { label: 'AI中文02', value: 'AiChinese02' },
    { label: '中文3', value: 'Chinese3' },
  ];

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
  
  const currentDevice = computed(() => {
    return getDeviceById(previewSettings.value.selectedDevice) || deviceTypes[1]
  })
  
  return {
    imageUrl,
    watermarkImageUrl,
    watermarkSettings,
    previewSettings,
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
  }
}
