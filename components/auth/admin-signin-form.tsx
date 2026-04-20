"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Loader2, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginAdmin(email, password);
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to selection
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-800">
              Admin Sign In
            </CardTitle>
            <CardDescription>
              Access the NailTech admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nailtech.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Admin access is restricted to authorized personnel only.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
