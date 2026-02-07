/**
 * 图标选择器组件
 * 用于选择 Space 图标、用户头像等
 */

import * as React from 'react';
import { 
  ChefHat, Home, Heart, Star, User, 
  Utensils, Coffee, Pizza, Apple, Carrot,
  Beef, Fish, Soup, Salad, Cake,
  Camera, Image, Upload, X, Check,
  ShoppingBag, Calendar, BookOpen, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';

// 预设图标列表
const PRESET_ICONS = {
  food: [
    { name: 'ChefHat', icon: ChefHat, color: '#FF6B35' },
    { name: 'Utensils', icon: Utensils, color: '#F7931E' },
    { name: 'Coffee', icon: Coffee, color: '#8B4513' },
    { name: 'Pizza', icon: Pizza, color: '#FFB347' },
    { name: 'Apple', icon: Apple, color: '#DC143C' },
    { name: 'Carrot', icon: Carrot, color: '#FF8C00' },
    { name: 'Beef', icon: Beef, color: '#8B0000' },
    { name: 'Fish', icon: Fish, color: '#4682B4' },
    { name: 'Soup', icon: Soup, color: '#DAA520' },
    { name: 'Salad', icon: Salad, color: '#32CD32' },
    { name: 'Cake', icon: Cake, color: '#FF69B4' },
    { name: 'Flame', icon: Flame, color: '#FF4500' },
  ],
  general: [
    { name: 'Home', icon: Home, color: '#4A90E2' },
    { name: 'Heart', icon: Heart, color: '#E74C3C' },
    { name: 'Star', icon: Star, color: '#F1C40F' },
    { name: 'User', icon: User, color: '#9B59B6' },
    { name: 'ShoppingBag', icon: ShoppingBag, color: '#16A085' },
    { name: 'Calendar', icon: Calendar, color: '#2980B9' },
    { name: 'BookOpen', icon: BookOpen, color: '#8E44AD' },
  ],
};

export interface IconPickerProps {
  /** 当前选中的图标 */  value?: string;
  /** 图标变化回调 */
  onChange?: (iconName: string, color?: string) => void;
  /** 当前颜色 */
  color?: string;
  /** 是否允许上传图片 */
  allowUpload?: boolean;
  /** 上传的图片 URL */
  imageUrl?: string | null;
  /** 图片变化回调 */
  onImageChange?: (file: File | null) => void;
  /** 自定义样式 */
  className?: string;
  /** 图标大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示颜色选择 */
  showColorPicker?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function IconPicker({
  value,
  onChange,
  color = '#FF6B35',
  allowUpload = true,
  imageUrl,
  onImageChange,
  className,
  size = 'md',
  showColorPicker = true,
}: IconPickerProps) {
  const [selectedIcon, setSelectedIcon] = React.useState(value || '');
  const [selectedColor, setSelectedColor] = React.useState(color);
  const [isOpen, setIsOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(imageUrl || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 同步外部值
  React.useEffect(() => {
    if (value) setSelectedIcon(value);
  }, [value]);

  React.useEffect(() => {
    if (imageUrl !== undefined) setPreviewImage(imageUrl);
  }, [imageUrl]);

  const handleIconSelect = (iconName: string, iconColor: string) => {
    setSelectedIcon(iconName);
    setSelectedColor(iconColor);
    onChange?.(iconName, iconColor);
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange?.(file);
      setSelectedIcon(''); // 清除图标选择
      setIsOpen(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onImageChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 获取当前图标组件
  const getCurrentIcon = () => {
    const allIcons = [...PRESET_ICONS.food, ...PRESET_ICONS.general];
    const iconData = allIcons.find((i) => i.name === selectedIcon);
    return iconData;
  };

  const currentIcon = getCurrentIcon();

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* 预览区域 */}
      <div
        className={cn(
          'relative rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-105',
          sizeClasses[size]
        )}
        style={{
          background: previewImage
            ? 'transparent'
            : currentIcon
            ? `linear-gradient(135deg, ${selectedColor}20, ${selectedColor}40)`
            : '#f3f4f6',
          border: `2px dashed ${previewImage || currentIcon ? selectedColor : '#d1d5db'}`,
        }}
        onClick={() => setIsOpen(true)}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Icon"
            className="w-full h-full object-cover"
          />
        ) : currentIcon ? (
          <currentIcon.icon
            size={iconSizes[size]}
            style={{ color: selectedColor }}
          />
        ) : (
          <Image className="text-gray-400" size={iconSizes[size]} />
        )}

        {/* 悬停提示 */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Camera className="text-white" size={iconSizes[size] * 0.6} />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-fit"
        >
          {previewImage || currentIcon ? '更换图标' : '选择图标'}
        </Button>

        {(previewImage || currentIcon) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              handleRemoveImage();
              setSelectedIcon('');
              onChange?.('', selectedColor);
            }}
            className="w-fit text-red-500 hover:text-red-600"
          >
            <X className="w-4 h-4 mr-1" />
            移除
          </Button>
        )}
      </div>

      {/* 图标选择弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择图标</DialogTitle>
          </DialogHeader>

          {/* 颜色选择 */}
          {showColorPicker && (
            <div className="space-y-2">
              <label className="text-sm font-medium">主题色</label>
              <div className="flex flex-wrap gap-2">
                {['#FF6B35', '#F7931E', '#4A90E2', '#E74C3C', '#F1C40F', '#9B59B6', '#16A085', '#8E44AD'].map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedColor === c
                          ? 'border-gray-800 scale-110'
                          : 'border-transparent hover:scale-105'
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setSelectedColor(c)}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* 食物图标 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">食物图标</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_ICONS.food.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    selectedIcon === name
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                  onClick={() => handleIconSelect(name, selectedColor)}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* 通用图标 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">通用图标</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_ICONS.general.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                    selectedIcon === name
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                  onClick={() => handleIconSelect(name, selectedColor)}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          {/* 上传图片 */}
          {allowUpload && (
            <div className="space-y-2">
              <label className="text-sm font-medium">或上传图片</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">点击上传图片</p>
                <p className="text-xs text-gray-400">支持 JPG, PNG, GIF</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Space Logo 设置组件
 */
interface SpaceLogoSettingProps {
  spaceId: number;
  currentImage?: string | null;
  onUpdate?: (imageUrl: string) => void;
}

export function SpaceLogoSetting({ currentImage, onUpdate }: SpaceLogoSettingProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">空间图标</h3>
          <p className="text-sm text-gray-500">设置您的厨房空间图标</p>
        </div>
        <IconPicker
          size="lg"
          imageUrl={currentImage}
          onImageChange={(file) => {
            // 这里调用 API 上传
            console.log('Upload file:', file);
          }}
        />
      </div>
    </div>
  );
}

export default IconPicker;
