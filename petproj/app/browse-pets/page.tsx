'use client'; 
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { RootState, AppDispatch } from '../store/store'; // Import your store types
import { fetchAdoptionPets } from '../store/slices/adoptionPetsSlice'; // Import the slice action
import Navbar from '@/components/navbar';
import VerticalSearchBar from '../../components/VerticalSearchBar'; 
import FilterSection from '../../components/FilterSection'; 
import PetGrid from "../../components/petGrid";
import './styles.css';

export default function BrowsePets() {
  // Redux Dispatch and Selector
  const dispatch = useDispatch<AppDispatch>();
  const { pets, loading, error } = useSelector((state: RootState) => state.adoptionPets); // Fetch pets from state

  // State for filter inputs
  const [filters, setFilters] = useState({
    isBuy: false,
    selectedSex: '',
    minAge: '',
    maxAge: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    minChildAge: '',
    canLiveWithDogs: false,
    canLiveWithCats: false,
    vaccinated: false,
    neutered: false,
    selectedCity: '',
    selectedSpecies: '',
    breed: '',
  });

  // Fetch pets from the Redux store
  useEffect(() => {
    dispatch(fetchAdoptionPets()); // Dispatch the action to fetch pets
  }, [dispatch]);

  const handleReset = () => {
    setFilters({
      isBuy: false,
      selectedSex: '',
      minAge: '',
      maxAge: '',
      minPrice: '',
      maxPrice: '',
      area: '',
      minChildAge: '',
      canLiveWithDogs: false,
      canLiveWithCats: false,
      vaccinated: false,
      neutered: false,
      selectedCity: '',
      selectedSpecies: '',
      breed: '',
    });
  };

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  // Filter pets based on the current filters
  const filteredPets = pets.filter((pet) => {

    // Determine if the pet is for buying based on the price
    const isPetBuy = Number(pet.price) > 0;
    const matchesBuy = filters.isBuy ? isPetBuy : !isPetBuy;

    const matchesSex = filters.selectedSex ? pet.sex === filters.selectedSex : true;
    const matchesMinAge = filters.minAge ? pet.age >= Number(filters.minAge) : true;
    const matchesMaxAge = filters.maxAge ? pet.age <= Number(filters.maxAge) : true;
    const matchesMinPrice = filters.minPrice ? Number(pet.price) >= Number(filters.minPrice) : true;
    const matchesMaxPrice = filters.maxPrice ? Number(pet.price) <= Number(filters.maxPrice) : true;
    const matchesArea = filters.area ? pet.area.includes(filters.area) : true;
    const matchesMinChildAge = filters.minChildAge ? pet.min_age_of_children >= Number(filters.minChildAge) : true;
    const matchesDogs = filters.canLiveWithDogs ? pet.can_live_with_dogs : true;
    const matchesCats = filters.canLiveWithCats ? pet.can_live_with_cats : true;
    const matchesVaccinated = filters.vaccinated ? pet.vaccinated : true;
    const matchesNeutered = filters.neutered ? pet.neutered : true;
    const matchesCity = filters.selectedCity ? pet.city_id === Number(filters.selectedCity) : true;
    const matchesSpecies = filters.selectedSpecies ? pet.pet_type === Number(filters.selectedSpecies) : true;
    const matchesBreed = filters.breed ? pet.pet_breed?.toLowerCase().includes(filters.breed.toLowerCase()) : true;

    return (
      matchesBuy &&
      matchesSex &&
      matchesMinAge &&
      matchesMaxAge &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesArea &&
      matchesMinChildAge &&
      matchesDogs &&
      matchesCats &&
      matchesVaccinated &&
      matchesNeutered &&
      matchesCity &&
      matchesSpecies &&
      matchesBreed
    );
  });

  return (
    <>
      <Navbar />
      <div className="fullBody">
        <FilterSection onSearch={(filters) => setFilters((prev) => ({ ...prev, ...filters }))} />
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
          <div className="flex w-full">
            <div className="w-1/4 mr-4">
              <VerticalSearchBar
                onSearch={setFilters} // Pass filters up to parent
                onReset={handleReset} // Pass reset function
                onSearchAction={handleSearch} // Pass search function
              />
            </div>
            <div className="w-3/4">
              {loading ? (
                <p>Loading pets...</p>
              ) : error ? (
                <p>Error: {error}</p>
              ) : (
                <PetGrid pets={filteredPets} />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
