/**
=========================================================
* Otis Admin PRO - v2.0.2
=========================================================

* Product Page: https://material-ui.com/store/items/otis-admin-pro-material-dashboard-react/
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectCameras } from "features/cameras/cameraSlice";

// @mui material components
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Otis Admin PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import CameraCard from "examples/Cards/CameraCard";

// Anaytics dashboard components
// import SalesByCountry from "layouts/dashboards/cameras/components/SalesByCountry";

// Data
// import reportsBarChartData from "layouts/dashboards/cameras/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboards/cameras/data/reportsLineChartData";
import backendUrl from "../../../config";

function getTimeSince(dateString) {
  if (!dateString) return "N/A";

  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 0 || Number.isNaN(seconds)) return "N/A"; // handle invalid/future dates

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0 && days === 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

  return parts.length > 0 ? `${parts.join(" ")} ago` : "just now";
}
function Cameras() {
  // const { sales, tasks } = reportsLineChartData;

  const dispatch = useDispatch();
  const cameraData = useSelector(selectCameras);
  const [stream, setStream] = useState(cameraData.results);

  useEffect(() => {
    const fetchCameras = async () => {
      const response = await fetch(`${backendUrl}/core/api/sse/cameras`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      const updatedCameras = await response.json();
      setStream(updatedCameras);
    };

    fetchCameras();

    const intervalId = setInterval(fetchCameras, 15000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Action buttons for the CameraCard
  const actionButtons = (
    <>
      {/* <Tooltip title="Refresh" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">info</Icon>
        </MDTypography>
      </Tooltip> */}
      <Tooltip title="Info" placement="bottom">
        <MDTypography variant="body1" color="info" lineHeight={1} sx={{ cursor: "pointer", mx: 3 }}>
          <Icon color="inherit">info_outline</Icon>
        </MDTypography>
      </Tooltip>
    </>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* <Grid container>
          <SalesByCountry />
        </Grid>
        <MDBox mt={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Bookings"
                  count={281}
                  percentage={{
                    color: "success",
                    amount: "+55%",
                    label: "than lask week",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Today's Users"
                  count="2,300"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Revenue"
                  count="34k"
                  percentage={{
                    color: "success",
                    amount: "+1%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="person_add"
                  title="Followers"
                  count="+91"
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Just updated",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox> */}
        <MDBox mt={2}>
          <Grid container spacing={3}>
            {stream.map((camera) => (
              <Grid item xs={12} md={6} lg={4} key={camera.id}>
                <MDBox mt={3}>
                  <CameraCard
                    image={`${backendUrl}/media/${camera.latest_event}`}
                    title={camera.description}
                    // description={`Lat: ${camera.latitude}, Lng: ${camera.longitude}`}
                    update={`${getTimeSince(camera.last_captured_at)}`}
                    event={`${getTimeSince(camera.last_uploaded_at)}`}
                    seen={`${getTimeSince(camera.last_reported_at)}`}
                    isActive={camera.live}
                    action={actionButtons}
                  />
                </MDBox>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Cameras;
