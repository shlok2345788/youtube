import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isSouthIndian: boolean;
    userLocation: string;
    isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isSouthIndian, setIsSouthIndian] = useState(false);
    const [userLocation, setUserLocation] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Check if current time is between 10AM-12PM
    const isDayTime = () => {
        const now = new Date();
        const currentHour = now.getHours();
        return currentHour >= 10 && currentHour < 12;
    };

    // Check if location is South Indian state
    const isSouthIndianState = (state: string) => {
        const southIndianStates = [
            'Tamil Nadu', 'Tamilnadu', 'TN',
            'Kerala', 'KL',
            'Karnataka', 'KA',
            'Andhra Pradesh', 'Andhra', 'AP',
            'Telangana', 'TS'
        ];
        return southIndianStates.some(southState =>
            state.toLowerCase().includes(southState.toLowerCase())
        );
    };

    // Get user location using IP geolocation
    const getUserLocation = async () => {
        try {
            // Try multiple geolocation services
            const services = [
                'https://ipapi.co/json/',
                'https://api.ipgeolocation.io/ipgeo?apiKey=',
                'https://ipinfo.io/json'
            ];

            for (const service of services) {
                try {
                    const response = await fetch(service, {
                        method: 'GET',
                        mode: 'cors'
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const state = data.region || data.state || data.region_name || '';
                        const country = data.country_name || data.country || '';

                        if (country === 'India' || country === 'IN') {
                            setUserLocation(state);
                            const southIndian = isSouthIndianState(state);
                            setIsSouthIndian(southIndian);

                            // Set theme based on time and location
                            if (southIndian && isDayTime()) {
                                setTheme('light');
                            } else {
                                setTheme('dark');
                            }
                        }
                        return;
                    }
                } catch (err) {
                    continue; // Try next service
                }
            }

            // Fallback: use browser timezone as approximation
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const indiaTimezones = [
                'Asia/Kolkata', 'Asia/Calcutta'
            ];

            if (indiaTimezones.includes(timezone)) {
                // Default to dark theme for India if location detection fails
                setTheme(isDayTime() ? 'light' : 'dark');
            } else {
                // Non-Indian users get dark theme
                setTheme('dark');
            }

        } catch (error) {
            console.error('Error detecting location:', error);
            // Default fallback
            setTheme(isDayTime() ? 'light' : 'dark');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserLocation();

        // Update theme based on time changes
        const interval = setInterval(() => {
            if (isSouthIndian && isDayTime()) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [isSouthIndian]);

    const value = {
        theme,
        setTheme,
        isSouthIndian,
        userLocation,
        isLoading
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};