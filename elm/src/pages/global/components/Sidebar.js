import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import FilterListIcon from '@mui/icons-material/FilterList';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    paddingTop: "150px",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "black",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    // marginTop: 50,
    marginRight: 36,
  },
  marginAutoItem: {
    margin: "auto",
  },

  marginRightItem: {
    paddingRight: "10px",
  },
  hide: {
    display: "none",
  },
  drawer: {
    // marginTop: 50,
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    marginTop: 70,
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolBarIconsLeft: {
    justifyContent: "space-between",
  },
  accrow: {
    float: "right",
  },
  accrow_width: {
    width: "100%",
  },
  drawerClose: {
    marginTop: 70,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <List>
          <ListItem button>
            <ListItemIcon>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText> </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon
              onClick={() => {
                window.location.href = "/violation/1";
              }}
            >
              <FilterListIcon />
            </ListItemIcon>
            <ListItemText
              primary="Streets"
              onClick={() => {
                window.location.href = "/violation/1";
              }}
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon
              onClick={() => {
                window.location.href = "/allviolations?p=1&filter=";
              }}
            >
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText
              primary="All Violations"
              onClick={() => {
                window.location.href = "/allviolations?p=1&filter=";
              }}
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon
              onClick={() => {
                window.location.href = "/duplicatepage?p=1&filter=";
              }}
            >
              <BackupTableIcon />
            </ListItemIcon>
            <ListItemText
              primary="Duplicate Violations"
              onClick={() => {
                window.location.href = "/duplicatepage?p=1&filter=";
              }}
            />
          </ListItem>
          
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph></Typography>
      </main>
    </div>
  );
}
