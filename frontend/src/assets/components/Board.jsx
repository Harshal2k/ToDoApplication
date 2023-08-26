import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import axios from "axios";
import DialogTitle from '@mui/material/DialogTitle';
import Column from "./Column";
import { Button, DialogContentText } from "@mui/material";


const defaultEditTask = {
  open: false,
  title: '',
  description: '',
  _id: '',
  status: ''
}

export default function Board() {
  const [editMode, setEditMode] = useState(false);
  const [deleteDetails, setDeleteDetails] = useState({ open: false, id: '', mode: '' });
  console.log({ env: process.env })

  const [tasks, setTasks] = useState({
    wait: [],
    dev: [],
    test: [],
    done: []
  });



  const [editTask, setEditTask] = React.useState(defaultEditTask);

  const handleClickOpen = (status, id) => {
    let tempTask = findItemById(id, tasks[status]);
    setEditTask({
      ...editTask,
      open: true,
      title: tempTask?.title,
      description: tempTask?.description,
      _id: id,
      status: status
    });
  };

  const handleClose = () => {
    setEditMode(false);
    setEditTask(defaultEditTask);
  };

  const handleSave = () => {
    let tempTask = findItemById(editTask?._id, tasks[editTask?.status]);
    let tempTaskArray = tasks[editTask?.status];
    let filteredObj = removeItemById(editTask?._id, tempTaskArray, true)
    tempTaskArray = filteredObj?.filteredArray;
    tempTaskArray?.splice(filteredObj?.index || 0, 0,
      {
        "_id": editTask?._id,
        "title": editTask?.title,
        "description": editTask?.description,
        "status": tempTask?.status,
        "__v": 0
      }
    )
    axios.patch(`/api/editTask/${editTask?._id}`, {
      title: editTask?.title,
      description: editTask?.description,
    }).then((res) => {
      setTasks({
        ...tasks,
        [editTask?.status]: tempTaskArray,
      });
      handleClose();
    }).catch(({ response }) => {

    })

  }

  const handleChange = (e) => {
    let { name, value } = e?.target;
    setEditTask({
      ...editTask,
      [name]: value,
    })
  }

  useEffect(() => {
    axios.get("/api/getTasks")
      .then((response) => response.json())
      .then((json) => {
        setTasks(json);
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (source?.droppableId === destination?.droppableId) return;
    if (source && destination) {
      let prevTasks = JSON.parse(JSON.stringify(tasks));
      updateTasks(draggableId, source?.droppableId, destination?.droppableId)
      axios.patch(`/api/editTask/${draggableId}`, {
        status: destination?.droppableId
      }).then((res) => {
      }).catch(({ response }) => {
        setTasks(prevTasks)
      });
    }

  };
  console.log({ editTask });
  const updateTasks = (taskId, source, dest) => {
    let item = findItemById(taskId, tasks[source]);
    let tempSourceTasks = tasks[source] || [];
    let tempDestTasks = tasks[dest] || [];
    tempDestTasks?.push(item);
    tempSourceTasks = removeItemById(taskId, tempSourceTasks);
    let sourceId = source;
    let destId = dest;
    setTasks({
      ...tasks,
      [sourceId]: tempSourceTasks,
      [destId]: tempDestTasks
    })
  }

  function findItemById(id, array) {
    return array.find((item) => item?._id === id);
  }

  function removeItemById(id, array, returnIndex = false) {
    if (returnIndex) {
      let nonMatchingIndex = 0;
      let tempArr = array.filter((item, index) => {
        if (item?._id !== id) {
          return true
        } else {
          nonMatchingIndex = index;
          return false;
        }
      });
      return {
        filteredArray: tempArr,
        index: nonMatchingIndex,
      }
    } else {
      return array.filter((item) => item?._id !== id);
    }
  }

  const hAddTaks = () => {
    axios.post(`/api/createTasks`, {
      title: editTask?.title,
      description: editTask?.description
    }).then((res) => {
      console.log({ res });
      let tempTaskArray = tasks?.wait
      tempTaskArray?.splice(0, 0,
        res?.data
      )
      setTasks({
        ...tasks,
        wait: tempTaskArray,
      });
      handleClose();
    });
  }

  const hDeleteTask = () => {
    axios.delete(`/api/deleteTask/${deleteDetails?.id}`).then((res) => {
      let tempTaskArray = tasks[deleteDetails?.mode]
      tempTaskArray = removeItemById(deleteDetails?.id, tempTaskArray);
      setTasks({
        ...tasks,
        [deleteDetails?.mode]: tempTaskArray,
      });
      setDeleteDetails({ open: false, id: '', mode: '' })
    });
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <h2 style={{ textAlign: "center", color: 'white' }}>DEVELOPER PROGRESS BOARD</h2>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={() => { setEditTask({ ...editTask, open: true }) }} variant="contained">Add Task</Button>
          <p style={{ color: 'white' }}>Double click cards to view or edit</p>
        </div>

        <div className="dropContainers">
          <Column delAction={(taskId, mode) => { setDeleteDetails({ open: true, id: taskId, mode: mode }) }} clickAction={(status, id) => { setEditMode(true); handleClickOpen(status, id) }} title={"Waiting"} tasks={tasks?.wait || []} id={"wait"} />
          <Column delAction={(taskId, mode) => { setDeleteDetails({ open: true, id: taskId, mode: mode }) }} clickAction={(status, id) => { setEditMode(true); handleClickOpen(status, id) }} title={"In Development"} tasks={tasks?.dev || []} id={"dev"} />
          <Column delAction={(taskId, mode) => { setDeleteDetails({ open: true, id: taskId, mode: mode }) }} clickAction={(status, id) => { setEditMode(true); handleClickOpen(status, id) }} title={"In Testing"} tasks={tasks?.test || []} id={"test"} />
          <Column delAction={(taskId, mode) => { setDeleteDetails({ open: true, id: taskId, mode: mode }) }} clickAction={(status, id) => { setEditMode(true); handleClickOpen(status, id) }} title={"Completed"} tasks={tasks?.done || []} id={"done"} />
        </div>
      </DragDropContext>
      <Dialog open={editTask?.open}>
        <DialogTitle>{editMode ? 'Update' : 'Create'} Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            fullWidth
            name="title"
            variant="outlined"
            value={editTask?.title}
            onChange={handleChange}
          />
          <TextField
            style={{ marginTop: '1rem' }}
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            fullWidth
            name="description"
            placeholder="Description"
            value={editTask?.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={(editTask?.title?.length <= 0 || editTask?.description?.length <= 0)} onClick={editMode ? handleSave : hAddTaks}>{editMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDetails?.open}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteDetails({ open: false, id: '' }) }}>Cancel</Button>
          <Button onClick={hDeleteTask}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
