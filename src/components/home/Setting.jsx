"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from '@/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import { logoutUser } from '@/redux/authSlice';
import { useTranslations } from 'next-intl';

const SettingsPasswordReset = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const t = useTranslations('Settings');
  const authStatus = useSelector((state) => state.auth.status);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">{t('title')}</h1>
          <p className="text-sm text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white"
            onClick={() => setShowForm(!showForm)}
          >
            {t('resetPassword')}
          </Button>
          <Button
            variant="outline"
            disabled={authStatus === 'loading'}
            onClick={async () => {
              const result = await dispatch(logoutUser());
              if (logoutUser.fulfilled.match(result)) {
                router.push('/login');
              }
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {authStatus === 'loading' ? t('loggingOut') : t('logout')}
          </Button>
        </div>

        {/* Password Reset Form */}
        {showForm && (
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  {t('pleaseEnter')}
                </h2>

                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('currentPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrent ? 'text' : 'password'}
                        placeholder="............"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrent ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('newPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showNew ? 'text' : 'password'}
                        placeholder="............"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('confirmPassword')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="............"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4">
                    {t('changePassword')}
                  </Button>

                  {/* Warning Alert */}
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertDescription className="text-yellow-800 text-sm">
                      {t('weakPassword')}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPasswordReset;
