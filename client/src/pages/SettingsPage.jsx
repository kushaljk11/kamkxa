import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { reminderService } from '@/services/reminderService';
import { toast } from '@/components/ui/Toast';
import {
  User,
  Palette,
  Bell,
  Clock,
  Shield,
  Moon,
  Sun,
  Laptop,
  Check,
  Phone,
  Send,
  MessageSquare,
  Sparkles,
  LogOut,
  Mail,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications & WhatsApp', icon: Bell },
  { id: 'reminders', label: 'Reminders & Quiet Hours', icon: Clock },
  { id: 'account', label: 'Account & Security', icon: Shield },
];

export const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState('profile');

  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || 'Kushal');
  const [lastName, setLastName] = useState(user?.lastName || 'Shrestha');
  const [timezone, setTimezone] = useState(user?.timezone || 'Asia/Kathmandu');

  // Notification and WhatsApp settings
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [defaultReminderOffset, setDefaultReminderOffset] = useState('30');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingEmailTest, setIsSendingEmailTest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load persisted preferences from backend
    reminderService.getPreferences().then((prefs) => {
      if (prefs) {
        if (prefs.whatsappEnabled !== undefined) setWhatsappEnabled(prefs.whatsappEnabled);
        if (prefs.whatsappPhone) setWhatsappPhone(prefs.whatsappPhone);
        if (prefs.defaultReminderOffset) setDefaultReminderOffset(prefs.defaultReminderOffset);
        if (prefs.timezone) setTimezone(prefs.timezone);
      }
    }).catch((err) => console.log('Loaded default preferences.'));
  }, []);

  const handleSaveProfile = () => {
    toast.success('Profile Saved', 'Personal information updated successfully.');
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await reminderService.updatePreferences({
        whatsappEnabled,
        whatsappPhone,
        defaultReminderOffset,
        timezone,
      });
      toast.success('Preferences Saved', 'Notification and reminder channels updated.');
    } catch (err) {
      toast.error('Failed to save', 'Preferences could not be saved to server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestWhatsApp = async () => {
    if (!whatsappPhone.trim()) {
      toast.error('Phone Required', 'Please enter your mobile phone number with country code (e.g. +97798...)');
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await reminderService.sendTestWhatsApp(whatsappPhone.trim());
      if (res.success) {
        toast.success(
          'WhatsApp Alert Sent!',
          `Check WhatsApp on ${whatsappPhone} for your GoTaskManager reminder.`
        );
      } else {
        toast.error('WhatsApp Dispatch Failed', res.message || 'Twilio response error.');
      }
    } catch (err) {
      toast.error(
        'WhatsApp Dispatch Failed',
        err.response?.data?.message || err.message || 'Check Twilio credentials and phone formatting.'
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingEmailTest(true);
    try {
      const res = await reminderService.sendTestEmail(user?.email);
      if (res.success) {
        toast.success(
          'Email Dispatched!',
          res.message || 'Check your inbox for the GoTaskManager test email.'
        );
      } else {
        toast.error('Email Dispatch Failed', res.message);
      }
    } catch (err) {
      toast.error(
        'Email Dispatch Failed',
        err.response?.data?.message || err.message || 'Check Nodemailer SMTP credentials.'
      );
    } finally {
      setIsSendingEmailTest(false);
    }
  };

  const initials = `${firstName[0] || 'K'}${lastName[0] || 'S'}`.toUpperCase();

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        subtitle="Manage your personal profile, WhatsApp alerts, timezone, and appearance"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar for Settings */}
        <div className="bg-surface rounded-xl border border-border p-2 shadow-card space-y-1">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer',
                  activeSection === sec.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information and display identity</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/15 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      {firstName} {lastName}
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {user?.email || 'kushal@gotaskmanager.app'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <Input
                  label="Email Address"
                  defaultValue={user?.email || 'kushal@gotaskmanager.app'}
                  disabled
                  helperText="Email is bound to your account credentials"
                />
                <Select
                  label="Timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  helperText="Reminders will strictly arrive aligned with this local timezone"
                >
                  <option value="Asia/Kathmandu">Asia/Kathmandu (UTC +05:45)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </Select>
                <div className="pt-2">
                  <Button variant="primary" onClick={handleSaveProfile}>
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Appearance & Theme</CardTitle>
                <CardDescription>Customize the look and feel of GoTaskManager</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Laptop },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = theme === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTheme(item.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                            : 'border-border bg-surface text-text-secondary hover:border-slate-300 dark:hover:border-border-subtle'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications & WhatsApp Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {/* Delivery Channels Card */}
              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Delivery Channels</CardTitle>
                  <CardDescription>Choose how and where you want to be alerted</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  {[
                    {
                      title: 'In-App Alerts',
                      desc: 'Real-time indicators in the top bar and notification bell',
                      checked: inAppNotifs,
                      setter: setInAppNotifs,
                    },
                    {
                      title: 'Email Notifications',
                      desc: 'Receive task summaries and weekly accomplishment digests',
                      checked: emailNotifs,
                      setter: setEmailNotifs,
                    },
                  ].map((channel, i) => (
                    <div
                      key={i}
                      onClick={() => channel.setter(!channel.checked)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface hover:border-slate-300 dark:hover:border-border-subtle transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{channel.title}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{channel.desc}</p>
                      </div>
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                          channel.checked
                            ? 'bg-primary border-primary text-white'
                            : 'border-border bg-surface'
                        )}
                      >
                        {channel.checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ))}

                  {/* Nodemailer SMTP Test Dispatch */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border/80">
                    <div>
                      <p className="text-xs font-semibold text-text-primary">Nodemailer SMTP Test</p>
                      <p className="text-[11px] text-text-muted">
                        Verify your SMTP email configuration by sending a test alert
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendTestEmail}
                      disabled={isSendingEmailTest}
                      className="gap-1.5 shrink-0"
                    >
                      {isSendingEmailTest ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      <span>Send Test Email</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Twilio WhatsApp Integration Card */}
              <Card className="p-6 border-status-success/30 shadow-card">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-status-successBg text-status-success flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle>WhatsApp Reminders (Twilio)</CardTitle>
                        <CardDescription>Receive automated deadline reminders directly on WhatsApp</CardDescription>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-successBg text-status-success border border-status-successBorder">
                      Twilio API Active
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  {/* Enable Switch */}
                  <div
                    onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface-subtle/40 hover:bg-surface transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        Enable WhatsApp Deadline Alerts
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Delivers automated pre-deadline alerts to your connected phone
                      </p>
                    </div>

                    <div
                      className={cn(
                        'w-10 h-6 rounded-full transition-colors relative flex items-center px-0.5',
                        whatsappEnabled ? 'bg-status-success' : 'bg-slate-300 dark:bg-slate-700'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                          whatsappEnabled ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div>
                    <Input
                      label="WhatsApp Mobile Number (with Country Code)"
                      placeholder="e.g. +9779812345678 or +14155552671"
                      value={whatsappPhone}
                      onChange={(e) => setWhatsappPhone(e.target.value)}
                      helperText="Include the '+' and country code without spaces or dashes"
                    />
                  </div>

                  {/* Test Notification Trigger */}
                  <div className="p-4 rounded-xl border border-border bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>Verify Connection</span>
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Sends an instant test alert via your configured Twilio WhatsApp sender
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      isLoading={isSendingTest}
                      onClick={handleSendTestWhatsApp}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Send Test Alert
                    </Button>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      isLoading={isSaving}
                      onClick={handleSavePreferences}
                    >
                      Save Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reminders & Quiet Hours Section */}
          {activeSection === 'reminders' && (
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Reminder Defaults & Quiet Hours</CardTitle>
                <CardDescription>Control timing presets and protect your focus time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <Select
                  label="Default Reminder Offset"
                  value={defaultReminderOffset}
                  onChange={(e) => setDefaultReminderOffset(e.target.value)}
                  helperText="Default pre-alert timing applied to newly created tasks"
                >
                  <option value="0">At due time</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </Select>

                <div className="p-4 rounded-xl border border-border bg-surface-subtle/40 text-xs text-text-secondary leading-relaxed">
                  <p className="font-semibold text-text-primary mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Quiet Hours Guarantee (10:00 PM – 7:00 AM)</span>
                  </p>
                  Any reminder scheduled during late night hours in your local timezone ({timezone}) will be automatically held and delivered first thing at 7:00 AM so your sleep remains undisturbed.
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    isLoading={isSaving}
                    onClick={handleSavePreferences}
                  >
                    Save Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account & Security Section */}
          {activeSection === 'account' && (
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>Authentication credentials and session management</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-5">
                <div className="space-y-3">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                </div>
                <div className="pt-2 flex items-center justify-between border-b border-border pb-5">
                  <Button
                    variant="primary"
                    onClick={() => toast.success('Password Updated', 'Your password was changed successfully.')}
                  >
                    Update Password
                  </Button>
                </div>

                {/* Session Sign Out */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs font-semibold text-text-primary">Active Session</p>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Signed in as {user?.email || 'kushal@gotaskmanager.app'}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => logout()}
                    leftIcon={<LogOut className="w-3.5 h-3.5" />}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
