import React, {useEffect, useState, useRef} from "react";
import {
    Box,
    Chip, Grid,
    Paper, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, Tabs
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {getEvents, resetEvents, selectEvents} from "./eventsSlice";
import {selectFilters, setFilterApplied} from "../filters/filterSlice";
import GridViewIcon from "@mui/icons-material/GridView";
import ReorderIcon from "@mui/icons-material/Reorder";


export function EventsTableWWF(){
    const [listView, setListView] = useState(true);
    const isFirstRun = useRef(true);
    const isFirstRender = useRef(true);
    const justRan = useRef(false);
    const [tab, setTab] = useState(0);
    const prevTab = useRef(tab);
    const [state, setState] = useState({page: 0, rowsPerPage: 10});
    const {results: events, count} = useSelector(selectEvents);
    const filters = useSelector(selectFilters);
    const dispatch = useDispatch();

      const status = (tab) => {
        switch (tab) {
          case 0:
            return "";
          case 1:
            return "FEATURED";
          default:
            return "NONE";
        }
      };

    const {page, rowsPerPage} = state;

    useEffect(() => {
        if(prevTab != tab) {
            prevTab.current = tab;
            dispatch(resetEvents());
            setState({page: 0, rowsPerPage: 10});
        }
        dispatch(getEvents(state.page + 1, filters.filterApplied, status(tab)));
    }, [tab])

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        dispatch(resetEvents());
        dispatch(getEvents(state.page + 1, filters.filterApplied, status(tab), rowsPerPage));
      }, [rowsPerPage]);

    useEffect(() => {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        if (justRan.current) {
          justRan.current = false;
          return;
        }
        dispatch(resetEvents());
        dispatch(getEvents(state.page + 1, filters.filterApplied, status(tab), rowsPerPage));
        justRan.current = true;
        let check = filters.filterApplied ? false : filters.filterApplied;
        dispatch(setFilterApplied(check));
        }, [filters]);

      const handleChangePage = (event, newPage) => {
        if (newPage > state.page && newPage + 1 > events.length/rowsPerPage) dispatch(getEvents(newPage + 1, filters.filterApplied, status(tab), rowsPerPage));
        setState({ page: newPage, rowsPerPage: state.rowsPerPage });
      };

    const handleChangeRowsPerPage = (event) => {
        setState({rowsPerPage: parseInt(event.target.value, 10), page: 0});
    };

    return (
        <Paper className="mb4">
            <TableContainer style={{maxHeight: 1200}}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
              <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="basic tabs example" sx={{ flex: 9.3 }}>
                <Tab label="All" />
                <Tab label="Featured" />
                {listView ? <GridViewIcon sx={{ position: 'absolute', right: 15, top: 12, color: "#1a76d2", '&:hover': {boxShadow: '0 0 5px 2px skyblue'} }} onClick={() => setListView(!listView)} /> : <ReorderIcon sx={{ position: 'absolute', right: 15, top: 12, color: "#1a76d2", '&:hover': {boxShadow: '0 0 5px 2px skyblue'} }} onClick={() => setListView(!listView)}/>}
              </Tabs>
            </Box>
            {listView ?
                 // List View
              (<Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>
                  </TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Specie</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Camera</TableCell>
                </TableRow>
              </TableHead>

              {events.length !== 0 ? (
                <TableBody>
                  {(rowsPerPage > 0 ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : events).map((row) => {
                    return (
                      <TableRow key={row.uuid}>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          <a target="_blank" href={row.file}>
                            <img src={row.thumbnail} height={80} />
                          </a>
                        </TableCell>
                        <TableCell>
                          {row.species.map((item) => (
                            <Chip className="mr1" style={{ backgroundColor: item.color }} color="primary" key={item.key} label={item.name} />
                          ))}
                        </TableCell>
                        <TableCell>{row.created_at}</TableCell>
                        <TableCell>{row.confidence.toFixed(2)}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.camera_name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              ) : (
                <div className="container tc">Loading Data....</div>
              )}
            </Table>)
                :
            (
             <div>
              <Grid container sx={{paddingTop: 3, paddingLeft: 5, paddingRight: 5}} spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 14 }}>
              {(rowsPerPage > 0 ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : events).map((row, index) => (
                <Grid item xs={2} sm={4} md={2} key={index} >
                  <a target="_blank" href={row.file} style={{marginTop: 20 }}>
                     <img style={{ border: "groove", borderColor: "gray", borderRadius: 10, marginBottom: 2 }} src={row.thumbnail} height={100} />
                  </a>
                </Grid>
              ))}
            </Grid>
          </div>
            )
            }
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={count !== null ? count : "loading..."}
            rowsPerPage={rowsPerPage}
            page={page}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onPageChange={handleChangePage}
            showFirstButton
          />
    </Paper>
    );
}