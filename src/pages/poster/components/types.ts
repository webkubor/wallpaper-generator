export interface TemplateConfig {
  title: string;
  subtitle: string;
  textColor: string;
  mainColor: string;
  titleSize: number;
  subtitleSize: number;
  selectedFont: string;
  subtitleFont: string;
  titleVertical: boolean;
  subtitleVertical: boolean;
  titleStroke: boolean;
  titleStrokeColor: string;
  subtitleColor: string;
  titleShadow: string;
  subtitleShadow: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  config: TemplateConfig;
}

export interface FontOption {
  label: string;
  value: string;
}

export interface PosterConfig {
  fontOptions: FontOption[];
  templates: Template[];
}
