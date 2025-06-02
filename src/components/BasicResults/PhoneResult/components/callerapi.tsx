import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Phone, 
  MapPin, 
  AlertCircle, 
  Shield, 
  Info, 
  User, 
  Globe 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface CallerApiProps {
  data: any;
}

const CallerAPI: React.FC<CallerApiProps> = ({ data }) => {
  const callerData = data?.callerapi || {};
  const truecaller = callerData.truecaller || {};
  const hiya = callerData.hiya || {};
  const viewcaller = callerData.viewcaller || [];
  
  // Get caller name from available sources
  const callerName = viewcaller[0]?.name || "Unknown Caller";
  const callerLocation = hiya.displayDetail || truecaller.country || "Location unknown";
  const callerNumber = truecaller.number || "No number available";
  const isSpam = callerData.callerapi?.is_spam || false;
  const spamScore = callerData.callerapi?.spam_score || 0;
  const provider = truecaller.provider || "Unknown";
  const lineType = truecaller.number_type_label || hiya.profileDetails?.lineTypeName || "Unknown";

  // Get first letter of name for avatar fallback
  const nameInitial = callerName.charAt(0).toUpperCase();

  return (
    <div className="w-[50%] mx-auto p-3 space-y-4 bg-gray-600 text-white rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Caller Information</h2>
        {isSpam && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Potential Spam
          </Badge>
        )}
      </div>

      {/* Main Info Car */}
      <Card className="overflow-hidden border border-gray-800 bg-gray-950 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-blue-400">
              <AvatarImage src={viewcaller[0]?.profilePic} />
              <AvatarFallback className="text-xl bg-blue-900">{nameInitial}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl font-bold text-white">{callerName}</CardTitle>
              <CardDescription className="text-gray-300 flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3" /> {callerNumber}
              </CardDescription>
              <CardDescription className="text-gray-300 flex items-center gap-1 text-sm">
                <MapPin className="h-3 w-3" /> {callerLocation}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 bg-gray-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-900 p-2 rounded-md border border-gray-800">
              <h3 className="text-md font-bold flex items-center gap-1 mb-1 text-white border-b border-gray-700 pb-1">
                <Info className="h-4 w-4 text-blue-400" /> Provider
              </h3>
              <div className="space-y-0.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-200">Provider:</span>
                  <span className="font-medium text-white">{provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Line Type:</span>
                  <span className="font-medium text-white">{lineType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Valid Number:</span>
                  <span className="font-medium text-white">{truecaller.is_valid ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-2 rounded-md border border-gray-800">
              <h3 className="text-md font-bold flex items-center gap-1 mb-1 text-white border-b border-gray-700 pb-1">
                <Shield className="h-4 w-4 text-blue-400" /> Safety
              </h3>
              <div className="space-y-0.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-200">Status:</span>
                  <Badge variant={isSpam ? "destructive" : "default"} className="text-xs">
                    {isSpam ? "Potential Spam" : "Not Marked as Spam"}
                  </Badge>
                </div>
                {spamScore > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-200">Spam Score:</span>
                    <span className="font-medium text-red-500">{spamScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Truecaller Details */}
      <Card className="bg-gray-950 border border-gray-800">
        <CardHeader className="p-2 bg-gray-900">
          <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
            <User className="h-4 w-4 text-blue-400" /> Truecaller Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-gray-900 p-2 rounded-md">
              <div className="space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-200">Country:</span>
                  <span className="font-medium text-white">{truecaller.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Country Code:</span>
                  <span className="font-medium text-white">+{truecaller.country_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Number Type:</span>
                  <span className="font-medium text-white">{truecaller.number_type_label}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 p-2 rounded-md">
              <div className="space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-200">Provider:</span>
                  <span className="font-medium text-white">{truecaller.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">National Number:</span>
                  <span className="font-medium text-white">{truecaller.national_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-200">Time Zone:</span>
                  <span className="font-medium text-white">{truecaller.time_zones?.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Viewcaller info if available */}
      {viewcaller.length > 0 && (
        <Card className="bg-gray-950 border border-gray-800">
          <CardHeader className="p-2 bg-gray-900">
            <CardTitle className="text-base font-bold text-white">Viewcaller Information</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-2">
              {viewcaller[0].names && (
                <div className="bg-gray-900 p-2 rounded-md">
                  <h4 className="font-bold mb-1 text-sm text-white border-b border-gray-700 pb-1">Names Reported ({viewcaller[0].namesCount})</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {viewcaller[0].names.map((nameInfo: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-0.5 border-b border-gray-800 text-xs">
                        <span className="text-white">{nameInfo.name}</span>
                        <Badge variant="outline" className="text-xs text-white">{nameInfo.occurrences} reports</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between bg-gray-900 p-2 rounded-md">
                <span className="text-gray-200 text-sm">Spam:</span>
                <Badge variant={viewcaller[0].spam ? "destructive" : "default"} className="text-xs">
                  {viewcaller[0].spam ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Info */}
      <Card className="bg-gray-950 border border-gray-800">
        <CardHeader className="p-2 bg-gray-900">
          <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
            <Globe className="h-4 w-4 text-blue-400" /> Network Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="bg-gray-900 p-2 rounded-md">
            <h4 className="font-bold mb-1 text-sm text-white border-b border-gray-700 pb-1">Hiya Data</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <div className="text-gray-200">Call ID:</div>
              <div className="font-medium text-white text-right truncate">{hiya.callId || "N/A"}</div>
              
              <div className="text-gray-200">Display Detail:</div>
              <div className="font-medium text-white text-right">{hiya.displayDetail || "N/A"}</div>
              
              <div className="text-gray-200">Line Type:</div>
              <div className="font-medium text-white text-right">{hiya.profileDetails?.lineTypeName || "N/A"}</div>
              
              <div className="text-gray-200">Location:</div>
              <div className="font-medium text-white text-right">{hiya.profileDetails?.location || "N/A"}</div>
              
              <div className="text-gray-200">Reputation:</div>
              <div className="font-medium text-white text-right">{hiya.reputationLevel || "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallerAPI;
