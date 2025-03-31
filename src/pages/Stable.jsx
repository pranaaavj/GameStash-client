/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';

const FLIGHTS = [
  {
    name: 'Indian',
    flightNumber: 101,
    departureTime: '1:35 PM',
    arrivalTime: '5:00 PM',
    from: 'Kochi',
    to: 'Delhi',
    price: 6500,
  },
  {
    name: 'USA',
    flightNumber: 202,
    departureTime: '4:20 AM',
    arrivalTime: '11:00 AM',
    from: 'New York',
    to: 'San Francisco',
    price: 18000,
  },
  {
    name: 'Australia',
    flightNumber: 303,
    departureTime: '8:45 PM',
    arrivalTime: '6:30 AM',
    from: 'Sydney',
    to: 'Melbourne',
    price: 4300,
  },
  {
    name: 'Indian',
    flightNumber: 104,
    departureTime: '6:15 AM',
    arrivalTime: '9:45 AM',
    from: 'Mumbai',
    to: 'Bangalore',
    price: 3200,
  },
  {
    name: 'USA',
    flightNumber: 205,
    departureTime: '3:00 PM',
    arrivalTime: '6:00 PM',
    from: 'Los Angeles',
    to: 'Chicago',
    price: 15500,
  },
];

export const StableWrapper = () => {
  const [selectedOption, setSelectedOption] = useState('all');
  const [sortMethod, setSortMethod] = useState('none');
  const [value, setValue] = useState('');

  const filteredFlights = useMemo(() => {
    let filtered = FLIGHTS;

    if (selectedOption !== 'all') {
      filtered = filtered.filter((f) => f.name == selectedOption);
    }

    if (value.trim() !== '') {
      filtered = filtered.filter(
        (f) =>
          f.from.toLowerCase().includes(value.toLowerCase()) ||
          f.to.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (sortMethod !== 'none') {
      filtered = filtered.toSorted((a, b) => {
        switch (sortMethod) {
          case 'Price: Low to High':
            return a.price - b.price;
          case 'Price: High to Low':
            return b.price - a.price;
          case 'Departure Time: Earliest':
            return (
              calculateTime(a.departureTime) - calculateTime(b.departureTime)
            );
        }
      });
    }

    return filtered;
  }, [selectedOption, value, sortMethod]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortMethod(e.target.value);
  };

  return (
    <div className='bg-white p-3 flex flex-col'>
      <label htmlFor='search'>Search by Destination</label>
      <input
        type='text'
        name='search'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='border p-2 max-w-2xl rounded-sm my-5'
      />
      <label
        htmlFor='select'
        className='block mb-2 font-medium'>
        Filtered by: <span>{selectedOption}</span>
      </label>
      <select
        onChange={handleOptionChange}
        name='select'
        className='border border-gray-300 rounded p-2 focus:outline-none mb-4'
        value={selectedOption}>
        <option value='all'>All</option>
        {[...new Set(FLIGHTS.map((f) => f.name))].map((flight, index) => (
          <option
            value={flight}
            key={index}>
            {flight}
          </option>
        ))}
      </select>
      <label
        htmlFor='sort'
        className='block mb-2 font-medium'>
        Sorted by: <span>{sortMethod}</span>
      </label>
      <select
        onChange={handleSortChange}
        name='sort'
        className='border border-gray-300 rounded p-2 focus:outline-none mb-4'
        value={sortMethod}>
        {[
          'None',
          'Price: Low to High',
          'Price: High to Low',
          'Departure Time: Earliest',
        ].map((sort, index) => (
          <option
            value={sort}
            key={index}>
            {sort}
          </option>
        ))}
      </select>
      <div className='bg-white p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-2'>
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight, index) => {
            return (
              <FlightCard
                key={index}
                flight={flight}
              />
            );
          })
        ) : (
          <h1>No Flights found</h1>
        )}
      </div>
    </div>
  );
};

const FlightCard = ({ flight }) => {
  return (
    <div>
      <div></div>
      <div className='bg-black hover:bg-black/90 transition shadow-xl ease-in-out duration-500 font-sans text-white p-3 rounded-lg space-y-6'>
        <div>
          <h1 className='font-bold flex justify-between text-lg'>
            Flight Name: <span className='font-normal'>{flight.name}</span>
          </h1>
        </div>
        <div className='font-bold flex justify-between'>
          {' '}
          Flight Number:{' '}
          <span className='font-normal'>{flight.flightNumber}</span>
        </div>
        <div className='font-bold flex justify-between'>
          Destination:{' '}
          <span className='font-normal'>
            {flight.from} - {flight.to}
          </span>
        </div>
        <div className='font-bold flex justify-between'>
          Departure Time:{' '}
          <span className='font-normal'>{flight.departureTime}</span>
        </div>
        <div className='font-bold flex justify-between'>
          Arrival Time:{' '}
          <span className='font-normal'>{flight.arrivalTime}</span>
        </div>
        <div className='font-bold flex justify-between'>
          Price: <span className='font-normal'> ${flight.price}</span>
        </div>
      </div>
    </div>
  );
};

const calculateTime = (timeStr) => {
  const [time, meridian] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (meridian === 'PM' && hours !== 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
