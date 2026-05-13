import {
  Home, ClipboardList, Search, User, Bell, Settings, LogOut,
  Hospital, Pill, CreditCard, Droplet, Droplets, FlaskConical,
  Route, Zap, Waves, Trash2, Construction, Landmark, FileText, Wheat,
  Heart, Mic, Bus, GraduationCap, Building2, Building, Leaf,
  Plus, Check, X, RefreshCw, Send, Filter, Download, Upload,
  AlertTriangle, Info, Star, Phone, Mail, MessageSquare, MapPin,
  Calendar, Clock, Eye, Trash, Flag, Forward, Copy, TrendingUp,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  ArrowRight, ArrowLeft, LayoutDashboard, BarChart2, Shield,
  Camera, Paperclip, Award, Briefcase, Power, Key, Save,
  Target, Edit, MoreHorizontal, Play, Undo,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  // Navigation
  home: Home,
  clipboard: ClipboardList,
  search: Search,
  user: User,
  bell: Bell,
  settings: Settings,
  logOut: LogOut,
  dashboard: LayoutDashboard,
  // Domain / category icons
  hospital: Hospital,
  pill: Pill,
  card: CreditCard,
  drop: Droplet,
  droplets: Droplets,
  flask: FlaskConical,
  road: Route,
  zap: Zap,
  waves: Waves,
  trash: Trash2,
  construction: Construction,
  landmark: Landmark,
  document: FileText,
  wheat: Wheat,
  heart: Heart,
  voice: Mic,
  bus: Bus,
  education: GraduationCap,
  building: Building2,
  leaf: Leaf,
  plus: Plus,
  // Actions
  check: Check,
  x: X,
  refresh: RefreshCw,
  send: Send,
  filter: Filter,
  download: Download,
  upload: Upload,
  edit: Edit,
  more: MoreHorizontal,
  play: Play,
  undo: Undo,
  copy: Copy,
  save: Save,
  target: Target,
  // Status
  alert: AlertTriangle,
  info: Info,
  star: Star,
  flag: Flag,
  forward: Forward,
  trending: TrendingUp,
  // Contact / Info
  phone: Phone,
  mail: Mail,
  message: MessageSquare,
  pin: MapPin,
  calendar: Calendar,
  clock: Clock,
  eye: Eye,
  // Navigation arrows
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  // Misc
  barChart: BarChart2,
  shield: Shield,
  camera: Camera,
  paperclip: Paperclip,
  award: Award,
  briefcase: Briefcase,
  power: Power,
  key: Key,
  // Direct Lucide names (PascalCase) also supported
  Hospital, Pill, CreditCard, Droplet, Droplets, FlaskConical,
  Route, Zap, Waves, Trash2, Construction, Landmark, FileText, Wheat,
  Heart, Mic, Bus, GraduationCap, Building2, Building, Leaf,
  Plus, Check, AlertTriangle, Info, Star, Phone, Mail, MessageSquare, MapPin,
  Calendar, Clock, Eye, TrendingUp, Home, ClipboardList, Search, User, Bell,
  Settings, LogOut, LayoutDashboard, BarChart2, Shield, Camera, Paperclip,
  Award, Briefcase, Power, Key, Save, Target, Edit, MoreHorizontal,
};

interface GmsIconProps extends LucideProps {
  name: string;
}

export function GmsIcon({ name, size = 18, ...props }: GmsIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}

export { ICON_MAP };
