import React, {Component} from "react";
import {Circles} from "react-loader-spinner";
import {selectSiteData} from "./site_data/siteDataSlice";
import {useSelector} from "react-redux";

export default function ReactSpinner() {
    const {loadingScreen: loading} = useSelector(selectSiteData);
    if (!loading) return null;
    return (
        <div className="loader-container">
            <div className="loader">
                <Circles type="Grid" style={{position: 'absolute', top: '50%', left: '50%', margin: '-25px 0 0 -25px'}} color="#00BFFF" height={120} width={120}/>
            </div>
        </div>
    );
}

