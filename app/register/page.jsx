'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Users, User, Smartphone, MessageSquare, Trophy, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    mlbbId: '',
    telegramUsername: '',
    teamLogo: null
  });

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'teamName' && value.length > 2) {
      checkTeamName(value);
    }
  };

  const checkTeamName = async (name) => {
    setIsChecking(true);
    try {
      const response = await fetch(`/api/check-team?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      setIsAvailable(data.available);
    } catch (error) {
      console.error('Error checking team name:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Rasm hajmi 5MB dan oshmasligi kerak');
        return;
      }
      
      setFormData(prev => ({ ...prev, teamLogo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.teamLogo) {
      toast.error('Jamoa logotipini yuklashingiz kerak');
      return;
    }
    
    if (isAvailable === false) {
      toast.error('Bu jamoa nomi allaqachon band. Iltimos, boshqa nom tanlang.');
      return;
    }

    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('teamName', formData.teamName);
      formDataToSend.append('captainName', formData.captainName);
      formDataToSend.append('mlbbId', formData.mlbbId);
      formDataToSend.append('telegramUsername', formData.telegramUsername);
      formDataToSend.append('teamLogo', formData.teamLogo);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push('/success');
        }, 3000);
      } else {
        toast.error(data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Server xatosi. Iltimos, keyinroq urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <Toaster position="top-right" />
      
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Jamoa Ro'yxatdan O'tish
          </h1>
          <p className="text-gray-300 text-lg">
            Quyidagi formani to'ldiring va turnirda ishtirok eting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Team Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-3">
                Jamoa Logotipi
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-500 transition-colors"
              >
                {preview ? (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-48 h-48 object-cover rounded-xl mx-auto"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setFormData(prev => ({ ...prev, teamLogo: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70">
                      Rasmni yuklash uchun bosing (PNG, JPG, max 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>
            </div>

            {/* Team Name */}
            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <Users className="w-4 h-4 mr-2" />
                Jamoa Nomi *
              </label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Masalan: Humo Warriors"
                required
                minLength={3}
                maxLength={50}
              />
              {isChecking ? (
                <p className="mt-2 text-sm text-cyan-400">Tekshirilmoqda...</p>
              ) : isAvailable === true ? (
                <p className="mt-2 text-sm text-green-400 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Jamoa nomi mavjud
                </p>
              ) : isAvailable === false ? (
                <p className="mt-2 text-sm text-red-400">
                  Bu jamoa nomi allaqachon band
                </p>
              ) : null}
            </div>

            {/* Captain Name */}
            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <User className="w-4 h-4 mr-2" />
                Kapiton Ismi *
              </label>
              <input
                type="text"
                name="captainName"
                value={formData.captainName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Masalan: Abduvoris"
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            {/* MLBB ID */}
            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <Smartphone className="w-4 h-4 mr-2" />
                MLBB ID *
              </label>
              <input
                type="text"
                name="mlbbId"
                value={formData.mlbbId}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Masalan: 123456789"
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            {/* Telegram Username */}
            <div>
              <label className="flex items-center text-sm font-medium mb-3">
                <MessageSquare className="w-4 h-4 mr-2" />
                Telegram Username *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                  @
                </div>
                <input
                  type="text"
                  name="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 mr-3"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                Men{' '}
                <a href="#" className="text-cyan-400 hover:underline">
                  turnir qoidalari
                </a>{' '}
                bilan tanishdim va ularga roziman. Shuningdek, men o'zimning 
                shaxsiy ma'lumotlarimni ishlatilishiga rozilik bildiraman.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading || !formData.teamLogo || isAvailable === false}
              className="btn-primary text-lg px-12 py-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ro'yxatdan o'tilmoqda...
                </span>
              ) : (
                'Jamoa Ro\'yxatdan O\'tish'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 max-w-md w-full text-center animate-float">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Muvaffaqiyatli Ro'yxatdan O'tdingiz!
            </h3>
            <p className="text-gray-300 mb-6">
              Jamoaingiz muvaffaqiyatli ro'yxatdan o'tdi. Tez orada 
              siz bilan bog'lanamiz. Rahmat!
            </p>
            <div className="animate-pulse text-cyan-400">
              Sizning so'rovingiz qayta ishlanmoqda...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
