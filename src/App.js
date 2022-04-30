import React from "react";
import { useEffect, useState } from "react";
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Button, TextField, Select, MenuItem } from "@material-ui/core";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { AppBar, Box, Toolbar, Typography, Container, FormControl } from "@material-ui/core"
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@material-ui/core";
import axios from "axios";

const BASE_URL = "https://eg-men-back.herokuapp.com/api/v1/channels/"

const useStyles = makeStyles((theme) => ({
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [channel, setChannels] = useState({
    "type": "",
    "name": "",
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setChannels(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(channel);
  }

  const getChannels = async() => {
    await axios.get(BASE_URL)
      .then(response => {
        setData(response.data.data);
      })
  }

  const postChannel = async() => {
    const channel_body = {
      "type": channel["type"],
      "name": channel["name"],
    }

    await axios.post(BASE_URL, channel_body)
      .then(response => {
        setChannels([])
        getChannels();
        abrirCerrarModalInsertar();
      })
  }

  const putChannel = async() => {
    const channel_body = {
      "type": channel["type"],
      "name": channel["name"],
    }

    await axios.put(BASE_URL + channel.id, channel_body)
      .then(response => {
        getChannels()
        abrirCerrarModalUpdate();
      })
  }

  const deleteChannel = async() => {
    await axios.delete(BASE_URL + channel.id)
      .then(response => {
        getChannels()
        abrirCerrarModalDelete();
      })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsert(!modalInsert);
  }

  const abrirCerrarModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  }

  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete);
  }

  useEffect(() => {
    getChannels();
  }, [])

  const bodyCreate = (
    <>
      <DialogTitle>
        Agregar Nuevo Canal
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingresa la informacion en el formulario para crear un nuevo Canal.
        </DialogContentText>
        <TextField required name="type" label="Tipo" fullWidth margin="dense" onChange={handleChange} />
        <TextField required name="name" label="Nombre" fullWidth multiline margin="dense" onChange={handleChange} />
        <DialogActions>
          <Button color="primary" onClick={() => postChannel()}>Insertar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const bodyUpdate = (
    <>
      <DialogTitle>
        Editar Canal
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica la informacion en el formulario para editar el canal.
        </DialogContentText>
        <TextField required name="type" label="Tipo" fullWidth margin="dense" onChange={handleChange} value={channel.type} />
        <TextField required name="name" label="Nombre" fullWidth margin="dense" onChange={handleChange} value={channel.name} />
        <DialogActions>
          <Button color="primary" onClick={() => putChannel()}>Editar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalUpdate()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const bodyEliminar = (
    <>
      <DialogTitle id="alert-dialog-title">
        Eliminar Canal
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Seguro quiere eliminar el canal <b>[{channel.id}] {channel.subject}</b>?
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={() => deleteChannel()}>Eliminar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalDelete()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const seleccionarConsola=(channel, caso)=>{
    setChannels(channel);
    (caso==='Editar') ? abrirCerrarModalUpdate() : abrirCerrarModalDelete()
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Evergreen - MEN
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container style={{ marginTop: '30px' }}>
        <Typography
          variant="h3"
          noWrap
          component="div"
          sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
        >
          Canales
        </Typography>
        <br/>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => abrirCerrarModalInsertar()}>Nuevo</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Updated at</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>{item.updated_at}</TableCell>
                  <TableCell>
                    <Edit className={styles.iconos} onClick={() => seleccionarConsola(item, 'Editar')} />
                    &nbsp;&nbsp;&nbsp;
                    <Delete className={styles.iconos} onClick={() => seleccionarConsola(item, 'Eliminar')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog
        open={modalInsert}
        onClose={abrirCerrarModalInsertar}
      >
        {bodyCreate}
      </Dialog>

      <Dialog
        open={modalUpdate}
        onClose={abrirCerrarModalUpdate}
      >
        {bodyUpdate}
      </Dialog>

      <Dialog
        open={modalDelete}
        onClose={abrirCerrarModalDelete}
      >
        {bodyEliminar}
      </Dialog>

    </div>
  )
}

export default App;