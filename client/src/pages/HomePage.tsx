import React, { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AddCircleOutline, Close, PowerSettingsNew } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import Fab from "@mui/material/Fab";
import CancelIcon from '@mui/icons-material/Cancel';
import { Stringifier } from "styled-components/dist/types";
import { Modal } from "@mui/material";

const HomePage = () => {
    const navigate = useNavigate();
    const [allStocks, setAllStocks] = React.useState<string[]>([]);
    const [subscribedStocks, setSubscribedStocks] = React.useState<string[]>([]);
    const [searchValue, setSearchValue] = React.useState<string>("");

    const verifyToken = async () => {
        const req = await fetch("https://bamboo-project-api.vercel.app/api/verifyToken", {
          method: "GET",
            headers: {
                "x-access-token" : localStorage.getItem("token")?? "",
            }
        });
        const data = await req.json();
        if(data.status !== "ok"){
            navigate("/login");
        }
        console.log(data);
    }

    const fetchAllStocks = async () => {
      const apiResponse = await fetch("https://bamboo-project-api.vercel.app/api/fetchAllStocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      apiResponse.json().then(
        (data) => {
          setAllStocks(data.stocksList.map((item: { code: string; })=>{
            return item.code;
          }));
        }
      )
    };

    const fetchsubscribedStocks = async() => {
      try{
        const apiResponse = await fetch("https://bamboo-project-api.vercel.app/api/fetchUsersSubscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token" : localStorage.getItem("token")?? "",
        }
      });
      apiResponse.json().then(
        (data) => {
          setSubscribedStocks(data.subscriptionList);
        }
      );
      }
      catch(ex){
        console.log(ex);
      }
      
    };

    const addStock = async (stockCode: string) => {
      try{
        const apiResponse = await fetch("https://bamboo-project-api.vercel.app/api/addStock", {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token" : localStorage.getItem("token")?? "",
          },
          body: JSON.stringify({
            stockCode
          })
        });
        const data = await apiResponse.json();
        if(data.status === "ok"){
          setSubscribedStocks([...subscribedStocks, stockCode]);
        }
        else{
          alert("something went wrong, please try adding again");
        }
      }
      catch(ex){
        console.log(ex);
      }
    }

    const removeStock = async (stockCode: string) => {
      try{
        const apiResponse = await fetch("https://bamboo-project-api.vercel.app/api/removeStock", {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token" : localStorage.getItem("token")?? "",
          },
          body: JSON.stringify({
            stockCode
          })
        });
        const data = await apiResponse.json();
        if(data.status === "ok"){
          setSubscribedStocks(subscribedStocks.filter((item)=>{return item!=stockCode}));
        }
        else{
          alert("something went wrong, please try removing again");
        }
      }
      catch(ex){
        console.log(ex);
      }
    }

    React.useEffect(()=>{
        verifyToken();
    }, []);

    React.useEffect(()=>{
        fetchAllStocks();
        fetchsubscribedStocks();
    }, []);


    return (<>
        <Header searchState={searchValue} setsearchState={setSearchValue}/>
        <Box sx={{textAlign: 'center'}}>
        <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ marginTop: '1rem' }}
          >
            List of stock news subscribed to
          </Typography>
        </Box>
        <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                display: 'grid',
                gridTemplateColumns: { md: '1fr' },
                gap: 2,
              }}
            >
              {searchValue=="" ? (subscribedStocks.map((stock) => (
                <Paper elevation={4} sx={{padding:'1rem'}}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div>{stock}</div>
                    <div onClick={()=>{removeStock(stock)}}><CancelIcon style={{color: "red"}}/> </div>
                  </div>
                </Paper>
              ))) :
              (
            //     <Modal
            //     open={true}
            //     style={{
            //       width: '80%',
            //       height: '70%',
            //       overflow: 'auto',
            //       margin: 'auto'
            //     }}
            //     >
            //       <Box
            //   sx={{
            //     p: 2,
            //     borderRadius: 2,
            //     bgcolor: 'background.default',
            //     display: 'grid',
            //     gridTemplateColumns: { md: '1fr' },
            //     gap: 2,
            //   }}
            // >
                // {
                  allStocks.map((stock) => (
                stock.includes(searchValue) && <Paper elevation={4} sx={{padding:'1rem'}}>
                  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div>{stock}</div>
                    {subscribedStocks.includes(stock) ? (
                      <div onClick={()=>{removeStock(stock)}}><CancelIcon style={{color: "red"}}/> </div>
                    ) : (
                      <div onClick={()=>{addStock(stock)}}><AddCircleOutline style={{color: "green"}}/> </div>
                    )
                  }  
                  </div>
                </Paper>
              ))
            // }
              // </Box>
              // </Modal>
              )
            }
            </Box>
      {/* {<Fab color="primary" aria-label="edit" sx={{margin: '1rem', position: 'fixed', bottom: '0px', right: '0px'}}>
        <EditIcon />
      </Fab>} */}
      
        </>)
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  }
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export function Header(props: {searchState: string, setsearchState: React.Dispatch<React.SetStateAction<string>>}) {
  const [isdrawerOpen, setIsdraweOpen] = useState(false);
    
  const drawerWidth = 240;
  const navItems = ["Home", "About", "Contact"];
  const handleDrawerToggle = () => {
    setIsdraweOpen((prevState) => !prevState);
  }

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Toolbar sx={{bgcolor: '#1976d2', color: 'white'}}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            // sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Bamboo
          </Typography>
        </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: 'contents' }}
          >
            Bamboo
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e)=>{props.setsearchState(e.target.value)}}
              value={props.searchState}
            />
            {/* <SearchIconWrapper style={{right: '2px', top: '2px'}} onClick={()=> {console.log("hiii")}}>
              <Close />
            </SearchIconWrapper> */}
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }}>
            <IconButton size="large" aria-label="logout" color="inherit">
                <PowerSettingsNew />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box 
        component="nav"
        sx={{ width: { sm: drawerWidth },  }} >
        <Drawer
          variant="temporary"
          open={isdrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            // display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default HomePage;