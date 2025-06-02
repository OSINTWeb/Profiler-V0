import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import CallerAPI from './components/callerapi';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import samplePhoneData from '@/Data/phoneUser.json';

const PhoneResultUI = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query') || '';
  const [phoneData, setPhoneData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('api');

  useEffect(() => {
    const fetchPhoneData = async () => {
      setIsLoading(true);
      
      // Only proceed if we have a valid phone number
      if (!query || query.trim() === '') {
        toast({
          title: "Invalid Phone Number",
          description: "Please provide a valid phone number for lookup.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      try {
        // Format phone number for API - remove any non-digit character
        const formattedPhone = query.replace(/\D/g, '');
        
        // Use environment variable for API endpoint
        const apiUrl = `${import.meta.env.VITE_PHONE_BASIC_API}/lookup?phone=${formattedPhone}`;
        
        console.log("Fetching data from API:", apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "X-API-Key": import.meta.env.VITE_PHONE_API_KEY || "lfYYrh30Hc"
          },
          signal: AbortSignal.timeout(10000) 
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setPhoneData(data);
        setDataSource('api');
        
        toast({
          title: "Live Data Loaded",
          description: "Successfully fetched live phone data.",
          variant: "default"
        });
      } catch (error) {
        console.error("Failed to fetch live phone data:", error);
        
        // Fallback to sample data
        console.log("Falling back to sample data");
        setPhoneData(samplePhoneData);
        setDataSource('local');
        
        toast({
          title: "Using Sample Data",
          description: "Live API unavailable. Using sample data instead.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPhoneData();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-48 bg-gray-700 rounded mb-4"></div>
            <div className="h-10 w-64 bg-gray-700 rounded"></div>
            <div className="mt-4 text-gray-400 text-sm">Fetching phone information...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white text-center">Phone Number Lookup Results</h1>
          <p className="text-white text-center">Results for: {query}</p>
          {dataSource === 'local' && (
            <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 text-xs px-4 py-2 rounded mt-2 text-center">
              Using sample data. Live API connection unavailable.
            </div>
          )}
        </div>
        
        <div className="rounded-lg shadow-md flex flex-col gap-4">
          {phoneData && <CallerAPI data={phoneData.callerapi} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PhoneResultUI;
