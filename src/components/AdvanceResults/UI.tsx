import React, { useState, useEffect } from "react";
import InfoCardsContainer from "./StatsCard";
import { Header } from "../Header";
import InfoCardList from "./InfocardList";
import "@/index.css";
import Datta from "@/Data/export_test@gmail.com.json";
import PhoneData from "@/Data/+918318943598.json";
import user from "@/Data/Aditya.json";
import ActivityProfileCard from "./ActivityProfileCard";
import BreachedAccount from "./Breached";
import LoadingSkeleton from "../LoadingSkeleton";
import { NewTimeline } from "./NewTimeline";
import Footer from "../Footer";
import { useLocation, useNavigate } from "react-router-dom";

const UI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const PaidSearch = params.get("PaidSearch");
  const query = params.get("query");
  const typeofsearch = params.get("typeofsearch");
  const UserId = params.get("userId");
  const [DATA, setDATA] = useState([]);
  const [hidebutton, sethidebutton] = useState(false);
  const [isloading, setisloading] = useState(true);
  const [error, setError] = useState(null);
  const [HibpCount, setHibpCount] = useState(0);
  const [hibpData, setHibpData] = useState([]);
  const [nonHibpData, setNonHibpData] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  const FetchURL = import.meta.env.VITE_ADVANCE_BACKEND;
  const AUTH_URL = import.meta.env.VITE_AUTH_BACKEND;

  useEffect(() => {
    // Store search parameters in localStorage
    if (PaidSearch) localStorage.setItem("PaidSearch", PaidSearch);
    if (query) localStorage.setItem("query", query);
    if (typeofsearch) localStorage.setItem("typeofsearch", typeofsearch);
    if (UserId) localStorage.setItem("userId", UserId);

    // Update URL if parameters are missing but exist in localStorage
    if ((!params.get("PaidSearch") || !params.get("query")) && PaidSearch && query) {
      const newParams = new URLSearchParams();
      newParams.set("PaidSearch", PaidSearch);
      newParams.set("query", query);
      if (typeofsearch) newParams.set("typeofsearch", typeofsearch);
      if (UserId) newParams.set("userId", UserId);
      navigate(`?${newParams.toString()}`, { replace: true });
    }

    const fetchData = async () => {
      if (hasFetched) return;

      if (query === "45206164641316463216463164") {
        let newData;
        if (PaidSearch === "Phone") {
          newData = Datta;
        } else if (PaidSearch === "Email") {
          newData = Datta;
        } else if (PaidSearch === "Username") {
          newData = user;
        }
        if (newData) {
          setDATA(newData);
          setisloading(false);
        }
        return;
      }
      setisloading(true);
      setError(null);
      try {
        const queryType = PaidSearch.toLowerCase();
        console.log("fetching data advance");
        // console.log("PaidSearch", PaidSearch,query);
        const response = await fetch(
          `${FetchURL}/AdvanceResult?type=${queryType.toLowerCase()}&query=${encodeURIComponent(
            query
          )}&`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setDATA(result);
        setHasFetched(true); // Mark that we've fetched the data
        if (result) {
          const id = UserId;
          console.log("User ID", id);
          const response = await fetch(`${AUTH_URL}/api/credits/remove/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: id,
              amount: 0.5,
            }),
          });
          console.log(response);
          if (response.ok) {
            console.log("Credits removed successfully");
          }
        }
      } catch (error) {
        console.error("API fetch error:", error);
        setError(error.message);
      } finally {
        setisloading(false);
      }
    };

    fetchData();
  }, [query, PaidSearch, hasFetched]);

  useEffect(() => {
    if (Array.isArray(DATA) && DATA.length > 0) {
      
      const hibpItems = DATA.filter((item) => item && item.module === "hibp");
      const nonHibpItems = DATA.filter((item) => item && item.module !== "hibp");
      setNonHibpData(nonHibpItems);
      if (hibpItems.length > 0) {
        setHibpData(hibpItems);
        // Safely access hibpItems[0].data and its length
        setHibpCount(Array.isArray(hibpItems[0]?.data) ? hibpItems[0].data.length : 0);
      } else {
        setHibpData([]);
        setHibpCount(0);
      }
    } else {
      setNonHibpData([]);
      setHibpData([]);
      setHibpCount(0);
    }
  }, [DATA]);
  return (
    <div className="flex flex-col text-white gap-10 justify-center items-center mx-auto  sm:px-12 md:px-16 lg:px-36 scrollbar py-3 scrollbar-hidden w-full overflow-x-hidden px-2">
      <div className="h-screen absolute top-0 left-0 w-full z-[-1] scrollbar-hidden">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/3fa80b610429bb88de86c8b20c39e87e7307087081b833e523b4bd950d758363?placeholderIfAbsent=true"
          className="md:object-fit lg:object-cover opacity-30 w-full h-full absolute top-0 left-0"
          alt="Background top"
        />
      </div>

      {isloading || DATA.length <= 0 ? (
        <>
          <LoadingSkeleton />
        </>
      ) : (
        <>
          <Header />
          {/* {JSON.stringify(nonHibpData.map((item) => item.widgets[0]?.content[0]?.value))} */}
          {query !== "45206164641316463216463164" && (
            <div className="flex items-center justify-center w-full mb-6">
              <h2 className="text-white text-2xl font-semibold relative group">
                Results for: <span className="text-teal-300">{query}</span>
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent transform scale-x-100 transition-transform duration-300"></div>
              </h2>
            </div>
          )}
          {hibpData.length > 0 && (
            <button
              className="bg-[#131315] text-white border flex gap-3 flex-1 grow shrink basis-auto px-4 py-4 rounded-md border-red-500 border-solid overflow-visible shadow-md shadow-red-700/40 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/70 transition-all duration-300 group relative"
              onClick={() => {
                document.getElementById("breached-account")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="text-red-200 font-bold text-lg">View Breached Data</div>{" "}
              <sup>{HibpCount}</sup>
            </button>
          )}
          <div className="flex justify-between w-full">
            <InfoCardsContainer data={nonHibpData} />
          </div>
          <div className="flex justify-between w-full">
            <NewTimeline data={nonHibpData} />
            {/* <Timeline data={DATA} /> */}
          </div>
          <div className="flex justify-between w-full">
            <ActivityProfileCard userData={nonHibpData} />
          </div>
          <div id="breached-account" className="flex justify-between w-full">
            <BreachedAccount userData={hibpData} />
          </div>
          <div className="w-full">
            <InfoCardList
              users={nonHibpData}
              fulldata={DATA}
              hidebutton={hidebutton}
              PaidSearch={PaidSearch}
              sethidebutton={sethidebutton}
            />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default UI;
