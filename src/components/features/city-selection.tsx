"use client";
import React from "react";
import { useCity } from "../../context/CityContext";
import { Autocomplete } from "../../../components/ui/auto-complete";
// import Autocomplete from your UI library or local component
// import { Autocomplete } from 'your-autocomplete-path';

export default function CitySelection() {
  const { city, setCity } = useCity();
  const cities = [
    "Mysuru",
    "Bengaluru",
    "Hyderabad",
    "Chennai",
    "Mumbai",
    "Delhi",
  ]; // Example cities, replace with actual data
  
  return (
    <div className="px-4 pt-8 w-full md:pt-12 md:w-[50%] mx-auto">
      <h1 className="font-amiri text-4xl md:text-5xl font-bold">Please Select the City</h1>
      <div className="relative">
        <Autocomplete
          options={cities.map((city: any) => ({ label: city, id: city }))}
          placeholder="Select the city"
          value={city}
          onChange={(e: any) => setCity(e.target ? e.target.value : e)}
          onSelect={(opt: any) => setCity(opt ? opt.label : "")}
        />
      </div>
    </div>
  );
}