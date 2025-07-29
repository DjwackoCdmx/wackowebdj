import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Music, User, Mail, Phone, Shield, AlertTriangle, Loader2 } from 'lucide-react';

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  phone: string;
  nickname: string;
}

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent, formData: RegisterFormData) => Promise<void>;
  loading: boolean;
}

export const RegisterForm = ({ onSubmit, loading }: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({ email: '', password: '', name: '', phone: '', nickname: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula");
    if (!/[0-9]/.test(password)) errors.push("Al menos un número");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("Al menos un carácter especial");
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert("Debes aceptar los términos de uso para continuar.");
      return;
    }
    if (!validatePassword(formData.password)) {
        alert("La contraseña no cumple con los requisitos de seguridad.");
        return;
    }
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white"><User className="w-4 h-4 inline mr-1" />Nombre</Label>
          <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" placeholder="Tu nombre" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nickname" className="text-white"><Music className="w-4 h-4 inline mr-1" />Apodo</Label>
          <Input id="nickname" type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" placeholder="Tu apodo" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white"><Phone className="w-4 h-4 inline mr-1" />Teléfono</Label>
        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" placeholder="+52 123 456 7890" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white"><Mail className="w-4 h-4 inline mr-1" />Email</Label>
        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" placeholder="tu@email.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white"><Shield className="w-4 h-4 inline mr-1" />Contraseña</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handlePasswordChange} required className="bg-white/5 border-white/20 text-white placeholder:text-white/50" placeholder="Crea una contraseña segura" />
          <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full text-white/70 hover:text-white" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</Button>
        </div>
        {passwordErrors.length > 0 && (
          <ul className="text-xs text-red-400 list-disc list-inside pl-2">
            {passwordErrors.map(err => <li key={err}>{err}</li>)}
          </ul>
        )}
      </div>
            <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
        <label htmlFor="terms" className="text-sm font-medium leading-none text-white/80">
          Acepto los <Link to="/terms" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">términos y condiciones</Link>
        </label>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={loading || !acceptTerms}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {loading ? 'Creando cuenta...' : 'Crear Cuenta'}</Button>
    </form>
  );
};
