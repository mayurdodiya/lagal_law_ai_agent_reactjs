import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
// import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import { LogOut, User, Settings, CreditCard } from "lucide-react";

import { FiLogOut, FiUser, FiSettings, FiCreditCard } from "react-icons/fi";
type UserProfile = {
  first_name: string | null;
  last_name: string | null;
  // role: 'male' | 'female' | null;
};

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!user) {
  //     navigate('/auth');
  //   }
  // }, [user, navigate]);

  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate('/auth');
  //   }

  //   if (user && user.userProfileInfo && user.userProfileInfo.isPlanPurchased === false && !user.userProfileInfo.planId) {
  //     navigate("/subscription");
  //   }

  // }, [user, loading, navigate]);

  // useEffect(() => {
  //   if (user) {
  //     fetchProfile();
  //   }
  // }, [user]);

  // const fetchProfile = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('first_name, last_name, role')
  //       .eq('id', user?.id)
  //       .single();

  //     if (error) {
  //       console.error('Error fetching profile:', error);
  //     } else {
  //       setProfile(data);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setProfileLoading(false);
  //   }
  // };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast("Success", {
        description: "Signed out successfully!",
      });
      navigate("/auth");
    } catch (error) {
      toast("Error", {
        description: "Error signing out",
      });
    }
  };

  // if (loading || profileLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //         <p className="mt-2 text-muted-foreground">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user) {
  //   return null;
  // }

  // const userInitials = profile
  //   ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
  //   : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Avatar>{/* <AvatarFallback>{userInitials}</AvatarFallback> */}</Avatar>
              <Button variant="outline" onClick={handleSignOut}>
                <FiLogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">{/* Welcome back, {profile?.first_name || user?.email}! */}</CardTitle>
              <CardDescription>Here's what's happening with your account today.</CardDescription>
            </CardHeader>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <FiUser className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user?.first_name}{" "}
                  {user?.last_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                {/* <p className="text-sm">
                  <span className="font-medium">Gender:</span> {profile?.role || 'Not specified'}
                </p> */}
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <FiSettings className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Account
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription
              </CardTitle>
              <FiCreditCard className="h-4 w-4 ml-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate("/subscription")}
              >
                View Plans
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
