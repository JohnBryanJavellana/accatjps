import React, { useEffect, useState } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';

const libraries = ['places'];

const GoogleMapLocationPicker = ({ callbackFunction, defaultValue = "", margin = "dense", size = null }) => {
    const [location, setLocation] = useState('');
    const [locationCoordinates, setLocationCoordinates] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyB8N9OYdN6jlHHDUP8Ay2KcXp_LMEYW4Zc",
        libraries: libraries,
    });

    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            const address = place.formatted_address || place.name;
            setLocation(address);

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                const coordString = `lat:${lat}&long:${lng}`;
                setLocationCoordinates(coordString);

                callbackFunction({
                    location: address,
                    coordinates: coordString
                });
            }
        }
    };

    useEffect(() => {
        setLocation(defaultValue.location);
        setLocationCoordinates(defaultValue.coordinates);
    }, [defaultValue]);

    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <FormControl fullWidth margin={margin} size={size ?? 'normal'} variant="outlined">
            <InputLabel htmlFor="location">
                Location <span className='text-danger'>*</span>
            </InputLabel>

            <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                    fields: ["formatted_address", "geometry", "name"],
                    componentRestrictions: { country: "ph" }
                }}
                slotProps={{
                    popper: {
                        sx: { zIndex: 9999 }
                    }
                }}
            >
                <OutlinedInput
                    required
                    id="location"
                    label="Location"
                    placeholder=""
                    value={location}
                    onChange={(e) => {
                        setLocation(e.target.value);
                        if (locationCoordinates) setLocationCoordinates('');
                    }}
                    fullWidth
                />
            </Autocomplete>
        </FormControl>
    );
};

export default GoogleMapLocationPicker;