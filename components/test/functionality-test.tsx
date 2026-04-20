"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Play,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  details?: any;
}

export function FunctionalityTest() {
  const { user, isAdmin } = useAdminAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateTest = (
    name: string,
    status: TestResult["status"],
    message: string,
    details?: any,
  ) => {
    setTests((prev) => {
      const existing = prev.find((t) => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      } else {
        return [...prev, { name, status, message, details }];
      }
    });
  };

  const runComprehensiveTest = async () => {
    setRunning(true);
    setTests([]);
    setProgress(0);

    const testSteps = [
      "Authentication Check",
      "Database Connection",
      "Today's Bookings Data",
      "Client Registration Test",
      "Booking Creation Test",
      "Message System Test",
      "Real-time Sync Test",
      "Dashboard Metrics Test",
    ];

    let currentStep = 0;

    for (const step of testSteps) {
      setCurrentTest(step);
      setProgress((currentStep / testSteps.length) * 100);

      try {
        switch (step) {
          case "Authentication Check":
            await testAuthentication();
            break;
          case "Database Connection":
            await testDatabaseConnection();
            break;
          case "Today's Bookings Data":
            await testTodaysBookings();
            break;
          case "Client Registration Test":
            await testClientRegistration();
            break;
          case "Booking Creation Test":
            await testBookingCreation();
            break;
          case "Message System Test":
            await testMessagingSystem();
            break;
          case "Real-time Sync Test":
            await testRealTimeSync();
            break;
          case "Dashboard Metrics Test":
            await testDashboardMetrics();
            break;
        }
      } catch (error: any) {
        updateTest(step, "error", `Failed: ${error.message}`, error);
      }

      currentStep++;
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between tests
    }

    setProgress(100);
    setCurrentTest("");
    setRunning(false);
    toast.success("Comprehensive test completed!");
  };

  const testAuthentication = async () => {
    updateTest(
      "Authentication Check",
      "running",
      "Checking admin authentication...",
    );

    if (!user) {
      throw new Error("No user authenticated");
    }

    if (!isAdmin) {
      throw new Error("User is not admin");
    }

    updateTest(
      "Authentication Check",
      "success",
      `✅ Admin authenticated: ${user.email}`,
    );
  };

  const testDatabaseConnection = async () => {
    updateTest(
      "Database Connection",
      "running",
      "Testing database connectivity...",
    );

    const collections = [
      "bookings",
      "clients",
      "conversations",
      "messages",
      "notifications",
    ];
    const results: any = {};

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      results[collectionName] = snapshot.docs.length;
    }

    updateTest(
      "Database Connection",
      "success",
      "✅ All collections accessible",
      results,
    );
  };

  const testTodaysBookings = async () => {
    updateTest(
      "Today's Bookings Data",
      "running",
      "Testing today's bookings query...",
    );

    const today = new Date().toISOString().split("T")[0];
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("date", "==", today),
    );

    const snapshot = await getDocs(bookingsQuery);
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const revenue = bookings.reduce(
      (sum: number, booking: any) => sum + (booking.revenue || 0),
      0,
    );

    updateTest(
      "Today's Bookings Data",
      "success",
      `✅ Found ${bookings.length} bookings today, Revenue: Ksh${revenue}`,
      { count: bookings.length, revenue, bookings: bookings.slice(0, 3) },
    );
  };

  const testClientRegistration = async () => {
    updateTest(
      "Client Registration Test",
      "running",
      "Testing client data structure...",
    );

    const clientsSnapshot = await getDocs(collection(db, "clients"));
    const clients = clientsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    updateTest(
      "Client Registration Test",
      "success",
      `✅ Found ${clients.length} registered clients`,
      { count: clients.length, samples: clients.slice(0, 2) },
    );
  };

  const testBookingCreation = async () => {
    updateTest("Booking Creation Test", "running", "Creating test booking...");

    const testBooking = {
      customerId: "test-client-" + Date.now(),
      customerName: "Test Client",
      customerEmail: "test@example.com",
      customerPhone: "+254700000000",
      service: "Test Service",
      stylist: "Test Stylist",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
      status: "pending",
      notes: "Test booking from functionality test",
      createdAt: Timestamp.now(),
      revenue: 500,
    };

    const docRef = await addDoc(collection(db, "bookings"), testBooking);

    updateTest(
      "Booking Creation Test",
      "success",
      `✅ Test booking created successfully`,
      { bookingId: docRef.id, booking: testBooking },
    );
  };

  const testMessagingSystem = async () => {
    updateTest(
      "Message System Test",
      "running",
      "Testing messaging functionality...",
    );

    const testConversationId = `test-conversation-${Date.now()}`;

    // Create test conversation
    await setDoc(doc(db, "conversations", testConversationId), {
      id: testConversationId,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerId: "test-client",
      lastMessage: "Test message",
      lastMessageTime: Timestamp.now(),
      unreadCount: 1,
    });

    // Create test message
    await addDoc(collection(db, "messages"), {
      text: "Test message from functionality test",
      senderId: "test-client",
      senderName: "Test Client",
      senderType: "customer",
      conversationId: testConversationId,
      timestamp: Timestamp.now(),
    });

    updateTest(
      "Message System Test",
      "success",
      `✅ Conversation and message created successfully`,
      { conversationId: testConversationId },
    );
  };

  const testRealTimeSync = async () => {
    updateTest(
      "Real-time Sync Test",
      "running",
      "Testing real-time listeners...",
    );

    return new Promise((resolve, reject) => {
      let listenerCount = 0;
      const timeout = setTimeout(() => {
        reject(new Error("Real-time listener timeout"));
      }, 5000);

      // Test bookings listener
      const unsubscribe = onSnapshot(
        collection(db, "bookings"),
        (snapshot) => {
          listenerCount++;
          if (listenerCount >= 1) {
            clearTimeout(timeout);
            unsubscribe();
            updateTest(
              "Real-time Sync Test",
              "success",
              `✅ Real-time listeners working (${snapshot.docs.length} docs)`,
              { docCount: snapshot.docs.length },
            );
            resolve(true);
          }
        },
        (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      );
    });
  };

  const testDashboardMetrics = async () => {
    updateTest(
      "Dashboard Metrics Test",
      "running",
      "Computing dashboard metrics...",
    );

    const today = new Date().toISOString().split("T")[0];

    // Get today's bookings
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("date", "==", today),
    );
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const todaysBookings = bookingsSnapshot.docs.length;
    const revenue = bookingsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().revenue || 0),
      0,
    );

    // Get conversations
    const conversationsSnapshot = await getDocs(
      collection(db, "conversations"),
    );
    const pendingMessages = conversationsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().unreadCount || 0),
      0,
    );

    // Get clients
    const clientsSnapshot = await getDocs(collection(db, "clients"));
    const activeCustomers = clientsSnapshot.docs.length;

    const metrics = {
      todaysBookings,
      pendingMessages,
      activeCustomers,
      revenue,
    };

    updateTest(
      "Dashboard Metrics Test",
      "success",
      `✅ All metrics computed successfully`,
      metrics,
    );
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return <div className="h-4 w-4 border border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const passedTests = tests.filter((t) => t.status === "success").length;
  const failedTests = tests.filter((t) => t.status === "error").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Comprehensive Functionality Test</span>
          </CardTitle>
          <CardDescription>
            Complete test of all NailTech features including real-time sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-4 flex">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                Bookings
              </Badge>
              <Badge variant="outline">
                <MessageSquare className="h-3 w-3 mr-1" />
                Messages
              </Badge>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                Customers
              </Badge>
              <Badge variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Revenue
              </Badge>
            </div>
            <Button onClick={runComprehensiveTest} disabled={running}>
              {running ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Full Test
                </>
              )}
            </Button>
          </div>

          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {currentTest}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {tests.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Test Results:</h4>
                <div className="space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    ✅ {passedTests} passed
                  </Badge>
                  {failedTests > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      ❌ {failedTests} failed
                    </Badge>
                  )}
                </div>
              </div>

              {tests.map((test, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(test.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{test.name}</span>
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {test.message}
                        </p>
                        {test.details && (
                          <div className="mt-2 text-xs">
                            <details className="cursor-pointer">
                              <summary className="text-blue-600 hover:text-blue-800">
                                View Details
                              </summary>
                              <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto">
                                {JSON.stringify(test.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              This test verifies: Authentication, Database access, Today's
              bookings calculation, Client management, Booking creation,
              Messaging system, Real-time sync, and Dashboard metrics.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
