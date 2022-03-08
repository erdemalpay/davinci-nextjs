import "../styles/globals.css";
import type { AppProps, AppContext } from "next/app";
import { LocationContext } from "../context/LocationContext";
import { getLocations } from "../utils/api/location";
import { useState } from "react";
import { Location } from "../types";
import App from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const { locations } = pageProps;
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    locations[0]
  );

  const initalLocationValue = {
    locations,
    selectedLocation,
    setSelectedLocation,
  };

  return (
    <LocationContext.Provider value={initalLocationValue}>
      <Component {...pageProps} />;
    </LocationContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const locations = await getLocations();
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, pageProps: { ...appProps.pageProps, locations } };
};

export default MyApp;
