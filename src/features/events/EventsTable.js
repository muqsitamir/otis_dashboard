import React, { useEffect, useState, useRef } from "react";
import GridViewIcon from '@mui/icons-material/GridView';
import ReorderIcon from '@mui/icons-material/Reorder';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel, Grid,
} from "@mui/material";
import ArchiveIcon from "@mui/icons-material/Archive";
import StarIcon from "@mui/icons-material/Star";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from '../../App';  
import axios from 'axios';
import {
  getEvents,
  selectEvents,
  resetEvents,
  updateEventStatus,
  deleteEvent,
  annotateEvents,
  removeAnnotations,
  setEvents
} from "./eventsSlice";
import { selectFilters, setFilterApplied, resetFilters } from "../filters/filterSlice";
import { selectOrganization } from "../organization/organizationSlice";

export function EventsTable() {
  const [state, setState] = useState({ page: 0, rowsPerPage: 10 });
  const [selected, setSelected] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [listView, setListView] = useState(true);
  const [reload, setReload] = useState(false);
  const [tab, setTab] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAnnotateMenu, setShowAnnotateMenu] = useState(false);
  const [selectedAnnotations, setSelectedAnnotations] = useState([]);
  const { species: allSpecies } = useSelector(selectOrganization);
  const prevTab = useRef(tab);
  const isFirstRender = useRef(true);
  const justRan = useRef(false);
  const { results: events, count } = useSelector(selectEvents);
  const filters = useSelector(selectFilters);
  const dispatch = useDispatch();
  const isFirstRun = useRef(true);
  const[countR,setCount]=useState(0)
  const [requests,setRequests]=useState([]);
  const [requestsPage, setRequestsPage] = useState(0);
  const status = (tab) => {
    switch (tab) {
      case 0:
        return "";
      case 1:
        return "ARCHIVED";
      case 2:
        return "FEATURED";
      case 3:
        return "REQUESTS"
      default:
        return "NONE";
    }
  };

  const { page, rowsPerPage } = state;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setSelected([]);
    
    dispatch(resetEvents());
    
    showChanges(true);
    
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
    if(tab===3){
      dispatch(getEvents(state.page + 1, filters.filterApplied, status(0), rowsPerPage));
    }else{
    dispatch(getEvents(state.page + 1, filters.filterApplied, status(tab), rowsPerPage));}
    justRan.current = true;
    let check = filters.filterApplied ? false : filters.filterApplied;
    dispatch(setFilterApplied(check));
  }, [filters]);

  useEffect(() => {
    if (prevTab !== tab && reload == true) {
      prevTab.current = tab;
      reloadEvents();
    }
    else {
      setReload(true)
    }
  }, [tab]);
  useEffect(() => {
    fetchRequest();
  }, [tab,requestsPage]);

  useEffect(() => {
    if(selectMode == false){
      setSelected([]);
    }
  }, [selectMode]);

  const showChanges = async (tabChange = false) => {
    if(!tabChange) {
      if (events.length <= rowsPerPage) {
        dispatch(resetEvents());
      } else {
        dispatch(setEvents({results: events.slice(0, rowsPerPage * page), count: count, filterApplied: true}))
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if(tab===3){
      dispatch(getEvents(state.page + 1, filters.filterApplied, status(0), rowsPerPage));
    }else{
    dispatch(getEvents(state.page + 1, filters.filterApplied, status(tab), rowsPerPage));}
  };

  const reloadEvents = (pageSize = 10) => {
    justRan.current = false;
    setState({ page: 0, rowsPerPage: pageSize });
    setSelected([]);
    dispatch(resetEvents());
    showChanges(true);
  };

  const handleChangePage = (event, newPage) => {
    if(tab!==3){
      if (newPage > state.page && newPage + 1 > events.length/rowsPerPage) dispatch(getEvents(newPage + 1, filters.filterApplied, status(tab), rowsPerPage));
      setState({ page: newPage, rowsPerPage: state.rowsPerPage });
    }else {
      // For requests pagination (when tab === 3)
      if (newPage > requestsPage && newPage + 1 > requests.length / rowsPerPage) {
        fetchRequest(newPage + 1); // Fetch requests with updated page number
      }
      setRequestsPage(newPage); // Update requests page state
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setState({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  const handleArchive = () => {
    if (tab !== 1) {
      dispatch(updateEventStatus(selected, "archive"));
    } else {
      dispatch(updateEventStatus(selected, "restore"));
    }
    setSelected([])
    if(tab == 2 || tab == 1){
      showChanges();
    }
  };

  const handleStar = () => {
    if (tab !== 2) {
      dispatch(updateEventStatus(selected, "feature"));
    } else {
      dispatch(updateEventStatus(selected, "restore"));
    }
    setSelected([])
    if(tab == 2 || tab == 1){
      showChanges();
    }
  };

  const handleDelete = () => {
    debugger;
    dispatch(deleteEvent(selected));
    setShowDeleteConfirmation(false);
    setSelected([]);
    showChanges();
  };

  const handleAnnotate = () => {
    dispatch(annotateEvents(selected, selectedAnnotations));
    setShowAnnotateMenu(false);
    setSelected([]);
    showChanges();
  };

  const handleUnAnnotate = () => {
    dispatch(removeAnnotations(selected, selectedAnnotations));
    setShowAnnotateMenu(false);
    setSelected([]);
    showChanges();
  }
  const modifyRequest = async (eventId, status) => {
    try {
      const token = localStorage.getItem('token');
      
     
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const config = {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      };
  
      const requestData = {
        id: eventId,  // Use the correct key expected by your backend
        request_status: status,
        request_type: "DELETE",
        
    
      };
  
      const response = await axios.put(`${backend_url}/core/api/request/`, requestData, config);
  
      // Handle success
      console.log('Request updated:', response.data);
      setRequests([])
      // After modifying the request, call fetchRequest to update the list
     
  
      return response.data; // Return the response in case it's needed elsewhere
  
    } catch (error) {
      // Handle errors - either show a notification or log it
      console.error('Error updating request:', error);
      throw error;
    }
  };
  
  const fetchRequest = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('User is not authenticated');
    }
  
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
  
    try {
      let response = await axios.get(`${backend_url}/core/api/request/?page=${requestsPage+1}&page_size=${rowsPerPage}`, config);
      console.log(response.data);
      
      // Update the requests state
      setRequests(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <Paper className="mb4">
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Event?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete {selected.length} selected event(s)?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showAnnotateMenu}
        onClose={() => setShowAnnotateMenu(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Annotate Event(s)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">Select all the labels you want to apply (or remove)!</DialogContentText>
          <FormGroup>
            {allSpecies.map((species) => (
              <FormControlLabel
                control={<Checkbox name={species.name} />}
                label={species.name}
                key={species.name}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAnnotations([...selectedAnnotations, species.name]);
                  } else {
                    setSelectedAnnotations(selectedAnnotations.filter((item) => item !== species.name));
                  }
                }}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAnnotateMenu(false);
              setSelectedAnnotations([]);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUnAnnotate}>UnAnnotate</Button>
          <Button onClick={handleAnnotate} autoFocus>
            Annotate
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer style={{ maxHeight: 1200, overflowX: { xs: 'auto', sm: 'unset' } }} >
        <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="basic tabs example" sx={{ flex: 9.3 }}>
            <Tab label="All" />
            <Tab label="Archived" />
            <Tab label="Featured" />
            <Tab label="Request" />
          </Tabs>
          <Box sx={{
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                alignItems: 'center',
                flexShrink: 0,
                ml: { xs: 1, sm: 2 },
                whiteSpace: 'nowrap'
              }}>
                {tab !== 3 ? (
                  <Button onClick={() => setSelectMode(!selectMode)} variant="text">
                    Select
                  </Button>
                ) : ''}
                {listView ? (
                  <GridViewIcon sx={{ color: "#1a76d2", '&:hover': { boxShadow: '0 0 5px 2px skyblue' }}} onClick={() => setListView(!listView)} />
                ) : (
                  <ReorderIcon sx={{ color: "#1a76d2", '&:hover': { boxShadow: '0 0 5px 2px skyblue' }}} onClick={() => setListView(!listView)} />
                )}
          </Box>
          {selected.length > 0 && (
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "3vw",
              ml: 2,
              flexShrink: 0,
              minWidth: 'max-content'
            }}>
              <h6 style={{ alignSelf: "center", margin: 0 }}>{selected.length > 0 && (`${selected.length} selected`)}</h6>
              <Button
                onClick={() => {
                  setShowAnnotateMenu(true);
                  setSelectedAnnotations([]);
                }}
                size="small"
              >
                Annotations Menu
              </Button>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                minWidth: '100px', // Ensure enough space for icons
              }}>
                <div onClick={handleArchive}>{tab === 1 ? <UnarchiveIcon style={{ color: "red" }} /> : <ArchiveIcon />}</div>
                <StarIcon onClick={handleStar} style={{ color: tab === 2 ? "red" : "black" }} />
                <DeleteIcon onClick={() => setShowDeleteConfirmation(true)} style={{ color: "red" }} />
              </Box>
            </Box>
          )}
        </Box>
        {listView ?
          (<Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
          {tab===3?(
                  <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Specie</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>type</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>):(
                  <TableRow>
                  <TableCell>
                    {selectMode ? (
                    <Checkbox
                      checked={events
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((event) => event.uuid)
                        .every((item) => selected.includes(item))}
                      onChange={() => {
                        if (selected.length === rowsPerPage) setSelected([]);
                        else setSelected(events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => event.uuid));
                      }}
                    /> ) : null}
                  </TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Specie</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Camera</TableCell>
                </TableRow>
                )}
            
          </TableHead>
            {tab===3?(<TableBody>
 {requests.length !== 0 ? (
   requests.map((row) => {
     
     return  ( 
       <TableRow key={row.id}>
         <TableCell>
           <a target="_blank" rel="noopener noreferrer" href={row.thumbnail}>
             <img src={row.thumbnail} height={80} alt="" />
           </a>
         </TableCell>
         <TableCell>
         {row.species.map((item) => (
              <Chip
                className="mr1"
                style={{ backgroundColor: item.color }}
                color="primary"
                key={item.key}
                label={item.name}
              />
            ))}
         </TableCell>
         <TableCell>{row.request_status}</TableCell>
         <TableCell>{row.request_type}</TableCell>
         <TableCell>{formatDateTime(row.created_at)}</TableCell>
<TableCell>{formatDateTime(row.updated_at)}</TableCell>
         {row.request_status==="PENDING"?(<TableCell>
     <Button onClick={() => modifyRequest(row.id, 'APPROVED')}>APPROVE</Button>
  <Button onClick={() => modifyRequest(row.id, 'REJECTED')}>REJECT</Button>
</TableCell>):(<TableCell>
     <Button disabled onClick={() => modifyRequest(row.id, 'APPROVED')}>APPROVE</Button>
  <Button disabled onClick={() => modifyRequest(row.id, 'REJECTED')}>REJECT</Button>
</TableCell>)}
         
       </TableRow>
     
    ) })
 ) : (
   <div className="container tc">Loading Data....</div>
 )}
</TableBody>):( <TableBody>
  {events.length !== 0 ? (

              (rowsPerPage > 0 ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : events).map((row) => {

                return (
                  <TableRow key={row.uuid}>
                    <TableCell>
                      {selectMode ? (
                      <Checkbox
                        checked={selected.includes(row.uuid)}
                        onChange={() => {
                          if (selected.includes(row.uuid)) {
                            setSelected(selected.filter((item) => item !== row.uuid));
                          } else {
                            setSelected([...selected, row.uuid]);
                          }
                        }}
                      /> ) : null}
                    </TableCell>
                    <TableCell>
  <a 
    target="_blank" 
    rel="noopener noreferrer" 
    href={row.file}
  >
    <img 
      src={row.thumbnail}
      height={80}
      alt="" 
    />
  </a>
</TableCell>
                    <TableCell>
                    
                  {
                 row.species.map((item) => ((
                 <Chip
                 className="mr1"
                   style={{ backgroundColor: item.color }}
                  color="primary"
                  key={item.key}
                  label={item.name} /> )))}
                    </TableCell>
                    <TableCell>{row.created_at}</TableCell>
                    <TableCell>{row.confidence.toFixed(2)}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.camera_name}</TableCell>
                  </TableRow>
                );
              })
          ) : (
            <div className="container tc">Loading Data....</div>
          )}
       </TableBody> )}
          
        </Table>)
            :
        (
         <div>
                {selectMode ? (
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Checkbox
                checked={events
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => event.uuid)
                  .every((item) => selected.includes(item))}
                onChange={() => {
                  if (selected.length === rowsPerPage) setSelected([]);
                  else setSelected(events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((event) => event.uuid));
                }}
              />
              <span><h4>Select All</h4></span>
            </span>
          ) : null}
          <Grid container sx={{paddingTop: 3, paddingLeft: 5, paddingRight: 5}} spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 14 }}>
          {(rowsPerPage > 0 ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : events).map((row, index) => (
            <Grid item xs={2} sm={4} md={2} key={index} >
              {selectMode ? (
              <Checkbox sx={{marginBottom: -6, color: "white"}}
                checked={selected.includes(row.uuid)}
                onChange={() => {
                  if (selected.includes(row.uuid)) {
                    setSelected(selected.filter((item) => item !== row.uuid));
                  } else {
                    setSelected([...selected, row.uuid]);
                  }
                }}
              />) : null}
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
        count={tab === 3 ? (countR !== null ? countR : "loading...") : (count !== null ? count : "loading...")}
        rowsPerPage={rowsPerPage}
        page={tab === 3?requestsPage:page}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onPageChange={handleChangePage}
        showFirstButton
      />
    </Paper>
  );
}
