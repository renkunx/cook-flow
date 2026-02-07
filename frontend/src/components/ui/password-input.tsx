/**
 * 密码输入框组件
 * 带显示/隐藏密码切换功能
 */

import * as React from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 是否显示密码强度 */
  showStrength?: boolean;
  /** 密码强度变化回调 */
  onStrengthChange?: (strength: number) => void;
  /** 输入框左侧图标 */
  leftIcon?: React.ReactNode;
  /** 自定义样式 */
  containerClassName?: string;
}

/**
 * 密码强度检测
 */
function checkPasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
  
  return strength;
}

/**
 * 密码强度标签
 */
const strengthLabels = ['弱', '一般', '良好', '强'];
const strengthColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
];

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ 
    className, 
    containerClassName,
    showStrength = false,
    onStrengthChange,
    leftIcon = <Lock className="h-4 w-4 text-muted-foreground" />,
    onChange,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 合并 ref
    React.useImperativeHandle(ref, () => inputRef.current!);

    // 计算密码强度
    React.useEffect(() => {
      if (showStrength && typeof value === 'string') {
        const newStrength = checkPasswordStrength(value);
        setStrength(newStrength);
        onStrengthChange?.(newStrength);
      }
    }, [value, showStrength, onStrengthChange]);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
      // 保持焦点
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    };

    return (
      <div className={cn('relative w-full', containerClassName)}>
        {/* 左侧图标 */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {leftIcon}
        </div>

        {/* 输入框 */}
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background',
            'px-10 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={inputRef}
          value={value}
          onChange={onChange}
          {...props}
        />

        {/* 右侧切换按钮 */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
          onClick={handleTogglePassword}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? '隐藏密码' : '显示密码'}
          </span>
        </Button>

        {/* 密码强度指示器 */}
        {showStrength && value && (
          <div className="mt-2 space-y-2">
            {/* 强度条 */}
            <div className="flex gap-1 h-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'flex-1 rounded-full transition-all duration-300',
                    level <= strength ? strengthColors[strength - 1] : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            
            {/* 强度标签 */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                密码强度: 
                <span className={cn(
                  'ml-1 font-medium',
                  strength === 0 && 'text-red-500',
                  strength === 1 && 'text-orange-500',
                  strength === 2 && 'text-yellow-600',
                  strength === 3 && 'text-green-600',
                  strength === 4 && 'text-green-700',
                )}>
                  {strengthLabels[strength - 1] || '太短'}
                </span>
              </span>
              
              {/* 要求列表 */}
              <div className="flex gap-3">
                <span className={cn(
                  'flex items-center gap-0.5',
                  (value as string).length >= 8 ? 'text-green-600' : 'text-gray-400'
                )}>
                  {(value as string).length >= 8 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  8位+
                </span>
                <span className={cn(
                  'flex items-center gap-0.5',
                  /[a-z]/.test(value as string) && /[A-Z]/.test(value as string) ? 'text-green-600' : 'text-gray-400'
                )}>
                  {/[a-z]/.test(value as string) && /[A-Z]/.test(value as string) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  大小写
                </span>
                <span className={cn(
                  'flex items-center gap-0.5',
                  /\d/.test(value as string) ? 'text-green-600' : 'text-gray-400'
                )}>
                  {/\d/.test(value as string) ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  数字
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };

/**
 * 带确认密码的输入框组
 */
interface ConfirmPasswordInputProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  passwordLabel?: string;
  confirmLabel?: string;
  showStrength?: boolean;
  className?: string;
}

export function ConfirmPasswordInput({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmChange,
  passwordLabel = '密码',
  confirmLabel = '确认密码',
  showStrength = true,
  className,
}: ConfirmPasswordInputProps) {
  const match = password && confirmPassword && password === confirmPassword;
  const mismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <label className="text-sm font-medium">{passwordLabel}</label>
        <PasswordInput
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="请输入密码"
          showStrength={showStrength}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{confirmLabel}</label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => onConfirmChange(e.target.value)}
          placeholder="请再次输入密码"
          leftIcon={
            match ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : mismatch ? (
              <X className="h-4 w-4 text-red-500" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )
          }
        />
        {mismatch && (
          <p className="text-xs text-red-500">两次输入的密码不一致</p>
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
