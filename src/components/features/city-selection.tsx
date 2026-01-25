"use client";
import React from "react";
import { useCity } from "../../context/CityContext";
import { Autocomplete } from "../../../components/ui/auto-complete";
import { cities } from '../../lib/data'

// import Autocomplete from your UI library or local component
// import { Autocomplete } from 'your-autocomplete-path';

export default function CitySelection() {
  const { city, setCity } = useCity();
  const handleCityChange = (city: any) => {
    setCity(city ? city.label : "");
    localStorage.setItem("city", city ? city.label : "");
  };
  return (
    <div className="px-4 pt-8 w-full md:pt-12 md:w-[50%] mx-auto">
      <h1 className="font-amiri text-4xl md:text-5xl font-bold">Please Select the City</h1>
      <div className="relative">
        <Autocomplete
          options={cities.map((city: any) => ({ label: city, id: city }))}
          placeholder="Select the city"
          value={city}
          onChange={(e: any) => setCity(e.target ? e.target.value : e)}
          onSelect={(opt: any) => handleCityChange(opt)}
        />
      </div>
    </div>
  );
}