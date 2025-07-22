import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setSnackBar, showLoadingScreen } from '../../reusable_components/site_data/siteDataSlice';
import { backend_url } from '../../App';

export const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organization: {
        name: '',
        cameras: [],
        species: [],
        can_annotate: false,
        can_unannotate: false,
        can_feature: false,
        can_delete: false,
    },  // Set to null initially until data is fetched
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
    clearOrganization: (state) => {
      state.organization = null;
    },
  },
});

// Action creators
export const { setOrganization, clearOrganization } = organizationSlice.actions;

// Thunk to fetch organization data
export const getOrganization = () => async (dispatch) => {
  try {
    dispatch(showLoadingScreen(true));

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('User is not authenticated');
    }

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    const response = await axios.get(`${backend_url}/core/api/organization/`, config);
     console.log(response.data)
    dispatch(setOrganization(response.data));

  } catch (error) {
    console.error('Error fetching organization:', error);
    dispatch(setSnackBar(error.message));
  } finally {
    dispatch(showLoadingScreen(false));
  }
};

// Selector to get organization state
export const selectOrganization = (state) => state.organization.organization;

// Default export
export default organizationSlice.reducer;
