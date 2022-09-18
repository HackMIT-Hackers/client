import { IconHandStop, IconBrush, IconBucket, IconWand, IconRectangle, IconLasso, IconColorPicker, IconZoomIn, IconQuestionMark} from "@tabler/icons";
import create from "zustand";

export const tools = [
  { icon: IconHandStop, label: 'Pan Tool' },
  { icon: IconBrush, label: 'Brush' },
  { icon: IconBucket, label: 'Paint Bucket' },
  { icon: IconWand, label: 'Magic Wand' },
  { icon: IconRectangle, label: 'Rectangle Select' },
  { icon: IconLasso, label: 'Lasso Tool' },
  { icon: IconColorPicker, label: 'Color Picker' },
  { icon: IconZoomIn, label: 'Zoom In' },
  { icon: IconQuestionMark, label: 'About'},
];

interface ToolState {
  selectedTool: number,
  changeTool: (t: number) => void;
}

export const useToolSelect = create<ToolState>((set) => ({
  selectedTool: -1,
  changeTool: (t: number) => set(() => ({ selectedTool: t }))
}));