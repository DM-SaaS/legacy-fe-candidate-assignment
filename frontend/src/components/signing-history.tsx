'use client';

import { useSigningHistory } from '@/hooks/use-signing-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download,
  BarChart3,
  Clock,
  User,
  FileText,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

export function SigningHistory() {
  const { 
    history, 
    isLoading, 
    hasHistory, 
    exportHistory,
    getStats 
  } = useSigningHistory();

  const stats = getStats();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };



  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Statistics Card - Compact */}
      {hasHistory && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-slate-700" />
            <h4 className="font-semibold text-slate-900">Statistics</h4>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 bg-white/80 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{stats.totalMessages}</div>
              <div className="text-xs text-blue-700">Total</div>
            </div>
            <div className="text-center p-2 bg-white/80 rounded-lg">
              <div className="text-lg font-bold text-green-600">{stats.validMessages}</div>
              <div className="text-xs text-green-700">Valid</div>
            </div>
            <div className="text-center p-2 bg-white/80 rounded-lg">
              <div className="text-lg font-bold text-orange-600">{stats.uniqueSigners}</div>
              <div className="text-xs text-orange-700">Signers</div>
            </div>
            <div className="text-center p-2 bg-white/80 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{stats.successRate.toFixed(1)}%</div>
              <div className="text-xs text-purple-700">Success</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      {hasHistory && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-600">
            {history.length} message{history.length !== 1 ? 's' : ''} in permanent audit trail
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={exportHistory}
            className="flex items-center gap-2 h-8"
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      )}

      {/* History List - Scrollable */}
      <div className="flex-1 min-h-0">
        {!hasHistory ? (
          <div className="h-full flex items-center justify-center">
            <Alert className="max-w-md">
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No signing history yet. Sign your first message to see it appear here!
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="h-full overflow-y-auto space-y-3 pr-2">
            {history.map((item, index) => (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <Badge variant={item.isValid ? "default" : "destructive"} className="text-xs">
                        {item.isValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Message - Truncated */}
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Message:</div>
                    <div className="p-2 bg-gray-50 rounded text-sm break-words line-clamp-2">
                      {item.message.length > 100 ? `${item.message.slice(0, 100)}...` : item.message}
                    </div>
                  </div>

                  {/* Signer - Compact */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3 w-3" />
                    <span className="text-muted-foreground">Signer:</span>
                    <code className="text-xs bg-gray-100 px-1 rounded flex-1 truncate">
                      {item.signer}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(item.signer, 'Signer address')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Signature - Compact */}
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Signature:</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-gray-50 rounded text-xs truncate">
                        {item.signature.slice(0, 20)}...{item.signature.slice(-20)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(item.signature, 'Signature')}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg">
                      <Shield className="h-3 w-3 text-slate-600" />
                      <span className="text-xs font-medium text-slate-700">Protected</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Entry #{history.length - index}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Bottom spacer for better scrolling */}
            <div className="h-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}