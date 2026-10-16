import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Users, 
  Trophy,
  Zap,
  Target,
  Calendar,
  MessageSquare,
  Flame,
  Star,
  TrendingUp,
  Clock,
  Award,
  Heart,
  Smile,
  User
} from 'lucide-react';
import { PostureDashboard } from './PostureDashboard';
import { PostureAnalytics } from './PostureAnalytics';
import { PostureSettings } from './PostureSettings';
import { PostureSocial } from './PostureSocial';
import { PostureCoach } from './PostureCoach';

export function PostureApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCoach, setShowCoach] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Progress', icon: BarChart3 },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentUser = {
    name: 'Alex',
    level: 12,
    points: 2840,
    streak: 7,
    postureScore: 85,
    pointsToNextLevel: 160,
    totalPointsForNextLevel: 300
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'analytics': return 'Progress';
      case 'social': return 'Social';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Status Bar Space */}
      <div className="h-11 bg-background"></div>
      
      {/* Simple Header for non-dashboard pages */}
      {activeTab !== 'dashboard' && (
        <header className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowCoach(true)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <div>
            {/* Dashboard Header - Separated sections */}
            <div className="px-4 -mt-11 pt-7">
              {/* Greeting Section - No background */}
              <div className="px-6 pt-6 pb-4">
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {/* Profile Photo */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMJA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80" 
                          alt={`${currentUser.name}'s profile`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold text-foreground">Hi, {currentUser.name}!</h2>
                        <p className="text-sm text-muted-foreground">Level {currentUser.level} Posture Master</p>
                        <p className="text-xs text-muted-foreground/70">Powered by SitBax</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-foreground hover:bg-muted rounded-full"
                      onClick={() => setShowCoach(true)}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats - Dark cards with colorful icons */}
              <div className="px-6 pb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">Streak</span>
                    </div>
                    <p className="text-2xl font-bold">{currentUser.streak}</p>
                  </div>
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Points</span>
                    </div>
                    <p className="text-2xl font-bold">{currentUser.points}</p>
                  </div>
                  <div className="bg-gray-800 text-white rounded-2xl p-4">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Score</span>
                    </div>
                    <p className="text-2xl font-bold">{currentUser.postureScore}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <PostureDashboard user={currentUser} />
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="p-4">
            <PostureAnalytics />
          </div>
        )}
        {activeTab === 'social' && (
          <div className="p-4">
            <PostureSocial />
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-4">
            <PostureSettings />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-blue-50 border-t px-4 py-2 pb-6 flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full ${
                activeTab === item.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* AI Coach Modal */}
      {showCoach && (
        <PostureCoach 
          isOpen={showCoach} 
          onClose={() => setShowCoach(false)} 
          user={currentUser}
        />
      )}
    </div>
  );
}