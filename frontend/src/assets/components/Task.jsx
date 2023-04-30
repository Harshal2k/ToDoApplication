import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar, Image } from "antd";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const Container = styled.div`
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.28) 3px 3px 7px 5px;
  padding: 0.5rem;
  color: rgb(0, 0, 0);
  margin-bottom: 0.7rem;
  min-height: 7rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div`
font-size: 1.3rem;
font-weight: 500;
background-color: #00000040;
`;

const Icons = styled.div`
  display: flex;
  justify-content: end;
  padding: 2px;
`;

function bgcolorChange(props) {
  console.log({ props });
  return props.isDragging
    ? "lightgreen"
    : props.status == "wait" ? '#ff6666' : props?.status == 'dev' ? '#46b2ff' : props?.status == 'test' ? '#ffe425' : '#00fe2b'

}

export default function Task({ handleEdit, delAction, task, index, status }) {
  return (
    <Draggable draggableId={`${task?._id}`} key={task?._id} index={index}>
      {(provided, snapshot) => (
        <Container
          status={status}
          onDoubleClick={() => { handleEdit(task?._id) }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}>
          <div style={{ display: "flex", justifyContent: "center", padding: 2, flexDirection: 'column' }}>
            <TextContent>{task?.title}</TextContent>
            <p style={{ height: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task?.description}</p>
          </div>
          <IconButton onClick={() => { delAction(task?._id) }} style={{ width: 'fit-content' }} aria-label="delete">
            <DeleteIcon />
          </IconButton>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
