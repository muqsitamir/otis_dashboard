import React from "react";
import PropTypes from "prop-types";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Button, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import backendUrl from "../../config";

export default function Camera({ content, updateMapCenter }) {
  const latest = `${backendUrl}/media/${content.latest_event}`;
  const live = content.live ? "success" : "disabled";
  const location = `Lat:${content.latitude} ,Lng:${content.longitude}`;

  const getDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 5);
    return date.toISOString().slice(0, 16).replace("T", " ");
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div
      className="card rounded my-3 shadow-lg back-card"
      style={{
        width: "230px",
        margin: "10px",
        height: "fit-content",
        maxHeight: "460px",
      }}
    >
      <Typography
        variant="subtitle2"
        gutterBottom
        component="div"
        marginTop={1}
        marginLeft={2}
        style={{
          display: "inline-flex",
          marginLeft: "10px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div>
          <FiberManualRecordIcon
            color={live}
            sx={{ position: "absolute", top: 10, right: 10, bottom: 0 }}
          />
        </div>
        <span>{content.description}</span>
      </Typography>

      <Typography
        style={{
          borderTop: "groove",
          borderBottom: "groove",
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
        }}
      >
        <span style={{ fontSize: "12px" }}>Created At: {getDate(content.created_at)}</span>
      </Typography>

      <Typography
        style={{
          borderTop: "groove",
          borderBottom: "groove",
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
        }}
      >
        <span style={{ fontSize: "12px" }}>Updated At: {getDate(content.last_reported_at)}</span>
      </Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={latest}
          alt=""
          className="card-img-top time"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "15px",
          }}
          onError={(e) => {
            e.target.src = "/video.png";
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "5px",
        }}
      >
        <Tooltip title={location} placement="top">
          <Button
            size="small"
            component="span"
            style={{
              border: "1px solid",
              color: "black",
              opacity: 0.8,
              fontSize: "12px",
            }}
            onClick={() => {
              scrollToTop();
              updateMapCenter(content.latitude, content.longitude);
            }}
          >
            <LocationOnIcon /> Location
          </Button>
        </Tooltip>

        <Button
          size="small"
          component={Link}
          to={`/statistics/${content.id}`}
          style={{
            border: "1px solid",
            color: "black",
            opacity: 0.8,
            fontSize: "12px",
          }}
        >
          <LeaderboardIcon /> Statistics
        </Button>
      </div>
    </div>
  );
}

Camera.propTypes = {
  content: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    latest_event: PropTypes.string.isRequired,
    live: PropTypes.bool.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    last_reported_at: PropTypes.string.isRequired,
  }).isRequired,
  updateMapCenter: PropTypes.func.isRequired,
};
