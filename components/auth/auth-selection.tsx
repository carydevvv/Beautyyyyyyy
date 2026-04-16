"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function AuthSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-purple-600" />
              <Crown className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to NailTech
          </h1>
          <p className="text-xl text-gray-600">
            Choose how you'd like to access our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Access */}
          <Card className="relative overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-purple-800">
                    I'm a Client
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Book appointments and manage your beauty journey
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Book appointments with expert stylists</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Chat directly with our team</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Track your appointment history</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Receive real-time notifications</span>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <Link href="/auth/client/signin" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Sign In as Client
                  </Button>
                </Link>
                <Link href="/auth/client/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 bg-transparent"
                  >
                    Create Client Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Admin Access */}
          <Card className="relative overflow-hidden border-2 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Shield className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-yellow-800">
                    I'm an Admin
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Manage bookings, clients, and business operations
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Manage all client bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Chat with customers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>View business analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Control all operations</span>
                </div>
              </div>
              <div className="pt-4">
                <Link href="/auth/admin/signin" className="block">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Admin Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@nailtech.com"
              className="text-purple-600 hover:underline"
            >
              support@nailtech.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
