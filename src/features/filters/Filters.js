import React, { useEffect, useState } from 'react';
import {Dialog, Stack, TextField} from "@mui/material";
import DatePicker from "../../reusable_components/DatePicker";
import {useDispatch, useSelector} from "react-redux";
import {setCameras, setDateRange, setSpecies, setFilterApplied, setTimeRange} from "./filterSlice";
import MultiSelect from "../../reusable_components/MultiSelect";
import {getOrganization, selectOrganization} from "../organization/organizationSlice";
import FilterListIcon from '@mui/icons-material/FilterList';
import {DesktopTimePicker, LocalizationProvider} from "@mui/x-date-pickers-pro";
import {AdapterDateFns} from "@mui/x-date-pickers-pro/AdapterDateFns";


export function Filters() {
    const {cameras:availCameras, species:availSpecies} = useSelector(selectOrganization);
    const [availCameras2, setAvailCameras2] = useState([]);


    useEffect(() => {
        let check = false;
        let Cameras2 = [];
        for(let i=0; i < availCameras.length; i++){
            if(check == false && ![13, 14, 15, 16, 17].includes(availCameras[i]['id'])){
                if(availCameras[i]["live"]==true){
                Cameras2.push({
                        id: availCameras[i]['id'],
                        description: availCameras[i]["description"]
                })
            }
                }else{
                    if(availCameras[i]["live"]==true){
                        Cameras2.push({
                                id: availCameras[i]['id'],
                                description: availCameras[i]["description"]
                        })
                    }  
                }
            check = false;
            }
        setAvailCameras2(Cameras2);
    }, [availCameras]);
    const cameraItems = availCameras2.map((v,i)=>({key:v.id,value:v.description}));
    const [state, setState] = useState({open: false});
    const speciesItems = availSpecies.map((v,i)=>({key:v.id,value:v.name}));
    const dispatch = useDispatch();
    const [newRange, setNewRange] = useState({
      startDate: null,
      endDate: new Date(),
      key: 'range'
    });
    const [startTime, setStartTime] = useState(new Date('2018-01-01T19:00:00.000Z'));
    const [endTime, setEndTime] = useState(new Date('2018-01-01T19:00:00.000Z'));
    const [newCameras, setNewCameras] = useState([]);
    const [newSpecies, setNewSpecies] = useState([]);


    const handleClose = () => {
        setState({open: false})
    }
    const handleOpen = (e) => {
        setState({open: true})
    }
    const handleDateChange = (range) => {
        setNewRange({startDate: range.range.startDate, endDate: range.range.endDate, key: 'range'})
    }
    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
    }
    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
    }
    const handleSpecieSelect = (e) => {
        setNewSpecies(e.target.value)
    }
    const handleCameraSelect = (e) => {
        setNewCameras(e.target.value)
    }
    const handleApplyFilter = () => {
        dispatch(setDateRange(newRange));
        dispatch(setCameras(newCameras));
        dispatch(setSpecies(newSpecies));
        dispatch(setFilterApplied(true));
        dispatch(setTimeRange({startTime: startTime, endTime: endTime}))
        setState({open: false});
    }
    return(
        <div>
            <button onClick={handleOpen} className="mdc-button mdc-top-app-bar__action-item mdc-button__ripple">
              <FilterListIcon className='v-mid mr2'/>
                <span>Filter</span>
            </button>
            <Dialog
                open={state.open}
                onClose={handleClose}
                closeAfterTransition>
                        <DatePicker ranges={newRange} onChange={handleDateChange} sx={{marginBottom:0}}/>
                        <MultiSelect label={"Cameras"} onChange={handleCameraSelect} values={newCameras} items={cameraItems}  />
                        <MultiSelect label={"Species"} onChange={handleSpecieSelect} values={newSpecies} items={speciesItems}/>
                        <div className="center tc pv3 ph2">
                            <button className="btn btn-outline-primary" onClick={handleApplyFilter}>Apply Filter</button>
                        </div>
            </Dialog>
        </div>
    );
}
