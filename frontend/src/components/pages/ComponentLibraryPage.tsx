import { useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { IconButton } from "../ui/IconButton";
import { StatusBadge } from "../ui/StatusBadge";
import { EmptyState } from "../ui/EmptyState";
import { Spinner } from "../ui/Spinner";
import { IconContainer } from "../ui/IconContainer";
import { AddressDisplay } from "../ui/AddressDisplay";
import { InfoRow } from "../ui/InfoRow";
import { SectionHeader } from "../ui/SectionHeader";
import { useToggle } from "../../hooks";
import {
  Mail,
  Download,
  Plus,
  Settings,
  AlertTriangle,
  Home,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  Copy,
  User,
  Wallet,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";

export function ComponentLibraryPage() {
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [showPassword] = useToggle(false);

  // All icons used in the project
  const allIcons = [
    { name: "Mail", component: Mail },
    { name: "Download", component: Download },
    { name: "Plus", component: Plus },
    { name: "Settings", component: Settings },
    { name: "AlertTriangle", component: AlertTriangle },
    { name: "Home", component: Home },
    { name: "ArrowLeft", component: ArrowLeft },
    { name: "Shield", component: Shield },
    { name: "CheckCircle", component: CheckCircle },
    { name: "XCircle", component: XCircle },
    { name: "Clock", component: Clock },
    { name: "AlertCircle", component: AlertCircle },
    { name: "Trash2", component: Trash2 },
    { name: "Copy", component: Copy },
    { name: "User", component: User },
    { name: "Wallet", component: Wallet },
    { name: "Search", component: Search },
    { name: "Eye", component: Eye },
    { name: "EyeOff", component: EyeOff },
  ];

  // Color schemes used in the project
  const colorSchemes = {
    primary: {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
    },
    gray: {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "200": "#e5e7eb",
      "300": "#d1d5db",
      "400": "#9ca3af",
      "500": "#6b7280",
      "600": "#4b5563",
      "700": "#374151",
      "800": "#1f2937",
      "900": "#111827",
    },
    status: {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Component Library
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive showcase of all UI components, icons, and color
            schemes used in this project.
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <SectionHeader>Table of Contents</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <a
              href="#components"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              UI Components
            </a>
            <a
              href="#icons"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Icons
            </a>
            <a
              href="#colors"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Color Schemes
            </a>
          </div>
        </Card>

        {/* UI Components Section */}
        <section id="components" className="mb-12">
          <SectionHeader>UI Components</SectionHeader>

          {/* Buttons */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button icon={Mail}>With Icon</Button>
                <Button icon={Download} iconPosition="right">
                  Icon Right
                </Button>
                <Button icon={Plus} iconOnly />
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button isLoading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Card>

          {/* Icon Buttons */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Icon Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <IconButton>
                <Settings className="w-4 h-4" />
              </IconButton>
              <IconButton variant="danger">
                <Trash2 className="w-4 h-4" />
              </IconButton>
              <IconButton variant="ghost">
                <Search className="w-4 h-4" />
              </IconButton>
            </div>
          </Card>

          {/* Inputs */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Input Fields</h3>
            <div className="space-y-4 max-w-md">
              <Input
                label="Email"
                placeholder="Enter your email"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <Input
                label="Required Field"
                placeholder="This field is required"
                error="This field is required"
              />
              <Input
                label="Disabled Field"
                placeholder="Disabled input"
                disabled
              />
            </div>
          </Card>

          {/* Textarea */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Textarea</h3>
            <div className="max-w-md">
              <Textarea
                label="Message"
                placeholder="Enter your message..."
                value={textareaValue}
                onChange={e => setTextareaValue(e.target.value)}
                rows={4}
              />
            </div>
          </Card>

          {/* Cards */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p>Default Card</p>
              </Card>
              <Card variant="outlined">
                <p>Outlined Card</p>
              </Card>
              <Card variant="elevated">
                <p>Elevated Card</p>
              </Card>
            </div>
          </Card>

          {/* Status Badges */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Status Badges</h3>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="success" />
              <StatusBadge status="error" />
              <StatusBadge status="pending" />
              <StatusBadge status="warning" />
            </div>
          </Card>

          {/* Icon Containers */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Icon Containers</h3>
            <div className="flex flex-wrap gap-4">
              <IconContainer variant="primary">
                <Shield className="w-8 h-8" />
              </IconContainer>
              <IconContainer variant="secondary">
                <User className="w-8 h-8" />
              </IconContainer>
              <IconContainer variant="accent">
                <Wallet className="w-8 h-8" />
              </IconContainer>
            </div>
          </Card>

          {/* Spinners */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Spinners</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </Card>

          {/* Empty State */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Empty State</h3>
            <EmptyState
              icon={Mail}
              title="No messages"
              description="Start a conversation to see messages here"
              action={<Button icon={Plus}>New Message</Button>}
            />
          </Card>

          {/* Info Row */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Info Rows</h3>
            <div className="space-y-2">
              <InfoRow icon={User} label="Email" value="user@example.com" />
              <InfoRow
                icon={Wallet}
                label="Wallet"
                value={<AddressDisplay address="0x742d35Cc6634C0532925a3b8D" />}
              />
            </div>
          </Card>
        </section>

        {/* Icons Section */}
        <section id="icons" className="mb-12">
          <SectionHeader>Icons</SectionHeader>
          <Card>
            <p className="text-gray-600 mb-6">
              All icons used in this project are from{" "}
              <a
                href="https://lucide.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Lucide React
              </a>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allIcons.map(({ name, component: IconComponent }) => (
                <div
                  key={name}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <IconComponent className="w-6 h-6 text-gray-700 mb-2" />
                  <span className="text-xs text-gray-600 text-center">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Color Schemes Section */}
        <section id="colors" className="mb-12">
          <SectionHeader>Color Schemes</SectionHeader>

          {/* Primary Colors */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Primary Colors</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Object.entries(colorSchemes.primary).map(([shade, color]) => (
                <div key={shade} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs text-gray-600">
                    <div>{shade}</div>
                    <div className="font-mono">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Gray Colors */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Gray Colors</h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {Object.entries(colorSchemes.gray).map(([shade, color]) => (
                <div key={shade} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs text-gray-600">
                    <div>{shade}</div>
                    <div className="font-mono">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Status Colors */}
          <Card className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Status Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(colorSchemes.status).map(([status, color]) => (
                <div key={status} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-xs text-gray-600">
                    <div className="capitalize">{status}</div>
                    <div className="font-mono">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
