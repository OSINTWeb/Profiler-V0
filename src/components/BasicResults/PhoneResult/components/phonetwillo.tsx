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
  Wifi,
  Globe,
  Building,
  Network,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PhoneTwilioProps {
  data: any;
}

const PhoneTwilio: React.FC<PhoneTwilioProps> = ({ data }) => {
  const twilioData = data?.twilio || {};
  
  const carrierName = twilioData.carrier_name || "Unknown Carrier";
  const errorCode = twilioData.error_code;
  const mcc = twilioData.mobile_country_code || "N/A";
  const mnc = twilioData.mobile_network_code || "N/A";
  const phoneType = twilioData.type || "Unknown";

  return (
    <div className="w-[50%] mx-auto p-3 space-y-4 bg-gray-600 text-white rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Carrier Information</h2>
        <Badge variant={errorCode ? "destructive" : "default"} className="flex items-center gap-1">
          {errorCode ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          {errorCode ? "Error" : "Valid"}
        </Badge>
      </div>

      {/* Main Info Card */}
      <Card className="overflow-hidden border border-gray-800 bg-gray-950 shadow-md">
        <CardHeader className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">{carrierName}</CardTitle>
              <CardDescription className="text-gray-300 flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3" /> {phoneType.toUpperCase()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 bg-gray-950">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-900 p-2 rounded-md border border-gray-800">
              <h3 className="text-md font-bold flex items-center gap-1 mb-1 text-white border-b border-gray-700 pb-1">
                <Network className="h-4 w-4 text-blue-400" /> Network Details
              </h3>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                <div className="text-gray-200">Mobile Country Code:</div>
                <div className="font-medium text-white text-right">{mcc}</div>
                
                <div className="text-gray-200">Mobile Network Code:</div>
                <div className="font-medium text-white text-right">{mnc}</div>
                
                <div className="text-gray-200">Network Type:</div>
                <div className="font-medium text-white text-right capitalize">{phoneType}</div>
                
                {errorCode && (
                  <>
                    <div className="text-gray-200">Error Code:</div>
                    <div className="font-medium text-red-400 text-right">{errorCode}</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-gray-900 p-2 rounded-md border border-gray-800">
              <h3 className="text-md font-bold flex items-center gap-1 mb-1 text-white border-b border-gray-700 pb-1">
                <Globe className="h-4 w-4 text-blue-400" /> Coverage Information
              </h3>
              <div className="p-2 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Wifi className="h-4 w-4 text-blue-400" />
                  <span className="text-white">{carrierName} provides {phoneType} service in this region</span>
                </div>
                <div className="text-gray-200 text-xs">
                  MCC-MNC: {mcc}-{mnc} identifies the mobile network operator
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Detail */}
      <Card className="bg-gray-950 border border-gray-800">
        <CardHeader className="p-2 bg-gray-900">
          <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
            <Wifi className="h-4 w-4 text-blue-400" /> Technical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="bg-gray-900 p-2 rounded-md">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between border-b border-gray-800 py-1">
                <span className="text-gray-200">Carrier:</span>
                <span className="font-medium text-white">{carrierName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 py-1">
                <span className="text-gray-200">MCC:</span>
                <span className="font-medium text-white">{mcc}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 py-1">
                <span className="text-gray-200">MNC:</span>
                <span className="font-medium text-white">{mnc}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 py-1">
                <span className="text-gray-200">Type:</span>
                <span className="font-medium text-white capitalize">{phoneType}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-200">Status:</span>
                <Badge variant={errorCode ? "destructive" : "default"} className="text-xs">
                  {errorCode ? `Error: ${errorCode}` : "Valid"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneTwilio;
