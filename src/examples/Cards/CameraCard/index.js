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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
// Otis Admin PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadgeDot from "components/MDBadgeDot"; // make sure this import exists

function CameraCard({
  image,
  title,
  update,
  // description,
  event,
  seen,
  isActive,
  action = false,
}) {
  return (
    <Card
      sx={{
        "&:hover .card-header": {
          transform: action && "translate3d(0, -50px, 0)",
        },
      }}
    >
      <MDBox
        position="relative"
        borderRadius="lg"
        mt={-3}
        mx={2}
        className="card-header"
        sx={{ transition: "transform 300ms cubic-bezier(0.34, 1.61, 0.7, 1)" }}
      >
        <MDBox
          component="img"
          src={image}
          alt={title}
          onError={(e) => {
            e.target.src = "/video.png"; // or any fallback image you want
          }}
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="relative"
          zIndex={1}
        />
        <MDBox
          borderRadius="lg"
          shadow="md"
          width="100%"
          height="100%"
          position="absolute"
          left={0}
          top="0"
          sx={{
            backgroundImage: `url(${image || "/video.png"})`,
            transform: "scale(0.94)",
            filter: "blur(12px)",
            backgroundSize: "cover",
          }}
        />
      </MDBox>
      <MDBox textAlign="center" pt={3} px={3}>
        <MDBox display="flex" justifyContent="center" alignItems="center" mt={action ? -8 : -4.25}>
          {action}
        </MDBox>

        {/* Title with status dot */}
        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1} mt={4}>
          <MDTypography variant="h5" fontWeight="regular">
            {title}
          </MDTypography>
        </MDBox>

        <MDBox mt={-0.5} display="flex" justifyContent="center">
          <MDBadgeDot
            color={isActive ? "success" : "dark"}
            badgeContent={isActive ? "Online" : "Offline"}
            size="md"
          />
        </MDBox>

        {/* Description
        <MDTypography variant="body2" color="text" sx={{ mt: 1, mb: 1 }}>
          {description}
        </MDTypography> */}
      </MDBox>
      <Divider />
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        pt={0.5}
        pb={3}
        px={3}
        lineHeight={1}
      >
        <Tooltip title="Time since last event captured" placement="bottom">
          <MDBox color="text" display="flex" alignItems="center">
            <Icon color="inherit" sx={{ m: 0.5, fontFamily: "Material Icons Outlined" }}>
              star_border
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {update}
            </MDTypography>
          </MDBox>
        </Tooltip>
        <Tooltip title="Time since last event uploaded" placement="bottom">
          <MDBox color="text" display="flex" alignItems="center">
            <Icon color="inherit" sx={{ m: 0.5, fontFamily: "Material Icons Outlined" }}>
              file_upload
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {event}
            </MDTypography>
          </MDBox>
        </Tooltip>
        <Tooltip title="Time since camera last seen" placement="bottom">
          <MDBox color="text" display="flex" alignItems="center">
            <Icon color="inherit" sx={{ m: 0.5, fontFamily: "Material Icons Outlined" }}>
              favorite_border
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {seen}
            </MDTypography>
          </MDBox>
        </Tooltip>
      </MDBox>
    </Card>
  );
}

// Typechecking props for the CameraCard
CameraCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // description: PropTypes.string.isRequired,
  update: PropTypes.node.isRequired,
  event: PropTypes.node.isRequired,
  seen: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  action: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
};

export default CameraCard;
