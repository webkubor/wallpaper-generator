import { ref, computed } from 'vue'

// 类型定义
export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  selected?: boolean;
}

export interface FontOption {
  label: string;
  value: string;
}

export interface PositionOption {
  value: string;
  label: string;
}

export interface WatermarkSettings {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  fontFamily: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  padding: number;
  rotation: number;
}

export interface ScalingMode {
  value: string;
  label: string;
}

// 设备类型定义
export const deviceTypes: Device[] = [
  { id: 'iphone', name: 'iPhone', width: 270, height: 584 },  // 约 0.69 倍缩放，保持宽高比
  { id: 'ipad', name: 'iPad', width: 400, height: 575 },      // 约 0.49 倍缩放，保持宽高比
  { id: 'mac', name: 'Mac', width: 480, height: 300 },        // 约 0.33 倍缩放，保持宽高比
  { id: 'custom', name: '自定义尺寸', width: 400, height: 400 }  // 默认正方形
]

// 获取设备信息
export const getDeviceById = (id: string): Device | undefined => {
  return deviceTypes.find(device => device.id === id)
}

// 水印位置样式计算
export const getWatermarkPositionStyle = (watermarkSettings: WatermarkSettings) => {
  const positions = {
    'top-left': { top: watermarkSettings.padding + 'px', left: watermarkSettings.padding + 'px' },
    'top-right': { top: watermarkSettings.padding + 'px', right: watermarkSettings.padding + 'px' },
    'bottom-left': { bottom: watermarkSettings.padding + 'px', left: watermarkSettings.padding + 'px' },
    'bottom-right': { bottom: watermarkSettings.padding + 'px', right: watermarkSettings.padding + 'px' },
    'center': { top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${watermarkSettings.rotation}deg)` }
  }
  return positions[watermarkSettings.position as keyof typeof positions]
}

// 默认水印设置
export const defaultWatermarkSettings: WatermarkSettings = {
  text: 'Design by 司南烛',
  fontSize: 24,
  color: '#000000',
  opacity: 0.5,
  fontFamily: 'Chinese3',
  position: 'bottom-right',
  padding: 20,
  rotation: 0
}

// 缩放模式选项
export const scalingModes: ScalingMode[] = [
  { value: 'contain', label: '等比缩放（可能留白）' },
  { value: 'cover', label: '填充（可能裁剪）' }
];

// 默认预览设置
export const defaultPreviewSettings = {
  selectedDevice: 'iphone',
  showCombined: false,
  backgroundColor: '#ffffff',
  showDeviceBorder: true,
  scalingMode: 'contain', // 默认使用等比缩放模式
  devices: deviceTypes.map(device => ({
    ...device,
    selected: false
  }))
}

// 使用壁纸生成器
export const useWallpaper = () => {
  const imageUrl = ref<string | null>(null);
  const watermarkImageUrl = ref<string | null>(null);
  const watermarkSettings = ref<WatermarkSettings>({...defaultWatermarkSettings})
  const previewSettings = ref({...defaultPreviewSettings})
  
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

  const scalingModeOptions = computed(() => {
    return scalingModes.map(mode => ({
      label: mode.label,
      value: mode.value,
    }))
  });

  const deviceOptions = computed(() => {
    return deviceTypes.map(device => ({
      label: device.name,
      value: device.id,
    }))
  });

  // 计算属性
  const selectedDeviceInfo = computed(() => {
    return getDeviceById(previewSettings.value.selectedDevice) || deviceTypes[0]
  })
  
  const watermarkText = computed(() => {
    return watermarkSettings.value.text
  })
  
  const watermarkPositionStyle = computed(() => {
    return getWatermarkPositionStyle(watermarkSettings.value)
  })
  
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
    return getDeviceById(previewSettings.value.selectedDevice) || deviceTypes[0]
  })
  
  return {
    imageUrl,
    watermarkImageUrl,
    watermarkSettings,
    previewSettings,
    deviceOptions,
    fontOptions,
    positionOptions,
    scalingModeOptions,
    currentDevice,
    selectedDeviceInfo,
    selectedDevices,
    watermarkText,
    watermarkPositionStyle,
    handleDeviceToggle,
    deviceTypes,
  }
}
