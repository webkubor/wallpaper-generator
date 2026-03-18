import { useWallpaper } from '../composables/useWallpaper';
import { captureWallpaper } from './captureUtils';
import { ref } from 'vue';

// 全局引用，用于存储 DOM 预览区域
export const globalPreviewArea = ref<HTMLElement | null>(null);

// 预设模板定义
const TEMPLATES: Record<string, any> = {
  xiaohongshu: {
    watermark: { text: "小红书", fontSize: 18, color: "#ff2442", opacity: 0.8, position: "bottom-right" as const },
    title: { show: true, text: "今日份美好", fontSize: 56, color: "#ffffff", direction: "horizontal" as const, fontFamily: "cute" },
    preview: { selectedDevice: "iphone", showDeviceBorder: false, hasNotch: false },
    background: { type: "perspective" as const }
  },
  business: {
    watermark: { text: "PROFESSIONAL", fontSize: 16, color: "#2c3e50", opacity: 0.6, position: "bottom-center" as const },
    title: { show: true, text: "BUSINESS", fontSize: 42, color: "#34495e", direction: "horizontal" as const, fontFamily: "drizzle" },
    preview: { selectedDevice: "mac", showDeviceBorder: true },
    background: { type: "color" as const, color: "#ecf0f1" }
  },
  minimal: {
    watermark: { text: "", opacity: 0 },
    title: { show: false },
    preview: { selectedDevice: "custom", showDeviceBorder: false },
    background: { type: "color" as const, color: "#ffffff" }
  },
  vintage: {
    watermark: { text: "Memories", fontSize: 20, color: "#d4a574", opacity: 0.7, position: "bottom-left" as const },
    title: { show: true, text: "时光", fontSize: 48, color: "#8b7355", direction: "vertical" as const, fontFamily: "AncientStyle" },
    preview: { selectedDevice: "ipad", showDeviceBorder: true },
    background: { type: "perspective" as const }
  },
  cute: {
    watermark: { text: "🌸", fontSize: 24, color: "#ff69b4", opacity: 0.8, position: "top-right" as const },
    title: { show: true, text: "可爱满分", fontSize: 52, color: "#ff85a2", direction: "horizontal" as const, fontFamily: "cute" },
    preview: { selectedDevice: "iphone", showDeviceBorder: true, hasNotch: true },
    background: { type: "color" as const, color: "#fff0f5" }
  }
};

export function initWebMCP() {
  const { 
    imageUrl, 
    watermarkSettings, 
    titleSettings, 
    previewSettings, 
    backgroundSettings,
    customWidth,
    customHeight,
    resetConfig 
  } = useWallpaper();

  // 定义工具实现
  const tools = {
    /**
     * 获取当前壁纸配置
     * 用于 AI 了解当前状态
     */
    get_wallpaper_config: () => {
      return {
        imageUrl: imageUrl.value,
        watermark: { ...watermarkSettings.value },
        title: { ...titleSettings.value },
        preview: { ...previewSettings.value },
        background: { ...backgroundSettings.value },
        customSize: {
          width: customWidth.value,
          height: customHeight.value
        }
      };
    },

    /**
     * 更新壁纸配置
     * 支持部分更新，只需传入需要修改的字段
     */
    update_wallpaper_config: (params: any) => {
      if (params.watermark) {
        Object.assign(watermarkSettings.value, params.watermark);
      }
      if (params.title) {
        Object.assign(titleSettings.value, params.title);
      }
      if (params.preview) {
        Object.assign(previewSettings.value, params.preview);
      }
      if (params.background) {
        Object.assign(backgroundSettings.value, params.background);
      }
      
      console.log('🎨 WebMCP: Config updated', params);
      return { 
        success: true, 
        message: '配置已更新',
        currentConfig: tools.get_wallpaper_config() 
      };
    },

    /**
     * 设置背景图片 URL
     * 支持 http/https 链接或 base64 数据
     */
    set_image_url: (params: { url: string }) => {
      if (!params.url) {
        throw new Error('URL is required');
      }
      imageUrl.value = params.url;
      console.log('🖼️ WebMCP: Image URL set', params.url.substring(0, 50) + '...');
      return { 
        success: true, 
        message: '图片已设置',
        imageUrl: imageUrl.value 
      };
    },

    /**
     * 导出壁纸
     * 触发截图并下载
     */
    export_wallpaper: async (params: { 
      mode?: 'withBackground' | 'withoutBackground', 
      filename?: string 
    } = {}) => {
      if (!globalPreviewArea.value) {
        throw new Error('预览区域未初始化，请等待页面加载完成');
      }
      
      const mode = params.mode || 'withBackground';
      const filename = params.filename || `wallpaper-${Date.now()}.png`;
      
      try {
        await captureWallpaper(globalPreviewArea.value, mode, filename);
        console.log('💾 WebMCP: Wallpaper exported', filename);
        return { 
          success: true, 
          message: '壁纸已导出',
          filename 
        };
      } catch (error) {
        console.error('导出失败:', error);
        throw new Error('导出失败: ' + (error as Error).message);
      }
    },

    /**
     * 重置壁纸配置
     * 恢复所有设置为默认值
     */
    reset_wallpaper_config: async () => {
      await resetConfig();
      console.log('🔄 WebMCP: Config reset');
      return { 
        success: true, 
        message: '配置已重置',
        currentConfig: tools.get_wallpaper_config()
      };
    },

    /**
     * 应用预设模板
     * 一键应用完整的设计风格
     */
    apply_template: (params: { templateId: string }) => {
      const template = TEMPLATES[params.templateId];
      if (!template) {
        const availableTemplates = Object.keys(TEMPLATES).join(', ');
        throw new Error(`未知模板: ${params.templateId}。可用模板: ${availableTemplates}`);
      }

      // 应用模板配置
      if (template.watermark) {
        Object.assign(watermarkSettings.value, template.watermark);
      }
      if (template.title) {
        Object.assign(titleSettings.value, template.title);
      }
      if (template.preview) {
        Object.assign(previewSettings.value, template.preview);
      }
      if (template.background) {
        Object.assign(backgroundSettings.value, template.background);
      }

      console.log('🎭 WebMCP: Template applied', params.templateId);
      return {
        success: true,
        message: `已应用 ${params.templateId} 模板`,
        templateId: params.templateId,
        currentConfig: tools.get_wallpaper_config()
      };
    },

    /**
     * 设置水印位置
     * 支持预设位置或精确坐标
     */
    set_watermark_position: (params: { 
      position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom',
      x?: number,
      y?: number
    }) => {
      const positionMap: Record<string, { offsetX: number; offsetY: number }> = {
        'top-left': { offsetX: 20, offsetY: 20 },
        'top-right': { offsetX: -20, offsetY: 20 },
        'bottom-left': { offsetX: 20, offsetY: -20 },
        'bottom-right': { offsetX: -20, offsetY: -20 },
        'center': { offsetX: 0, offsetY: 0 }
      };

      if (params.position && params.position !== 'custom') {
        const pos = positionMap[params.position];
        if (pos) {
          watermarkSettings.value.offsetX = pos.offsetX;
          watermarkSettings.value.offsetY = pos.offsetY;
          watermarkSettings.value.position = params.position;
        }
      } else if (params.position === 'custom' && typeof params.x === 'number' && typeof params.y === 'number') {
        watermarkSettings.value.offsetX = params.x;
        watermarkSettings.value.offsetY = params.y;
        watermarkSettings.value.position = 'custom';
      }

      return {
        success: true,
        message: '水印位置已更新',
        position: {
          x: watermarkSettings.value.offsetX,
          y: watermarkSettings.value.offsetY
        }
      };
    },

    /**
     * 获取可用模板列表
     * 返回所有预设模板的 ID 和描述
     */
    get_available_templates: () => {
      return {
        success: true,
        templates: [
          { id: 'xiaohongshu', name: '小红书风', description: '大字报风格，适合社交媒体封面' },
          { id: 'business', name: '商务简约', description: '专业简约风格，适合商务场景' },
          { id: 'minimal', name: '极简留白', description: '极致简约，无水印无标题' },
          { id: 'vintage', name: '复古胶片', description: '怀旧复古风格，温暖色调' },
          { id: 'cute', name: '可爱萌系', description: '粉色调，可爱字体，适合萌系内容' }
        ]
      };
    },

    /**
     * 获取可用字体列表
     * 返回所有可用字体的信息
     */
    get_available_fonts: () => {
      return {
        success: true,
        fonts: [
          { id: 'cute', name: '可爱体', description: '圆润可爱，适合萌系、日常主题' },
          { id: 'vampire-wars', name: '哥特体', description: '暗黑哥特，适合个性、神秘主题' },
          { id: 'Wuxia', name: '武侠体', description: '江湖气息，适合古风、武侠主题' },
          { id: 'drizzle', name: '手写体', description: '自然手写，适合日记、随笔主题' },
          { id: 'AncientStyle', name: '古风体', description: '古典雅致，适合诗词、国风主题' }
        ]
      };
    }
  };

  // 注册到 window.mcp
  (window as any).mcp = {
    version: '1.0.0',
    discovery: () => ({
      entry: '/.well-known/webmcp.json',
      event: 'webmcp:ready',
      status: 'active'
    }),
    call: async (toolName: string, params: any) => {
      const tool = (tools as any)[toolName];
      if (!tool) {
        const availableTools = Object.keys(tools).join(', ');
        throw new Error(`工具 ${toolName} 不存在。可用工具: ${availableTools}`);
      }
      console.log(`🔧 WebMCP: Calling ${toolName}`, params);
      return await tool(params);
    },
    // 列出所有可用工具
    listTools: () => Object.keys(tools)
  };

  // 派发就绪事件
  window.dispatchEvent(new CustomEvent('webmcp:ready', {
    detail: { 
      version: '1.0.0',
      tools: Object.keys(tools)
    }
  }));
  
  console.log('🚀 WebMCP Protocol Initialized');
  console.log('   Available tools:', Object.keys(tools).join(', '));
}
