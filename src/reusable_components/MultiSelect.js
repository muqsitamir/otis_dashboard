import React from "react";
import {MenuItem, TextField} from "@mui/material";


export default function MultiSelect(props){
    const { label, items, values, onChange} = props
    return(
        <TextField
        select
        variant = "outlined"
        label = {label}
        SelectProps={{
          multiple: true,
          value: values,
          onChange: onChange
        }}
        >
            {items.map((v, i)=>(<MenuItem value={v.key}>{v.value}</MenuItem>))}
        </TextField>
    );
}