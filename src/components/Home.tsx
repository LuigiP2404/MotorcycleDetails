import { useEffect, useState } from "react";
import React from 'react';
import { MotorcycleType, MotorcycleDetails } from "../interfaces/Motorcycles";
import axios from "axios";
import BikeDetails from "./BikeDetails";
import '../style/Home.scss';
import NoDataFound from "./NoDataFound";

const Home = () => {
    const apiBaseUrl = 'https://api.api-ninjas.com/v1/motorcycles';
    const apiKey = process.env.REACT_APP_API_KEY;

    const mockData = {
        bore_stroke: "70.0 x 51.8 mm (2.8 x 2.0 inches)",
        clutch: "Assist  and  Slipper Clutch",
        compression: "11.5:1",
        cooling: "Liquid",
        displacement: "399.0 ccm (24.35 cubic inches)",
        dry_weight: "167.0 kg (368.2 pounds)",
        emission: null,
        engine: "Twin, four-stroke",
        frame: "Trellis, high-tensile steel",
        front_brakes: "Single disc. Single  petal-type disc with 2-piston calipers. Optional ABS.",
        front_suspension: "41mm hydraulic telescopic fork",
        front_tire: "110/70-17 ",
        front_wheel_travel: "119 mm (4.7 inches)",
        fuel_capacity: "3.70 litres (0.98 US gallons)",
        fuel_consumption: null,
        fuel_control: "Double Overhead Cams/Twin Cam (DOHC)",
        fuel_system: "Injection. DFI® with dual 32mm throttle bodies",
        gearbox: "6-speed",
        ground_clearance: "140 mm (5.5 inches)",
        ignition: "TCBI w/digital advance",
        lubrication: null,
        make: "Kawasaki",
        model: "Ninja 400 ",
        power: null,
        rear_brakes: "Single disc. Single petal-type disc with single-piston caliper. Optional ABS.",
        rear_suspension: "Horizontal back-link with adjustable spring preload ",
        rear_tire: "150/70-17 ",
        rear_wheel_travel: "130 mm (5.1 inches)",
        seat_height: "785 mm (30.9 inches) If adjustable, lowest setting.",
        starter: "Electric",
        top_speed: null,
        torque: null,
        total_height: "1120 mm (44.1 inches)",
        total_length: "1989 mm (78.3 inches)",
        total_weight: null,
        total_width: "711 mm (28.0 inches)",
        transmission: "Chain   (final drive)",
        type: "Sport",
        valves_per_cylinder: null,
        wheelbase: "1369 mm (53.9 inches)",
        year: "2022"
    }

    const [jsonData, updateJsonData] = useState<MotorcycleType[]>([]);
    const [makes, updateMakes] = useState<string[]>([]);
    const [selectedMake, updateSelectedMake] = useState<string>('');
    const [models, updateModels] = useState<string[]>([]);
    const [selectedModel, updateSelectedModel] = useState<string>('');
    const [years, updateYears] = useState<number[]>([]);
    const [selectedYear, updateSelectedYear] = useState<string>();
    const [bikeDetails, updateBikeDetails] = useState<MotorcycleDetails | null>(null);
    const [selectedBike, updateSelectedBike] = useState<string | null>(null);
    const [selectedBikeStr, updateSelectedBikeStr] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [noDataFound, setNoDataFound] = useState<boolean>(false);

    useEffect(() => {
        fetchMotorcycles();
    }, []);

    useEffect(() => {
        if (jsonData.length) {
            getMakes();
        }
    }, [jsonData])

    useEffect(() => {
        if (selectedMake) {
            clearSelections();
            getModels();
        }
    }, [selectedMake]);

    useEffect(() => {
        clearYear();
        getBikeYear();
    }, [selectedModel]);

    const fetchMotorcycles = () => {
        fetch('/data/motorcycles.json')
            .then(response => response.json())
            .then(data => {
                updateJsonData(data)
            })
            .catch(error => {
                console.error('There was an error while loading JSON file:', error);
            });
    }

    const getMakes = () => {
        const data = jsonData;
        const makes = data.map((x: MotorcycleType) => {
            return x.make;
        })
        if (makes.length) {
            updateMakes(makes);
        }
    }

    const getModels = () => {
        const data = jsonData;
        const makeToFilter = selectedMake;
        if (makeToFilter) {
            setLoading(true);
            const filteredModels = data.filter((x) => {
                if (x.make === makeToFilter)
                    return x.models;
            })[0].models;
            if (filteredModels.length) {
                const filteredModelNames = filteredModels.map(x => x.name);
                setTimeout(() => {
                    updateModels(filteredModelNames);
                    setLoading(false);
                }, 1000);
            }
        }
    }

    const getBikeYear = () => {
        if (selectedMake && selectedModel) {
            setLoading(true);
            const bikeYears = jsonData.filter(x => {
                return x.make === selectedMake
            })[0].models;
            if (bikeYears) {
                const filteredYears = bikeYears.filter(x => {
                    return selectedModel === x.name;
                })[0].years;
                setTimeout(() => {
                    updateYears(filteredYears);
                    setLoading(false);
                }, 1000);
            }
        }
    }

    const normalizeValue = (value: any) => (value === null ? undefined : value);

    const reorderBikeDetails = (data: MotorcycleDetails): MotorcycleDetails => {
        const priorityFields = ["make", "model", "year", "type"];

        const ordered: Partial<MotorcycleDetails> = {};

        // Aggiungi prima i campi prioritari, se esistono
        priorityFields.forEach((field) => {
            if (field in data) {
                ordered[field as keyof MotorcycleDetails] = normalizeValue(data[field as keyof MotorcycleDetails]);

            }
        });

        // Aggiungi gli altri campi in ordine originale, esclusi quelli già aggiunti
        Object.keys(data).forEach((key) => {
            if (!priorityFields.includes(key)) {
                ordered[key as keyof MotorcycleDetails] = normalizeValue(data[key as keyof MotorcycleDetails]);
            }
        });

        return ordered as MotorcycleDetails;
    };

    const checkBikeModel = (data: MotorcycleDetails[]) => {
        return data.filter((x: any) => {
            return x.model.toLocaleLowerCase === selectedModel?.toLocaleLowerCase;
        })[0];
    };

    const search = () => {
        setLoading(true);
        setNoDataFound(false);
        updateBikeDetails(null);
        updateSelectedBike(null);
        updateSelectedBikeStr(null);
        if (selectedMake && selectedModel && selectedYear) {
            const url = `${apiBaseUrl}?make=${selectedMake}&model=${selectedModel}&year=${selectedYear}`
            axios.get(url, {
                headers: {
                    'X-Api-Key': apiKey
                }
            })
                .then((res: any) => {
                    if (res.data.length) {
                        const data = checkBikeModel(res.data);
                        if (data) {
                            updateBikeDetails(reorderBikeDetails(data))
                        } else {
                            console.log('There was an error while searching for the bike')
                            setNoDataFound(true);
                        }
                    } else {
                        setNoDataFound(true);
                    }
                    setLoading(false)
                    updateSelectedBike(`${selectedMake}_${selectedModel.replaceAll(' ', '-')}_${selectedYear}`)
                    updateSelectedBikeStr(`${selectedMake} ${selectedModel} - ${selectedYear}`)
                })
                .catch(err => {
                    console.error('There was an error fetching data: ' + err);
                    setLoading(false)
                    setNoDataFound(true);
                })
        }
    }

    const clearSelections = () => {
        updateSelectedModel('');
        clearYear()
    }

    const clearYear = () => {
        updateSelectedYear('');
    }

    const clear = () => {
        updateSelectedModel('');
        updateSelectedYear('');
        updateSelectedMake('');
        updateSelectedBike(null);
        updateSelectedBikeStr(null);
        clearYear();
        setNoDataFound(false);
    }

    return (
        <div className="home-container">
            {loading ? <div className="loader">
                <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjQ3NnFwYXUyMWtzaGNmY2ttZ2c2M24zOWE5YXB6bm04a2FuanZ0eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FyX4cz5yDuVWAwtxkM/giphy.gif"></img>
            </div> : <></>}
            <div className="main-content">
                <div className="main-content-title">
                    <h2>Search for a motorcycle!</h2>
                </div>
                <div className="main-content-box">
                    <div className="main-content-fields">
                        <div className="main-content-fields-row">
                            <select value={selectedMake} onChange={e => updateSelectedMake(e.target.value)}>
                                <option value="" hidden>Make</option>
                                {makes.map((make) => {
                                    return <option value={make}>{make}</option>
                                })}
                            </select>
                        </div>
                        <div className="main-content-fields-row">
                            <select disabled={!selectedMake} value={selectedModel} onChange={e => updateSelectedModel(e.target.value)}>
                                <option value="" hidden>Model</option>
                                {models.map((model) => {
                                    return <option value={model}>{model}</option>
                                })}
                            </select>
                        </div>
                        <div className="main-content-fields-row">
                            <select disabled={!selectedModel} value={selectedYear} onChange={e => updateSelectedYear(e.target.value)}>
                                <option value="" hidden>Year</option>
                                {years.map((year) => {
                                    return <option value={year}>{year}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <button onClick={search} className="search-button">
                        Search
                    </button>
                </div>
                {selectedBike && !noDataFound ? <BikeDetails bikeFullName={selectedBikeStr} bikeModel={bikeDetails} imgSrc={`/assets/img/${selectedBike}.jpg`} /> : <></>}
                {noDataFound ? <NoDataFound removeFilters={clear} /> : <></>}
            </div>
        </div>
    )
}

export default Home;