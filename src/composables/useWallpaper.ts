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
  id: string;
  name: string;
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

// 设备类型定义
export const deviceTypes: Device[] = [
  { id: 'iphone', name: 'iPhone', width: 390, height: 844 },
  { id: 'ipad', name: 'iPad', width: 820, height: 1180 },
  { id: 'mac', name: 'Mac', width: 1440, height: 900 },
  { id: 'xiaohongshu', name: '小红书', width: 1080, height: 1920 }
]

// 字体列表
export const fontList: FontOption[] = [
  { id: '1', name: 'Arial', value: 'Arial' },
  { id: '2', name: 'Verdana', value: 'Verdana' },
  { id: '3', name: 'Helvetica', value: 'Helvetica' },
  { id: '4', name: 'Tahoma', value: 'Tahoma' },
  { id: '5', name: 'Times', value: 'Times' },
  { id: '6', name: 'Courier', value: 'Courier' },
  { id: '7', name: 'Georgia', value: 'Georgia' },
  { id: '8', name: 'Palatino', value: 'Palatino' },
  { id: '9', name: 'Garamond', value: 'Garamond' },
  { id: '10', name: 'Bookman', value: 'Bookman' },
  { id: '11', name: 'Comic Sans MS', value: 'Comic Sans MS' },
  { id: '12', name: 'Trebuchet MS', value: 'Trebuchet MS' },
  { id: '13', name: 'Arial Black', value: 'Arial Black' },
  { id: '14', name: 'Impact', value: 'Impact' },
  { id: '15', name: 'Lucida Sans', value: 'Lucida Sans' },
  { id: '16', name: 'Lucida Console', value: 'Lucida Console' },
  { id: '17', name: 'Monaco', value: 'Monaco' },
  { id: '18', name: 'Copperplate', value: 'Copperplate' },
  { id: '19', name: 'PingFang SC', value: 'PingFang SC' },
  { id: '20', name: 'Microsoft YaHei', value: 'Microsoft YaHei' },
  { id: '21', name: 'SimHei', value: 'SimHei' },
  { id: '22', name: 'SimSun', value: 'SimSun' },
  { id: '23', name: 'KaiTi', value: 'KaiTi' },
  { id: '24', name: 'FangSong', value: 'FangSong' }
]

// 位置选项
export const positionOptions: PositionOption[] = [
  { value: 'top-left', label: '左上角' },
  { value: 'top-right', label: '右上角' },
  { value: 'bottom-left', label: '左下角' },
  { value: 'bottom-right', label: '右下角' },
  { value: 'center', label: '居中' }
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
  text: 'Wallpaper',
  fontSize: 24,
  color: '#ffffff',
  opacity: 0.5,
  fontFamily: 'Arial',
  position: 'bottom-right',
  padding: 20,
  rotation: 0
}

// 默认预览设置
export const defaultPreviewSettings = {
  selectedDevice: 'iphone',
  showCombined: false,
  backgroundColor: '#ffffff',
  showDeviceBorder: true,
  devices: deviceTypes.map(device => ({
    ...device,
    selected: false
  }))
}

// 使用壁纸生成器
export const useWallpaper = () => {
  const imageUrl = ref('')
  const watermarkSettings = ref<WatermarkSettings>({...defaultWatermarkSettings})
  const previewSettings = ref({...defaultPreviewSettings})
  
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
  
  return {
    imageUrl,
    watermarkSettings,
    previewSettings,
    selectedDeviceInfo,
    selectedDevices,
    watermarkText,
    watermarkPositionStyle,
    handleDeviceToggle,
    deviceTypes,
    fontList,
    positionOptions
  }
}
