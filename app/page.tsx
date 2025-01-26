'use client'

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Clock, 
  QrCode, 
  Sheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import UsersManagement from '@/components/users-management';
import CoursesManagement from '@/components/courses-management';
import StudentsManagement from '@/components/students-management';
import CourseAttendanceManagement from '@/components/sessions-management';

// Sample Data (replace with actual data fetching)
const attendanceData = [
  { month: 'Jan', attendance: 65 },
  { month: 'Feb', attendance: 59 },
  { month: 'Mar', attendance: 80 },
  { month: 'Apr', attendance: 81 },
  { month: 'May', attendance: 56 },
  { month: 'Jun', attendance: 55 },
];

interface QuickStatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change: number;
}
const QuickStatCard = ({ icon: Icon, title, value, change }: QuickStatCardProps) => (
  <Card className="w-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change > 0 ? '+' : ''}{change}% from last month
      </p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-8">
          <QrCode className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold">Attendance Hub</h1>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          orientation="vertical" 
          className="space-y-2"
        >
          <TabsList className="flex flex-col h-full w-full">
            <TabsTrigger 
              value="dashboard" 
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="w-full justify-start gap-2"
            >
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="w-full justify-start gap-2"
            >
              <GraduationCap className="h-4 w-4" /> Students
            </TabsTrigger>
            <TabsTrigger 
              value="courses" 
              className="w-full justify-start gap-2"
            >
              <Clock className="h-4 w-4" /> Courses
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="w-full justify-start gap-2"
            >
              <Sheet className="h-4 w-4" /> Sessions
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Tabs value={activeTab}>
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Dashboard</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <QuickStatCard 
                  icon={Users} 
                  title="Total Students" 
                  value="2,350" 
                  change={5.2} 
                />
                <QuickStatCard 
                  icon={Clock} 
                  title="Active Courses" 
                  value="42" 
                  change={3.1} 
                />
                <QuickStatCard 
                  icon={QrCode} 
                  title="QR Scans" 
                  value="1,250" 
                  change={12.5} 
                />
                <QuickStatCard 
                  icon={GraduationCap} 
                  title="Avg Attendance" 
                  value="78%" 
                  change={-2.3} 
                />
              </div>

              {/* Attendance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Attendance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder content for other tabs */}
          <TabsContent value="users"><UsersManagement/> </TabsContent>
          <TabsContent value="students"><StudentsManagement/></TabsContent>
          <TabsContent value="courses"><CoursesManagement useDummyData={true}/></TabsContent>
          <TabsContent value="sessions"><CourseAttendanceManagement useDummyData={true}/></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;