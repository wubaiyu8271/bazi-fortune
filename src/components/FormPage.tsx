import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserInfo } from '../types';
import { getShiChenList } from '../utils/bazi';
import { ChevronLeft, User, Calendar, Clock, Users } from 'lucide-react';

interface FormPageProps {
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

// 农历数据（简化版 - 1900-2100年）
const lunarInfo = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
];

// 农历月份名称
const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
// 农历日期名称
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];

// 判断农历年闰月
function leapMonth(y: number): number {
  return lunarInfo[y - 1900] & 0xf;
}

// 判断农历年闰月天数
function leapDays(y: number): number {
  if (leapMonth(y)) {
    return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

// 农历年总天数
function yearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

// 农历转公历
function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean): Date {
  // 从1900年1月31日（农历1900年正月初一）开始计算
  let offset = 0;
  for (let y = 1900; y < lunarYear; y++) {
    offset += yearDays(y);
  }
  
  const leap = leapMonth(lunarYear);
  for (let m = 1; m < lunarMonth; m++) {
    offset += (lunarInfo[lunarYear - 1900] & (0x10000 >> m)) ? 30 : 29;
  }
  if (isLeap && leap === lunarMonth) {
    offset += (lunarInfo[lunarYear - 1900] & (0x10000 >> lunarMonth)) ? 30 : 29;
  }
  if (leap && leap < lunarMonth) {
    offset += leapDays(lunarYear);
  }
  
  offset += lunarDay - 1;
  
  const baseDate = new Date(1900, 0, 31);
  return new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
}

export function FormPage({ onSubmit, onBack }: FormPageProps) {
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  
  // 公历日期状态
  const [solarYear, setSolarYear] = useState<number>(2000);
  const [solarMonth, setSolarMonth] = useState<number>(1);
  const [solarDay, setSolarDay] = useState<number>(1);
  
  // 农历日期状态
  const [lunarYear, setLunarYear] = useState<number>(2000);
  const [lunarMonth, setLunarMonth] = useState<number>(1);
  const [lunarDayVal, setLunarDayVal] = useState<number>(1);
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    gender: 'male',
    birthDate: '',
    birthHour: 12,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shiChenList = getShiChenList();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 获取公历月份天数
  const getSolarDays = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // 获取农历月份天数
  const getLunarDays = (year: number, month: number, isLeap: boolean) => {
    if (isLeap) {
      return leapDays(year);
    }
    return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  };

  // 获取农历月份列表（包括闰月）
  const getLunarMonths = (year: number) => {
    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: lunarMonths[i], isLeap: false }));
    const leap = leapMonth(year);
    if (leap > 0) {
      months.splice(leap, 0, { value: leap, label: '闰' + lunarMonths[leap - 1], isLeap: true });
    }
    return months;
  };

  // 格式化日期为 YYYY-MM-DD（使用本地时间，避免时区问题）
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 更新日期
  useEffect(() => {
    let date: Date;
    if (calendarType === 'solar') {
      date = new Date(solarYear, solarMonth - 1, solarDay);
    } else {
      date = lunarToSolar(lunarYear, lunarMonth, lunarDayVal, isLeapMonth);
    }
    const dateStr = formatDate(date);
    setFormData(prev => ({ ...prev, birthDate: dateStr }));
  }, [calendarType, solarYear, solarMonth, solarDay, lunarYear, lunarMonth, lunarDayVal, isLeapMonth]);

  // 公历月份变化时，检查日期是否有效
  useEffect(() => {
    const maxDays = getSolarDays(solarYear, solarMonth);
    if (solarDay > maxDays) {
      setSolarDay(maxDays);
    }
  }, [solarYear, solarMonth]);

  // 农历月份变化时，检查日期是否有效
  useEffect(() => {
    const maxDays = getLunarDays(lunarYear, lunarMonth, isLeapMonth);
    if (lunarDayVal > maxDays) {
      setLunarDayVal(maxDays);
    }
  }, [lunarYear, lunarMonth, isLeapMonth]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (!/[\u4e00-\u9fa5]{2,8}/.test(formData.name)) {
      newErrors.name = '请输入2-8个汉字';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = '请选择出生日期';
    } else {
      const date = new Date(formData.birthDate);
      const now = new Date();
      if (date > now) {
        newErrors.birthDate = '出生日期不能晚于今天';
      }
      if (date.getFullYear() < 1900) {
        newErrors.birthDate = '出生日期不能早于1900年';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const solarDays = getSolarDays(solarYear, solarMonth);
  const lunarDaysCount = getLunarDays(lunarYear, lunarMonth, isLeapMonth);
  const lunarMonthList = getLunarMonths(lunarYear);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen py-8 px-4"
    >
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-600 hover:text-ink-800 mb-6 transition-colors font-calligraphy"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      {/* 表单容器 */}
      <div className="max-w-md mx-auto">
        <div className="scroll-decoration p-6 md:p-8">
          <h2 className="font-calligraphy text-2xl font-bold text-center text-ink-800 mb-8">
            请输入测算所需信息
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 姓名 */}
            <div>
              <label className="flex items-center gap-2 text-ink-700 font-medium mb-2 font-calligraphy">
                <User className="w-4 h-4 text-gold-600" />
                姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名（必须汉字）"
                className="w-full px-4 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none transition-colors bg-white/80 font-calligraphy"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 font-calligraphy">{errors.name}</p>
              )}
            </div>

            {/* 性别 */}
            <div>
              <label className="flex items-center gap-2 text-ink-700 font-medium mb-2 font-calligraphy">
                <Users className="w-4 h-4 text-gold-600" />
                性别
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 cursor-pointer transition-all font-calligraphy ${
                      formData.gender === option.value
                        ? 'border-gold-500 bg-gold-50 text-ink-800'
                        : 'border-ink-200 hover:border-ink-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                      className="sr-only"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 出生日期 */}
            <div>
              <label className="flex items-center gap-2 text-ink-700 font-medium mb-2 font-calligraphy">
                <Calendar className="w-4 h-4 text-gold-600" />
                出生日期
              </label>
              
              {/* 历法切换 */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setCalendarType('solar')}
                  className={`flex-1 py-2 rounded-lg border-2 font-calligraphy transition-all ${
                    calendarType === 'solar'
                      ? 'border-gold-500 bg-gold-50 text-ink-800'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  公历
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarType('lunar')}
                  className={`flex-1 py-2 rounded-lg border-2 font-calligraphy transition-all ${
                    calendarType === 'lunar'
                      ? 'border-gold-500 bg-gold-50 text-ink-800'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  农历
                </button>
              </div>

              {/* 公历选择 */}
              {calendarType === 'solar' && (
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={solarYear}
                    onChange={(e) => setSolarYear(Number(e.target.value))}
                    className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                  >
                    {years.map(y => (
                      <option key={y} value={y}>{y}年</option>
                    ))}
                  </select>
                  <select
                    value={solarMonth}
                    onChange={(e) => setSolarMonth(Number(e.target.value))}
                    className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                  >
                    {months.map(m => (
                      <option key={m} value={m}>{m}月</option>
                    ))}
                  </select>
                  <select
                    value={solarDay}
                    onChange={(e) => setSolarDay(Number(e.target.value))}
                    className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                  >
                    {Array.from({ length: solarDays }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}日</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 农历选择 */}
              {calendarType === 'lunar' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={lunarYear}
                      onChange={(e) => setLunarYear(Number(e.target.value))}
                      className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                    >
                      {years.map(y => (
                        <option key={y} value={y}>{y}年</option>
                      ))}
                    </select>
                    <select
                      value={`${isLeapMonth ? 'leap' : ''}${lunarMonth}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        const isLeap = val.startsWith('leap');
                        const month = Number(val.replace('leap', ''));
                        setIsLeapMonth(isLeap);
                        setLunarMonth(month);
                      }}
                      className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                    >
                      {lunarMonthList.map(m => (
                        <option key={`${m.isLeap ? 'leap' : ''}${m.value}`} value={`${m.isLeap ? 'leap' : ''}${m.value}`}>
                          {m.label}月
                        </option>
                      ))}
                    </select>
                    <select
                      value={lunarDayVal}
                      onChange={(e) => setLunarDayVal(Number(e.target.value))}
                      className="px-3 py-3 rounded-lg border-2 border-ink-200 focus:border-gold-500 focus:outline-none bg-white/80 font-calligraphy"
                    >
                      {Array.from({ length: lunarDaysCount }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{lunarDays[d - 1]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 显示转换后的公历日期 */}
              <p className="text-ink-500 text-sm mt-2 font-calligraphy">
                公历：{formData.birthDate || '请选择日期'}
              </p>

              {errors.birthDate && (
                <p className="text-red-600 text-sm mt-1 font-calligraphy">{errors.birthDate}</p>
              )}
            </div>

            {/* 出生时辰 */}
            <div>
              <label className="flex items-center gap-2 text-ink-700 font-medium mb-2 font-calligraphy">
                <Clock className="w-4 h-4 text-gold-600" />
                出生时辰
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-ink-200 rounded-lg bg-white/80">
                {shiChenList.map((sc) => (
                  <label
                    key={sc.value}
                    className={`flex flex-col items-center py-2 px-1 rounded cursor-pointer transition-all text-center font-calligraphy ${
                      formData.birthHour === sc.value * 2
                        ? 'bg-gold-500 text-white'
                        : 'hover:bg-gold-50'
                    }`}
                  >
                    <input
                      type="radio"
                      value={sc.value * 2}
                      checked={formData.birthHour === sc.value * 2}
                      onChange={(e) => setFormData({ ...formData, birthHour: parseInt(e.target.value) })}
                      className="sr-only"
                    />
                    <span className="font-medium text-sm">{sc.label}</span>
                    <span className="text-xs opacity-80">{sc.timeRange}</span>
                  </label>
                ))}
              </div>
              <p className="text-ink-500 text-xs mt-2 font-calligraphy">
                不知道时辰？选择最接近的时段即可
              </p>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              className="btn-primary w-full text-lg font-calligraphy"
            >
              立即测算
            </button>

            <p className="text-center text-ink-500 text-xs font-calligraphy">
              您的信息将严格保密，仅用于八字测算
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
