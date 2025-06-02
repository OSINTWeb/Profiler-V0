import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  UserCircle,
  MessageCircle,
  Globe,
  Facebook,
  Phone,
  Smartphone,
  Share2,
  Info,
  Apple
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SocialPhoneProps {
  data: any;
}

const SocialPhone: React.FC<SocialPhoneProps> = ({ data }) => {
  const facebookData = data?.Facebook || [];
  const whatsappData = data?.whatsapp || {};
  const appleData = data?.apple || {};
  
  const hasFacebookData = facebookData.length > 0;
  const hasWhatsappData = Object.keys(whatsappData).length > 0;
  const hasAppleData = Object.keys(appleData).length > 0;

  return (
    <div className="w-[50%] mx-auto p-3 space-y-4 bg-gray-600 text-white rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Social Media Profiles</h2>
        <Badge variant="outline" className="flex items-center gap-1 text-white">
          <Share2 className="h-3 w-3" />
          {hasFacebookData ? facebookData.length : 0} Profiles
        </Badge>
      </div>

      {/* Facebook Profile */}
      {hasFacebookData && (
        <Card className="overflow-hidden border border-gray-800 bg-gray-950 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center">
                <Facebook className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Facebook Profiles</CardTitle>
                <CardDescription className="text-gray-300 flex items-center gap-1 text-sm">
                  <UserCircle className="h-3 w-3" /> {facebookData.length} associated profiles
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 bg-gray-950">
            <div className="grid grid-cols-1 gap-3">
              {facebookData.map((profile, index) => (
                <div key={index} className="bg-gray-900 p-2 rounded-md border border-gray-800">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarImage src={profile.profile_picture} alt={profile.name} />
                      <AvatarFallback className="text-sm bg-blue-900">{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-md font-bold text-white">{profile.name}</h3>
                      <p className="text-xs text-gray-300">{profile.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Data */}
      {hasWhatsappData && (
        <Card className="bg-gray-950 border border-gray-800">
          <CardHeader className="p-2 bg-gradient-to-r from-green-900 to-emerald-900">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-white">WhatsApp Profile</CardTitle>
                <CardDescription className="text-gray-300 flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3" /> {whatsappData.phone || whatsappData.number}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-1 gap-3">
              {/* Profile Info */}
              <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
                <div className="flex items-start gap-3">
                  {whatsappData.profilePic ? (
                    <Avatar className="h-12 w-12 border border-gray-700">
                      <AvatarImage src={whatsappData.profilePic} alt="WhatsApp Profile" />
                      <AvatarFallback className="text-sm bg-green-900">WA</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-green-900 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-md font-bold text-white">WhatsApp User</h3>
                    <p className="text-xs text-gray-300">{whatsappData.number}</p>
                    {whatsappData.about && (
                      <p className="text-sm text-gray-200 mt-1 italic">"{whatsappData.about}"</p>
                    )}
                    <div className="flex gap-1 mt-2">
                      {whatsappData.isBusiness && (
                        <Badge variant="outline" className="text-xs bg-blue-900 text-white">
                          Business
                        </Badge>
                      )}
                      {whatsappData.isWAContact && (
                        <Badge variant="outline" className="text-xs bg-green-900 text-white">
                          WhatsApp Contact
                        </Badge>
                      )}
                      {whatsappData.isMyContact && (
                        <Badge variant="outline" className="text-xs bg-gray-700 text-white">
                          My Contact
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
                <h4 className="font-bold mb-2 text-sm text-white border-b border-gray-700 pb-1">
                  Account Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col space-y-1">
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">Phone:</span>
                      <span className="block font-medium text-white">{whatsappData.phone || whatsappData.number}</span>
                    </div>
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">Country:</span>
                      <span className="block font-medium text-white">{whatsappData.countryCode || 'Unknown'}</span>
                    </div>
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">User ID:</span>
                      <span className="block font-medium text-white truncate">{whatsappData.id?.user || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">Business:</span>
                      <span className="block font-medium text-white">{whatsappData.isBusiness ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">Blocked:</span>
                      <span className="block font-medium text-white">{whatsappData.isBlocked ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="border-b border-gray-800 py-1">
                      <span className="text-gray-400">Server:</span>
                      <span className="block font-medium text-white">{whatsappData.id?.server || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Serialized ID */}
              <div className="bg-gray-900 p-3 rounded-md border border-gray-800">
                <h4 className="font-bold mb-2 text-xs text-white">
                  Serialized ID
                </h4>
                <div className="text-xs bg-gray-950 p-2 rounded border border-gray-700 font-mono break-all text-green-400">
                  {whatsappData.id?._serialized || 'Not available'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apple Data */}
      {hasAppleData ? (
        <Card className="bg-gray-950 border border-gray-800">
          <CardHeader className="p-2 bg-gray-900">
            <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
              <Apple className="h-4 w-4 text-gray-400" /> Apple Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="bg-gray-900 p-2 rounded-md">
              <div className="text-center py-4">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">No Apple data available for this phone number</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-950 border border-gray-800">
          <CardHeader className="p-2 bg-gray-900">
            <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
              <Apple className="h-4 w-4 text-gray-400" /> Apple Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="bg-gray-900 p-2 rounded-md">
              <div className="text-center py-4">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-300">No Apple data available for this phone number</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-gray-950 border border-gray-800">
        <CardHeader className="p-2 bg-gray-900">
          <CardTitle className="flex items-center gap-1 text-base font-bold text-white">
            <Smartphone className="h-4 w-4 text-blue-400" /> Social Footprint
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-900 p-2 rounded-md flex flex-col items-center justify-center text-center">
              <Facebook className="h-5 w-5 text-blue-500 mb-1" />
              <div className="text-md font-bold text-white">{facebookData.length}</div>
              <div className="text-xs text-gray-300">Facebook Profiles</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-md flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-5 w-5 text-green-500 mb-1" />
              <div className="text-md font-bold text-white">{hasWhatsappData ? "Yes" : "No"}</div>
              <div className="text-xs text-gray-300">WhatsApp Data</div>
            </div>
            <div className="bg-gray-900 p-2 rounded-md flex flex-col items-center justify-center text-center">
              <Apple className="h-5 w-5 text-gray-400 mb-1" />
              <div className="text-md font-bold text-white">{hasAppleData ? "Yes" : "No"}</div>
              <div className="text-xs text-gray-300">Apple Data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialPhone;
